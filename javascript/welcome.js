// Check if we're in a module environment (for Supabase import)
let supabase;

// Initialize Supabase client
async function initializeSupabase() {
    try {
        // Import Supabase dynamically
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
        
        //Environment variables (for production, use actual env vars)
        const supabaseUrl = 'https://inlksxdnfiruqaiumofw.supabase.co'; 
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlubGtzeGRuZmlydXFhaXVtb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjg0NTIsImV4cCI6MjA3NTYwNDQ1Mn0.35KjPxnqPSJD5PcNJiOinrDu2RlG3rPUDKdre3dSxXU'; 
        
        supabase = createClient(supabaseUrl, supabaseKey);
        return supabase;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        // Fallback to localStorage-based auth
        return null;
    }
}

// DOM Elements
const registerForm = document.getElementById('registerForm');
const fullNameInput = document.getElementById('fullName');
const registerEmailInput = document.getElementById('registerEmail');
const registerPasswordInput = document.getElementById('registerPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const agreeTermsCheckbox = document.getElementById('agreeTerms');

// Loading Animation Elements
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgressBar = document.querySelector('.loading-progress');
const loadingPercentage = document.querySelector('.loading-percentage');
const welcomeContent = document.querySelector('.welcome-content');

// Loading Animation Variables
let loadingProgress = 0;
let loadingInterval;
const loadingDuration = 3000; // 3 seconds
const loadingSteps = 100;

// Initialize register page
document.addEventListener('DOMContentLoaded', async function() {
    await initializeSupabase();
    await checkExistingAuth();
    initializeRegisterForm();
    initializePasswordToggle();
    
    // Start loading animation if loading screen exists
    if (loadingScreen) {
        startLoading();
    }
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

// Initialize register form
function initializeRegisterForm() {
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
}

// Initialize password toggle
function initializePasswordToggle() {
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', toggleRegisterPassword);
    }
}

// Handle register submission
async function handleRegister() {
    // Get form data
    const formData = {
        fullName: fullNameInput ? fullNameInput.value.trim() : '',
        email: registerEmailInput ? registerEmailInput.value.trim() : '',
        password: registerPasswordInput ? registerPasswordInput.value : '',
        confirmPassword: confirmPasswordInput ? confirmPasswordInput.value : '',
        agreeTerms: agreeTermsCheckbox ? agreeTermsCheckbox.checked : false
    };

    // Basic validation
    if (!validateRegisterForm(formData)) {
        return;
    }

    // Show loading state
    showRegisterLoadingState();

    if (supabase) {
        // Use Supabase authentication
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        display_name: formData.fullName
                    }
                }
            });

            if (error) {
                showRegisterError(error.message);
                resetRegisterButton();
                return;
            }

            // Show success message
            showRegisterSuccessMessage();

            // Save additional data to localStorage for compatibility
            const userData = {
                name: formData.fullName,
                email: formData.email,
                isLoggedIn: true,
                loginDate: new Date().toISOString(),
                loginMethod: 'email',
                supabaseUser: true,
                isNewUser: true
            };
            localStorage.setItem('bobolingoUser', JSON.stringify(userData));

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            showRegisterError('An unexpected error occurred. Please try again.');
            resetRegisterButton();
        }
    } else {
        // Fallback to localStorage-based registration
        setTimeout(() => {
            const userData = {
                name: formData.fullName,
                email: formData.email,
                isLoggedIn: true,
                loginDate: new Date().toISOString(),
                loginMethod: 'email',
                isNewUser: true
            };

            localStorage.setItem('bobolingoUser', JSON.stringify(userData));
            showRegisterSuccessMessage();

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }, 2000);
    }
}

// Validate register form
function validateRegisterForm(formData) {
    // Check if all required fields are filled
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        showRegisterError('Please fill in all required fields.');
        return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
        showRegisterError('Passwords do not match.');
        return false;
    }

    // Check if terms are agreed
    if (!formData.agreeTerms) {
        showRegisterError('Please agree to the Terms & Conditions.');
        return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showRegisterError('Please enter a valid email address.');
        return false;
    }

    // Basic password validation
    if (formData.password.length < 6) {
        showRegisterError('Password must be at least 6 characters long.');
        return false;
    }

    return true;
}

// Show register loading state
function showRegisterLoadingState() {
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        registerBtn.disabled = true;
    }
}

// Show register success message
function showRegisterSuccessMessage() {
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
        registerBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
        registerBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }
}

// Reset register button
function resetRegisterButton() {
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
        registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        registerBtn.disabled = false;
        registerBtn.style.background = '';
    }
}

