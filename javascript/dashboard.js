// Dashboard JavaScript

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const grammarInput = document.getElementById('grammarInput');
const checkGrammarBtn = document.getElementById('checkGrammar');
const clearTextBtn = document.getElementById('clearText');
const grammarResults = document.getElementById('grammarResults');
const grammarLanguage = document.getElementById('grammarLanguage');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndLoadUser();
    initializeNavigation();
    initializeGrammarChecker();
    animateStats();
    initializeUserMenu();
});

// Check authentication and load user data
function checkAuthAndLoadUser() {
    const userData = localStorage.getItem('bobolingoUser');
    
    if (!userData) {
        // User not logged in, load as guest
        loadGuestMode();
        return;
    }
    
    const user = JSON.parse(userData);
    
    if (!user.isLoggedIn) {
        // User not logged in, load as guest
        loadGuestMode();
        return;
    }
    
    // Load user data into dashboard
    loadUserData(user);
}

// Load guest mode
function loadGuestMode() {
    const userNameElement = document.querySelector('.user-name');
    const userInitialElement = document.querySelector('.avatar-letter');
    const welcomeTitle = document.querySelector('.section-title');
    
    if (userNameElement) {
        userNameElement.textContent = 'Guest';
    }
    
    if (userInitialElement) {
        userInitialElement.textContent = 'G';
    }
    
    if (welcomeTitle) {
        welcomeTitle.textContent = 'Welcome to Bobolingo! 🎉';
    }
}

// Load user data into dashboard
function loadUserData(user) {
    const userNameElement = document.querySelector('.user-name');
    const userInitialElement = document.querySelector('.avatar-letter');
    const welcomeTitle = document.querySelector('.section-title');
    
    if (userNameElement) {
        const firstName = user.name.split(' ')[0];
        userNameElement.textContent = firstName;
    }
    
    if (userInitialElement) {
        userInitialElement.textContent = user.name.charAt(0).toUpperCase();
    }
    
    if (welcomeTitle) {
        const firstName = user.name.split(' ')[0];
        welcomeTitle.textContent = `Welcome back, ${firstName}! 🎉`;
    }
}

// Initialize user menu
function initializeUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleUserDropdown();
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        hideUserDropdown();
    });
}

// Toggle user dropdown menu
function toggleUserDropdown() {
    let dropdown = document.querySelector('.user-dropdown');
    
    if (!dropdown) {
        createUserDropdown();
        dropdown = document.querySelector('.user-dropdown');
    }
    
    const isVisible = dropdown.style.display === 'block';
    
    if (isVisible) {
        hideUserDropdown();
    } else {
        showUserDropdown();
    }
}

// Create user dropdown menu
function createUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    const userData = localStorage.getItem('bobolingoUser');
    
    let dropdownContent;
    
    if (!userData || !JSON.parse(userData).isLoggedIn) {
        // Guest mode dropdown
        dropdownContent = `
            <div class="dropdown-header">
                <div class="dropdown-avatar">
                    <span class="dropdown-avatar-letter">G</span>
                </div>
                <div class="dropdown-user-info">
                    <div class="dropdown-name">Guest User</div>
                    <div class="dropdown-email">guest@bobolingo.com</div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-menu">
                <a href="login.html" class="dropdown-item">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Sign In</span>
                </a>
                <a href="welcome.html" class="dropdown-item">
                    <i class="fas fa-user-plus"></i>
                    <span>Sign Up</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item" onclick="showHelp()">
                    <i class="fas fa-question-circle"></i>
                    <span>Help & Support</span>
                </a>
            </div>
        `;
    } else {
        // Logged in user dropdown
        const user = JSON.parse(userData);
        dropdownContent = `
            <div class="dropdown-header">
                <div class="dropdown-avatar">
                    <span class="dropdown-avatar-letter">${user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div class="dropdown-user-info">
                    <div class="dropdown-name">${user.name}</div>
                    <div class="dropdown-email">${user.email}</div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-menu">
                <a href="profile.html" class="dropdown-item">
                    <i class="fas fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="#" class="dropdown-item" onclick="showSettings()">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </a>
                <a href="#" class="dropdown-item" onclick="showHelp()">
                    <i class="fas fa-question-circle"></i>
                    <span>Help & Support</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item danger" onclick="signOutFromDropdown()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Sign Out</span>
                </a>
            </div>
        `;
    }
    
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = dropdownContent;
    
    // Add dropdown styles
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        border: 1px solid #e5e7eb;
        min-width: 280px;
        z-index: 1001;
        display: none;
        overflow: hidden;
        margin-top: 0.5rem;
    `;
    
    userMenu.style.position = 'relative';
    userMenu.appendChild(dropdown);
    
    // Add dropdown CSS styles to page
    if (!document.querySelector('#dropdown-styles')) {
        const style = document.createElement('style');
        style.id = 'dropdown-styles';
        style.textContent = `
            .dropdown-header {
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .dropdown-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
            }
            
            .dropdown-name {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.25rem;
            }
            
            .dropdown-email {
                font-size: 0.8rem;
                color: #64748b;
            }
            
            .dropdown-divider {
                height: 1px;
                background: #e5e7eb;
                margin: 0.5rem 0;
            }
            
            .dropdown-menu {
                padding: 0.5rem;
            }
            
            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                color: #374151;
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            }
            
            .dropdown-item:hover {
                background: #f3f4f6;
                color: #667eea;
            }
            
            .dropdown-item.danger {
                color: #dc2626;
            }
            
            .dropdown-item.danger:hover {
                background: #fef2f2;
                color: #dc2626;
            }
            
            .dropdown-item i {
                width: 16px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
}

// Show/Hide dropdown functions
function showUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.style.display = 'block';
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            dropdown.style.transition = 'all 0.2s ease';
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        }, 10);
    }
}

function hideUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 200);
    }
}

// Dropdown menu functions
function showSettings() {
    hideUserDropdown();
    alert('Settings functionality would be implemented here.\\n\\nFor now, you can access basic settings through your profile page.');
}

function showHelp() {
    hideUserDropdown();
    alert('Help & Support functionality would be implemented here.\\n\\nThis would show FAQ, contact options, and tutorials.');
}

function signOutFromDropdown() {
    hideUserDropdown();
    
    const confirmed = confirm('Are you sure you want to sign out?\\n\\nYou will be redirected to the home page.');
    
    if (confirmed) {
        // Clear user data
        localStorage.removeItem('bobolingoUser');
        localStorage.removeItem('bobolingoProfile');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Navigation functionality
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items and sections
            navLinks.forEach(navLink => navLink.parentElement.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding section
            this.parentElement.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Add slide-in animation
            targetElement.style.opacity = '0';
            targetElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetElement.style.transition = 'all 0.3s ease';
                targetElement.style.opacity = '1';
                targetElement.style.transform = 'translateY(0)';
            }, 50);
        });
    });
}

// Navigate to lessons section
function navigateToLessons(courseType) {
    // Navigate to lessons section
    const lessonsNavLink = document.querySelector('[data-section="lessons"]');
    const lessonsSection = document.getElementById('lessons');
    
    // Remove active class from all nav items and sections
    navLinks.forEach(navLink => navLink.parentElement.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));
    
    // Add active class to lessons nav item and section
    if (lessonsNavLink) {
        lessonsNavLink.parentElement.classList.add('active');
    }
    
    if (lessonsSection) {
        lessonsSection.classList.add('active');
        
        // Add slide-in animation
        lessonsSection.style.opacity = '0';
        lessonsSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            lessonsSection.style.transition = 'all 0.3s ease';
            lessonsSection.style.opacity = '1';
            lessonsSection.style.transform = 'translateY(0)';
            
            // Optional: Scroll to specific course based on courseType
            console.log(`Navigating to ${courseType} course`);
        }, 50);
    }
}

// Grammar Checker functionality
function initializeGrammarChecker() {
    if (checkGrammarBtn) {
        checkGrammarBtn.addEventListener('click', checkGrammar);
    }
    
    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', clearText);
    }
    
    if (grammarInput) {
        grammarInput.addEventListener('input', updateCharacterCount);
    }
}

// Grammar check function
function checkGrammar() {
    const text = grammarInput.value.trim();
    
    if (!text) {
        showError('Please enter some text to check.');
        return;
    }
    
    // Show loading state
    grammarResults.innerHTML = `
        <div class="loading-state" style="text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #667eea; margin-bottom: 1rem;"></i>
            <h3>Analyzing your text...</h3>
            <p>Please wait while we check your grammar.</p>
        </div>
    `;
    
    // Simulate API call with timeout
    setTimeout(() => {
        const errors = simulateGrammarCheck(text);
        displayGrammarResults(errors);
    }, 2000);
}

// Simulate grammar checking (replace with actual API)
function simulateGrammarCheck(text) {
    const commonErrors = [
        {
            type: 'Spelling',
            message: 'Possible spelling mistake found.',
            suggestion: 'Check the spelling of technical terms.'
        },
        {
            type: 'Grammar',
            message: 'Consider revising sentence structure.',
            suggestion: 'Try breaking long sentences into shorter ones.'
        }
    ];
    
    // Return random errors for demo
    return Math.random() > 0.5 ? commonErrors : [];
}

// Display grammar results
function displayGrammarResults(errors) {
    if (errors.length === 0) {
        grammarResults.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 2rem; color: #059669;">
                <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3>Great job!</h3>
                <p>No grammar issues found in your text.</p>
            </div>
        `;
    } else {
        let resultsHTML = '<h3>Grammar Check Results</h3>';
        errors.forEach(error => {
            resultsHTML += `
                <div class="error-item">
                    <div class="error-type">${error.type}</div>
                    <div class="error-message">${error.message}</div>
                    <div class="error-suggestion">${error.suggestion}</div>
                </div>
            `;
        });
        grammarResults.innerHTML = resultsHTML;
    }
}

// Clear text function
function clearText() {
    grammarInput.value = '';
    grammarResults.innerHTML = `
        <div class="results-placeholder">
            <i class="fas fa-spell-check"></i>
            <h3>Grammar Check Results</h3>
            <p>Enter text above and click "Check Grammar" to see suggestions</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    grammarResults.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem; color: #dc2626;">
            <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Animate stats on page load
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent.replace(/[^0-9]/g, ''));
                animateValue(entry.target, 0, target, 2000);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Animate number counting
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    const suffix = originalText.replace(/[0-9]/g, '');
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Add hover effects for lesson cards
document.addEventListener('DOMContentLoaded', function() {
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    lessonCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        });
    });
});

// Add real-time character count (optional)
function updateCharacterCount() {
    const text = grammarInput.value;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;
    
    // You can add a character counter display if needed
    console.log(`Characters: ${charCount}, Words: ${wordCount}`);
}

// Mobile menu toggle (for responsive design)
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-active');
}

// Add click handlers for lesson continue buttons
document.addEventListener('DOMContentLoaded', function() {
    const continueButtons = document.querySelectorAll('.lesson-button');
    
    continueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lessonTitle = this.parentElement.querySelector('.lesson-title').textContent;
            console.log(`Continue learning: ${lessonTitle}`);
            // Add navigation logic here
        });
    });
});

// Make functions globally available for onclick handlers
window.navigateToLessons = navigateToLessons;
window.showSettings = showSettings;
window.showHelp = showHelp;
window.signOutFromDropdown = signOutFromDropdown;