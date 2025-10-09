// ==========================================
//          SCRAMBOBO GAME
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

// Start Scrambobo game
function startScrambobo(level) {
    currentScrambleGame.level = level;
    currentScrambleGame.score = 0;
    currentScrambleGame.wordsCompleted = 0;
    
    document.getElementById('scrambobo-menu').style.display = 'none';
    document.getElementById('scrambobo-game').style.display = 'block';
    document.getElementById('current-level').textContent = level.charAt(0).toUpperCase() + level.slice(1);
    document.getElementById('scramble-score').textContent = '0';
    
    loadNewScrambleWord();
}

// Back to Scrambobo menu
function backToScramboboMenu() {
    document.getElementById('scrambobo-menu').style.display = 'block';
    document.getElementById('scrambobo-game').style.display = 'none';
    clearScrambleFeedback();
}

// Load new scramble word
function loadNewScrambleWord() {
    const words = scrambleWords[currentScrambleGame.level];
    const randomIndex = Math.floor(Math.random() * words.length);
    currentScrambleGame.currentWord = words[randomIndex];
    
    displayScrambledWord(currentScrambleGame.currentWord.word);
    hideScrambleHint();
    clearScrambleFeedback();
    
    // Hide next button and show check button
    document.getElementById('next-word').style.display = 'none';
    document.getElementById('check-answer').style.display = 'inline-block';
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
    const tiles = container.querySelectorAll('.letter-tile');
    const userAnswer = Array.from(tiles).map(tile => tile.textContent).join('').toLowerCase();
    
    if (userAnswer === currentScrambleGame.currentWord.word.toLowerCase()) {
        const points = getScoreForLevel(currentScrambleGame.level);
        currentScrambleGame.score += points;
        currentScrambleGame.wordsCompleted++;
        
        document.getElementById('scramble-score').textContent = currentScrambleGame.score;
        
        showScrambleFeedback(`Correct! +${points} points`, 'success');
        
        // Hide check button and show next button
        document.getElementById('check-answer').style.display = 'none';
        document.getElementById('next-word').style.display = 'inline-block';
    } else {
        showScrambleFeedback('Incorrect! Try again or use a hint.', 'error');
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

// Export functions for global access
window.startScrambobo = startScrambobo;
window.backToScramboboMenu = backToScramboboMenu;
window.checkScrambleAnswer = checkScrambleAnswer;
window.showScrambleHint = showScrambleHint;
window.nextScrambleWord = nextScrambleWord;