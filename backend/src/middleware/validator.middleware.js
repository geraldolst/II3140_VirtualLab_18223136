const { STATUS, ERRORS, GAME_TYPES, DIFFICULTY } = require('../config/constants');

// Validate registration input
const validateRegister = (req, res, next) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: ERRORS.MISSING_FIELDS,
            required: ['email', 'password', 'username']
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    next();
};

// Validate login input
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: ERRORS.MISSING_FIELDS,
            required: ['email', 'password']
        });
    }

    next();
};

// Validate game score submission
const validateGameScore = (req, res, next) => {
    const { game_type, score, difficulty } = req.body;

    if (!game_type || score === undefined || !difficulty) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: ERRORS.MISSING_FIELDS,
            required: ['game_type', 'score', 'difficulty']
        });
    }

    // Validate game type
    const validGameTypes = Object.values(GAME_TYPES);
    if (!validGameTypes.includes(game_type)) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: ERRORS.INVALID_GAME_TYPE,
            validTypes: validGameTypes
        });
    }

    // Validate difficulty
    const validDifficulties = Object.values(DIFFICULTY);
    if (!validDifficulties.includes(difficulty)) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Invalid difficulty level',
            validLevels: validDifficulties
        });
    }

    // Validate score is a number
    if (typeof score !== 'number' || score < 0) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: ERRORS.INVALID_SCORE
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateGameScore
};
