# MCP Extensions - Academic

## Overview

Academic Intelligence Processor - SNHU email processing and academic signal extraction.

## Purpose

This MCP extension processes academic emails from SNHU through the Zapier integration, extracting:

- **Course information** - Course codes, assignments, deadlines
- **Academic deadlines** - Due dates, exam schedules
- **Grading updates** - Grade notifications, feedback
- **Communication** - Professor communications, announcements
- **Resource links** - Course materials, reading assignments

## Zapier Integration

### Trigger
- **Office 365 Outlook** - New email received

### Filters (7 Academic Conditions)
1. From domain contains `snhu.edu`
2. Subject contains course codes (e.g., CS, IT, MAT)
3. To/CC contains student email
4. Not from automated systems
5. Contains academic keywords (assignment, due, grade, exam, quiz)
6. Not spam or promotional
7. Sent during academic hours

### Processing
- **GPT-4o mini** - AI summarization of email content
- Extract structured data from natural language
- Classify email type (assignment, deadline, grade, communication)

### Webhook
- **Endpoint**: `https://[CODESPACE]-8080.app.github.dev/signals/academic`
- **Method**: POST
- **Headers**:
  - `X-GPG-Key-ID: AE5519579584DEF5`
  - `X-Subkey: 510AB6D40B4A24FB`
  - `X-Source: strategickhaos-academic`
  - `Content-Type: application/json`

## Data Structure

Expected webhook payload:
```json
{
  "id": "unique-email-id",
  "timestamp": "2025-12-04T18:00:00Z",
  "from": "professor@snhu.edu",
  "subject": "CS-499 Final Project Due Date",
  "summary": "AI-generated summary of email",
  "type": "deadline",
  "course": "CS-499",
  "deadline": "2025-12-15T23:59:00Z",
  "priority": "high",
  "action_required": true
}
```

## Processing Pipeline

1. **Receive** - Webhook receives signal from Zapier
2. **Validate** - GPG headers and payload structure
3. **Parse** - Extract academic metadata
4. **Store** - Save to database or file system
5. **Alert** - Trigger notifications if high priority
6. **Analyze** - Feed into broader academic intelligence

## Storage

Signals stored in:
```
mcp-extensions/academic/
├── signals/
│   ├── 2025-12/
│   │   ├── signal-001.json
│   │   ├── signal-002.json
│   │   └── ...
└── README.md
```

## Future Enhancements

- Calendar integration for deadline tracking
- Smart prioritization based on urgency
- Automatic response suggestions
- Study schedule optimization
- Grade tracking and GPA projection
