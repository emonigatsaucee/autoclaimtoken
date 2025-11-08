# Local PostgreSQL Setup (Free Forever)

## Quick Docker Setup (Easiest)
```bash
# Install Docker Desktop from https://docker.com/products/docker-desktop
# Then run:
docker run --name postgres-crypto -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=autoclaimtoken -p 5432:5432 -d postgres:15

# Update your .env file:
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/autoclaimtoken
```

## Manual PostgreSQL Installation
### Windows:
1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Set password for 'postgres' user
4. Open pgAdmin or SQL Shell
5. Create database:
   ```sql
   CREATE DATABASE autoclaimtoken;
   ```
6. Update .env:
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/autoclaimtoken
   ```

## Test Connection:
```bash
npm run dev
# Visit http://localhost:3001/health
# Should show "Database initialized successfully"
```