# 🚀 Panduan Setup Autentikasi Google dengan Supabase

## 📋 Daftar Isi
1. [Setup Supabase Project](#1-setup-supabase-project)
2. [Konfigurasi Google OAuth](#2-konfigurasi-google-oauth)
3. [Testing Aplikasi](#3-testing-aplikasi)
4. [Troubleshooting](#4-troubleshooting)

---

## 1. Setup Supabase Project

### 1.1 Buat Project Supabase
1. Kunjungi [https://supabase.com/](https://supabase.com/)
2. Login atau buat akun baru
3. Klik **"New Project"**
4. Isi detail project:
   - **Organization**: Pilih atau buat baru
   - **Name**: `bobolingo-virtuallab`
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih yang terdekat (misalnya: Southeast Asia)
5. Klik **"Create new project"**
6. Tunggu beberapa menit hingga project selesai dibuat

### 1.2 Dapatkan API Keys
1. Di dashboard Supabase, buka **Settings** > **API**
2. Copy nilai berikut:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### 1.3 Update Environment Variables
File `.env.local` sudah dikonfigurasi dengan benar:
```bash
NEXT_PUBLIC_SUPABASE_URL='https://inlksxdnfiruqaiumofw.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

---

## 2. Konfigurasi Google OAuth

### 2.1 Setup Google Console
1. Kunjungi [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Enable **Google+ API** dan **OAuth 2.0**

### 2.2 Buat OAuth 2.0 Client
1. Buka **APIs & Services** > **Credentials**
2. Klik **"Create Credentials"** > **OAuth 2.0 Client IDs**
3. Pilih **Application type**: Web application
4. Isi **Name**: `Bobolingo VirtualLab`
5. **Authorized redirect URIs**, tambahkan:
   ```
   https://inlksxdnfiruqaiumofw.supabase.co/auth/v1/callback
   http://localhost:3000/auth-callback.html
   http://127.0.0.1:5500/auth-callback.html
   ```
6. Klik **"Create"**
7. Copy **Client ID** dan **Client Secret**

### 2.3 Konfigurasi di Supabase
1. Di dashboard Supabase, buka **Authentication** > **Providers**
2. Cari **Google** dan enable
3. Isi:
   - **Client ID**: Dari Google Console
   - **Client Secret**: Dari Google Console
4. Klik **"Save"**

---

## 3. Testing Aplikasi

### 3.1 Testing Local
1. Buka terminal dan jalankan:
   ```bash
   npm run dev
   ```
   atau
   ```bash
   npx serve .
   ```

2. Buka browser ke `http://localhost:3000` atau sesuai port yang ditampilkan

### 3.2 Test Flow Autentikasi
1. **Test Registration:**
   - Klik **"Register"** di homepage
   - Isi form registrasi lengkap
   - Atau klik **"Sign up with Google"**

2. **Test Login:**
   - Klik **"Login"** di homepage
   - Isi email/password yang sudah didaftarkan
   - Atau klik **"Sign in with Google"**

3. **Expected Flow:**
   ```
   Login/Register → Google OAuth → auth-callback.html → dashboard.html
   ```

### 3.3 Verifikasi Data
1. Cek **localStorage** di browser DevTools:
   ```javascript
   localStorage.getItem('bobolingoUser')
   ```

2. Cek **Supabase Dashboard** > **Authentication** > **Users**

---

## 4. Troubleshooting

### 4.1 Error "Invalid redirect URL"
**Solusi:**
- Pastikan redirect URL di Google Console exact match
- Tambahkan semua URL yang mungkin digunakan (localhost, 127.0.0.1, domain production)

### 4.2 Error "Provider not enabled"
**Solusi:**
- Pastikan Google provider sudah enabled di Supabase
- Periksa Client ID dan Secret sudah benar

### 4.3 Redirect tidak berfungsi
**Solusi:**
- Periksa file `auth-callback.html` bisa diakses
- Pastikan JavaScript dapat mengakses Supabase
- Cek console browser untuk error messages

### 4.4 CORS Error
**Solusi:**
- Pastikan menggunakan `https://cdn.skypack.dev/@supabase/supabase-js` untuk CDN
- Atau serve dari local server (bukan file://)

---

## 🔧 File Konfigurasi Penting

### JavaScript Files:
- `javascript/login.js` - Login dengan email/password dan Google
- `javascript/welcome.js` - Registrasi dengan email/password dan Google  
- `javascript/auth-callback.js` - Handler untuk OAuth callback

### HTML Files:
- `login.html` - Halaman login
- `welcome.html` - Halaman registrasi
- `auth-callback.html` - Callback handler page

### Config Files:
- `.env.local` - Environment variables
- `configs/environment.js` - Config helper

---

## 🎯 Status Implementasi

### ✅ Completed:
- [x] Supabase client setup
- [x] Google OAuth integration
- [x] Login form with validation
- [x] Registration form with validation
- [x] Auth callback handler
- [x] Error handling
- [x] Loading states
- [x] LocalStorage compatibility

### 📝 Next Steps:
1. Setup Google Console credentials
2. Test OAuth flow
3. Deploy to production (optional)

---

## 🆘 Support

Jika mengalami masalah:
1. Cek console browser untuk error messages
2. Verify semua credentials sudah benar
3. Pastikan semua file ada dan accessible
4. Test dengan incognito/private browsing

**Good luck! 🚀**