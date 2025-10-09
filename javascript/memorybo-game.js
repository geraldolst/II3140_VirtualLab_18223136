// ==========================================
//          MEMORYBO GAME
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
    
    // Prevent flipping if card is already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Prevent flipping more than 2 cards
    if (currentMemoryGame.flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.textContent = currentMemoryGame.cards[cardIndex].content;
    currentMemoryGame.flippedCards.push(cardIndex);
    
    // Check for match when 2 cards are flipped
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
        // No match - flip cards back
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '?';
            secondCard.textContent = '?';
        }, 500);
        
        showMemoryFeedback('No match. Try again!', 'info');
    }
    
    // Reset flipped cards
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

// Export functions for global access
window.startmemorybo = startmemorybo;
window.backTomemoryboMenu = backTomemoryboMenu;
window.resetMemoryGame = resetMemoryGame;