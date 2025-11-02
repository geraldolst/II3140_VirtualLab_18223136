/**
 * Combined Games - Scrambobo & Memoribo
 * Integrated with Supabase Authentication
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Initialize Supabase
const supabaseUrl = 'https://kgskbtkxcdhqhfmpuxoe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnc2tidGt4Y2RocWhmbXB1eG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NTA5ODEsImV4cCI6MjA1MjMyNjk4MX0.VuJe36xKAVT4mJ1Hw4Daz7qHTaVPDU4bOYvxlJ9zXks';
const supabase = createClient(supabaseUrl, supabaseKey);

// Global User State
let currentUser = null;
let userProfile = null;

// ==============================
// 1. Authentication & User Profile
// ==============================

async function checkAuthAndLoadUser() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
            console.log('No active session');
            loadGuestMode();
            return;
        }
        
        currentUser = session.user;
        
        // Load user profile from database
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        
        if (!profileError && profile) {
            userProfile = profile;
            updateUserDisplay();
        } else {
            loadGuestMode();
        }
        
    } catch (error) {
        console.error('Auth check error:', error);
        loadGuestMode();
    }
}

function updateUserDisplay() {
    const userNameElement = document.getElementById('headerUserName');
    const userInitialElement = document.getElementById('userInitial');
    
    if (userProfile) {
        const displayName = userProfile.full_name || userProfile.email?.split('@')[0] || 'User';
        const initial = displayName.charAt(0).toUpperCase();
        
        if (userNameElement) userNameElement.textContent = displayName;
        if (userInitialElement) userInitialElement.textContent = initial;
    }
}

function loadGuestMode() {
    const userNameElement = document.getElementById('headerUserName');
    const userInitialElement = document.getElementById('userInitial');
    
    if (userNameElement) userNameElement.textContent = 'Guest';
    if (userInitialElement) userInitialElement.textContent = 'G';
}

// ==============================
// 2. Navigation Functions
// ==============================

function hideAllSections() {
    document.getElementById("intro-section").style.display = "none";
    document.getElementById("games-section").style.display = "none";
    document.getElementById("scrambobo-section").style.display = "none";
    document.getElementById("scrambobo-game-section").style.display = "none";
    document.getElementById("memoribo-section").style.display = "none";
}

window.showHome = function() {
    hideAllSections();
    document.getElementById("intro-section").style.display = "flex";
    document.getElementById("games-section").style.display = "block";
}

window.showScrambobo = function() {
    hideAllSections();
    document.getElementById("scrambobo-section").style.display = "block";
}

window.showMemoribo = function() {
    hideAllSections();
    document.getElementById("memoribo-section").style.display = "block";
    initMemoriboGame();
}

window.scrollToGames = function() {
    document.getElementById("games-section").scrollIntoView({ behavior: "smooth" });
}

// ==============================
// 3. Scrambobo Game Logic
// ==============================

const scramboboWords = {
    easy: [
        { word: "CAT", hint: "A common pet" },
        { word: "DOG", hint: "Man's best friend" },
        { word: "SUN", hint: "Star at the center of our solar system" },
        { word: "BOOK", hint: "You read it" },
        { word: "FISH", hint: "Lives in water" },
        { word: "TREE", hint: "Has leaves and branches" },
        { word: "BALL", hint: "Round object used in games" },
        { word: "DOOR", hint: "You open it to enter a room" },
        { word: "MILK", hint: "White liquid from cows" },
        { word: "BIRD", hint: "Animal that flies" }
    ],
    medium: [
        { word: "HAPPY", hint: "Feeling joy" },
        { word: "SWIFT", hint: "Moving fast" },
        { word: "BRAVE", hint: "Having courage" },
        { word: "GENTLE", hint: "Soft and kind" },
        { word: "BRIGHT", hint: "Full of light" },
        { word: "CLEVER", hint: "Smart and intelligent" },
        { word: "PLANET", hint: "We live on one" },
        { word: "GUITAR", hint: "A stringed instrument" },
        { word: "CASTLE", hint: "A large fortified building" },
        { word: "BRIDGE", hint: "Crosses over water" }
    ],
    hard: [
        { word: "COMPUTER", hint: "Electronic device for processing data" },
        { word: "KEYBOARD", hint: "Used for typing" },
        { word: "ELEPHANT", hint: "Largest land animal" },
        { word: "MOUNTAIN", hint: "A large natural elevation" },
        { word: "BUTTERFLY", hint: "Insect with colorful wings" },
        { word: "TELESCOPE", hint: "Used to see distant objects" },
        { word: "UMBRELLA", hint: "Protects from rain" },
        { word: "ADVENTURE", hint: "An exciting experience" },
        { word: "CHOCOLATE", hint: "Sweet brown candy" },
        { word: "STRAWBERRY", hint: "Red fruit with seeds outside" }
    ]
};

let scramboboState = {
    currentWord: {},
    currentLevel: "",
    score: 0,
    correctAnswers: 0,
    draggedItem: null
};

window.startScrambobo = function(level) {
    scramboboState.currentLevel = level;
    scramboboState.score = 0;
    scramboboState.correctAnswers = 0;
    
    hideAllSections();
    document.getElementById("scrambobo-game-section").style.display = "block";
    
    updateScramboboStats();
    loadScramboboWord(level);
}

function loadScramboboWord(level) {
    const feedback = document.getElementById("scrambobo-feedback");
    feedback.textContent = "";
    feedback.className = "game-feedback";

    const wordData = scramboboWords[level][Math.floor(Math.random() * scramboboWords[level].length)];
    scramboboState.currentWord = wordData;
    
    let scrambled = shuffleWord(wordData.word.split(''));
    
    const scrambledContainer = document.getElementById("scrambled-letters");
    scrambledContainer.innerHTML = '';

    scrambled.forEach((letter) => {
        let letterElement = document.createElement('div');
        letterElement.classList.add('letter-tile');
        letterElement.setAttribute('draggable', true);
        letterElement.textContent = letter;

        letterElement.addEventListener('dragstart', dragStart);
        letterElement.addEventListener('dragover', dragOver);
        letterElement.addEventListener('drop', drop);
        letterElement.addEventListener('dragend', dragEnd);

        scrambledContainer.appendChild(letterElement);
    });
}

function shuffleWord(wordArray) {
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    return wordArray;
}

function dragStart(event) {
    scramboboState.draggedItem = event.target;
    setTimeout(() => event.target.style.opacity = "0.5", 0);
}

function dragEnd(event) {
    event.target.style.opacity = "1";
    scramboboState.draggedItem = null;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('letter-tile')) {
        let container = target.parentNode;
        let targetLetterIndex = Array.from(container.children).indexOf(target);
        let draggedLetterIndex = Array.from(container.children).indexOf(scramboboState.draggedItem);

        if (draggedLetterIndex !== targetLetterIndex) {
            if (draggedLetterIndex < targetLetterIndex) {
                container.insertBefore(scramboboState.draggedItem, target.nextSibling);
            } else {
                container.insertBefore(scramboboState.draggedItem, target);
            }
        }
    }
}

window.checkScramboboAnswer = function() {
    let scrambledContainer = document.getElementById("scrambled-letters");
    let userWord = Array.from(scrambledContainer.children).map(letter => letter.textContent).join('');

    let feedback = document.getElementById("scrambobo-feedback");
    
    if (userWord === scramboboState.currentWord.word) {
        feedback.textContent = "🎉 Correct! Well done!";
        feedback.className = "game-feedback success";
        
        scramboboState.score += 10;
        scramboboState.correctAnswers++;
        updateScramboboStats();
        
        setTimeout(() => loadScramboboWord(scramboboState.currentLevel), 1500);
    } else {
        feedback.textContent = "❌ Try again!";
        feedback.className = "game-feedback error";
    }
}

window.giveScramboboHint = function() {
    let feedback = document.getElementById("scrambobo-feedback");
    feedback.textContent = `💡 Hint: ${scramboboState.currentWord.hint}`;
    feedback.className = "game-feedback hint";
}

window.nextScramboboQuestion = function() {
    loadScramboboWord(scramboboState.currentLevel);
}

function updateScramboboStats() {
    document.getElementById("scrambobo-score").textContent = scramboboState.score;
    document.getElementById("scrambobo-correct").textContent = scramboboState.correctAnswers;
}

// ==============================
// 4. Memoribo Game Logic
// ==============================

const memoriboWordPairs = [
    { word: "HAPPY", definition: "Feeling joy" },
    { word: "SWIFT", definition: "Moving fast" },
    { word: "BRAVE", definition: "Having courage" },
    { word: "GENTLE", definition: "Soft and kind" },
    { word: "BRIGHT", definition: "Full of light" },
    { word: "STRONG", definition: "Having power" },
    { word: "CLEVER", definition: "Smart and intelligent" },
    { word: "WONDER", definition: "Feeling of amazement" },
    { word: "PEACE", definition: "State of calm" },
    { word: "TRUST", definition: "Belief in someone" },
    { word: "DREAM", definition: "Hope for the future" },
    { word: "SMILE", definition: "Expression of happiness" }
];

let memoriboState = {
    cards: [],
    flippedCards: [],
    matchedCards: [],
    moves: 0,
    matches: 0,
    canFlip: true
};

function initMemoriboGame() {
    // Select random 6 word pairs
    let selectedPairs = [];
    let availablePairs = [...memoriboWordPairs];
    
    while (selectedPairs.length < 6 && availablePairs.length > 0) {
        let randomIndex = Math.floor(Math.random() * availablePairs.length);
        selectedPairs.push(availablePairs[randomIndex]);
        availablePairs.splice(randomIndex, 1);
    }

    // Create cards array
    memoriboState.cards = [];
    selectedPairs.forEach(pair => {
        memoriboState.cards.push({ text: pair.word, type: 'word', pair: pair.definition });
        memoriboState.cards.push({ text: pair.definition, type: 'definition', pair: pair.word });
    });

    // Shuffle cards
    memoriboState.cards.sort(() => 0.5 - Math.random());

    // Reset game state
    memoriboState.flippedCards = [];
    memoriboState.matchedCards = [];
    memoriboState.moves = 0;
    memoriboState.matches = 0;
    memoriboState.canFlip = true;

    // Render cards
    renderMemoriboCards();
    updateMemoriboStats();
}

function renderMemoriboCards() {
    let memoryGameContainer = document.getElementById('memory-game');
    memoryGameContainer.innerHTML = '';

    memoriboState.cards.forEach((card, index) => {
        let cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.text = card.text;
        cardElement.dataset.index = index;
        cardElement.dataset.type = card.type;
        cardElement.dataset.pair = card.pair;
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <i class="fas fa-question"></i>
                </div>
                <div class="card-back">
                    ${card.text}
                </div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => flipMemoriboCard(cardElement, index));
        memoryGameContainer.appendChild(cardElement);
    });

    document.getElementById('memoribo-feedback').textContent = '';
}

function flipMemoriboCard(cardElement, index) {
    if (!memoriboState.canFlip || 
        cardElement.classList.contains('flipped') || 
        memoriboState.matchedCards.includes(index)) {
        return;
    }

    cardElement.classList.add('flipped');
    memoriboState.flippedCards.push({ element: cardElement, index: index });

    if (memoriboState.flippedCards.length === 2) {
        memoriboState.moves++;
        updateMemoriboStats();
        checkMemoriboMatch();
    }
}

function checkMemoriboMatch() {
    memoriboState.canFlip = false;
    
    let [card1, card2] = memoriboState.flippedCards;
    let element1 = card1.element;
    let element2 = card2.element;

    if (element1.dataset.pair === element2.dataset.text && 
        element2.dataset.pair === element1.dataset.text) {
        // Match found!
        memoriboState.matchedCards.push(card1.index, card2.index);
        memoriboState.matches++;
        updateMemoriboStats();
        
        element1.classList.add('matched');
        element2.classList.add('matched');
        
        let feedback = document.getElementById('memoribo-feedback');
        feedback.textContent = '🎉 Match found!';
        feedback.className = 'game-feedback success';
        
        setTimeout(() => {
            feedback.textContent = '';
        }, 1500);

        memoriboState.flippedCards = [];
        memoriboState.canFlip = true;

        // Check if game is complete
        if (memoriboState.matchedCards.length === memoriboState.cards.length) {
            setTimeout(() => {
                let feedback = document.getElementById('memoribo-feedback');
                feedback.textContent = `🏆 Congratulations! You matched all cards in ${memoriboState.moves} moves!`;
                feedback.className = 'game-feedback success';
            }, 500);
        }
    } else {
        // No match
        setTimeout(() => {
            element1.classList.remove('flipped');
            element2.classList.remove('flipped');
            memoriboState.flippedCards = [];
            memoriboState.canFlip = true;
        }, 1000);
    }
}

function updateMemoriboStats() {
    document.getElementById('memoribo-matches').textContent = memoriboState.matches;
    document.getElementById('memoribo-moves').textContent = memoriboState.moves;
}

window.resetMemoriboGame = function() {
    initMemoriboGame();
}

// ==============================
// 5. Initialize on Page Load
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndLoadUser();
    showHome();
});
