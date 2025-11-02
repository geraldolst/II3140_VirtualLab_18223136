const express = require('express');
const router = express.Router();
const { supabase } = require('../services/supabase.service');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', async (req, res) => {
    try {
        // TODO: Add authentication middleware
        const userId = req.query.userId; // Temporary - should come from auth token
        
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            user: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', async (req, res) => {
    try {
        const userId = req.query.userId; // Temporary
        const updates = req.body;
        
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', async (req, res) => {
    try {
        const userId = req.query.userId;
        
        // Get game scores
        const { data: scores, error } = await supabase
            .from('game_scores')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        
        const stats = {
            totalGames: scores.length,
            scramboboGames: scores.filter(s => s.game_type === 'scrambobo').length,
            memoriboGames: scores.filter(s => s.game_type === 'memoribo').length,
            totalScore: scores.reduce((sum, s) => sum + (s.score || 0), 0),
            averageScore: scores.length > 0 
                ? scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length 
                : 0
        };
        
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
