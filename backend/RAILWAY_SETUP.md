# Railway Environment Variables Setup

Buka Railway Dashboard → Your Project → Variables tab, lalu tambahkan:

## Required Environment Variables

```bash
# Supabase Configuration (WAJIB!)
SUPABASE_URL=https://inlksxdnfiruqaiumofw.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlubGtzeGRuZmlydXFhaXVtb2Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDAyODQ1MiwiZXhwIjoyMDc1NjA0NDUyfQ.w6AM2uU0-wu77MCiaJcxuOA84LttMpXr6t3LIIeuRug

# JWT Configuration (WAJIB!)
JWT_SECRET=97c4b5bcf0b59095ae66764a0a1303e0
JWT_EXPIRE=7d

# Optional - Railway auto-set PORT
# NODE_ENV=production (optional, default to production)
```

## Cara Set di Railway:

1. Buka https://railway.app
2. Pilih project: `ii3140virtuallab18223136-production`
3. Klik tab **Variables**
4. Klik **+ New Variable**
5. Add satu per satu:
   - `SUPABASE_URL` → paste value
   - `SUPABASE_SERVICE_KEY` → paste value
   - `JWT_SECRET` → paste value
   - `JWT_EXPIRE` → `7d`
6. Klik **Deploy** atau tunggu auto-redeploy

## Verify Deployment:

Setelah deploy selesai, test:
```bash
curl https://ii3140virtuallab18223136-production.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "message": "Bobolingo Backend API is running",
  "timestamp": "2025-11-02T...",
  "version": "1.0.0"
}
```
