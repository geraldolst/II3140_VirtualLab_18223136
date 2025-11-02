# 🎓 Bobolingo - Language Learning Platform

Platform pembelajaran bahasa yang menyenangkan dengan gamifikasi dan fitur interaktif.

**Virtual Lab Project for ITB First Year Students**  
*Interactive platform to support English courses with engaging features and games*

![Snoopy Logo](frontend/assets/Snoopy-face-preview.png)

## 🌟 **Live Demo**
**🚀 Website:** [https://bobolingolab.vercel.app/](https://bobolingolab.vercel.app/)

---

## 📁 **Project Structure**

```
II3140_VirtualLab_18223136/
├── 📁 frontend/              # Frontend application
│   ├── assets/               # Images, icons, GIFs
│   ├── styles/               # CSS files
│   ├── javascript/           # Frontend JS
│   ├── *.html                # HTML pages
│   ├── vercel.json           # Vercel config
│   └── README.md             # Frontend documentation
│
├── 📁 backend/               # Backend API server
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Custom middleware
│   │   ├── services/         # External services
│   │   ├── config/           # Configuration
│   │   └── server.js         # Main server
│   ├── package.json          # Backend dependencies
│   ├── .env.example          # Environment template
│   └── README.md             # Backend documentation
│
├── 📁 docs/                  # Documentation
└── README.md                 # This file
```

---

##  **Key Features**

### 1. 🎮 **Interactive Games**
- **Scrambobo**: Word scrambling puzzle with 3 difficulty levels
- **Memoribo**: Memory card matching game untuk vocabulary building

### 2. 📚 **Learning Features**
- YouTube-based video courses
- English fundamentals course
- Grammar checker (AI-powered - coming soon)

### 3. � **User Management**
- Google OAuth authentication via Supabase
- User profile with statistics
- Progress tracking
- Game history & leaderboard

### 4. 🎨 **Modern UI/UX**
- Responsive design (mobile-friendly)
- Smooth animations
- Duolingo-inspired purple theme
- Clean & intuitive interface

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 16+ (for backend)
- Git
- Supabase account (for authentication & database)

### **Installation**

#### 1. Clone Repository
```bash
git clone https://github.com/geraldolst/II3140_VirtualLab_18223136.git
cd II3140_VirtualLab_18223136
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan credentials Supabase Anda
npm run dev
```
Backend akan berjalan di `http://localhost:3000`

#### 3. Setup Frontend
```bash
cd frontend
# Open with Live Server di VS Code
# atau
python -m http.server 5500
# atau
npx serve
```
Frontend akan berjalan di `http://localhost:5500`

---

## 🔧 **Tech Stack**

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Supabase Client (Authentication)
- Responsive Design

### Backend
- Node.js + Express.js
- Supabase (Database & Auth)
- JWT for session management
- RESTful API architecture

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway / Render
- **Database**: Supabase

---

## 📡 **API Endpoints**

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user statistics

### Games
- `POST /api/games/save-score` - Save game score
- `GET /api/games/leaderboard/:type` - Get leaderboard
- `GET /api/games/history` - Get game history

### Grammar
- `POST /api/grammar/check` - Check grammar

---

## 🎯 **Features Status**

### ✅ Implemented
- [x] Landing page dengan hero section
- [x] Dashboard dengan game selection
- [x] Scrambobo game (3 levels)
- [x] Memoribo game
- [x] User profile display
- [x] Backend API structure
- [x] Supabase integration
- [x] Responsive design

### 🚧 In Progress
- [ ] Full authentication implementation
- [ ] Grammar checker API integration
- [ ] Leaderboard UI
- [ ] Achievements system

### 📋 Planned
- [ ] More games (Quizbo, Listenbo)
- [ ] Social features (friends, challenges)
- [ ] Mobile app (PWA)
- [ ] Multi-language support
- [ ] Dark mode

---

## 🏗️ **Technical Architecture**

### **Frontend Technologies:**
- **HTML5**
- **CSS3** 
- **JavaScript ES6+**
- **Font Awesome**
- **Google Fonts**

### **Deployment:**
- **Platform**: Vercel (serverless deployment)


---

## 📱 **How to Use**

### **Getting Started:**
1. **Visit Website**: Go to [Live Demo Link](https://bobolingolab.vercel.app/)
2. **Guest Access**: Start using immediately without registration
3. **Explore Dashboard**: Navigate through different sections via sidebar
4. **Optional Login**: Click login for future authentication features


---

## 🎮 **Game Instructions**

### **Memorybo (Memory Game):**
1. Click on cards to flip them
2. Match English words with their meanings  
3. Complete all pairs to win
4. Track your attempts and improve your score

### **Scrambobo (Word Scramble):**
1. Drag and drop letter tiles to form words
2. Use hints if you get stuck
3. Choose difficulty level (Easy/Medium/Hard)
4. Build vocabulary through word recognition

---