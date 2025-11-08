# PostgreSQL Setup Instructions

## Option 1: Local PostgreSQL Installation

### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for 'postgres' user
4. Open pgAdmin or command line
5. Create database: `CREATE DATABASE autoclaimtoken;`
6. Update .env file with your connection string:
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/autoclaimtoken
   ```

### Alternative: Using Docker
```bash
# Run PostgreSQL in Docker
docker run --name postgres-crypto -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=autoclaimtoken -p 5432:5432 -d postgres:15

# Update .env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/autoclaimtoken
```

## Option 2: Free Cloud Database (Recommended for Testing)

### Render PostgreSQL (Free):
1. Go to https://render.com
2. Sign up for free account
3. Create new PostgreSQL database
4. Copy the External Database URL
5. Update .env with the provided URL

### Supabase (Free):
1. Go to https://supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy connection string
5. Update .env file

## After Database Setup:
1. Update your .env file with correct DATABASE_URL
2. Restart the backend server: `npm run dev`
3. Database tables will be created automatically

## Test Connection:
Visit http://localhost:3001/health to verify backend is running with database.