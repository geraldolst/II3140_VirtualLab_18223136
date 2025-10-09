// Login Page JavaScript with Supabase

// Check if we're in a module environment (for Supabase import)
let supabase;

// Initialize Supabase client
async function initializeSupabase() {
    try {
        // Import Supabase dynamically
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
        
        // Get environment variables (you'll need to set these)
        const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your actual URL
        const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual key
        
        supabase = createClient(supabaseUrl, supabaseKey);
        return supabase;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        // Fallback to localStorage-based auth
        return null;
    }
}

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Initialize login page
document.addEventListener('DOMContentLoaded', async function() {
    await initializeSupabase();
    await checkExistingAuth();
    initializeLoginForm();
    initializePasswordToggle();
    initializeSocialButtons();
});

// Check if user is already logged in
async function checkExistingAuth() {
    if (supabase) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Redirect to dashboard if already logged in
                window.location.href = 'dashboard.html';
                return;
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        }
    }
    
    // Fallback: check localStorage
    const userData = localStorage.getItem('bobolingoUser');
    if (userData) {
        const user = JSON.parse(userData);
        if (user.isLoggedIn) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Initialize login form
function initializeLoginForm() {
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

// Handle login submission
async function handleLogin() {
    // Get form data
    const formData = {
        email: emailInput ? emailInput.value.trim() : '',
        password: passwordInput ? passwordInput.value : '',
        rememberMe: rememberMeCheckbox ? rememberMeCheckbox.checked : false
    };

    // Basic validation
    if (!validateLoginForm(formData)) {
        return;
    }

    // Show loading state
    showLoadingState();

    if (supabase) {
        // Use Supabase authentication
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                showLoginError(error.message);
                resetLoginButton();
                return;
            }

            // Show success message
            showSuccessMessage();

            // Save additional data to localStorage for compatibility
            const userData = {
                name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
                email: data.user.email,
                isLoggedIn: true,
                loginDate: new Date().toISOString(),
                loginMethod: 'email',
                supabaseUser: true
            };
            localStorage.setItem('bobolingoUser', JSON.stringify(userData));

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            showLoginError('An unexpected error occurred. Please try again.');
            resetLoginButton();
        }
    } else {
        // Fallback to localStorage-based auth
        setTimeout(() => {
            const userData = {
                name: formData.email.split('@')[0] || 'User',
                email: formData.email || 'user@example.com',
                isLoggedIn: true,
                loginDate: new Date().toISOString(),
                loginMethod: 'email'
            };

            localStorage.setItem('bobolingoUser', JSON.stringify(userData));
            showSuccessMessage();

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 2000);
    }
}

// Validate login form
function validateLoginForm(formData) {
    // Check if all required fields are filled
    if (!formData.email || !formData.password) {
        showLoginError('Please fill in all required fields.');
        return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showLoginError('Please enter a valid email address.');
        return false;
    }

    return true;
}



// Show loading state
function showLoadingState() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        loginBtn.disabled = true;
    }
}

// Reset login button
function resetLoginButton() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        loginBtn.disabled = false;
        loginBtn.style.background = '';
    }
}

// Show login error
function showLoginError(message) {
    let errorElement = document.querySelector('.login-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'login-error';
        errorElement.style.cssText = `
            background: #fef2f2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #fecaca;
            font-size: 0.9rem;
            animation: slideDown 0.3s ease;
        `;
        
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.insertBefore(errorElement, loginForm.firstChild);
        }
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }, 5000);
}

// Show success message
function showSuccessMessage() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }
}

