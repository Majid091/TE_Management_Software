# Components

## Structure

```
components/
├── common/           # Reusable generic components
│   ├── buttons/      # Button variants
│   ├── inputs/       # Form input components
│   ├── modals/       # Modal dialogs
│   ├── tables/       # Table components
│   ├── cards/        # Card components
│   ├── loaders/      # Loading indicators
│   ├── alerts/       # Alert/notification components
│   ├── pagination/   # Pagination controls
│   ├── navigation/   # Navigation components
│   └── forms/        # Form wrapper components
├── layout/           # Layout components
│   ├── header/       # App header
│   ├── sidebar/      # Navigation sidebar
│   ├── footer/       # App footer
│   └── main/         # Main content area
└── features/         # Feature-specific components
    ├── employees/    # Employee module components
    ├── departments/  # Department module components
    ├── projects/     # Project module components
    ├── revenue/      # Revenue module components
    ├── reports/      # Report module components
    ├── auth/         # Authentication components
    └── audit/        # Audit log components
```

## Common Components

### Buttons
- PrimaryButton
- SecondaryButton
- IconButton
- LoadingButton

### Inputs
- TextInput
- SelectInput
- DatePicker
- SearchInput
- Checkbox
- RadioGroup

### Tables
- DataTable
- SortableTable
- PaginatedTable

### Modals
- ConfirmModal
- FormModal
- AlertModal

## Feature Components

### Employees
- EmployeeList
- EmployeeCard
- EmployeeForm
- EmployeeDetails
- AvailabilityCalendar
- ProjectAssignment

### Projects
- ProjectList
- ProjectCard
- ProjectForm
- ProjectDetails
- TeamMemberList
- ProjectTimeline

### Departments
- DepartmentList
- DepartmentTree
- DepartmentForm
- DepartmentDetails

### Reports
- ReportFilters
- ReportChart
- ReportTable
- ReportExport
