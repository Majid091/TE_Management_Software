# Services Layer (Business Logic)

## Structure

```
services/
├── auth/              # Authentication & authorization logic
├── employees/         # Employee business operations
├── departments/       # Department business operations
├── projects/          # Project business operations
├── revenue/           # Revenue calculation & tracking
├── reports/           # Report generation logic
├── audit/             # Audit logging service
├── notifications/     # Notification handling
└── email/             # Email service
```

## Service Responsibilities

### AuthService
- User authentication
- Token generation and validation
- Password hashing and verification
- Role-based access control checks
- Session management

### EmployeeService
- Employee CRUD operations
- Position assignment
- Department transfers
- Project allocation management
- Availability tracking
- Employee search and filtering

### DepartmentService
- Department CRUD operations
- Hierarchy management
- Budget tracking
- Employee roster management
- Department statistics

### ProjectService
- Project CRUD operations
- Team composition management
- Status transitions
- Timeline management
- Project-employee assignments
- Allocation percentage tracking

### RevenueService
- Revenue entry management
- Revenue calculations
- Period-based aggregations
- Project revenue tracking
- Department revenue rollups

### ReportService
- Revenue reports
- Employee utilization reports
- Project status reports
- Department performance reports
- Custom report generation
- Data aggregation and formatting

### AuditService
- Activity logging
- Change tracking
- Audit trail queries
- Compliance reporting

### NotificationService
- In-app notifications
- Notification preferences
- Broadcast notifications

### EmailService
- Email template management
- Email sending
- Email queue management
