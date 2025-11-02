// DOM Elements
const loginForm = document.getElementById('loginForm');
const nameInput = document.getElementById('name');
const nimInput = document.getElementById('nim');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    initializePasswordToggle();
    initializeSocialButtons();
});

// Initialize login form
function initializeLoginForm() {
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

// Handle login submission - Connect to Backend API
async function handleLogin() {
    // Get form data - ONLY email and password needed for backend
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    // Simple validation
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    // Show loading state
    showLoadingState();

    try {
        // Call backend API
        const result = await window.API.auth.login(email, password);
        
        if (result.success && result.data) {
            // Backend returns: { user, token }
            // Save to localStorage in same format as before
            const userData = {
                ...result.data.user,
                token: result.data.token,
                isLoggedIn: true,
                loginDate: new Date().toISOString()
            };
            
            localStorage.setItem('bobolingoUser', JSON.stringify(userData));

            // Show success message
            showSuccessMessage();

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            throw new Error(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'Login failed. Please check your credentials.');
        resetLoadingState();
    }
}

// Reset loading state
function resetLoadingState() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        const btnText = loginBtn.querySelector('.btn-text');
        const btnIcon = loginBtn.querySelector('.btn-icon');

        loginBtn.classList.remove('loading');
        if (btnText) btnText.textContent = 'Sign In';
        if (btnIcon) btnIcon.className = 'fas fa-sign-in-alt btn-icon';
        loginBtn.disabled = false;
        loginBtn.style.background = '';
    }
}

// Show loading state
function showLoadingState() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        const btnText = loginBtn.querySelector('.btn-text');
        const btnIcon = loginBtn.querySelector('.btn-icon');

        loginBtn.classList.add('loading');
        if (btnText) btnText.textContent = 'Signing In...';
        if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
        loginBtn.disabled = true;
    }
}

// Show success message
function showSuccessMessage() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        const btnText = loginBtn.querySelector('.btn-text');
        const btnIcon = loginBtn.querySelector('.btn-icon');

        loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        if (btnText) btnText.textContent = 'Success!';
        if (btnIcon) btnIcon.className = 'fas fa-check btn-icon';
    }
}

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
                window.location.href = '../html/dashboard.html';
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
            window.location.href = '../html/welcome.html';
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
    window.location.href = '../html/dashboard.html';
}