# 🔧 Fix: Database Connection Error

## ❌ Error yang Terjadi:
```
Can't reach database server at `db.fzvvufqaiywfwfkwllpv.supabase.co:5432`
```

## 🎯 Solusi: Gunakan Connection Pooling URL

Supabase memiliki 2 jenis connection string:

### ❌ Direct Connection (Port 5432) - TIDAK WORK untuk Railway
```
postgresql://postgres:Admin_123@db.fzvvufqaiywfwfkwllpv.supabase.co:5432/postgres
```
**Problem:** Railway dan hosting platforms perlu connection pooling!

### ✅ Connection Pooling (Port 6543) - GUNAKAN INI!
```
postgresql://postgres.fzvvufqaiywfwfkwllpv:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 🚀 Cara Dapat URL yang Benar

### Step 1: Buka Supabase Dashboard
1. Go to: https://app.supabase.com
2. Select your project
3. Click **Settings** (⚙️) di sidebar kiri
4. Click **Database**

### Step 2: Scroll ke "Connection String"
Ada 2 tab:
- **Connection String** (Tab 1) - Direct connection ❌
- **Connection Pooling** (Tab 2) - **PILIH INI!** ✅

### Step 3: Copy "Transaction Mode"
Di tab **Connection Pooling**, ada 3 mode:
- Session Mode
- **Transaction Mode** ← **COPY YANG INI!**
- Statement Mode

### Step 4: Ganti [YOUR-PASSWORD]
URL format:
```
postgresql://postgres.fzvvufqaiywfwfkwllpv:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Ganti `[YOUR-PASSWORD]` dengan: **Admin_123**

Final URL:
```
postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 📝 Update Railway Environment Variable

### Method 1: Via Railway Dashboard
1. Go to Railway Dashboard
2. Select your backend service
3. Click **"Variables"** tab
4. Find **DATABASE_URL**
5. Click **Edit** (pencil icon)
6. Replace dengan Connection Pooling URL
7. Click **Save**

### Method 2: Delete & Re-add
1. Click trash icon di DATABASE_URL
2. Click **"New Variable"**
3. Name: `DATABASE_URL`
4. Value: (paste Connection Pooling URL)
5. Click **Add**

Railway akan auto-restart service!

---

## ⚠️ Ciri-Ciri URL yang Benar:

### ❌ SALAH (Direct Connection):
```
Port: 5432
Host: db.fzvvufqaiywfwfkwllpv.supabase.co
```

### ✅ BENAR (Connection Pooling):
```
Port: 6543 ← PENTING!
Host: aws-0-xxxxx.pooler.supabase.com ← Ada "pooler"!
Query: ?pgbouncer=true ← Harus ada!
```

---

## 🔍 Alternative: Cek Password Benar

Jika sudah pakai pooling URL tapi masih error:

### Verify Password
1. Supabase Dashboard → Settings → Database
2. Scroll ke **"Database Password"**
3. Jika lupa password, click **"Reset Database Password"**
4. Copy password baru
5. Update di Railway DATABASE_URL

---

## 🧪 Test Koneksi Lokal (Optional)

Test di Mac Anda dulu sebelum update Railway:

```bash
cd /Users/adityadwicahyono/Desktop/Fullstack/academic-class/backend

# Buat file .env temporary untuk test
echo 'DATABASE_URL="postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"' > .env.test

# Test connection
DATABASE_URL="postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true" npx prisma db pull
```

Jika success, URL benar! Update ke Railway.

---

## ✅ After Fix Checklist

- [ ] Get Connection Pooling URL dari Supabase
- [ ] Verify format: port 6543, ada "pooler" di hostname
- [ ] Ganti [YOUR-PASSWORD] dengan Admin_123
- [ ] Update DATABASE_URL di Railway
- [ ] Wait for auto-restart (1-2 menit)
- [ ] Check Railway logs - error hilang
- [ ] Test backend URL

---

## 📞 Quick Fix Command

**URL yang Harus Anda Dapatkan dari Supabase:**

Format akan seperti ini (region mungkin beda):
```
postgresql://postgres.fzvvufqaiywfwfkwllpv:Admin_123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Cek:**
- ✅ Port: **6543** (bukan 5432)
- ✅ Host: ada kata **"pooler"**
- ✅ Query string: **?pgbouncer=true**

---

Setelah dapat URL yang benar, update di Railway dan Railway akan auto-restart! 🚀
