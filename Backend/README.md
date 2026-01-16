# TE Management Software - Backend API

Production-ready NestJS backend for the Company Management Software system.

## Features

- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Manager, Employee)
- RESTful API endpoints
- PostgreSQL database with TypeORM
- Comprehensive validation and error handling
- Request logging and auditing
- Pagination support
- Real-time capabilities ready

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (Passport)
- **Validation:** class-validator, class-transformer
- **Password Hashing:** bcrypt

## Project Structure

```
Backend/
├── src/
│   ├── common/          # Shared utilities
│   │   ├── decorators/  # Custom decorators
│   │   ├── dtos/        # Common DTOs
│   │   ├── enums/       # Enums
│   │   ├── filters/     # Exception filters
│   │   ├── guards/      # Auth & role guards
│   │   └── interceptors/# Request/response interceptors
│   ├── config/          # Configuration files
│   ├── database/        # Database setup
│   │   └── entities/    # TypeORM entities
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── employees/   # Employee management
│   │   ├── departments/ # Department management
│   │   ├── projects/    # Project management
│   │   ├── revenue/     # Revenue tracking
│   │   └── analytics/   # Analytics & reports
│   ├── app.module.ts    # Root module
│   └── main.ts          # Application entry
└── package.json
```

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with database credentials
```

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE te_management;
```

2. Run the schema from `src/database/schemas/schema.sql`:
```bash
psql -U postgres -d te_management -f src/database/schemas/schema.sql
```

3. Update `.env` with your database credentials

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at: `http://localhost:3000/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Employees
- `GET /api/employees` - List employees (with filters)
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee
- `PATCH /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `PATCH /api/employees/:id/availability` - Update availability
- `GET /api/employees/department/:id` - Get employees by department
- `GET /api/employees/:id/projects` - Get employee projects

### Departments
- `GET /api/departments` - List departments
- `GET /api/departments/:id` - Get department details
- `POST /api/departments` - Create department
- `PATCH /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department
- `GET /api/departments/:id/employees` - Get department employees
- `GET /api/departments/:id/projects` - Get department projects
- `GET /api/departments/:id/stats` - Get department statistics

### Projects
- `GET /api/projects` - List projects (with filters)
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/assign` - Assign employee to project
- `DELETE /api/projects/:id/remove-employee/:employeeId` - Remove employee
- `GET /api/projects/status/:status` - Get projects by status

### Revenue
- `GET /api/revenue` - List revenue records
- `GET /api/revenue/summary` - Get revenue summary
- `GET /api/revenue/monthly` - Get monthly revenue
- `GET /api/revenue/yearly` - Get yearly revenue
- `GET /api/revenue/range` - Get revenue by date range
- `GET /api/revenue/project/:id` - Get project revenue
- `GET /api/revenue/department/:id` - Get department revenue
- `POST /api/revenue` - Create revenue record
- `PATCH /api/revenue/:id` - Update revenue record
- `DELETE /api/revenue/:id` - Delete revenue record

### Analytics
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/employees` - Employee analytics
- `GET /api/analytics/projects` - Project analytics
- `GET /api/analytics/departments` - Department analytics
- `GET /api/analytics/trends` - Trend data

## Authentication

All endpoints (except login and refresh) require authentication via JWT Bearer token:

```
Authorization: Bearer <access_token>
```

## Role-Based Access

- **Admin:** Full access to all endpoints
- **Manager:** Can manage employees, projects, and view analytics
- **Employee:** Can view data, update own profile

## Environment Variables

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=te_management

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Enable SSL/TLS for database connections
4. Set up proper CORS policies
5. Configure rate limiting
6. Enable database connection pooling
7. Set up monitoring and logging

## License

MIT
