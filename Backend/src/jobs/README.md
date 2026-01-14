# Background Jobs

## Structure

```
jobs/
├── schedulers/       # Scheduled/cron tasks
├── workers/          # Job processing logic
└── queues/           # Queue definitions
```

## Schedulers

### Daily Jobs
- Revenue aggregation
- Availability reset
- Report generation

### Weekly Jobs
- Utilization summary emails
- Project status updates
- Audit log cleanup (archive old logs)

### Monthly Jobs
- Revenue reports
- Department performance summaries
- Data backup tasks

## Workers

### RevenueWorker
- Process revenue calculations
- Generate revenue snapshots

### ReportWorker
- Generate scheduled reports
- Process custom report requests

### NotificationWorker
- Send email notifications
- Process notification queue

### AuditWorker
- Process audit log entries
- Archive old audit records

## Queues

### High Priority
- Authentication events
- Critical notifications

### Normal Priority
- Report generation
- Email sending

### Low Priority
- Audit logging
- Analytics processing
