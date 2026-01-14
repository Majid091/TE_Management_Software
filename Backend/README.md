# Backend - Company Management Software

## Directory Structure

```
Backend/
├── src/                    # Source code
│   ├── api/               # API layer
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # Route definitions
│   │   ├── middlewares/   # Request/response interceptors
│   │   └── validators/    # Input validation schemas
│   ├── services/          # Business logic layer
│   ├── models/            # Data models
│   │   ├── entities/      # Entity definitions
│   │   ├── relationships/ # Many-to-many mappings
│   │   └── enums/         # Enumeration types
│   ├── repositories/      # Data access layer
│   ├── config/            # Configuration files
│   ├── database/          # Database related
│   │   ├── migrations/    # Database migrations
│   │   ├── seeds/         # Seed data
│   │   └── schemas/       # Schema definitions
│   ├── jobs/              # Background processing
│   │   ├── schedulers/    # Scheduled tasks
│   │   ├── workers/       # Job processors
│   │   └── queues/        # Queue definitions
│   ├── utils/             # Utility functions
│   ├── constants/         # Application constants
│   ├── types/             # Type definitions
│   └── events/            # Event system
├── tests/                 # Test suites
└── docs/                  # Documentation
```

## Module Responsibilities

### Controllers
Handle HTTP requests and delegate to services

### Services
Contain business logic and orchestrate operations

### Repositories
Abstract database operations and queries

### Models
Define data structures and relationships
