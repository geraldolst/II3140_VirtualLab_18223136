// Auth Callback Handler for OAuth Redirects
// This handles the callback from Google OAuth and redirects appropriately

document.addEventListener('DOMContentLoaded', async function() {
    await handleAuthCallback();
});

async function handleAuthCallback() {
    try {
        // Import Supabase dynamically
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
        
        // Initialize Supabase
        const supabaseUrl = 'https://inlksxdnfiruqaiumofw.supabase.co'; 
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlubGtzeGRuZmlydXFhaXVtb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjg0NTIsImV4cCI6MjA3NTYwNDQ1Mn0.35KjPxnqPSJD5PcNJiOinrDu2RlG3rPUDKdre3dSxXU';
        
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Auth callback error:', error);
            // Redirect to login with error
            window.location.href = 'login.html?error=auth_failed';
            return;
        }

        if (data.session && data.session.user) {
            const user = data.session.user;
            
            // Save user data to localStorage for compatibility
            const userData = {
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                email: user.email,
                isLoggedIn: true,
                loginDate: new Date().toISOString(),
                loginMethod: 'google',
                profilePicture: user.user_metadata?.avatar_url || '',
                supabaseUser: true,
                userId: user.id
            };
            
            localStorage.setItem('bobolingoUser', JSON.stringify(userData));
            
            // Show success message briefly
            showSuccessMessage();
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            // No session found, redirect to login
            window.location.href = 'login.html';
        }

    } catch (error) {
        console.error('Callback handling error:', error);
        window.location.href = 'login.html?error=callback_failed';
    }
}

function showSuccessMessage() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const message = document.createElement('div');
    message.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 0 1rem;
        animation: fadeInScale 0.3s ease;
    `;
    
    message.innerHTML = `
        <div style="color: #10b981; font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="color: #333; margin-bottom: 0.5rem;">Authentication Successful!</h2>
        <p style="color: #666;">Redirecting to your dashboard...</p>
    `;
    
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}