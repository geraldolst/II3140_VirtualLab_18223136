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
            if (courseType === 'fundamentals' || courseType === 'grammar') {
                const targetCourse = document.querySelector(`.course-card:nth-child(${courseType === 'fundamentals' ? '1' : '2'})`);
                if (targetCourse) {
                    targetCourse.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Add highlight effect
                    targetCourse.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
                    setTimeout(() => {
                        targetCourse.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                    }, 2000);
                }
            }
        }, 50);
    }
}

// Grammar Checker functionality
function initializeGrammarChecker() {
    checkGrammarBtn.addEventListener('click', checkGrammar);
    clearTextBtn.addEventListener('click', clearText);
    grammarInput.addEventListener('input', updateCharacterCount);
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
            this.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to check grammar
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (document.getElementById('grammar-checker').classList.contains('active')) {
            event.preventDefault();
            checkGrammar();
        }
    }
    
    // Escape to clear results
    if (event.key === 'Escape') {
        if (document.getElementById('grammar-checker').classList.contains('active')) {
            clearText();
        }
    }
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
        });
    });
});

// ==========================================
//          SCRAMBIFY GAME
// ==========================================

// Scramble game data
const scrambleWords = {
    easy: [
        { word: "apple", hint: "A common red or green fruit" },
        { word: "house", hint: "A place where people live" },
        { word: "water", hint: "Clear liquid essential for life" },
        { word: "happy", hint: "Feeling of joy or contentment" },
        { word: "sunny", hint: "Bright with sunlight" },
        { word: "green", hint: "The color of grass" },
        { word: "music", hint: "Pleasant sounds in harmony" },
        { word: "friend", hint: "Someone you care about" },
        { word: "smile", hint: "Happy facial expression" },
        { word: "peace", hint: "State of tranquility" },
        { word: "heart", hint: "Organ that pumps blood" },
        { word: "light", hint: "Brightness that lets us see" },
        { word: "dream", hint: "Images during sleep" },
        { word: "dance", hint: "Moving to music" },
        { word: "ocean", hint: "Large body of salt water" }
    ],
    medium: [
        { word: "computer", hint: "Electronic device for processing data" },
        { word: "elephant", hint: "Large grey animal with trunk" },
        { word: "rainbow", hint: "Arc of colors in the sky" },
        { word: "butterfly", hint: "Colorful flying insect" },
        { word: "mountain", hint: "Very high natural elevation" },
        { word: "adventure", hint: "Exciting or unusual experience" },
        { word: "chocolate", hint: "Sweet brown confection" },
        { word: "telephone", hint: "Device for voice communication" },
        { word: "vacation", hint: "Time away from work or school" },
        { word: "dinosaur", hint: "Extinct prehistoric reptile" },
        { word: "keyboard", hint: "Input device with keys" },
        { word: "sandwich", hint: "Food between bread slices" },
        { word: "umbrella", hint: "Protection from rain" },
        { word: "fountain", hint: "Decorative water feature" },
        { word: "calendar", hint: "Chart showing days and dates" }
    ],
    hard: [
        { word: "programming", hint: "Writing code for computers" },
        { word: "magnificent", hint: "Extremely beautiful or impressive" },
        { word: "constellation", hint: "Group of stars forming a pattern" },
        { word: "architecture", hint: "Art of designing buildings" },
        { word: "photography", hint: "Art of taking pictures" },
        { word: "encyclopedia", hint: "Reference work with articles" },
        { word: "Mediterranean", hint: "Sea between Europe and Africa" },
        { word: "sophisticated", hint: "Highly developed or complex" },
        { word: "documentary", hint: "Non-fiction film or program" },
        { word: "extraordinary", hint: "Very unusual or remarkable" },
        { word: "revolutionary", hint: "Involving major change" },
        { word: "unbelievable", hint: "Hard to believe" },
        { word: "entrepreneurship", hint: "Starting and running businesses" },
        { word: "philosophical", hint: "Relating to philosophy" },
        { word: "sustainability", hint: "Ability to maintain over time" }
    ]
};

let currentScrambleGame = {
    level: '',
    currentWord: null,
    score: 0,
    wordsCompleted: 0
};

// Start Scrambify game
function startScrambify(level) {
    currentScrambleGame.level = level;
    currentScrambleGame.score = 0;
    currentScrambleGame.wordsCompleted = 0;
    
    document.getElementById('scrambify-menu').style.display = 'none';
    document.getElementById('scrambify-game').style.display = 'block';
    document.getElementById('current-level').textContent = level.charAt(0).toUpperCase() + level.slice(1);
    document.getElementById('scramble-score').textContent = '0';
    
    loadNewScrambleWord();
}

