# SAGCO-CLI v0.1.0

**Field Engineering Productivity CLI**
Strategickhaos DAO LLC | EIN 39-2900295 | Dom Garza

-----

## What This Does

Computes Expected vs Actual vs Variance for industrial insulation
rope access projects. Takes a YAML config with circuit data,
outputs CPI, remaining hours, savings, and per-circuit audit.

-----

## Build

Requires Rust 1.80+

```bash
cargo build --release
```

-----

## Commands

```bash
# Summary metrics
./target/release/sagco-cli compute --config sagco.master.yaml

# Per-circuit audit with ERU analysis
./target/release/sagco-cli audit --config sagco.master.yaml

# Validate config file
./target/release/sagco-cli validate --config sagco.master.yaml
```

-----

## Expected Output — compute

```
═══════════════════════════════════════════
  SAGCO COMPUTE  |  C-1602 Package  |  PO 4406147216
═══════════════════════════════════════════
  Est Hours   :     4979.0
  Act Hours   :     3583.3
  Remaining   :     1395.7
  CPI         :      1.390
  Variance    :     -28.0%
  Savings @$77:  $107,468.90
  STATUS      : AHEAD
═══════════════════════════════════════════
```

-----

## Expected Output — audit

```
CUI  CIRCUIT              EST      ACT   REMAIN    VAR%    $AT RISK  VERDICT
─────────────────────────────────────────────────────────────────────────────
1    F-1763-PR-1A       290.0    427.5   -137.5   -47.4%   $10,588   OVER
2    C-1602-O-1B       1080.0   1118.4    -38.4    -3.6%    $2,957   OVER
3    IS-HDRFE-1A        491.0   1020.3   -529.3  -107.8%   $40,765   CRITICAL OVER
4    E-1706-NA-1A       138.0    216.9    -78.9   -57.2%    $6,075   OVER
5    PO-HDRFE-1B        204.0    173.3     30.7    15.0%  BANKED $2k  UNDER
6    HBF-HDRULT-1C     1021.0    208.3    812.7    79.6%  BANKED $63k BANKED
8    J-2011-FO-1B       951.0    164.6    786.4    82.7%  BANKED $61k BANKED
...
─────────────────────────────────────────────────────────────────────────────
  Overrun hours : 784.1  ($60,375.70)
  Banked hours  : 2179.8 ($167,844.60)
  Net position  : $107,468.90
```

-----

## Config Format

```yaml
project: "C-1602 Package"
po: "4406147216"
blend_rate: 77.0
difficulty_multiplier: 1.69
circuits:
  - cui_number: "1"
    circuit_id: "F-1763-PR-1A"
    est_hours: 290.0
    act_hours: 427.5
    lnft: 75.0
    sqft: 649.2
    status: "COMPLETE"
```

-----

## Project Data — PO 4406147216

|Field     |Value         |
|----------|--------------|
|Project   |C-1602 Package|
|PO        |4406147216    |
|Est Hours |4,979.0       |
|Act Hours |3,583.3       |
|Remaining |1,395.7       |
|Blend Rate|$77/hr        |
|Est $     |$483,228      |
|Act $     |$333,532      |
|Variance $|+$149,696     |
|CPI       |1.390 (AHEAD) |
|Circuits  |12            |

-----

## Install on Termux (Z Fold)

```bash
pkg install rust
tar -xzf sagco-cli.tar.gz
cd sagco-cli

# IMPORTANT — if sagco-cli already exists as a git repo:
cp src/*.rs ../sagco-cli-new/src/
# or just overwrite the source files manually

cargo build --release
./target/release/sagco-cli compute
```

-----

## Source Tree

```
sagco-cli/
├── Cargo.toml
├── README.md
├── sagco.master.yaml
└── src/
    ├── main.rs
    ├── config.rs
    ├── models.rs
    ├── commands/
    │   ├── mod.rs
    │   ├── compute.rs
    │   ├── audit.rs
    │   └── validate.rs
    └── engines/
        ├── mod.rs
        ├── productivity.rs
        └── eru.rs
```

-----

## The Fix for “Hello, world!” Output

If you extracted the tar into an existing sagco-cli git repo,
the old src/main.rs overwrote the new one. Run this on Termux:

```bash
cd ~/downloads/sagco-cli

cat > src/main.rs << 'RUST'
use clap::Parser;
use anyhow::Result;
mod config; mod models; mod engines; mod commands;
#[derive(Parser)]
#[command(about = "SAGCO Field Engineering CLI")]
struct Cli { #[command(subcommand)] command: Commands }
#[derive(clap::Subcommand)]
enum Commands {
    Compute(commands::compute::ComputeArgs),
    Audit(commands::audit::AuditArgs),
    Validate(commands::validate::ValidateArgs),
}
fn main() -> Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Commands::Compute(a)  => commands::compute::execute(a),
        Commands::Audit(a)    => commands::audit::execute(a),
        Commands::Validate(a) => commands::validate::execute(a),
    }
}
RUST

cargo build --release
./target/release/sagco-cli compute
```

-----

## Inventor

Domenic Gabriel Garza
Strategickhaos DAO LLC | EIN 39-2900295
ORCID 0009-0005-2996-3526
Wyoming 2025-001708194
