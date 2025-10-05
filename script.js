/**
 * CSC 372-01 -Assignment 5: Rock, Paper, Scissors Game
 * Name: Sarah Robinson
 * Date: 10.03.2025
 * * This script implements the Rock, Paper, Scissors game using event listeners,
 * setTimeout, and setInterval callbacks for the computer's turn and score persistence.
 */
 
const CHOICES = ['rock', 'paper', 'scissors'];


// Using the local path from HTML for consistency

const QUESTION_MARK_SRC = `https://ser723.github.io/assignment-5/Image/question-mark.png`;
let playerChoice = null;
let computerChoice = null;
let thinkingInterval = null;

const SCORE_KEY = 'rpsScore';
let score = {
    wins: 0,
    losses: 0,
    ties: 0 
};

// --- DOM Element Selectors ---
const playerChoiceImgs = document.querySelectorAll('#player-throw img');
const computerImg = document.getElementById('computer-choice-img');
const outcomeMessage = document.getElementById('result-message');
const playAgainButton = document.getElementById('play-again-button');
const resetButton = document.getElementById('reset-score-button');

const winsCount = document.getElementById('wins-count');
const lossesCount = document.getElementById('losses-count');
const tiesCount = document.getElementById('ties-count');


// --- Main Game Logic ---

/** Winner based on the two throws. */
function determineWinner(pChoice, cChoice) {
    if (pChoice === cChoice) {
        return 'tie';
    } else if (
        (pChoice === 'rock' && cChoice === 'scissors') ||
        (pChoice === 'paper' && cChoice === 'rock') ||
        (pChoice === 'scissors' && cChoice === 'paper')
    ) {
        return 'player';
    } else {
        return 'computer';
    }
}

/** Updates the score object and displays the new totals. */
function updateScore(result) {
    if (result === 'player') {
        score.wins++;
        outcomeMessage.textContent = 'YOU WIN!';
        outcomeMessage.style.color = 'green';
    } else if (result === 'computer') {
        score.losses++;
        outcomeMessage.textContent = 'COMPUTER WINS!';
        outcomeMessage.style.color = 'red';
    } else {
        score.ties++;
        outcomeMessage.textContent = "IT'S A TIE!";
        outcomeMessage.style.color = 'blue';
    }

    // Update the DOM elements for the score display
    winsCount.textContent = score.wins;
    lossesCount.textContent = score.losses;
    tiesCount.textContent = score.ties;

    saveScore(); // Score is saved after each round
}

// --- Computer Turn Logic (Callbacks) ---

/**
 * **CALLBACK** for setTimeout: 
 * Stops thinking, randomly selects throw, updates image, and scores.
 */
function displayFinalResult() {
    // Stop the "thinking" animation
    clearInterval(thinkingInterval);

    //Randomly select computer's choice
    const randomIndex = Math.floor(Math.random() * CHOICES.length);
    computerChoice = CHOICES[randomIndex];
    
    //Display the final image
    computerImg.src = `https://ser723.github.io/assignment-5/Image/${computerChoice}.png`;
    //Determine winner and update score
    const result = determineWinner(playerChoice, computerChoice); 
    updateScore(result);

    // Restart the game
    setGameActive(true);
}

/**
 * Starts the 3-second "thinking" animation and
 *  sets the timer for the final result.
 */
function startComputerThinking() {
    let index = 0;

    if (thinkingInterval) {
        clearInterval(thinkingInterval);
    }

    // **CALLBACK** for setInterval: Cycles image every 500ms
    thinkingInterval = setInterval(() => {
        const choice = CHOICES[index % CHOICES.length];
        computerImg.src = `image/${choice}.png`;
        index++;
    }, 500); // half a second

    // Sets the timer for the total thinking duration (3 seconds)
    setTimeout(displayFinalResult, 3000); 
}

// --- Event Handlers---

/** Enables or disables user interaction elements based on game state. */
function setGameActive(active) {
    playerChoiceImgs.forEach(img => {
        img.style.pointerEvents = active ? 'auto' : 'none';
        img.style.opacity = active ? '1.0' : '0.5';
    });
    // The Play Again button should only appear when the game is inactive.
    playAgainButton.style.display = active ? 'none' : 'block';
}

/** **CALLBACK** for click: Main function triggered when a player makes a choice. */
function handlePlayerThrow(event) {
    setGameActive(false);

    // Highlight selected choice
    playerChoiceImgs.forEach(img => img.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    playerChoice = event.currentTarget.getAttribute('data-choice');

    // Display status message
    outcomeMessage.textContent = 'Computer thinking...';
    outcomeMessage.style.color = '#333';

    // Start the computer's turn
    startComputerThinking();
}

/** Resets the game state for a new round. */
function resetGame() {
    playerChoice = null;
    computerChoice = null;

    // Display reset
    playerChoiceImgs.forEach(img => img.classList.remove('selected'));
    computerImg.src = QUESTION_MARK_SRC;
    outcomeMessage.textContent = 'Make your selection!';
    outcomeMessage.style.color = '#333';

    setGameActive(true); 
}

// --- Score Tracking Functions (Extra Credit) ---

/** Loads score from local storage if available. */
function loadScore() {
    const savedScore = localStorage.getItem(SCORE_KEY);
    if (savedScore) {
        score = JSON.parse(savedScore);
    }
    // Update the score display (Initial load)
    winsCount.textContent = score.wins;
    lossesCount.textContent = score.losses;
    tiesCount.textContent = score.ties;
}

/** Saves current score to localStorage. */
function saveScore() {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
}

/** Resets score and updates display. */
function resetScore() {
    if (!confirm("Are you sure you want to reset the score history?")) {
        return;
    }
    score = { wins: 0, losses: 0, ties: 0 };
    saveScore();
    loadScore();
    resetGame();
}

// Initialization of Event Listeners

/** Function to attach all event listerners to DOM elements. */
function setUpGameListeners() {

    // Attach click listeners to player choice images
    playerChoiceImgs.forEach(img => {
        img.addEventListener('click',handlePlayerThrow);
    });

    // Attach listeners to buttons
    playAgainButton.addEventListener('click', resetGame);
    resetButton.addEventListener('click', resetScore);

    loadScore();
    setGameActive(true);
}

document.addEventListener('DOMContentLoaded', setUpGameListeners);