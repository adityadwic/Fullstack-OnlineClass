# 🚀 Deployment Steps - Follow This Guide

## ✅ Step 1: Deploy Backend ke Railway

### 1.1 Sign Up Railway
1. Buka: https://railway.app
2. Click **"Start a New Project"** atau **"Login with GitHub"**
3. Authorize Railway untuk akses GitHub Anda
4. Setelah login, Anda akan masuk ke Dashboard

### 1.2 Create New Project
1. Click **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Cari dan pilih: **`Fullstack-OnlineClass`**
4. Railway akan auto-detect project Anda

### 1.3 Configure Backend Service
1. Railway akan mendeteksi bahwa ini monorepo
2. Click **"Add a service"** atau service akan auto-create
3. Jika ditanya, pilih **"Deploy from GitHub"**

### 1.4 Set Root Directory untuk Backend
**PENTING:** Railway perlu tahu lokasi backend folder

1. Click pada service yang baru dibuat
2. Go to **Settings** tab
3. Scroll ke **"Service Settings"**
4. Set **Root Directory**: `backend`
5. Set **Watch Paths**: `backend/**`

### 1.5 Configure Build & Start Commands
Masih di Settings:

**Build Command:**
```bash
npm install && npx prisma generate
```

**Start Command:**
```bash
npm start
```

**Install Command:** (leave as default)
```bash
npm install
```

### 1.6 Add Environment Variables
1. Click tab **"Variables"**
2. Click **"New Variable"** dan tambahkan satu per satu:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=your_supabase_database_url_here
JWT_SECRET=generate_new_random_32_char_string
JWT_EXPIRES_IN=7d
```

**⚠️ PENTING - Cara Dapat DATABASE_URL:**
1. Buka: https://app.supabase.com
2. Pilih project Anda
3. Click **Settings** (⚙️) → **Database**
4. Scroll ke **"Connection String"**
5. Copy yang format **"URI"** atau **"Connection Pooling"**
6. Ganti `[YOUR-PASSWORD]` dengan password database Anda
7. Paste ke Railway

**Format harus seperti:**
```
postgresql://postgres.xxxxx:PASSWORD@aws-0-xxxxx.pooler.supabase.com:6543/postgres
```

**⚠️ Generate JWT_SECRET Baru:**
Jangan pakai JWT_SECRET dari development! Generate baru:

**Option A: Via Terminal di Mac Anda**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Via Online Generator**
- Buka: https://generate-secret.vercel.app/32
- Copy hasil generate

### 1.7 Deploy Backend!
1. Click **"Deploy"** atau Railway akan auto-deploy
2. Tunggu proses build (biasanya 2-5 menit)
3. Monitor di tab **"Deployments"**
4. Status akan berubah: Building → Deploying → Active ✅

### 1.8 Get Backend URL
Setelah deploy sukses:
1. Go to **Settings** tab
2. Scroll ke **"Networking"** atau **"Domains"**
3. Click **"Generate Domain"**
4. Railway akan buat URL seperti: `https://fullstack-onlineclass-production.up.railway.app`
5. **SIMPAN URL INI!** Nanti dipakai untuk frontend

### 1.9 Test Backend API
Test di browser atau Postman:
```
https://your-backend.railway.app/health
```

Jika berhasil, akan tampil response JSON.

---

## ✅ Step 2: Run Prisma Migrations di Railway

### 2.1 Install Railway CLI (di Mac Anda)
```bash
npm install -g @railway/cli
```

### 2.2 Login ke Railway
```bash
railway login
```
Browser akan terbuka untuk authorize.

### 2.3 Link Project
```bash
cd /Users/adityadwicahyono/Desktop/Fullstack/academic-class/backend
railway link
```
Pilih project **"Fullstack-OnlineClass"** dari list.

### 2.4 Run Migrations
```bash
railway run npx prisma migrate deploy
```

Ini akan setup semua tables di Supabase PostgreSQL.

### 2.5 (Optional) Seed Database
Jika ingin populate data test:
```bash
railway run node seed.js
```

---

## ▲ Step 3: Deploy Frontend ke Vercel

### 3.1 Sign Up Vercel
1. Buka: https://vercel.com
2. Click **"Sign Up"**
3. Pilih **"Continue with GitHub"**
4. Authorize Vercel

