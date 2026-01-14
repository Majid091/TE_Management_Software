# API Communication Layer

## Structure

```
api/
├── services/         # API service functions
├── interceptors/     # Request/response interceptors
└── endpoints/        # API endpoint definitions
```

## Services

### AuthService
- login(credentials)
- logout()
- refreshToken()
- resetPassword(email)
- changePassword(oldPassword, newPassword)

### EmployeeService
- getAll(filters)
- getById(id)
- create(data)
- update(id, data)
- delete(id)
- getProjects(employeeId)
- getAvailability(employeeId, dateRange)
- updateAvailability(employeeId, data)

### DepartmentService
- getAll()
- getById(id)
- create(data)
- update(id, data)
- delete(id)
- getEmployees(departmentId)
- getProjects(departmentId)

### ProjectService
- getAll(filters)
- getById(id)
- create(data)
- update(id, data)
- delete(id)
- getTeamMembers(projectId)
- addTeamMember(projectId, employeeId, allocation)
- removeTeamMember(projectId, employeeId)

### RevenueService
- getAll(filters)
- getById(id)
- create(data)
- update(id, data)
- delete(id)
- getSummary(dateRange)
- getByProject(projectId)
- getByDepartment(departmentId)

### ReportService
- getRevenueReport(params)
- getUtilizationReport(params)
- getProjectReport(params)
- generateCustomReport(config)
- exportReport(reportId, format)

### AuditService
- getLogs(filters)
- getLogById(id)
- getEntityHistory(entityType, entityId)

## Interceptors

### Request Interceptor
- Add authentication token
- Add request ID for tracking
- Set content type headers

### Response Interceptor
- Handle authentication errors (401)
- Handle authorization errors (403)
- Handle server errors (500)
- Transform response data

### Error Interceptor
- Standardize error format
- Log errors
- Show error notifications

## Endpoints

Centralized endpoint definitions for maintainability:
- AUTH_ENDPOINTS
- EMPLOYEE_ENDPOINTS
- DEPARTMENT_ENDPOINTS
- PROJECT_ENDPOINTS
- REVENUE_ENDPOINTS
- REPORT_ENDPOINTS
- AUDIT_ENDPOINTS
