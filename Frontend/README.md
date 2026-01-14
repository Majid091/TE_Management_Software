# Frontend - Company Management Software

## Directory Structure

```
Frontend/
├── src/                      # Source code
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication screens
│   │   ├── dashboard/       # Main dashboard
│   │   ├── employees/       # Employee management
│   │   ├── departments/     # Department management
│   │   ├── projects/        # Project management
│   │   ├── revenue/         # Revenue tracking
│   │   ├── reports/         # Reports & analytics
│   │   ├── settings/        # Application settings
│   │   ├── audit/           # Audit logs viewer
│   │   └── errors/          # Error pages (404, 500, etc.)
│   ├── components/          # Reusable components
│   │   ├── common/          # Generic UI components
│   │   ├── layout/          # Layout components
│   │   └── features/        # Feature-specific components
│   ├── layouts/             # Page layout templates
│   ├── state/               # State management
│   │   ├── actions/         # State actions
│   │   ├── reducers/        # State reducers
│   │   ├── selectors/       # State selectors
│   │   └── store/           # Store configuration
│   ├── api/                 # API communication
│   │   ├── services/        # API service functions
│   │   ├── interceptors/    # Request/response interceptors
│   │   └── endpoints/       # API endpoint definitions
│   ├── assets/              # Static assets
│   ├── styles/              # Styling
│   ├── hooks/               # Custom hooks
│   ├── helpers/             # Helper functions
│   ├── constants/           # Application constants
│   ├── utils/               # Utility functions
│   ├── types/               # Type definitions
│   ├── config/              # Configuration
│   └── routes/              # Route definitions
├── tests/                   # Test suites
└── public/                  # Public static files
```

## Feature Modules

### Authentication
- Login, logout, password reset
- Role-based access control UI
- Session management

### Employee Management
- Employee CRUD operations
- Position/role assignment
- Department assignment
- Project assignment & availability

### Project Management
- Project CRUD operations
- Team member management
- Timeline & status tracking
- Revenue tracking per project

### Department Management
- Department CRUD operations
- Employee roster
- Project portfolio

### Reports & Analytics
- Revenue reports
- Employee utilization
- Project status summaries
- Custom report generation