### 3.2 Import Project
1. Di Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Pilih **"Import Git Repository"**
3. Cari dan pilih: **`Fullstack-OnlineClass`**
4. Click **"Import"**

### 3.3 Configure Project Settings
**PENTING:** Vercel perlu tahu lokasi frontend folder

**Framework Preset:** Next.js (auto-detected ✅)

**Root Directory:**
- Click **"Edit"** di samping root directory
- Pilih: `frontend`
- Save

**Build Settings:**
```
Build Command: npm run build
Output Directory: .next (auto)
Install Command: npm install
```

### 3.4 Add Environment Variables
**SEBELUM DEPLOY**, tambahkan environment variable:

1. Expand **"Environment Variables"** section
2. Add variable:

**Name:**
```
NEXT_PUBLIC_API_URL
```

**Value:** (ganti dengan Railway URL Anda)
```
https://your-backend.railway.app/api
```

**⚠️ PENTING:** Harus ada `/api` di akhir!

3. Click **"Add"**

### 3.5 Deploy Frontend!
1. Click **"Deploy"**
2. Vercel akan:
   - Install dependencies
   - Build Next.js
   - Deploy to CDN
3. Tunggu 2-4 menit
4. Status: Building → Deploying → Ready ✅

### 3.6 Get Frontend URL
Setelah deploy sukses:
- Vercel akan show URL: `https://fullstack-onlineclass.vercel.app`
- Click untuk test!

---

## 🔧 Step 4: Update Backend CORS

Sekarang backend perlu allow request dari Vercel URL.

### 4.1 Update Railway Environment Variables
1. Kembali ke Railway Dashboard
2. Pilih backend service
3. Go to **Variables** tab
4. Add new variable:

```env
FRONTEND_URL=https://fullstack-onlineclass.vercel.app
```

(Ganti dengan Vercel URL Anda yang sebenarnya)

### 4.2 Update Backend Code
Buka file `backend/server.js` dan pastikan CORS configuration sudah benar:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4001',
  process.env.FRONTEND_URL, // Vercel production URL
  /\.vercel\.app$/, // All Vercel preview deployments
];
```

### 4.3 Commit & Push
```bash
cd /Users/adityadwicahyono/Desktop/Fullstack/academic-class
git add backend/server.js
git commit -m "Update CORS for Vercel production"
git push origin master
```

Railway akan auto re-deploy! 🚀

---

## 🧪 Step 5: Test Production

### 5.1 Test Backend API
```bash
curl https://your-backend.railway.app/api/courses
```

### 5.2 Test Frontend
1. Buka: `https://your-frontend.vercel.app`
2. Test flow:
   - Register user baru
   - Login
   - Browse courses
   - Enroll course
   - Play video
   - Mark as complete

### 5.3 Test End-to-End
- Register → Login → Enroll → Watch → Complete ✅

---

## 🎉 Deployment Complete Checklist

- [ ] Backend deployed to Railway
- [ ] Database migrations run
- [ ] Backend URL generated
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set
- [ ] CORS updated
- [ ] Full flow tested
- [ ] Production URLs saved

---

## 🆘 Troubleshooting

### Problem: Railway Build Failed
**Solution:**
1. Check Railway logs (Deployments tab)
2. Ensure `backend/package.json` has correct scripts
3. Verify `DATABASE_URL` format is correct
4. Check Node.js version compatibility

### Problem: Prisma Migration Failed
**Solution:**
```bash
railway run npx prisma db push
```

### Problem: Frontend Can't Connect to Backend
**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` in Vercel
2. Check backend CORS allows Vercel URL
3. Test backend URL directly in browser
4. Check Railway logs for errors

### Problem: CORS Error
**Solution:**
1. Add Vercel URL to `FRONTEND_URL` in Railway
2. Ensure CORS regex includes `\.vercel\.app$`
3. Redeploy backend

---

## 📞 Quick Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **GitHub Repo:** https://github.com/adityadwic/Fullstack-OnlineClass

---

## 🔄 Auto Deploy Setup

✅ **Already Configured!**

Setiap kali Anda push ke GitHub:
- Railway auto re-deploy backend
- Vercel auto re-deploy frontend

```bash
git add .
git commit -m "Your changes"
git push origin master
```

Both will auto deploy in 2-3 minutes! 🚀

---

**Next:** Follow Step 1 untuk deploy backend ke Railway! 💪
