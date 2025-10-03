# ▲ Deploy Frontend ke Vercel - Step by Step

## ✅ Backend Ready!
Backend URL: `https://fullstack-onlineclass-production.up.railway.app`

---

## 🚀 Deploy Frontend Sekarang

### Step 1: Sign Up Vercel (2 menit)

1. **Buka:** https://vercel.com
2. **Click:** "Sign Up" atau "Login"
3. **Pilih:** "Continue with GitHub"
4. **Authorize Vercel** untuk akses GitHub

---

### Step 2: Import Project (3 menit)

1. **Di Vercel Dashboard**, click **"Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Vercel akan show list GitHub repos
   - Cari dan pilih: **`Fullstack-OnlineClass`**
   - Click **"Import"**

---

### Step 3: Configure Build Settings (5 menit)

**PENTING! Ikuti setting ini dengan teliti:**

#### A. Framework Preset
```
✅ Framework: Next.js (auto-detected)
```

#### B. Root Directory
```
⚠️ KLIK "EDIT" di Root Directory
Pilih: frontend
```

**Cara setting Root Directory:**
1. Di bawah "Configure Project"
2. Ada dropdown "Root Directory"
3. Click **"Edit"** (tombol di sebelah kanan)
4. Pilih folder **"frontend"** dari list
5. Click **"Continue"**

#### C. Build & Output Settings (Auto)
```
✅ Build Command: npm run build
✅ Output Directory: .next
✅ Install Command: npm install
```

#### D. Node.js Version (Optional)
```
Default: 20.x (sudah OK)
```

---

### Step 4: Environment Variables (PENTING! ⚠️)

**SEBELUM CLICK "DEPLOY"**, tambahkan environment variable:

1. **Expand section:** "Environment Variables"

2. **Add Variable:**
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://fullstack-onlineclass-production.up.railway.app/api`
   - **Environment:** All (Production, Preview, Development)

3. **Click "Add"**

**⚠️ PENTING:**
- Harus ada `/api` di akhir URL!
- Format: `https://your-backend.railway.app/api`

#### Screenshot Reference:
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ Key                                     │
│ NEXT_PUBLIC_API_URL                     │
│                                         │
│ Value                                   │
│ https://fullstack-onlineclass-produc...│
│                                         │
│ [Add Another]                           │
└─────────────────────────────────────────┘
```

---

### Step 5: Deploy! (4 menit)

1. **Verify Semua Setting:**
   - ✅ Root Directory: `frontend`
   - ✅ Framework: Next.js
   - ✅ Environment Variable: `NEXT_PUBLIC_API_URL` added

2. **Click "Deploy"**

3. **Vercel akan:**
   - Install dependencies
   - Build Next.js application
   - Deploy to global CDN
   - Generate production URL

4. **Tunggu Build Complete (3-5 menit)**
   - Status: Queued → Building → Deploying → Ready ✅

---

### Step 6: Get Frontend URL

Setelah deployment sukses:

1. **Vercel akan show URL:**
   ```
   https://fullstack-onlineclass.vercel.app
   ```
   atau
   ```
   https://fullstack-onlineclass-username.vercel.app
   ```

2. **Click URL untuk test!**

---

## 🧪 Test Frontend

### Test 1: Home Page
```
https://your-frontend.vercel.app/
```
Should show: Landing page dengan course list

### Test 2: Register
```
1. Click "Register" atau "/register"
2. Fill form
3. Submit
```
If success → redirects to courses page

### Test 3: Login
```
1. Click "Login" atau "/login"
2. Enter credentials
3. Submit
```
Should work and redirect to dashboard

### Test 4: API Connection
```
Open browser console (F12)
Check for API calls to:
https://fullstack-onlineclass-production.up.railway.app/api/...
```
Should see successful API responses (200 OK)

---

## ⚠️ Common Issues & Solutions

### Issue 1: Build Failed - Module Not Found
**Solution:**
- Verify `root directory = frontend`
- Check all dependencies in `frontend/package.json`
- Check for TypeScript errors

### Issue 2: API Calls Fail (CORS Error)
**Solution:**
- Verify `NEXT_PUBLIC_API_URL` ends with `/api`
- Check backend CORS allows Vercel domain
- We'll fix CORS in next step

### Issue 3: Environment Variable Not Working
**Solution:**
- Redeploy: Vercel Dashboard → Deployments → "..." → Redeploy
- Check spelling: `NEXT_PUBLIC_API_URL` (exact case)

---

## ✅ Success Checklist

After deployment:
- [ ] Build completed successfully
- [ ] Vercel URL generated
- [ ] Home page loads
- [ ] Can navigate to /register
- [ ] Can navigate to /login
- [ ] No build errors in Vercel logs

---

## 🔄 Next Steps

After frontend deployed:

### 1. Update Backend CORS
Add Vercel URL to Railway environment:
```env
FRONTEND_URL=https://your-frontend.vercel.app
```

### 2. Test Full Flow
- Register → Login → Browse → Enroll → Watch

### 3. Custom Domain (Optional)
- Buy domain
- Add to Vercel
- Update CORS

---

## 📋 Quick Reference

**Backend URL:**
```
https://fullstack-onlineclass-production.up.railway.app
```

**API Endpoint for Frontend:**
```
https://fullstack-onlineclass-production.up.railway.app/api
```

**Environment Variable:**
```
NEXT_PUBLIC_API_URL=https://fullstack-onlineclass-production.up.railway.app/api
```

---

## 🎯 Deploy Now!

**Go to:** https://vercel.com

**Follow Steps 1-6 above**

**After successful deploy, kasih tahu:**
> "Frontend URL: https://your-frontend.vercel.app"

Lalu saya akan bantu update CORS dan test production! 🚀

---

## 💡 Pro Tips

1. **Auto Deploy:** Every push to `master` = auto redeploy frontend
2. **Preview Deployments:** Every branch = unique preview URL
3. **Rollback:** Can rollback to previous deployment anytime
4. **Analytics:** Enable Vercel Analytics for free
5. **Logs:** Check "Logs" tab for runtime errors

---

**Ready? Let's deploy frontend! 💪**
