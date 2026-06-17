#!/usr/bin/env python3
"""
SAGCO-XL-COMPILER v1.0
Pipeline: ZIP → Lexer → Parser → Enumerator → AST → IR → Verdict
Target: SAGCO-NOTEBOOK-001.xlsx (any .xlsx)
"""
import zipfile, xml.etree.ElementTree as ET, json, sys, re
from dataclasses import dataclass, field, asdict
from typing import Optional

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"

# ── TOKEN TYPES ────────────────────────────────────────────────
class TT:
    STRING  = "STRING"
    NUMBER  = "NUMBER"
    FORMULA = "FORMULA"
    EMPTY   = "EMPTY"
    BOOL    = "BOOL"

# ── AST NODES ─────────────────────────────────────────────────
@dataclass
class CellToken:
    addr: str          # e.g. "A3"
    row: int
    col: int
    col_letter: str
    tok_type: str
    raw_value: Optional[str]
    formula: Optional[str]
    resolved: Optional[str] = None   # filled by enumerator

@dataclass
class RowNode:
    row_idx: int
    cells: list = field(default_factory=list)

@dataclass
class SheetAST:
    name: str
    sheet_id: int
    rows: list = field(default_factory=list)
    symbol_refs: list = field(default_factory=list)  # string indices used

@dataclass
class WorkbookAST:
    source: str
    sheets: list = field(default_factory=list)
    symbol_table: dict = field(default_factory=dict)  # index→string
    formula_list: list = field(default_factory=list)
    verdict: dict = field(default_factory=dict)

# ── STAGE 0: LEXER — unzip + emit raw XML streams ─────────────
def lexer(xlsx_path: str) -> dict:
    streams = {}
    with zipfile.ZipFile(xlsx_path, 'r') as z:
        for name in z.namelist():
            streams[name] = z.read(name)
    return streams

# ── STAGE 1: ENUMERATOR — build symbol table from sharedStrings
def build_symbol_table(streams: dict) -> dict:
    table = {}
    raw = streams.get("xl/sharedStrings.xml", b"")
    if not raw:
        return table
    root = ET.fromstring(raw)
    for i, si in enumerate(root.findall(f"{{{NS}}}si")):
        t = si.find(f"{{{NS}}}t")
        if t is not None and t.text:
            table[str(i)] = t.text
        else:
            # rich text — concat all <t> runs
            parts = [r.text or "" for r in si.iter(f"{{{NS}}}t")]
            table[str(i)] = "".join(parts)
    return table

# ── STAGE 2: PARSER — XML → CellToken stream per sheet ────────
def col_to_int(col_str: str) -> int:
    n = 0
    for ch in col_str:
        n = n * 26 + (ord(ch) - ord('A') + 1)
    return n

def parse_addr(addr: str):
    m = re.match(r"([A-Z]+)(\d+)", addr)
    col_s, row_s = m.group(1), m.group(2)
    return int(row_s), col_to_int(col_s), col_s

def parse_sheet(raw_xml: bytes, sheet_name: str, sheet_id: int, sym: dict) -> SheetAST:
    ast = SheetAST(name=sheet_name, sheet_id=sheet_id)
    root = ET.fromstring(raw_xml)
    sd = root.find(f"{{{NS}}}sheetData")
    if sd is None:
        return ast

    for row_el in sd.findall(f"{{{NS}}}row"):
        row_idx = int(row_el.attrib.get("r", 0))
        row_node = RowNode(row_idx=row_idx)

        for c_el in row_el.findall(f"{{{NS}}}c"):
            addr  = c_el.attrib.get("r", "A1")
            r, col_i, col_s = parse_addr(addr)
            t_attr = c_el.attrib.get("t", "n")
            v_el = c_el.find(f"{{{NS}}}v")
            f_el = c_el.find(f"{{{NS}}}f")
            raw_val  = v_el.text if v_el is not None else None
            formula  = f_el.text if f_el is not None else None

            if t_attr == "s":    tok_type = TT.STRING
            elif t_attr == "b":  tok_type = TT.BOOL
            elif formula:        tok_type = TT.FORMULA
            elif raw_val:        tok_type = TT.NUMBER
            else:                tok_type = TT.EMPTY

            resolved = sym.get(raw_val) if t_attr == "s" else raw_val

            cell = CellToken(
                addr=addr, row=r, col=col_i, col_letter=col_s,
                tok_type=tok_type, raw_value=raw_val,
                formula=formula, resolved=resolved
            )
            row_node.cells.append(cell)
            if tok_type == TT.STRING and raw_val:
                ast.symbol_refs.append(raw_val)

        ast.rows.append(row_node)
    return ast

