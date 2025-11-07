// Load environment variables FIRST
require('dotenv').config();

module.exports = {
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRE: '7d',

    // Game Types
    GAME_TYPES: {
        SCRAMBOBO: 'scrambobo',
        MEMORIBO: 'memoribo'
    },

    // Difficulty Levels
    DIFFICULTY: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard'
    },

    // HTTP Status Codes
    STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        SERVER_ERROR: 500
    },

    // Error Messages
    ERRORS: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        USER_EXISTS: 'User already exists with this email',
        UNAUTHORIZED: 'Unauthorized access',
        INVALID_TOKEN: 'Invalid or expired token',
        USER_NOT_FOUND: 'User not found',
        MISSING_FIELDS: 'Missing required fields',
        INVALID_GAME_TYPE: 'Invalid game type',
        INVALID_SCORE: 'Invalid score data'
    }
};
