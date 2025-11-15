//App.jsx
import React, { useState, useEffect, useRef } from 'react';
import PlayerThrow from './PlayerThrow';
import ComputerThrow from './ComputerThrow';
import ResultDisplay from './ResultDisplay';
import ScoreBoard from './ScoreBoard';
import ResetButton from './ResetButton';
import './App.css'; 

const CHOICES = [ 'rock', 'paper', 'scissors' ];
const SCORE_KEY = 'rpsScore';

//Help functions- checks for the winner
const determineWinner = (pChoice, cChoice) => {
    if (pChoice === cChoice) return 'Tie';
    if ((pChoice === 'rock' && cChoice === 'scissors') ||
        (pChoice === 'paper' && cChoice === 'rock') ||
        (pChoice === 'scissors' && cChoice === 'paper')) {
            return 'Win';
        }
        return 'Lose';
};

const loadScore = () => {
    const saved = localStorage.getItem(SCORE_KEY);
    return saved ? JSON.parse(saved) : { wins: 0, losses: 0, ties: 0 };
};

const saveScore = (newScore) => {
    localStorage.setItem(SCORE_KEY, JSON.stringify(newScore));
};

function App() {
    //State will replace global variables: playerChoice, computerChoice, result, score
    const [playerChoice, setPlayerChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [result, setResult] = useState(null); // 'Win', 'Lose', 'Tie', or null
    const [isAnimating, setIsAnimating] = useState(false);
    const [animatedChoice, setAnimatedChoice] = useState(null); // For the computer's cycling images
    const [score, setScore] = useState(loadScore());

    //useRef replaces the global variable 'thinkingInterval' to persist across renders
    const thinkingIntervalRef = useRef(null);

    //Initial score load (Equivalent to the old call in setUpGameListeners)
    useEffect(() => {
        saveScore(score); //Ensure score is saved on initialization/update
    }, [score]); 

    //This function handles the computer's turn and final result reveal
    const startComputerTurn = (pChoice) => {
        setIsAnimating(true);
        setComputerChoice(null);
        setResult(null);

        let index = 0;

        // Start the new animation interval here (replaces thinkingInterval = setInterval)
        thinkingIntervalRef.current = setInterval(() => {
            const choice = CHOICES[index % CHOICES.length];
            setAnimatedChoice(choice);
            index++;
        }, 500);

        // Set the timer for the total thinking duration (replaces setTimeout(displayFinalResult,3000))
        setTimeout(() => {
            clearInterval(thinkingIntervalRef.current); // Stop animation

            // Randomly select computer's final choice
            const finalComputerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
            setComputerChoice(finalComputerChoice);
            setIsAnimating(false);

            //Determine winner and update the score
            const finalResult = determineWinner(pChoice, finalComputerChoice);
            setResult(finalResult);

            setScore(prevScore => {
                const newScore = { ...prevScore };
                if (finalResult === 'Win') newScore.wins++;
                else if (finalResult === 'Lose') newScore.losses++;
                else newScore.ties++;
                return newScore;
            });

        }, 3000);
    };

    //The handler function passed to PlayerThrow (replaces handlePlayerThrow)
    const handlePlayerSelect = (choice) => {
        if (isAnimating) return; // Prevent multiple selections during animation

        setPlayerChoice(choice);
        startComputerTurn(choice);
    };

    // Resets the game state for a new round (replaces resetGame)
    const resetGame = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
        setIsAnimating(false);
        setAnimatedChoice(null);
        //This will make sure to clear any ongoing intervals if Play Again is clicked during animation
        if (thinkingIntervalRef.current) {
            clearInterval(thinkingIntervalRef.current);
        }
    };

    // Resets score (replaces resetScore)
    const resetScore = () => {
        if (window.confirm("Are you sure you want to reset the score?")) {
            const initialScore = { wins: 0, losses: 0, ties: 0 };
            setScore(initialScore);
            saveScore(initialScore);
            resetGame();
        }
    };

    return (
        <main>
            <PlayerThrow
                onSelect={handlePlayerSelect}
                playerChoice={playerChoice}
                isAnimating={isAnimating}
            />

            <ComputerThrow
                computerChoice={computerChoice}
                isAnimating={isAnimating}
                animatedChoice={animatedChoice}
            />
            <ResultDisplay
                result={result}
                isAnimating={isAnimating}
                onPlayAgain={resetGame}
            />

            <ScoreBoard score={score} />

            <ResetButton onResetScore={resetScore} />
        </main> 
    );
}

export default App;