# API Layer

## Structure

```
api/
├── controllers/         # Request handlers by domain
│   ├── auth/           # Authentication operations
│   ├── employees/      # Employee CRUD & operations
│   ├── departments/    # Department CRUD & operations
│   ├── projects/       # Project CRUD & operations
│   ├── revenue/        # Revenue tracking operations
│   ├── reports/        # Report generation
│   ├── audit/          # Audit log operations
│   └── users/          # User management
├── routes/             # Route definitions and grouping
├── middlewares/        # Request interceptors
│   ├── auth/           # Authentication & authorization
│   ├── validation/     # Request validation
│   ├── error/          # Error handling
│   ├── logging/        # Request logging
│   └── rateLimit/      # Rate limiting
└── validators/         # Input validation schemas
    ├── auth/           # Auth request schemas
    ├── employees/      # Employee request schemas
    ├── departments/    # Department request schemas
    ├── projects/       # Project request schemas
    ├── revenue/        # Revenue request schemas
    └── reports/        # Report request schemas
```

## API Endpoints Overview

### Authentication
- POST   /api/auth/login
- POST   /api/auth/logout
- POST   /api/auth/refresh
- POST   /api/auth/password/reset
- POST   /api/auth/password/change

### Employees
- GET    /api/employees
- GET    /api/employees/:id
- POST   /api/employees
- PUT    /api/employees/:id
- DELETE /api/employees/:id
- GET    /api/employees/:id/projects
- GET    /api/employees/:id/availability
- PUT    /api/employees/:id/availability

### Departments
- GET    /api/departments
- GET    /api/departments/:id
- POST   /api/departments
- PUT    /api/departments/:id
- DELETE /api/departments/:id
- GET    /api/departments/:id/employees
- GET    /api/departments/:id/projects

### Projects
- GET    /api/projects
- GET    /api/projects/:id
- POST   /api/projects
- PUT    /api/projects/:id
- DELETE /api/projects/:id
- GET    /api/projects/:id/employees
- POST   /api/projects/:id/employees
- DELETE /api/projects/:id/employees/:employeeId
- GET    /api/projects/:id/revenue

### Revenue
- GET    /api/revenue
- GET    /api/revenue/:id
- POST   /api/revenue
- PUT    /api/revenue/:id
- DELETE /api/revenue/:id
- GET    /api/revenue/summary
- GET    /api/revenue/by-project/:projectId
- GET    /api/revenue/by-department/:departmentId

### Reports
- GET    /api/reports/revenue
- GET    /api/reports/employees
- GET    /api/reports/projects
- GET    /api/reports/departments
- GET    /api/reports/utilization
- POST   /api/reports/custom

### Audit
- GET    /api/audit/logs
- GET    /api/audit/logs/:id
- GET    /api/audit/logs/entity/:entityType/:entityId

### Users
- GET    /api/users
- GET    /api/users/:id
- POST   /api/users
- PUT    /api/users/:id
- DELETE /api/users/:id
- PUT    /api/users/:id/role
