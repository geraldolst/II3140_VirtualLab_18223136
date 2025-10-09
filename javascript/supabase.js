// Supabase Configuration and Client
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

// Supabase Configuration
const supabaseUrl = 'https://inlksxdnfiruqaiumofw.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlubGtzeGRuZmlydXFhaXVtb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjg0NTIsImV4cCI6MjA3NTYwNDQ1Mn0.35KjPxnqPSJD5PcNJiOinrDu2RlG3rPUDKdre3dSxXU   '; 
// Create Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication Helper Functions
export const authHelpers = {
    // Sign up new user
    async signUp(email, password, userData) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: userData.fullName,
                        display_name: userData.displayName
                    }
                }
            });

            if (error) throw error;

            // Create user profile in database
            if (data.user) {
                await this.createUserProfile(data.user.id, userData);
            }

            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in existing user
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Load user profile data
            if (data.user) {
                const profile = await this.getUserProfile(data.user.id);
                return { success: true, data, profile };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out user
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Clear local storage
            localStorage.removeItem('bobolingoUser');
            
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current session
    async getSession() {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { success: true, session: data.session };
        } catch (error) {
            console.error('Get session error:', error);
            return { success: false, error: error.message };
        }
    },

    // Create user profile
    async createUserProfile(userId, userData) {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .insert([
                    {
                        user_id: userId,
                        full_name: userData.fullName,
                        display_name: userData.displayName,
                        email: userData.email,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create profile error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get user profile
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            return { success: true, profile: data };
        } catch (error) {
            console.error('Get profile error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Course Progress Helper Functions
export const courseHelpers = {
    // Get user's course progress
    async getCourseProgress(userId) {
        try {
            const { data, error } = await supabase
                .from('course_progress')
                .select(`
                    *,
                    courses (
                        course_name,
                        total_lessons
                    )
                `)
                .eq('user_id', userId);

            if (error) throw error;
            return { success: true, progress: data };
        } catch (error) {
            console.error('Get course progress error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update course progress
    async updateCourseProgress(userId, courseId, completedLessons) {
        try {
            const { data, error } = await supabase
                .from('course_progress')
                .upsert([
                    {
                        user_id: userId,
                        course_id: courseId,
                        completed_lessons: completedLessons,
                        last_accessed: new Date().toISOString(),
                        is_completed: completedLessons >= 4 // Assuming 4 lessons per course
                    }
                ], {
                    onConflict: 'user_id,course_id'
                });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update course progress error:', error);
            return { success: false, error: error.message };
        }
    },

    // Mark course as completed
    async completeCourse(userId, courseId) {
        try {
            await this.updateCourseProgress(userId, courseId, 4);
            
            // Check if user completed all 4 courses
            const progress = await this.getCourseProgress(userId);
            if (progress.success) {
                const completedCourses = progress.progress.filter(p => p.is_completed).length;
                if (completedCourses >= 4) {
                    // Unlock games for user
                    await this.unlockGamesForUser(userId);
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Complete course error:', error);
            return { success: false, error: error.message };
        }
    },

    // Unlock games for user
    async unlockGamesForUser(userId) {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .update({ games_unlocked: true })
                .eq('user_id', userId);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Unlock games error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Game Progress Helper Functions
export const gameHelpers = {
    // Get user's game progress
    async getGameProgress(userId) {
        try {
            const { data, error } = await supabase
                .from('game_progress')
                .select(`
                    *,
                    games (
                        game_name,
                        max_level
                    )
                `)
                .eq('user_id', userId);

            if (error) throw error;
            return { success: true, progress: data };
        } catch (error) {
            console.error('Get game progress error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update game progress
    async updateGameProgress(userId, gameId, level, points, isWin = false) {
        try {
            // Get current progress
            const { data: current, error: fetchError } = await supabase
                .from('game_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('game_id', gameId)
                .single();

            let newLevel = level;
            let newTotalPoints = points;
            let newHighestLevel = level;

            if (current) {
                newTotalPoints = current.total_points + points;
                newHighestLevel = Math.max(current.highest_level, level);
                
                // Only advance level if user wins and it's higher than current
                if (isWin && level > current.highest_level) {
                    newLevel = level;
                } else {
                    newLevel = current.highest_level;
                }
            }

            const { data, error } = await supabase
                .from('game_progress')
                .upsert([
                    {
                        user_id: userId,
                        game_id: gameId,
                        current_level: newLevel,
                        highest_level: newHighestLevel,
                        total_points: newTotalPoints,
                        last_played: new Date().toISOString()
                    }
                ], {
                    onConflict: 'user_id,game_id'
                });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update game progress error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get leaderboard
    async getLeaderboard(gameId = null) {
        try {
            let query = supabase
                .from('game_progress')
                .select(`
                    *,
                    user_profiles!inner (
                        display_name,
                        full_name
                    ),
                    games (
                        game_name
                    )
                `)
                .order('total_points', { ascending: false })
                .limit(10);

            if (gameId) {
                query = query.eq('game_id', gameId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, leaderboard: data };
        } catch (error) {
            console.error('Get leaderboard error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Real-time subscriptions
export const subscriptions = {
    // Subscribe to user profile changes
    subscribeToProfile(userId, callback) {
        return supabase
            .channel('profile-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_profiles',
                    filter: `user_id=eq.${userId}`
                },
                callback
            )
            .subscribe();
    },

    // Subscribe to course progress changes
    subscribeToCourseProgress(userId, callback) {
        return supabase
            .channel('course-progress-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'course_progress',
                    filter: `user_id=eq.${userId}`
                },
                callback
            )
            .subscribe();
    },

    // Subscribe to game progress changes
    subscribeToGameProgress(userId, callback) {
        return supabase
            .channel('game-progress-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'game_progress',
                    filter: `user_id=eq.${userId}`
                },
                callback
            )
            .subscribe();
    }
};