// Back to Scrambify menu
function backToScrambifyMenu() {
    document.getElementById('scrambify-menu').style.display = 'block';
    document.getElementById('scrambify-game').style.display = 'none';
    clearScrambleFeedback();
}

// Load new scramble word
function loadNewScrambleWord() {
    const words = scrambleWords[currentScrambleGame.level];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    currentScrambleGame.currentWord = randomWord;
    
    displayScrambledWord(randomWord.word);
    clearScrambleFeedback();
    hideScrambleHint();
    
    document.getElementById('check-answer').style.display = 'inline-block';
    document.getElementById('next-word').style.display = 'none';
}

// Display scrambled word
function displayScrambledWord(word) {
    const container = document.getElementById('scrambled-letters');
    container.innerHTML = '';
    
    const letters = word.split('').sort(() => Math.random() - 0.5);
    
    letters.forEach(letter => {
        const letterTile = document.createElement('div');
        letterTile.classList.add('letter-tile');
        letterTile.textContent = letter.toUpperCase();
        letterTile.draggable = true;
        
        // Add drag event listeners
        letterTile.addEventListener('dragstart', handleDragStart);
        letterTile.addEventListener('dragend', handleDragEnd);
        letterTile.addEventListener('dragover', handleDragOver);
        letterTile.addEventListener('drop', handleDrop);
        
        container.appendChild(letterTile);
    });
}

// Drag and drop handlers
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    if (draggedElement && e.target.classList.contains('letter-tile') && e.target !== draggedElement) {
        const container = e.target.parentNode;
        const draggedIndex = Array.from(container.children).indexOf(draggedElement);
        const targetIndex = Array.from(container.children).indexOf(e.target);
        
        if (draggedIndex < targetIndex) {
            container.insertBefore(draggedElement, e.target.nextSibling);
        } else {
            container.insertBefore(draggedElement, e.target);
        }
    }
}

// Check scramble answer
function checkScrambleAnswer() {
    const container = document.getElementById('scrambled-letters');
    const letters = Array.from(container.children).map(tile => tile.textContent.toLowerCase()).join('');
    const correctWord = currentScrambleGame.currentWord.word;
    
    if (letters === correctWord) {
        showScrambleFeedback('Correct! Well done! 🎉', 'success');
        currentScrambleGame.score += getScoreForLevel(currentScrambleGame.level);
        currentScrambleGame.wordsCompleted++;
        document.getElementById('scramble-score').textContent = currentScrambleGame.score;
        
        document.getElementById('check-answer').style.display = 'none';
        document.getElementById('next-word').style.display = 'inline-block';
    } else {
        showScrambleFeedback('Not quite right. Try again! 🤔', 'error');
    }
}

// Get score for level
function getScoreForLevel(level) {
    switch (level) {
        case 'easy': return 10;
        case 'medium': return 20;
        case 'hard': return 30;
        default: return 10;
    }
}

// Show scramble hint
function showScrambleHint() {
    const hintDisplay = document.getElementById('scramble-hint');
    hintDisplay.textContent = `💡 Hint: ${currentScrambleGame.currentWord.hint}`;
    hintDisplay.classList.add('show');
}

// Hide scramble hint
function hideScrambleHint() {
    const hintDisplay = document.getElementById('scramble-hint');
    hintDisplay.classList.remove('show');
}

// Next scramble word
function nextScrambleWord() {
    loadNewScrambleWord();
}

// Show scramble feedback
function showScrambleFeedback(message, type) {
    const feedback = document.getElementById('scramble-feedback');
    feedback.textContent = message;
    feedback.className = `game-feedback ${type}`;
}

// Clear scramble feedback
function clearScrambleFeedback() {
    const feedback = document.getElementById('scramble-feedback');
    feedback.textContent = '';
    feedback.className = 'game-feedback';
}

// ==========================================
//          memorybo GAME
// ==========================================

// Memory game data
const memoryWords = [
    { word: 'rain', meaning: 'Water that falls from the sky' },
    { word: 'mountain', meaning: 'A large natural elevation of the earth\'s surface' },
    { word: 'ocean', meaning: 'A vast body of saltwater' },
    { word: 'forest', meaning: 'A large area covered with trees' },
    { word: 'desert', meaning: 'A dry barren area of land' },
    { word: 'river', meaning: 'A large natural stream of water' },
    { word: 'island', meaning: 'A piece of land surrounded by water' },
    { word: 'bridge', meaning: 'A structure that allows passage over an obstacle' },
    { word: 'castle', meaning: 'A large fortified building' },
    { word: 'library', meaning: 'A building containing books for reading' },
    { word: 'garden', meaning: 'A plot of ground for growing plants' },
    { word: 'market', meaning: 'A place where goods are sold' },
    { word: 'hospital', meaning: 'A place for medical treatment' },
    { word: 'school', meaning: 'An institution for education' },
    { word: 'theater', meaning: 'A building for dramatic performances' }
];

