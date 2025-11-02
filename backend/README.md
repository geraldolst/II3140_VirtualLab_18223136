# Bobolingo Backend API

Backend server untuk aplikasi Bobolingo - Platform pembelajaran bahasa yang menyenangkan.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Database & Authentication
- **JWT** - Token-based authentication

## 📁 Struktur Project

```
backend/
├── src/
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── game.routes.js
│   │   └── grammar.routes.js
│   ├── controllers/     # Business logic (coming soon)
│   ├── middleware/      # Custom middleware (coming soon)
│   ├── services/        # External services
│   │   └── supabase.service.js
│   ├── config/          # Configuration files
│   ├── utils/           # Helper functions
│   └── server.js        # Main server file
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── README.md           # This file
```

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` dan isi dengan credentials Anda:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5500
```

### 3. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 4. Test API

Buka browser atau Postman:
```
http://localhost:3000/health
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Games
- `POST /api/games/save-score` - Save game score
- `GET /api/games/leaderboard/:gameType` - Get leaderboard
- `GET /api/games/history` - Get user's game history

### Grammar
- `POST /api/grammar/check` - Check grammar

## 🔧 Development

### Run in Development Mode (with auto-reload)
```bash
npm run dev
```

### Run in Production Mode
```bash
npm start
```

## 📦 Dependencies

### Production
- `express` - Web framework
- `@supabase/supabase-js` - Supabase client
- `cors` - Enable CORS
- `dotenv` - Environment variables
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing

### Development
- `nodemon` - Auto-reload server

## 🚢 Deployment

### Deploy to Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Deploy:
```bash
railway up
```

### Deploy to Render

1. Push code ke GitHub
2. Connect repository di Render dashboard
3. Set environment variables
4. Deploy!

## 📝 TODO

- [ ] Implement authentication middleware
- [ ] Add input validation
- [ ] Add rate limiting
- [ ] Implement grammar checking API integration
- [ ] Add comprehensive error handling
- [ ] Add logging system
- [ ] Add unit tests
- [ ] Add API documentation (Swagger)

## 👥 Team

Bobolingo Development Team

## 📄 License

MIT
