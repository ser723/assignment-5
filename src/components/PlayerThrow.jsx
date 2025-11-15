//PlayerThrow.jsx
import React from 'react';
import './PlayerThrow.css'; // For the .selected class styling

const throws =['rock', 'paper', 'scissors'];

function PlayerThrow({ onSelect, playerChoice, isAnimating }) {
    return (
       <section id="player-throw">
            <h2>Your Throw: Choose your weapon!</h2>
            <div className="throw-options" style={{ pointerEvents: isAnimating ? 'none' : 'auto' }}>
                {throws.map(throwName => (
                    <img 
                        key={throwName}
                        src={`/images/${throwName}.png`} // Use relative path as required
                        alt={throwName}
                        data-choice={throwName}
                        onClick={() => onSelect(throwName)}
                        className={playerChoice === throwName ? 'selected' : ''}
                        style={{ opacity: isAnimating && playerChoice !== throwName ? '0.5' : '1.0' }}
                    />
                ))}
            </div>
        </section>
    );
}

export default PlayerThrow;