// Google Sign-in with Supabase OAuth
async function signInWithGoogle() {
    const googleBtn = document.querySelector('.google-btn');
    if (!googleBtn) return;
    
    const originalContent = googleBtn.innerHTML;
    
    // Show loading state
    googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in with Google...';
    googleBtn.disabled = true;

    if (supabase) {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard.html`
                }
            });

            if (error) {
                console.error('Google sign-in error:', error);
                showLoginError('Failed to sign in with Google. Please try again.');
                
                // Reset button
                googleBtn.innerHTML = originalContent;
                googleBtn.disabled = false;
                return;
            }

            // If successful, user will be redirected automatically

        } catch (error) {
            console.error('Google OAuth error:', error);
            showLoginError('An unexpected error occurred with Google sign-in.');
            
            // Reset button
            googleBtn.innerHTML = originalContent;
            googleBtn.disabled = false;
        }
    } else {
        // Fallback simulation for development
        setTimeout(() => {
            const userData = {
                name: 'Google User',
                email: 'user@gmail.com',
                isLoggedIn: true,
                loginDate: new Date().toISOString(),
                loginMethod: 'google',
                profilePicture: 'https://via.placeholder.com/150'
            };

            localStorage.setItem('bobolingoUser', JSON.stringify(userData));

            googleBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            googleBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 2000);
    }
}

// Make functions globally available
window.signInWithGoogle = signInWithGoogle;

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');

    if (passwordInput && passwordIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            passwordIcon.className = 'fas fa-eye';
        }
    }
}

// Initialize social login buttons
function initializeSocialButtons() {
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');

    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            handleSocialLogin('google');
        });
    }

    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            handleSocialLogin('facebook');
        });
    }
}

// Handle social login (Frontend only)
function handleSocialLogin(provider) {
    // Show loading state for social button
    const button = document.querySelector(`.${provider}-btn`);
    
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        button.disabled = true;

        // Simulate social login
        setTimeout(() => {
            // Create user data for social login
            const userData = {
                name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                nim: '',
                email: `user@${provider}.com`,
                isLoggedIn: true,
                loginDate: new Date().toISOString(),
                provider: provider
            };

            // Save to localStorage
            localStorage.setItem('bobolingoUser', JSON.stringify(userData));

            // Show success and redirect
            button.innerHTML = '<i class="fas fa-check"></i> Success!';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        }, 2000);
    }
}

// Initialize password toggle and other features
function initializePasswordToggle() {
    // Handle "Forgot Password" link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password recovery feature coming soon!\n\nFor now, you can sign in with any credentials.');
        });
    }

    // Handle "Sign up here" link
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'welcome.html';
        });
    }

    // Add visual feedback for form inputs
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.parentElement) {
                this.parentElement.classList.add('focused');
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.parentElement) {
                this.parentElement.classList.remove('focused');
                if (this.value) {
                    this.parentElement.classList.add('has-value');
                } else {
                    this.parentElement.classList.remove('has-value');
                }
            }
        });
        
        // Check if input has value on load
        if (input.value && input.parentElement) {
            input.parentElement.classList.add('has-value');
        }
    });

    // Add enter key support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.closest('#loginForm')) {
            e.preventDefault();
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    });
}

// Guest login function (if needed)
function loginAsGuest() {
    // Create guest user data
    const guestData = {
        name: 'Guest User',
        nim: '',
        email: 'guest@bobolingo.com',
        isLoggedIn: true,
        isGuest: true,
        loginDate: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('bobolingoUser', JSON.stringify(guestData));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Google Sign-in
function signInWithGoogle() {
    // Show loading state
    const googleBtn = document.querySelector('.google-btn');
    const originalContent = googleBtn.innerHTML;
    
    googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    googleBtn.disabled = true;

    // Simulate Google OAuth process
    setTimeout(() => {
        // Simulate successful Google sign-in
        const userData = {
            name: 'Google User',
            email: 'user@gmail.com',
            isLoggedIn: true,
            loginDate: new Date().toISOString(),
            loginMethod: 'google',
            profilePicture: 'https://via.placeholder.com/150' // Placeholder avatar
        };

        // Save to localStorage
        localStorage.setItem('bobolingoUser', JSON.stringify(userData));

        // Show success message
        googleBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        googleBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    }, 2000);
}

// Facebook Sign-in
function signInWithFacebook() {
    // Show loading state
    const facebookBtn = document.querySelector('.facebook-btn');
    const originalContent = facebookBtn.innerHTML;
    
    facebookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    facebookBtn.disabled = true;

    // Simulate Facebook OAuth process
    setTimeout(() => {
        // Simulate successful Facebook sign-in
        const userData = {
            name: 'Facebook User',
            email: 'user@facebook.com',
            isLoggedIn: true,
            loginDate: new Date().toISOString(),
            loginMethod: 'facebook',
            profilePicture: 'https://via.placeholder.com/150' // Placeholder avatar
        };

        // Save to localStorage
        localStorage.setItem('bobolingoUser', JSON.stringify(userData));

        // Show success message
        facebookBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        facebookBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    }, 2000);
}