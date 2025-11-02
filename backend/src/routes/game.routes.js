const express = require('express');
const router = express.Router();
const { supabase } = require('../services/supabase.service');

/**
 * @route   POST /api/games/save-score
 * @desc    Save game score
 * @access  Private
 */
router.post('/save-score', async (req, res) => {
    try {
        const { userId, gameType, score, difficulty, completed } = req.body;
        
        const { data, error } = await supabase
            .from('game_scores')
            .insert({
                user_id: userId,
                game_type: gameType,
                score: score,
                difficulty: difficulty,
                completed: completed || false,
                played_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Score saved successfully',
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   GET /api/games/leaderboard/:gameType
 * @desc    Get leaderboard for a specific game
 * @access  Public
 */
router.get('/leaderboard/:gameType', async (req, res) => {
    try {
        const { gameType } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        
        const { data, error } = await supabase
            .from('game_scores')
            .select(`
                *,
                users (
                    id,
                    name,
                    email
                )
            `)
            .eq('game_type', gameType)
            .order('score', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        
        res.json({
            success: true,
            leaderboard: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   GET /api/games/history
 * @desc    Get user's game history
 * @access  Private
 */
router.get('/history', async (req, res) => {
    try {
        const userId = req.query.userId;
        const gameType = req.query.gameType; // optional filter
        
        let query = supabase
            .from('game_scores')
            .select('*')
            .eq('user_id', userId)
            .order('played_at', { ascending: false });
        
        if (gameType) {
            query = query.eq('game_type', gameType);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        res.json({
            success: true,
            history: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
