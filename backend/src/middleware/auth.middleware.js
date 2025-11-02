const jwt = require('jsonwebtoken');
const { JWT_SECRET, STATUS, ERRORS } = require('../config/constants');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERRORS.UNAUTHORIZED
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Attach user info to request
            req.user = {
                id: decoded.userId,
                email: decoded.email
            };
            
            next();
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError.message);
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERRORS.INVALID_TOKEN
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

module.exports = authMiddleware;
