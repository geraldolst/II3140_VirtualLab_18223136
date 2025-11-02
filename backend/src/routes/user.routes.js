const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth.middleware');
const { STATUS, ERRORS } = require('../config/constants');

// GET /api/users/profile - Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, username, created_at, last_login')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(STATUS.NOT_FOUND).json({
                success: false,
                message: ERRORS.USER_NOT_FOUND
            });
        }

        res.status(STATUS.OK).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve profile'
        });
    }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username } = req.body;

        if (!username) {
            return res.status(STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Username is required'
            });
        }

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update({ username })
            .eq('id', userId)
            .select('id, email, username, created_at, last_login')
            .single();

        if (error) {
            console.error('Update profile error:', error);
            return res.status(STATUS.SERVER_ERROR).json({
                success: false,
                message: 'Failed to update profile'
            });
        }

        res.status(STATUS.OK).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: updatedUser }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// GET /api/users/stats - Get user statistics
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get game scores
        const { data: scores, error } = await supabase
            .from('game_scores')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Get stats error:', error);
            return res.status(STATUS.SERVER_ERROR).json({
                success: false,
                message: 'Failed to retrieve statistics'
            });
        }

        const stats = {
            totalGames: scores.length,
            scramboboGames: scores.filter(s => s.game_type === 'scrambobo').length,
            memoriboGames: scores.filter(s => s.game_type === 'memoribo').length,
            totalScore: scores.reduce((sum, s) => sum + (s.score || 0), 0),
            averageScore: scores.length > 0 
                ? Math.round(scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length) 
                : 0,
            highestScore: scores.length > 0 
                ? Math.max(...scores.map(s => s.score || 0))
                : 0
        };

        res.status(STATUS.OK).json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve statistics'
        });
    }
});

// DELETE /api/users/account - Delete user account
router.delete('/account', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete user's game scores first
        await supabase
            .from('game_scores')
            .delete()
            .eq('user_id', userId);

        // Delete user account
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Delete account error:', error);
            return res.status(STATUS.SERVER_ERROR).json({
                success: false,
                message: 'Failed to delete account'
            });
        }

        res.status(STATUS.OK).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete account'
        });
    }
});

module.exports = router;
