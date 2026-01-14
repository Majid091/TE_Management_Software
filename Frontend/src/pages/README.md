# Pages

## Structure

```
pages/
├── auth/             # Authentication pages
├── dashboard/        # Main dashboard
├── employees/        # Employee management pages
├── departments/      # Department management pages
├── projects/         # Project management pages
├── revenue/          # Revenue tracking pages
├── reports/          # Reports & analytics pages
├── settings/         # Application settings
├── audit/            # Audit log pages
└── errors/           # Error pages
```

## Page Descriptions

### Auth Pages
- LoginPage - User login
- LogoutPage - Logout confirmation
- ForgotPasswordPage - Password reset request
- ResetPasswordPage - Set new password
- UnauthorizedPage - Access denied

### Dashboard
- DashboardPage - Main overview with widgets
  - Revenue summary
  - Active projects
  - Employee utilization
  - Recent activity

### Employee Pages
- EmployeeListPage - List all employees
- EmployeeDetailPage - View employee details
- EmployeeCreatePage - Add new employee
- EmployeeEditPage - Edit employee
- EmployeeAvailabilityPage - Manage availability

### Department Pages
- DepartmentListPage - List all departments
- DepartmentDetailPage - View department details
- DepartmentCreatePage - Add new department
- DepartmentEditPage - Edit department

### Project Pages
- ProjectListPage - List all projects
- ProjectDetailPage - View project details
- ProjectCreatePage - Add new project
- ProjectEditPage - Edit project
- ProjectTeamPage - Manage project team

### Revenue Pages
- RevenueOverviewPage - Revenue dashboard
- RevenueEntryPage - Add/edit revenue entries
- RevenueByProjectPage - Project revenue breakdown
- RevenueByDepartmentPage - Department revenue

### Report Pages
- ReportsOverviewPage - Report dashboard
- RevenueReportPage - Revenue reports
- UtilizationReportPage - Employee utilization
- ProjectReportPage - Project status reports
- CustomReportPage - Build custom reports

### Settings Pages
- GeneralSettingsPage - App settings
- ProfileSettingsPage - User profile
- SecuritySettingsPage - Password/security

### Audit Pages
- AuditLogPage - View audit logs
- AuditDetailPage - View audit entry details

### Error Pages
- NotFoundPage (404)
- ServerErrorPage (500)
- MaintenancePage
