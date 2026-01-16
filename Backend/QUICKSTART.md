# Quick Start Guide

Get the TE Management Software backend running in 5 minutes.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Step 1: Install Dependencies

```bash
cd Backend
npm install
```

## Step 2: Setup Database

1. Create a PostgreSQL database:
```bash
createdb te_management
```

Or using psql:
```sql
CREATE DATABASE te_management;
```

2. Run the database schema:
```bash
psql -U postgres -d te_management -f src/database/schemas/schema.sql
```

3. (Optional) Load seed data:
```bash
psql -U postgres -d te_management -f src/database/seeds/seed-data.sql
```

## Step 3: Configure Environment

Create a `.env` file:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=te_management

JWT_SECRET=change-this-to-a-secure-random-string
JWT_REFRESH_SECRET=change-this-to-another-secure-random-string
```

## Step 4: Run the Application

Development mode:
```bash
npm run start:dev
```

The API will be available at: http://localhost:3000/api

## Step 5: Test the API

### Login (Get Access Token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123"
  }'
```

### Use the Token

```bash
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Test Accounts

After running seed data, you can login with:

| Email | Password | Role |
|-------|----------|------|
| admin@company.com | password123 | Admin |
| manager@company.com | password123 | Manager |
| employee@company.com | password123 | Employee |

**Note:** You'll need to hash these passwords with bcrypt before inserting into the database. Use the following command:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10).then(hash => console.log(hash));"
```

## Common Issues

### Database Connection Error
- Check if PostgreSQL is running: `pg_isready`
- Verify database credentials in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use
- Change the port in `.env`: `PORT=3001`
- Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)

### JWT Token Error
- Ensure JWT_SECRET is set in `.env`
- Token may have expired (default: 15 minutes)
- Request a new token using the refresh endpoint

## Next Steps

1. Read the [API Documentation](./docs/API_DOCUMENTATION.md)
2. Explore the [README](./README.md) for detailed information
3. Check the database schema: `src/database/schemas/schema.sql`
4. Review the entity models: `src/database/entities/`

## Development Tips

### Watch Mode
```bash
npm run start:dev
```
Auto-reloads on file changes.

### Debug Mode
```bash
npm run start:debug
```
Enables debugging on port 9229.

### Run Tests
```bash
npm run test
```

### Check Logs
All requests are logged in development mode. Check the console output.

## API Testing Tools

- **Postman**: Import the API endpoints from the documentation
- **curl**: Use command-line examples from the docs
- **Thunder Client**: VS Code extension for API testing
- **Insomnia**: REST client alternative

## Production Build

```bash
npm run build
npm run start:prod
```

## Need Help?

- Check the [README](./README.md) for detailed documentation
- Review [API Documentation](./docs/API_DOCUMENTATION.md)
- Examine entity relationships in `src/database/entities/`
- Look at example requests in the documentation
