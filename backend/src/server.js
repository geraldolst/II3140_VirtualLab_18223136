const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check first (before routes that might fail)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Bobolingo Backend API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Routes - with error handling
try {
    app.use('/api/auth', require('./routes/auth.routes'));
    console.log('✅ Auth routes loaded');
} catch (error) {
    console.error('❌ Error loading auth routes:', error.message);
}

try {
    app.use('/api/users', require('./routes/user.routes'));
    console.log('✅ User routes loaded');
} catch (error) {
    console.error('❌ Error loading user routes:', error.message);
}

try {
    app.use('/api/games', require('./routes/game.routes'));
    console.log('✅ Game routes loaded');
} catch (error) {
    console.error('❌ Error loading game routes:', error.message);
}

try {
    app.use('/api/grammar', require('./routes/grammar.routes'));
    console.log('✅ Grammar routes loaded');
} catch (error) {
    console.error('❌ Error loading grammar routes:', error.message);
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message 
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Bobolingo Backend running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5500'}`);
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', error);
        process.exit(1);
    }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
