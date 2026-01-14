# Data Models

## Entities

### Employee
- id
- firstName
- lastName
- email
- phone
- hireDate
- status (active, inactive, on_leave)
- positionId (FK)
- departmentId (FK)
- managerId (FK - self-reference)
- createdAt
- updatedAt

### Department
- id
- name
- code
- description
- managerId (FK to Employee)
- parentDepartmentId (FK - self-reference for hierarchy)
- budget
- createdAt
- updatedAt

### Project
- id
- name
- code
- description
- departmentId (FK)
- status (planning, active, on_hold, completed, cancelled)
- startDate
- endDate
- estimatedRevenue
- actualRevenue
- createdAt
- updatedAt

### Position
- id
- title
- level
- departmentId (FK)
- description
- createdAt
- updatedAt

### User
- id
- employeeId (FK)
- username
- passwordHash
- role (admin, manager, employee)
- lastLogin
- isActive
- createdAt
- updatedAt

### AuditLog
- id
- userId (FK)
- action
- entityType
- entityId
- oldValues
- newValues
- ipAddress
- userAgent
- createdAt

### Revenue
- id
- projectId (FK)
- amount
- type (estimated, actual, invoiced, received)
- period
- description
- createdAt
- updatedAt

## Relationships (Many-to-Many)

### EmployeeProject
- id
- employeeId (FK)
- projectId (FK)
- role (developer, lead, manager, consultant)
- allocation (percentage)
- startDate
- endDate
- createdAt
- updatedAt

### EmployeeAvailability
- id
- employeeId (FK)
- date
- availableHours
- allocatedHours
- notes
- createdAt
- updatedAt

## Enums

### EmployeeStatus
- ACTIVE
- INACTIVE
- ON_LEAVE
- TERMINATED

### ProjectStatus
- PLANNING
- ACTIVE
- ON_HOLD
- COMPLETED
- CANCELLED

### UserRole
- ADMIN
- MANAGER
- EMPLOYEE

### AllocationRole
- DEVELOPER
- LEAD
- MANAGER
- CONSULTANT
