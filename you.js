// DOM Elements
const cells = document.querySelectorAll('.cell');
const humanModeBtn = document.getElementById('humanMode');
const aiModeBtn = document.getElementById('aiMode');

// Game State Variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isVsComputer = false;
let aiDifficulty = 'easy';

// Initialize Game
function initializeGame() {
    humanModeBtn.addEventListener('click', () => {
        isVsComputer = false;
        resetGame();
        alert('Human vs Human mode selected!');
    });

    aiModeBtn.addEventListener('click', () => {
        isVsComputer = true;
        resetGame();
        alert('Human vs AI mode selected!');
        const difficulty = prompt('Choose AI difficulty (easy/medium/hard):');
        if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
            aiDifficulty = difficulty.toLowerCase();
        } else {
            aiDifficulty = 'easy';
            alert('Invalid difficulty selected. Defaulting to easy mode.');
        }
    });

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });
}

// Handle Cell Click
function handleCellClick(index) {
    if (board[index] === '' && gameActive) {
        makeMove(index);
        
        if (isVsComputer && gameActive) {
            setTimeout(() => {
                makeAiMove();
            }, 500);
        }
    }
}

// Make Move
function makeMove(position) {
    board[position] = currentPlayer;
    cells[position].textContent = currentPlayer;
    
    if (checkWinForPlayer(board, currentPlayer)) {
        gameActive = false;
        alert(`${currentPlayer} wins!`);
        return;
    }
    
    if (checkDraw()) {
        gameActive = false;
        alert("It's a draw!");
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// AI Move Logic
function makeAiMove() {
    let position;
    
    // Use probability to determine if AI uses minimax based on difficulty
    const useMinmax = Math.random() < getDifficultyProbability();
    
    if (useMinmax) {
        position = minimax([...board], 'O').position;
    } else {
        position = getRandomMove();
    }
    
    if (position !== null) {
        makeMove(position);
    }
}

function getDifficultyProbability() {
    switch(aiDifficulty) {
        case 'hard': return 1;      // 100% minimax
        case 'medium': return 0.7;  // 70% minimax
        default: return 0.3;        // 30% minimax
    }
}

// Minimax Algorithm
function minimax(boardState, player, depth = 0) {
    const availableMoves = boardState.reduce((acc, cell, idx) => {
        if (cell === '') acc.push(idx);
        return acc;
    }, []);
    
    // Terminal states
    if (checkWinForPlayer(boardState, 'X')) return { score: -10 + depth };
    if (checkWinForPlayer(boardState, 'O')) return { score: 10 - depth };
    if (availableMoves.length === 0) return { score: 0 };
    
    const moves = [];
    
    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.position = availableMoves[i];
        
        boardState[availableMoves[i]] = player;
        const result = minimax(boardState, player === 'O' ? 'X' : 'O', depth + 1);
        move.score = result.score;
        boardState[availableMoves[i]] = '';
        
        moves.push(move);
    }
    
    // Find best move
    return player === 'O' 
        ? moves.reduce((best, move) => move.score > best.score ? move : best, {score: -Infinity})
        : moves.reduce((best, move) => move.score < best.score ? move : best, {score: Infinity});
}

// Helper Functions
function getRandomMove() {
    const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    
    if (emptyCells.length === 0) return null;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkWinForPlayer(boardState, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    return winPatterns.some(pattern => 
        pattern.every(index => boardState[index] === player)
    );
}

function checkDraw() {
    return !board.includes('');
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
}

// Start the game
initializeGame();