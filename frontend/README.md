# Bobolingo Frontend

Frontend aplikasi Bobolingo - Platform pembelajaran bahasa yang menyenangkan dengan gamifikasi.

## 🎨 Tech Stack

- **HTML5** - Markup
- **CSS3** - Styling (dengan animasi dan responsive design)
- **JavaScript (Vanilla)** - Interactivity
- **Supabase Client** - Authentication & Database

## 📁 Struktur Project

```
frontend/
├── assets/              # Images, icons, GIFs
│   ├── snoopy-removebg-preview.png
│   ├── Snoopy-excellence.gif
│   └── ...
├── styles/              # CSS files
│   ├── style.css        # Global styles
│   ├── dashboard.css    # Dashboard styles
│   ├── login.css        # Login page styles
│   └── ...
├── javascript/          # JavaScript files
│   ├── dashboard.js     # Dashboard logic
│   ├── login.js         # Login logic
│   └── ...
├── index.html           # Landing page
├── dashboard.html       # Main dashboard
├── login.html           # Login page
├── profile.html         # User profile
├── welcome.html         # Welcome/Signup page
└── vercel.json          # Vercel configuration
```

## 🚀 Features

### 🎮 Games
- **Scrambobo** - Word scramble game dengan 3 level kesulitan
- **Memoribo** - Memory card matching game

### 📚 Learning
- Grammar checker
- Lessons & courses
- Progress tracking

### 👤 User Features
- User authentication (Google OAuth via Supabase)
- Profile management
- Game statistics
- Leaderboard

## 🛠️ Setup & Development

### 1. Setup Backend API

Pastikan backend sudah running di `http://localhost:3000`

```bash
cd ../backend
npm install
npm run dev
```

### 2. Update API Configuration

Edit `javascript/config.js` (jika ada) atau langsung di file JS untuk set API URL:

```javascript
const API_URL = 'http://localhost:3000/api';
```

### 3. Run Frontend

#### Option 1: Live Server (VS Code)
1. Install extension "Live Server"
2. Right-click `index.html`
3. Click "Open with Live Server"

#### Option 2: Python HTTP Server
```bash
cd frontend
python -m http.server 5500
```

#### Option 3: Node.js HTTP Server
```bash
npx serve
```

Buka browser: `http://localhost:5500`

## 🎯 Main Pages

### Landing Page (`index.html`)
- Hero section dengan CTA
- Features overview
- About section

### Dashboard (`dashboard.html`)
- User profile header
- Game selection (Scrambobo & Memoribo)
- Statistics
- Grammar checker

### Login/Welcome
- Google OAuth integration
- Guest mode support

### Profile (`profile.html`)
- User information
- Game statistics
- Settings

## 🔌 API Integration

Frontend berkomunikasi dengan backend melalui REST API:

```javascript
// Example: Get user profile
async function getUserProfile() {
    const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}
```

## 🎨 Styling

### Color Scheme (Bobolingo Purple Theme)
```css
--primary-color: #667eea;      /* Purple */
--secondary-color: #764ba2;    /* Dark Purple */
--accent-color: #7FB3D5;       /* Light Blue */
--success-color: #10b981;      /* Green */
--danger-color: #dc2626;       /* Red */
```

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚢 Deployment

### Deploy to Vercel

#### Via CLI
```bash
cd frontend
npm i -g vercel
vercel --prod
```

#### Via GitHub
1. Push ke GitHub
2. Import repository di Vercel
3. Deploy!

### Environment Variables (Vercel)
Set di Vercel Dashboard → Settings → Environment Variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
API_URL=https://your-backend-api.com/api
```

## 📱 Features per Page

### Dashboard
- ✅ User authentication check
- ✅ Scrambobo game (3 difficulty levels)
- ✅ Memoribo game
- ✅ Grammar checker
- ✅ User statistics
- ✅ Progress tracking

### Games
- ✅ Drag & drop untuk Scrambobo
- ✅ Card flip animation untuk Memoribo
- ✅ Score tracking
- ✅ Level progression
- ✅ Hints system

### Profile
- ✅ User information display
- ✅ Avatar/Initial
- ✅ Game statistics
- ✅ Achievements (coming soon)

## 🔐 Authentication Flow

1. User klik "Login with Google"
2. Redirect ke Supabase Google OAuth
3. Callback ke welcome.html
4. Store session di localStorage
5. Redirect ke dashboard
6. Dashboard check session validity

## 📝 TODO

- [ ] Add PWA support
- [ ] Implement offline mode
- [ ] Add more games
- [ ] Leaderboard UI
- [ ] Achievements system
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Better mobile responsiveness

## 👥 Team

Bobolingo Development Team

## 📄 License

MIT