let currentMemoryGame = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    attempts: 0,
    totalPairs: 6
};

// Start memorybo game
function startmemorybo() {
    document.getElementById('memorybo-menu').style.display = 'none';
    document.getElementById('memorybo-game').style.display = 'block';
    
    initializeMemoryGame();
}

// Back to memorybo menu
function backTomemoryboMenu() {
    document.getElementById('memorybo-menu').style.display = 'block';
    document.getElementById('memorybo-game').style.display = 'none';
}

// Initialize memory game
function initializeMemoryGame() {
    currentMemoryGame.flippedCards = [];
    currentMemoryGame.matchedPairs = 0;
    currentMemoryGame.attempts = 0;
    
    // Select random word pairs
    const selectedWords = memoryWords.sort(() => 0.5 - Math.random()).slice(0, 6);
    
    // Create card pairs
    currentMemoryGame.cards = [];
    selectedWords.forEach((wordPair, index) => {
        currentMemoryGame.cards.push({
            id: `word-${index}`,
            content: wordPair.word,
            type: 'word',
            pairId: index
        });
        currentMemoryGame.cards.push({
            id: `meaning-${index}`,
            content: wordPair.meaning,
            type: 'meaning',
            pairId: index
        });
    });
    
    // Shuffle cards
    currentMemoryGame.cards = currentMemoryGame.cards.sort(() => 0.5 - Math.random());
    
    updateMemoryUI();
    renderMemoryBoard();
}

// Render memory board
function renderMemoryBoard() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    
    currentMemoryGame.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.cardIndex = index;
        cardElement.dataset.pairId = card.pairId;
        cardElement.dataset.type = card.type;
        cardElement.textContent = '?';
        
        cardElement.addEventListener('click', flipMemoryCard);
        
        board.appendChild(cardElement);
    });
}

// Flip memory card
function flipMemoryCard(e) {
    const card = e.target;
    const cardIndex = parseInt(card.dataset.cardIndex);
    
    // Don't allow flipping if card is already flipped or matched, or if two cards are already flipped
    if (card.classList.contains('flipped') || 
        card.classList.contains('matched') || 
        currentMemoryGame.flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.textContent = currentMemoryGame.cards[cardIndex].content;
    currentMemoryGame.flippedCards.push(cardIndex);
    
    // Check for match when two cards are flipped
    if (currentMemoryGame.flippedCards.length === 2) {
        setTimeout(checkMemoryMatch, 1000);
    }
}

// Check for memory match
function checkMemoryMatch() {
    const [firstIndex, secondIndex] = currentMemoryGame.flippedCards;
    const firstCard = document.querySelector(`[data-card-index="${firstIndex}"]`);
    const secondCard = document.querySelector(`[data-card-index="${secondIndex}"]`);
    
    const firstPairId = currentMemoryGame.cards[firstIndex].pairId;
    const secondPairId = currentMemoryGame.cards[secondIndex].pairId;
    
    currentMemoryGame.attempts++;
    
    if (firstPairId === secondPairId) {
        // Match found
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        currentMemoryGame.matchedPairs++;
        
        showMemoryFeedback('Great match! 🎉', 'success');
        
        // Check if game is complete
        if (currentMemoryGame.matchedPairs === currentMemoryGame.totalPairs) {
            setTimeout(() => {
                showMemoryFeedback(`Congratulations! You completed the game in ${currentMemoryGame.attempts} attempts! 🏆`, 'success');
            }, 500);
        }
    } else {
        // No match
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '?';
            secondCard.textContent = '?';
        }, 500);
        
        showMemoryFeedback('No match. Try again! 🤔', 'info');
    }
    
    currentMemoryGame.flippedCards = [];
    updateMemoryUI();
}

// Update memory UI
function updateMemoryUI() {
    document.getElementById('matches-found').textContent = currentMemoryGame.matchedPairs;
    document.getElementById('total-matches').textContent = currentMemoryGame.totalPairs;
    document.getElementById('attempts-count').textContent = currentMemoryGame.attempts;
}

// Reset memory game
function resetMemoryGame() {
    initializeMemoryGame();
    clearMemoryFeedback();
}

// Show memory feedback
function showMemoryFeedback(message, type) {
    const feedback = document.getElementById('memory-feedback');
    feedback.textContent = message;
    feedback.className = `game-feedback ${type}`;
    
    setTimeout(() => {
        if (type !== 'success' || !message.includes('Congratulations')) {
            clearMemoryFeedback();
        }
    }, 2000);
}

// Clear memory feedback
function clearMemoryFeedback() {
    const feedback = document.getElementById('memory-feedback');
    feedback.textContent = '';
    feedback.className = 'game-feedback';
}