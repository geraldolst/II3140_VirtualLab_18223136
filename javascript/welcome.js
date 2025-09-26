// Welcome Page JavaScript

// Loading Animation Variables
let loadingProgress = 0;
let loadingInterval;
const loadingDuration = 3000; // 3 seconds
const loadingSteps = 100;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const welcomeContent = document.getElementById('welcomeContent');
const loadingProgressBar = document.querySelector('.loading-progress');
const loadingPercentage = document.querySelector('.loading-percentage');

// Initialize loading when page loads
document.addEventListener('DOMContentLoaded', function() {
    startLoading();
});

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