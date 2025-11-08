# Render Setup - Free PostgreSQL + Deployment

## Step 1: Create GitHub Repository
```bash
cd c:\Users\USER\autoclaimtoken
git init
git add .
git commit -m "Initial commit - CryptoRecover platform"
git branch -M main
git remote add origin https://github.com/yourusername/cryptorecover.git
git push -u origin main
```

## Step 2: Render Free PostgreSQL (90 days free)
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "PostgreSQL"
4. Name: `cryptorecover-db`
5. Database: `autoclaimtoken`
6. User: `postgres`
7. Region: Choose closest to you
8. Click "Create Database"
9. Copy the "External Database URL" (starts with postgresql://)

## Step 3: Deploy Backend to Render
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Name: `cryptorecover-backend`
4. Environment: `Node`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add Environment Variables:
   - `DATABASE_URL` = (paste your PostgreSQL URL)
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your-secret-key-here`
8. Click "Create Web Service"

## Step 4: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Import your GitHub repo
3. Framework: Next.js
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = (your Render backend URL)
5. Deploy

## URLs You'll Get:
- Backend: https://cryptorecover-backend.onrender.com
- Frontend: https://cryptorecover.vercel.app
- Database: Managed by Render

Total Cost: $0 (Free for 90 days PostgreSQL, unlimited frontend)