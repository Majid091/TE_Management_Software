# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "admin@company.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "department": "Engineering",
    "avatar": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

### Change Password
```http
POST /auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Employees

### List Employees
```http
GET /employees?page=1&limit=10&search=john&department=1&availability=available
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "phone": "+1 234 567 8901",
      "position": "Senior Software Engineer",
      "department": {
        "id": "1",
        "name": "Engineering"
      },
      "availability": "available",
      "hireDate": "2020-03-15",
      "salary": 95000,
      "skills": ["React", "Node.js", "TypeScript"],
      "avatar": null,
      "manager": {
        "id": "4",
        "name": "Sarah Johnson"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 76,
    "totalPages": 8
  }
}
```

### Get Employee Details
```http
GET /employees/1
Authorization: Bearer {token}
```

### Create Employee
```http
POST /employees
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newemployee@company.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "Employee",
  "phone": "+1 234 567 8999",
  "position": "Software Engineer",
  "departmentId": 1,
  "availability": "available",
  "hireDate": "2024-01-15",
  "salary": 85000,
  "skills": ["JavaScript", "React"],
  "managerId": 4,
  "role": "employee"
}
```

### Update Employee
```http
PATCH /employees/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "position": "Senior Software Engineer",
  "salary": 100000
}
```

### Update Employee Availability
```http
PATCH /employees/1/availability
Authorization: Bearer {token}
Content-Type: application/json

{
  "availability": "busy"
}
```

### Delete Employee
```http
DELETE /employees/1
Authorization: Bearer {token}
```

## Departments

### List Departments
```http
GET /departments?page=1&limit=10&search=engineering
Authorization: Bearer {token}
```

### Get Department Details
```http
GET /departments/1
Authorization: Bearer {token}
```

### Create Department
```http
POST /departments
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Sales",
  "description": "Sales and business development",
  "budget": 1000000,
  "location": "Building C, Floor 1",
  "email": "sales@company.com",
  "phone": "+1 234 567 8960",
  "headId": 5
}
```

### Get Department Employees
```http
GET /departments/1/employees
Authorization: Bearer {token}
```

### Get Department Projects
```http
GET /departments/1/projects
Authorization: Bearer {token}
```

### Get Department Stats
```http
GET /departments/1/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "employeeCount": 25,
  "projectCount": 8,
  "budget": 2500000,
  "activeProjects": 5
}
```

## Projects

### List Projects
```http
GET /projects?page=1&limit=10&search=alpha&status=in_progress&department=1
Authorization: Bearer {token}
```

### Get Project Details
```http
GET /projects/1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "1",
  "name": "Project Alpha",
  "description": "Enterprise resource planning system modernization",
  "status": "in_progress",
  "department": {
    "id": "1",
    "name": "Engineering"
  },
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",
  "budget": 500000,
  "progress": 65,
  "priority": "high",
  "manager": {
    "id": "4",
    "name": "Sarah Johnson"
  },
  "client": "Acme Corporation",
  "tags": ["ERP", "Modernization", "Cloud"],
  "team": [
    {
      "id": "1",
      "name": "John Doe",
      "role": "Lead Developer",
      "allocationPercentage": 100
    }
  ]
}
```

### Create Project
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "status": "planning",
  "priority": "medium",
  "departmentId": 1,
  "managerId": 2,
  "client": "Client Name",
  "startDate": "2024-06-01",
  "endDate": "2024-12-31",
  "budget": 400000,
  "progress": 0,
  "tags": ["Tag1", "Tag2"]
}
```

### Assign Employee to Project
```http
POST /projects/1/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "employeeId": 3,
  "role": "Backend Developer",
  "allocationPercentage": 75
}
```

### Remove Employee from Project
```http
DELETE /projects/1/remove-employee/3
Authorization: Bearer {token}
```

## Revenue

### Get Revenue Summary
```http
GET /revenue/summary
Authorization: Bearer {token}
```

**Response:**
```json
{
  "totalRevenue": 2850000,
  "totalExpenses": 1950000,
  "netProfit": 900000,
  "profitMargin": 31.58,
  "revenueGrowth": 15.2,
  "expenseGrowth": 8.5,
  "activeProjects": 12,
  "completedProjects": 8
}
```

### Get Monthly Revenue
```http
GET /revenue/monthly?year=2024
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "month": "Jan",
    "revenue": 180000,
    "expenses": 120000,
    "profit": 60000
  },
  {
    "month": "Feb",
    "revenue": 220000,
    "expenses": 150000,
    "profit": 70000
  }
]
```

### Get Yearly Revenue
```http
GET /revenue/yearly
Authorization: Bearer {token}
```

### Get Revenue by Date Range
```http
GET /revenue/range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

### Get Revenue by Project
```http
GET /revenue/project/1
Authorization: Bearer {token}
```

### Get Revenue by Department
```http
GET /revenue/department/1
Authorization: Bearer {token}
```

### Create Revenue Record
```http
POST /revenue
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectId": 1,
  "amount": 150000,
  "expense": 80000,
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-31",
  "description": "Q1 revenue"
}
```

## Analytics

### Get Dashboard Overview
```http
GET /analytics/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "overview": {
    "totalEmployees": 76,
    "totalProjects": 20,
    "totalDepartments": 6,
    "totalRevenue": 2850000,
    "employeeGrowth": 12.5,
    "projectGrowth": 8.3,
    "revenueGrowth": 15.2
  },
  "projectsByStatus": [
    {
      "status": "planning",
      "count": 3,
      "percentage": 15
    }
  ],
  "employeesByDepartment": [
    {
      "department": "Engineering",
      "count": 25
    }
  ],
  "employeeAvailability": [
    {
      "status": "available",
      "count": 45,
      "percentage": 59.2
    }
  ],
  "recentActivity": [],
  "upcomingDeadlines": [
    {
      "id": 1,
      "project": "Project Alpha",
      "deadline": "2024-03-15",
      "daysLeft": 5
    }
  ]
}
```

### Get Employee Analytics
```http
GET /analytics/employees
Authorization: Bearer {token}
```

### Get Project Analytics
```http
GET /analytics/projects
Authorization: Bearer {token}
```

### Get Department Analytics
```http
GET /analytics/departments
Authorization: Bearer {token}
```

### Get Trends
```http
GET /analytics/trends
Authorization: Bearer {token}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/employees",
  "method": "POST",
  "message": "Validation failed"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/employees",
  "method": "GET",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/employees",
  "method": "POST",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/employees/999",
  "method": "GET",
  "message": "Employee not found"
}
```

## Rate Limiting

API requests are rate-limited to 100 requests per minute per IP address.

## Pagination

All list endpoints support pagination with the following query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search query string

## Filtering

List endpoints support various filters:
- **Employees**: `department`, `availability`
- **Projects**: `status`, `department`

## Sorting

Currently, results are sorted by creation date (newest first). Custom sorting will be added in future versions.
