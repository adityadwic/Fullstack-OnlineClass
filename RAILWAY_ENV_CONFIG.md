# 🚂 Railway Environment Variables Configuration

Copy dan paste environment variables ini ke Railway Dashboard:

---

## Backend Service - Environment Variables

### 1. NODE_ENV
```
production
```

### 2. PORT
```
4000
```

### 3. DATABASE_URL (Supabase PostgreSQL)
```
postgresql://postgres:Admin_123@db.fzvvufqaiywfwfkwllpv.supabase.co:5432/postgres
```

### 4. JWT_SECRET (Generated - PRODUCTION ONLY)
```
eacdd885090b6d55dc4f41232a8c0b507f4056e5a9e0749b5c4d31abe26c465d
```

### 5. JWT_EXPIRES_IN
```
7d
```

---

## ⚠️ PENTING - Cloudinary (Optional)

Jika Anda menggunakan upload image/file dan sudah punya akun Cloudinary:

### 6. CLOUDINARY_CLOUD_NAME
```
your-cloudinary-cloud-name
```

### 7. CLOUDINARY_API_KEY
```
your-cloudinary-api-key
```

### 8. CLOUDINARY_API_SECRET
```
your-cloudinary-api-secret
```

**Jika TIDAK pakai Cloudinary:** Skip variables di atas (6-8).

---

## 🎯 Cara Input ke Railway

### Method 1: Via Dashboard (Recommended)

1. Buka Railway Dashboard
2. Pilih service backend Anda
3. Click tab **"Variables"**
4. Click **"New Variable"** untuk setiap variable
5. Copy-paste Name dan Value
6. Click **"Add"** untuk setiap variable

### Method 2: Via Raw Editor

1. Click **"RAW Editor"** di tab Variables
2. Paste semua sekaligus:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://postgres:Admin_123@db.fzvvufqaiywfwfkwllpv.supabase.co:5432/postgres
JWT_SECRET=eacdd885090b6d55dc4f41232a8c0b507f4056e5a9e0749b5c4d31abe26c465d
JWT_EXPIRES_IN=7d
```

3. Click **"Update Variables"**

---

## ✅ Verification Checklist

Setelah input environment variables:

- [ ] NODE_ENV = production
- [ ] PORT = 4000
- [ ] DATABASE_URL = postgresql://postgres:Admin_123@... (full URL)
- [ ] JWT_SECRET = eacdd885090b6d55... (64 characters)
- [ ] JWT_EXPIRES_IN = 7d

---

## 🚀 Next Steps After Adding Variables

1. Railway akan **auto-restart** service
2. Tunggu deployment selesai (2-3 menit)
3. Check status: Building → Active ✅
4. Generate domain untuk backend
5. Test backend URL

---

## 🧪 Test Backend After Deploy

```bash
# Test health endpoint
curl https://your-backend.up.railway.app/health

# Expected response:
{"status":"ok","message":"Server is running"}
```

---

## 🔒 Security Notes

✅ **JWT_SECRET sudah di-generate secara random**
✅ **DATABASE_URL menggunakan Supabase (secure by default)**
⚠️ **JANGAN share file ini ke public!**
⚠️ **JANGAN commit JWT_SECRET ke GitHub!**

---

Lanjut ke deployment! 🚂
