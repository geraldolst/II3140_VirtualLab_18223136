const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth.middleware');
const { validateGameScore } = require('../middleware/validator.middleware');
const { STATUS, ERRORS } = require('../config/constants');

// POST /api/games/save-score - Save game score
router.post('/save-score', authMiddleware, validateGameScore, async (req, res) => {
    try {
        const userId = req.user.id;
        const { game_type, score, difficulty, completed } = req.body;

        const { data: savedScore, error } = await supabase
            .from('game_scores')
            .insert({
                user_id: userId,
                game_type,
                score: parseInt(score) || 0,            // pastikan integer
                // difficulty: difficulty || 'medium',
                // completed_at: new Date().toISOString(),  // ✅ sesuai nama kolom
                // time_taken: null                        // ✅ tambahkan field ini
            })
            .select()
            .single();

        if (error) {
            console.error('Save score error:', error); // ← ini sudah ada
            console.error('Full error details:', JSON.stringify(error, null, 2));
            return res.status(STATUS.SERVER_ERROR).json({
                success: false,
                message: 'Failed to save score'
            });
        }

        res.status(STATUS.CREATED).json({
            success: true,
            message: 'Score saved successfully',
            data: { score: savedScore }
        });
    } catch (error) {
        console.error('Save score error:', error); // ← ini sudah ada
        console.error('Full error details:', JSON.stringify(error, null, 2));
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Failed to save score'
        });
    }
});

// GET /api/games/leaderboard/:game_type - Get leaderboard for a specific game
router.get('/leaderboard/:game_type', async (req, res) => {
    try {
        const { game_type } = req.params;
        const limit = parseInt(req.query.limit) || 10;

        const { data: leaderboard, error } = await supabase
            .from('game_scores')
            .select(`
                id,
                score,
                difficulty,
                played_at,
                users (
                    id,
                    username,
                    email
                )
            `)
            .eq('game_type', game_type)
            .order('score', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Leaderboard error:', error);
            return res.status(STATUS.SERVER_ERROR).json({
                success: false,
                message: 'Failed to retrieve leaderboard'
            });
        }

        res.status(STATUS.OK).json({
            success: true,
            data: { leaderboard }
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve leaderboard'
        });
    }
});

// GET /api/games/history - Get user's game history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const game_type = req.query.game_type; // optional filter

        let query = supabase
            .from('game_scores')
            .select('*')
            .eq('user_id', userId)
            .order('played_at', { ascending: false });

        if (game_type) {
            query = query.eq('game_type', game_type);
        }

        const { data: history, error } = await query;

        if (error) {
            console.error('Game history error:', error);
            return res.status(STATUS.SERVER_ERROR).json({
                success: false,
                message: 'Failed to retrieve game history'
            });
        }

        res.status(STATUS.OK).json({
            success: true,
            data: { history }
        });
    } catch (error) {
        console.error('Game history error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve game history'
        });
    }
});

// GET /api/games/stats/:game_type - Get user statistics for a specific game
router.get('/stats/:game_type', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { game_type } = req.params;

        const { data: scores, error } = await supabase
            .from('game_scores')
            .select('*')
            .eq('user_id', userId)
            .eq('game_type', game_type);

        if (error) {
            console.error('Game stats error:', error);
            return res.status(STATUS.SERVER_ERROR).json({
                success: false,
                message: 'Failed to retrieve game statistics'
            });
        }

        const stats = {
            totalPlayed: scores.length,
            totalScore: scores.reduce((sum, s) => sum + (s.score || 0), 0),
            averageScore: scores.length > 0
                ? Math.round(scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length)
                : 0,
            highestScore: scores.length > 0
                ? Math.max(...scores.map(s => s.score || 0))
                : 0,
            completionRate: scores.length > 0
                ? Math.round((scores.filter(s => s.completed).length / scores.length) * 100)
                : 0
        };

        res.status(STATUS.OK).json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        console.error('Game stats error:', error);
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve game statistics'
        });
    }
});

module.exports = router;
