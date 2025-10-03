# 🔧 Database Connection Pooling Fix

## Problem
Railway production was experiencing **Prisma prepared statement errors** with connection pooling:
```
Error: prepared statement "s0" already exists
ConnectorError: QueryError(PostgresError { code: "42P05" })
```

## Root Cause
The issue occurred because:
1. We were using Supabase connection pooling (port **6543**)
2. Railway's Prisma client was creating prepared statements
3. PgBouncer (connection pooler) doesn't support prepared statements in transaction mode

## Solution

### 1. **Updated Prisma Schema**
Added `directUrl` for migrations and pooling support:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")  // ✅ Added this
}
```

### 2. **Updated Railway Environment Variables**

Set the following variables in Railway:

```bash
# Pooled connection with pgbouncer parameter
DATABASE_URL="postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct connection for migrations
DIRECT_DATABASE_URL="postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**Key Parameters:**
- `pgbouncer=true` - Tells Prisma to use PgBouncer-compatible mode (no prepared statements)
- `connection_limit=1` - Limits connections to prevent pooling issues
- Port **6543** for pooled queries (read/write operations)
- Port **5432** for direct connection (migrations only)

### 3. **Railway Commands Used**

```bash
# Link to Railway project
railway link

# Set pooled connection URL
railway variables --set DATABASE_URL="postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Set direct connection URL for migrations
railway variables --set DIRECT_DATABASE_URL="postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Push code to trigger redeploy
git push origin master
```

## How It Works

### Connection Types

| Connection Type | Port | URL Parameter | Use Case |
|----------------|------|---------------|----------|
| **Direct** | 5432 | None | Migrations, admin operations |
| **Pooled** | 6543 | `pgbouncer=true` | Application queries (production) |

### Prisma Behavior

- **DATABASE_URL (pooled)**: Used for all query operations
  - Disables prepared statements with `pgbouncer=true`
  - Limits connections with `connection_limit=1`
  - Prevents "prepared statement already exists" errors

- **DIRECT_DATABASE_URL**: Used only for:
  - Schema migrations (`prisma migrate`)
  - Schema push (`prisma db push`)
  - Administrative operations

## Local Development

For local development, use direct connection:

```env
# .env
DATABASE_URL=postgresql://postgres:Admin_123@db.fzvvufqaiywfwfkwllpv.supabase.co:5432/postgres
DIRECT_DATABASE_URL=postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

## Production Settings

Railway environment variables:

```env
DATABASE_URL=postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

DIRECT_DATABASE_URL=postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

JWT_SECRET=eacdd885090b6d55dc4f41232a8c0b507f4056e5a9e0749b5c4d31abe26c465d
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=4000
```

## Testing

After deployment, test the login endpoint:

```bash
curl -X POST https://fullstack-onlineclass-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Student User",
    "email": "student@example.com",
    "role": "STUDENT"
  }
}
```

## Additional Resources

- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#connection-pool)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [PgBouncer Documentation](https://www.pgbouncer.org/usage.html)

## Troubleshooting

### If login still fails:

1. **Check Railway logs:**
   ```bash
   railway logs --service Fullstack-OnlineClass
   ```

2. **Verify environment variables:**
   ```bash
   railway variables
   ```

3. **Regenerate Prisma client:**
   ```bash
   cd backend
   npx prisma generate
   git add .
   git commit -m "Regenerate Prisma client"
   git push origin master
   ```

4. **Restart Railway service:**
   ```bash
   railway up --service Fullstack-OnlineClass
   ```

## Status
✅ **Fixed**: Prisma schema updated with `directUrl`  
✅ **Fixed**: Railway environment variables configured  
✅ **Fixed**: Connection pooling enabled with `pgbouncer=true`  
🔄 **Deploying**: Waiting for Railway auto-deployment to complete  

---

**Last Updated**: 2025-10-03  
**Railway Project**: efficient-vitality  
**Service**: Fullstack-OnlineClass  
**Backend URL**: https://fullstack-onlineclass-production.up.railway.app
