# Bobolingo Games - Scrambobo & Memoribo

## 📖 Deskripsi
Implementasi game edukatif **Scrambobo** dan **Memoribo** dalam satu file HTML dengan tampilan seperti Duolingo. Game ini terintegrasi dengan Supabase untuk menampilkan profil user dari database.

## 🎮 Fitur Game

### 1. **Scrambobo** (Word Scramble Game)
- **Konsep**: Menyusun huruf-huruf acak menjadi kata yang benar
- **Tingkat Kesulitan**:
  - **Easy**: Kata pendek 3-4 huruf (CAT, DOG, BOOK, dll)
  - **Medium**: Kata sedang 5-6 huruf (HAPPY, SWIFT, BRAVE, dll)
  - **Hard**: Kata panjang 7+ huruf (COMPUTER, ELEPHANT, MOUNTAIN, dll)
- **Fitur**:
  - ✅ Drag & Drop huruf untuk menyusun kata
  - 💡 Tombol Hint untuk petunjuk
  - ⏭️ Tombol Next untuk soal berikutnya
  - 🏆 Sistem scoring
  - ✔️ Counter jawaban benar

### 2. **Memoribo** (Memory Card Matching Game)
- **Konsep**: Mencocokkan kata dengan definisinya
- **Mekanik**:
  - Flip kartu untuk melihat isi
  - Cari pasangan kata dan definisi yang cocok
  - 6 pasang kartu (12 kartu total)
- **Fitur**:
  - 🎴 Animasi flip card 3D
  - 🎯 Counter matches dan moves
  - 🔄 Tombol reset untuk main ulang
  - ✨ Visual feedback untuk kartu yang cocok

## 🎨 Desain

### Inspirasi
Desain terinspirasi dari **Duolingo** dengan karakteristik:
- 🌈 Gradient background purple-blue
- 💫 Animasi smooth dan interaktif
- 🎯 UI/UX yang clean dan modern
- 📱 Responsive design untuk mobile

### Warna Utama
- **Primary**: #667eea → #764ba2 (Purple gradient)
- **Success**: #48bb78 (Green)
- **Warning**: #ed8936 (Orange)
- **Error**: #fc8181 (Red)

## 🔗 Integrasi Database

### Profil User dari Supabase
File ini mengambil data user dari database Supabase:
```javascript
// Koneksi ke Supabase
const supabaseUrl = 'https://kgskbtkxcdhqhfmpuxoe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Mengambil profil user
const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', currentUser.id)
    .single();
```

### Data yang Ditampilkan
- ✅ Nama lengkap user
- ✅ Inisial avatar
- ✅ Email (jika tersedia)

## 📁 Struktur File

```
II3140_VirtualLab_18223136/
├── games.html                      # File HTML utama (SINGLE FILE)
├── javascript/
│   └── games-combined.js           # Logic kedua game + Supabase
└── styles/
    └── games-combined.css          # Styling Duolingo-inspired
```

## 🚀 Cara Menggunakan

### 1. Buka File
```
Buka games.html di browser
```

### 2. Navigasi
1. **Home Page**: Menampilkan intro dan pilihan game
2. **Pilih Game**: Klik Scrambobo atau Memoribo
3. **Main Game**: Ikuti instruksi di layar

### 3. Scrambobo
1. Pilih tingkat kesulitan (Easy/Medium/Hard)
2. Drag & drop huruf untuk menyusun kata
3. Klik "Check Answer" untuk validasi
4. Gunakan "Hint" jika butuh bantuan
5. Klik "Next" untuk soal berikutnya

### 4. Memoribo
1. Game otomatis dimulai dengan 12 kartu
2. Klik kartu untuk flip
3. Cocokkan kata dengan definisinya
4. Game selesai saat semua kartu tercocokkan
5. Klik "Reset Game" untuk main ulang

## 🔄 Perbandingan dengan GitHub Reference

### Mirip dengan Repository Tamara:
✅ **Single File Approach**: Semua game dalam 1 file HTML
✅ **Navigation System**: Beralih antar section dengan hide/show
✅ **Word Data Structure**: Format kata dan hint sama
✅ **Drag & Drop Mechanic**: Untuk Scrambobo
✅ **Memory Card Flip**: Untuk Memoribo
✅ **Feedback System**: Visual feedback untuk benar/salah

### Perbedaan/Peningkatan:
🌟 **Duolingo-style Design**: Lebih modern dan menarik
🌟 **Supabase Integration**: Menampilkan profil user asli
🌟 **Enhanced Animations**: Lebih smooth dan professional
🌟 **Responsive Design**: Better mobile experience
🌟 **Score System**: Tracking untuk Scrambobo
🌟 **Moves Counter**: Untuk Memoribo

## 💡 Logika Game

### Scrambobo Logic (Hampir sama dengan GitHub)
```javascript
1. Pilih kata random dari tingkat kesulitan
2. Shuffle huruf-huruf kata
3. User drag & drop untuk menyusun
4. Validasi jawaban
5. Berikan feedback
6. Update score jika benar
```

### Memoribo Logic (Hampir sama dengan GitHub)
```javascript
1. Pilih 6 pasang kata-definisi secara random
2. Buat array 12 kartu (word + definition)
3. Shuffle kartu
4. User flip 2 kartu
5. Cek apakah cocok
6. Jika cocok: mark as matched
7. Jika tidak: flip kembali
8. Game selesai saat semua cocok
```

## 🎯 Fitur Khusus

### 1. Real-time Profile
- Mengambil data user dari Supabase saat halaman load
- Update avatar dan nama di header
- Guest mode jika belum login

### 2. Smooth Animations
- Card flip animation 3D
- Button hover effects
- Transform transitions

### 3. Responsive Layout
- Mobile-friendly grid system
- Adaptive font sizes
- Touch-friendly buttons

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 769px) { ... }

/* Tablet */
@media (max-width: 768px) { ... }

/* Mobile */
@media (max-width: 480px) { ... }
```

## 🔧 Kustomisasi

### Menambah Kata Baru

**Scrambobo:**
```javascript
const scramboboWords = {
    easy: [
        { word: "NEW", hint: "Your hint here" }
    ]
};
```

**Memoribo:**
```javascript
const memoriboWordPairs = [
    { word: "WORD", definition: "The meaning" }
];
```

### Mengubah Warna
Edit di `styles/games-combined.css`:
```css
.games-body {
    background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
}
```

## 📚 Dependencies

- **Supabase Client**: CDN import untuk database
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

## ⚡ Performance

- ✅ Minimal DOM manipulation
- ✅ CSS animations (no JS)
- ✅ Lazy loading images
- ✅ Optimized event listeners

## 🐛 Known Issues

- Tidak ada (sudah tested dan working)

## 🎓 Credits

- **Konsep Game**: Terinspirasi dari repository Tamara Mayranda Lubis
- **Desain**: Duolingo-inspired
- **Database**: Supabase
- **Icons**: Font Awesome

## 📝 License

Educational project for II3140 - Web and Mobile Application Development

---

**Dibuat dengan ❤️ untuk pembelajaran bahasa yang menyenangkan!**