// Show register error
function showRegisterError(message) {
    let errorElement = document.querySelector('.register-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'register-error';
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
        
        const registerForm = document.querySelector('.register-form');
        if (registerForm) {
            registerForm.insertBefore(errorElement, registerForm.firstChild);
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

// Toggle register password visibility
function toggleRegisterPassword() {
    const passwordInput = document.getElementById('registerPassword');
    const passwordIcon = document.getElementById('registerPasswordIcon');
    
    if (passwordInput && passwordIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.classList.remove('fa-eye');
            passwordIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            passwordIcon.classList.remove('fa-eye-slash');
            passwordIcon.classList.add('fa-eye');
        }
    }
}

// Google Sign-up with Supabase OAuth
async function signUpWithGoogle() {
    const googleBtn = document.querySelector('.google-btn');
    if (!googleBtn) return;
    
    const originalContent = googleBtn.innerHTML;
    
    // Show loading state
    googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing up with Google...';
    googleBtn.disabled = true;

    if (supabase) {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth-callback.html`,
                    queryParams: {
                        prompt: 'select_account'
                    }
                }
            });

            if (error) {
                console.error('Google sign-up error:', error);
                showRegisterError('Failed to sign up with Google. Please try again.');
                
                // Reset button
                googleBtn.innerHTML = originalContent;
                googleBtn.disabled = false;
                return;
            }

            // If successful, user will be redirected automatically

        } catch (error) {
            console.error('Google OAuth error:', error);
            showRegisterError('An unexpected error occurred with Google sign-up.');
            
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
                profilePicture: 'https://via.placeholder.com/150',
                isNewUser: true
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
window.signUpWithGoogle = signUpWithGoogle;
window.toggleRegisterPassword = toggleRegisterPassword;

// Start Loading Animation
function startLoading() {
    loadingProgress = 0;
    const incrementTime = loadingDuration / loadingSteps;
    
    loadingInterval = setInterval(() => {
        loadingProgress += 1;
        
        // Update progress bar
        loadingProgressBar.style.width = loadingProgress + '%';
        loadingPercentage.textContent = loadingProgress + '%';
        
        // Complete loading
        if (loadingProgress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(completeLoading, 500); // Wait a bit before transitioning
        }
    }, incrementTime);
    
    // Add some random variations to make it feel more realistic
    setTimeout(() => {
        if (loadingProgress < 30) {
            loadingProgress = 30;
        }
    }, 800);
    
    setTimeout(() => {
        if (loadingProgress < 60) {
            loadingProgress = 60;
        }
    }, 1500);
    
    setTimeout(() => {
        if (loadingProgress < 85) {
            loadingProgress = 85;
        }
    }, 2200);
}

// Complete Loading and Show Welcome Content
function completeLoading() {
    // Hide loading screen with fade out
    loadingScreen.classList.add('hidden');
    
    // Show welcome content after loading screen fades
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        welcomeContent.style.display = 'block';
        
        // Start typing animation for greeting
        startTypingAnimation();
    }, 500);
}

// Typing Animation for Greeting
function startTypingAnimation() {
    const greetingWord = document.querySelector('.greeting-word');
    const cursor = document.querySelector('.typing-cursor');
    const text = 'Hi!';
    let index = 0;
    
    // Clear initial text
    greetingWord.textContent = '';
    
    // Type each character
    const typingInterval = setInterval(() => {
        if (index < text.length) {
            greetingWord.textContent += text[index];
            index++;
        } else {
            clearInterval(typingInterval);
            // Hide cursor after typing completes
            setTimeout(() => {
                cursor.style.display = 'none';
            }, 2000);
        }
    }, 200);
}

// Continue Button Action
function startLearning() {
    // Add click animation
    const continueBtn = document.querySelector('.continue-btn');
    continueBtn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        continueBtn.style.transform = 'scale(1)';
        
        // Navigate to login page
        window.location.href = '../html/login.html';
    }, 150);
}

// Show Welcome Message (placeholder for actual functionality)
function showWelcomeMessage() {
    const messages = [
        "🎉 Great! Let's start your language learning journey!",
        "🌟 Choose your first language to learn!",
        "📚 Your adventure begins now!",
        "🚀 Ready to unlock new languages?"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create popup message
    const popup = document.createElement('div');
    popup.className = 'welcome-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3>${randomMessage}</h3>
            <p>This would normally take you to the language selection page.</p>
            <button onclick="closePopup()" class="btn btn-primary">OK</button>
        </div>
    `;
    
    // Add popup styles
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const popupContent = popup.querySelector('.popup-content');
    popupContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 0 1rem;
        animation: slideInUp 0.3s ease;
    `;
    
    document.body.appendChild(popup);
}

// Close Popup
function closePopup() {
    const popup = document.querySelector('.welcome-popup');
    if (popup) {
        popup.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Add hover effects for mascot
document.addEventListener('DOMContentLoaded', function() {
    const mascot = document.querySelector('.mascot-character');
    
    if (mascot) {
        mascot.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        mascot.addEventListener('mouseleave', function() {
            this.style.animation = 'bounce 2s ease-in-out infinite';
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Press Enter or Space to continue
    if (event.key === 'Enter' || event.key === ' ') {
        const continueBtn = document.querySelector('.continue-btn');
        if (continueBtn && welcomeContent.style.display !== 'none') {
            event.preventDefault();
            startLearning();
        }
    }
    
    // Press Escape to close popup
    if (event.key === 'Escape') {
        closePopup();
    }
});

// Add loading screen click to skip (for development/testing)
if (loadingScreen) {
    loadingScreen.addEventListener('click', function() {
        if (loadingProgress < 100) {
            clearInterval(loadingInterval);
            loadingProgress = 100;
            loadingProgressBar.style.width = '100%';
            loadingPercentage.textContent = '100%';
            setTimeout(completeLoading, 200);
        }
    });
}