# ── STAGE 3: SEMANTIC — extract formula list across workbook ───
def extract_formulas(sheets: list) -> list:
    formulas = []
    for sheet in sheets:
        for row in sheet.rows:
            for cell in row.cells:
                if cell.formula:
                    formulas.append({
                        "sheet": sheet.name,
                        "addr":  cell.addr,
                        "expr":  cell.formula,
                        "value": cell.raw_value
                    })
    return formulas

# ── STAGE 4: CODEGEN — emit SAGCO-IR JSON ─────────────────────
def emit_ir(wb: WorkbookAST) -> dict:
    ir = {
        "sagco_ir_version": "1.0",
        "source": wb.source,
        "symbol_table_size": len(wb.symbol_table),
        "sheet_count": len(wb.sheets),
        "formula_count": len(wb.formula_list),
        "sheets": [],
        "formulas": wb.formula_list,
        "verdict": wb.verdict
    }
    for sheet in wb.sheets:
        s_ir = {
            "id": sheet.sheet_id,
            "name": sheet.name,
            "row_count": len(sheet.rows),
            "cell_count": sum(len(r.cells) for r in sheet.rows),
            "string_refs": len(sheet.symbol_refs),
            "rows": []
        }
        for row in sheet.rows:
            r_ir = {"r": row.row_idx, "cells": []}
            for c in row.cells:
                c_ir = {"addr": c.addr, "type": c.tok_type}
                if c.resolved: c_ir["value"] = c.resolved
                if c.formula:  c_ir["formula"] = c.formula
                r_ir["cells"].append(c_ir)
            s_ir["rows"].append(r_ir)
        ir["sheets"].append(s_ir)
    return ir

# ── STAGE 5: VERDICT ──────────────────────────────────────────
def run_verdict(wb: WorkbookAST) -> dict:
    total_cells   = sum(sum(len(r.cells) for r in s.rows) for s in wb.sheets)
    formula_cells = len(wb.formula_list)
    string_cells  = sum(len(s.symbol_refs) for s in wb.sheets)
    coverage      = round((formula_cells / total_cells) * 100, 1) if total_cells else 0
    status = ("PROVEN" if coverage >= 20 else
              "PROMISING" if coverage >= 10 else
              "PARTIAL"   if coverage >= 5  else "UNPROVEN")
    return {
        "total_cells":    total_cells,
        "formula_cells":  formula_cells,
        "string_cells":   string_cells,
        "symbol_table":   len(wb.symbol_table),
        "formula_ratio":  f"{coverage}%",
        "status":         status
    }

# ── COMPILER MAIN ─────────────────────────────────────────────
def compile_xlsx(xlsx_path: str) -> dict:
    print(f"[LEXER]      Reading {xlsx_path}")
    streams = lexer(xlsx_path)
    print(f"[LEXER]      {len(streams)} ZIP entries tokenized")

    print("[ENUMERATOR] Building symbol table...")
    sym = build_symbol_table(streams)
    print(f"[ENUMERATOR] {len(sym)} symbols indexed")

    # sheet name map from workbook.xml
    wb_xml = streams.get("xl/workbook.xml", b"")
    sheet_names = {}
    if wb_xml:
        wb_root = ET.fromstring(wb_xml)
        for sh in wb_root.iter(f"{{{NS}}}sheet"):
            sid = sh.attrib.get("sheetId","0")
            sheet_names[sid] = sh.attrib.get("name", f"Sheet{sid}")

    print("[PARSER]     Parsing sheets...")
    sheets = []
    i = 1
    while True:
        key = f"xl/worksheets/sheet{i}.xml"
        if key not in streams:
            break
        name = sheet_names.get(str(i), f"Sheet{i}")
        sheet_ast = parse_sheet(streams[key], name, i, sym)
        print(f"[PARSER]     Sheet {i} '{name}': {sum(len(r.cells) for r in sheet_ast.rows)} cells")
        sheets.append(sheet_ast)
        i += 1

    print("[SEMANTIC]   Extracting formula list...")
    formulas = extract_formulas(sheets)
    print(f"[SEMANTIC]   {len(formulas)} formulas found")

    wb = WorkbookAST(source=xlsx_path, sheets=sheets,
                     symbol_table=sym, formula_list=formulas)

    print("[VERDICT]    Running coverage analysis...")
    wb.verdict = run_verdict(wb)

    print("[CODEGEN]    Emitting SAGCO-IR...")
    ir = emit_ir(wb)
    return ir

# ── ENTRY ─────────────────────────────────────────────────────
if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "SAGCO-NOTEBOOK-001.xlsx"
    ir = compile_xlsx(path)
    out = path.replace(".xlsx", "_IR.json")
    with open(out, "w") as f:
        json.dump(ir, f, indent=2)
    print(f"\n[IR WRITTEN] {out}")
    print(f"\n=== SAGCO VERDICT ===")
    for k, v in ir["verdict"].items():
        print(f"  {k:<20} {v}")
    print(f"\n=== SYMBOL TABLE (first 10) ===")
