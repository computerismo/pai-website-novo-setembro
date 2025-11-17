# 🚀 Railway Deployment Guide

This guide will help you deploy your dental website with blogging system to Railway.

## Prerequisites

- Railway account (sign up at https://railway.app)
- This repository pushed to GitHub
- Basic knowledge of environment variables

## Step 1: Create a Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose this repository
5. Railway will auto-detect it's a Next.js app

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. The `DATABASE_URL` environment variable will be automatically set

## Step 3: Configure Environment Variables

In your Railway project settings, add these environment variables:

### Required Variables

```bash
# Database (automatically set by Railway)
DATABASE_URL=postgresql://... (already set)

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters-long
NEXTAUTH_URL=https://your-app-name.railway.app

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-app-name.railway.app
```

### Generate NEXTAUTH_SECRET

Run this command locally to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Step 4: Deploy

1. Railway will automatically deploy your app
2. Wait for the build to complete (5-10 minutes for first deploy)
3. Your app will be available at `https://your-app-name.railway.app`

## Step 5: Run Database Migrations

After the first deployment, you need to set up the database:

1. In Railway, go to your web service
2. Open the "Settings" tab
3. Scroll to "Custom Start Command" and temporarily add:

```bash
npx prisma migrate deploy && npm start
```

4. Redeploy your service
5. After successful migration, remove the custom command (Railway will use `npm start` by default)

Alternatively, use Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migration
railway run npx prisma migrate deploy
```

## Step 6: Create Admin User

After database is set up, you need to create the first admin user. You have two options:

### Option A: Run Migration Script

```bash
# Using Railway CLI
railway run npx ts-node scripts/migrate-mdx-to-db.ts
```

This will:
- Create an admin user: `admin@clinica.com` / `admin123`
- Migrate existing MDX posts to database

### Option B: Manually Create Admin User

Use Railway's PostgreSQL shell or a tool like Prisma Studio:

```bash
# Hash a password first (use bcrypt)
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);

# Then insert into database
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@clinica.com',
  '<hashed-password>',
  'Admin',
  'admin',
  NOW(),
  NOW()
);
```

## Step 7: Access Admin Panel

1. Go to `https://your-app-name.railway.app/login`
2. Login with your admin credentials
3. Start creating blog posts!

## Deployment Architecture

```
┌─────────────────────────────────────┐
│     Railway Project                 │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │  Next.js App │  │  PostgreSQL  ││
│  │  (Web Service)  │  (Database)  ││
│  │              │◄─┤              ││
│  │  - Frontend  │  │  - Posts     ││
│  │  - Admin     │  │  - Users     ││
│  │  - API       │  │  - Leads     ││
│  └──────────────┘  └──────────────┘│
│                                     │
└─────────────────────────────────────┘
         ▲
         │
    Public Internet
```

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | Auto-set by Railway |
| `NEXTAUTH_SECRET` | NextAuth encryption key | ✅ | Generate with OpenSSL |
| `NEXTAUTH_URL` | Your app URL | ✅ | https://your-app.railway.app |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | ❌ | G-XXXXXXXXXX |
| `NEXT_PUBLIC_SITE_URL` | Site URL for metadata | ❌ | https://your-app.railway.app |

## Custom Domain (Optional)

1. In Railway project settings, go to "Settings"
2. Click "Generate Domain" or "Custom Domain"
3. Add your custom domain (e.g., clinica.com.br)
4. Update DNS records as shown by Railway
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your custom domain

## Troubleshooting

### Build Fails

**Issue**: Build fails with "Prisma Client not found"

**Solution**: Railway automatically runs `postinstall` script which generates Prisma Client. Check that `package.json` has:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Error

**Issue**: App can't connect to database

**Solution**:
1. Check `DATABASE_URL` is set correctly
2. Ensure PostgreSQL service is running
3. Check Railway logs for connection errors

### NextAuth Error

**Issue**: "NEXTAUTH_SECRET is not set"

**Solution**: Generate and set `NEXTAUTH_SECRET` in environment variables

### Images Not Loading

**Issue**: Uploaded images return 404

**Solution**: Railway doesn't persist file uploads. Use external storage:
- Cloudinary
- AWS S3
- Uploadcare
- Or enable Railway volumes (paid feature)

## Monitoring & Logs

- Access logs in Railway dashboard under your service
- Set up alerts for errors
- Monitor database usage in PostgreSQL service

## Updating Your App

Railway automatically deploys on every push to your main branch:

1. Make changes locally
2. Commit and push to GitHub
3. Railway detects changes and auto-deploys
4. Check deployment status in Railway dashboard

## Cost Estimate

Railway pricing (as of 2024):

- **Free Tier**: $5 credit/month (enough for small sites)
- **Starter**: $5/month minimum usage
- **Average cost for this app**: ~$5-10/month

Typical usage:
- Next.js app: ~$3-5/month
- PostgreSQL: ~$2-3/month

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: [Your GitHub Repository]/issues

---

## Quick Start Checklist

- [ ] Create Railway account
- [ ] Create new project from GitHub
- [ ] Add PostgreSQL database
- [ ] Set environment variables
- [ ] Deploy app
- [ ] Run database migrations
- [ ] Create admin user
- [ ] Login to admin panel
- [ ] Create first blog post
- [ ] (Optional) Add custom domain

🎉 Your site is now live with a full blogging system!
