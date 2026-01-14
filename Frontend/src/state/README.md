# State Management

## Structure

```
state/
├── actions/          # Action creators
├── reducers/         # State reducers
├── selectors/        # State selectors
└── store/            # Store configuration
```

## State Modules

### Auth State
- currentUser
- isAuthenticated
- permissions
- sessionInfo

### Employees State
- employeeList
- selectedEmployee
- employeeFilters
- availability

### Departments State
- departmentList
- departmentTree
- selectedDepartment

### Projects State
- projectList
- selectedProject
- projectFilters
- teamMembers

### Revenue State
- revenueEntries
- revenueSummary
- revenueFilters

### Reports State
- reportData
- reportFilters
- generatedReports

### UI State
- loading states
- modal states
- sidebar collapsed
- notifications

## Actions

### Employee Actions
- fetchEmployees
- fetchEmployeeById
- createEmployee
- updateEmployee
- deleteEmployee
- assignToProject
- updateAvailability

### Project Actions
- fetchProjects
- fetchProjectById
- createProject
- updateProject
- deleteProject
- addTeamMember
- removeTeamMember

## Selectors

### Employee Selectors
- selectAllEmployees
- selectEmployeeById
- selectEmployeesByDepartment
- selectAvailableEmployees

### Project Selectors
- selectAllProjects
- selectProjectById
- selectProjectsByStatus
- selectProjectsByDepartment
