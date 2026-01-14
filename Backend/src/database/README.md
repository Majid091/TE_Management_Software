# Database Layer

## Structure

```
database/
├── migrations/        # Database migration files
├── seeds/            # Seed data for development/testing
└── schemas/          # Schema definitions
```

## Migrations

Migration files should be numbered sequentially and include:
- Create tables for all entities
- Add indexes for performance
- Set up foreign key relationships
- Add constraints

### Migration Order
1. Create positions table
2. Create departments table
3. Create employees table
4. Create users table
5. Create projects table
6. Create employee_projects (junction table)
7. Create employee_availability table
8. Create revenue table
9. Create audit_logs table

## Seeds

Seed files for populating initial/test data:
- Default admin user
- Sample departments
- Sample positions
- Sample employees
- Sample projects
- Sample revenue data

## Schemas

Schema definition files documenting:
- Table structures
- Column types and constraints
- Indexes
- Foreign key relationships
- Triggers (if applicable)
