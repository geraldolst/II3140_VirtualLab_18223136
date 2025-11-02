const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { JWT_SECRET, JWT_EXPIRE, STATUS, ERRORS } = require('../config/constants');
const { validateRegister, validateLogin } = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/auth/register - Register new user
router.post('/register', validateRegister, async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(STATUS.CONFLICT).json({
                success: false,
                message: ERRORS.USER_EXISTS
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
                email,
                password_hash,
                username,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Registration error:', error);
            return res.status(STATUS.SERVER_ERROR).json({
                success: false,
                message: 'Failed to create user account'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE }
        );

        res.status(STATUS.CREATED).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// POST /api/auth/login - Login user
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERRORS.INVALID_CREDENTIALS
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERRORS.INVALID_CREDENTIALS
            });
        }

        // Update last login
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE }
        );

        res.status(STATUS.OK).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// POST /api/auth/verify-token - Verify JWT token
router.post('/verify-token', authMiddleware, (req, res) => {
    res.status(STATUS.OK).json({
        success: true,
        message: 'Token is valid',
        data: {
            user: req.user
        }
    });
});

// POST /api/auth/logout - Logout user (client-side token removal)
router.post('/logout', authMiddleware, (req, res) => {
    res.status(STATUS.OK).json({
        success: true,
        message: 'Logout successful'
    });
});

module.exports = router;
