//ComputerThrow.jsx
import React from 'react';
// question-mark.png is going to be in pumblic/images
const QUESTiION_MARK_SRC = '/images/question-mark.png';

function ComputerThrow({ computerChoice, isAnimating, animatedChoice }) {
    let displaySrc = QUESTiION_MARK_SRC;
    let altText = "Computer's choice";

    if (isAnimating && animatedChoice) {
        //Display the cycling choice during animation
        imgSrc = `/images/${animatedChoice}.png`;
        altText = "Computer is thinking...";
    } else if (computerChoice) {
        //Displays the final choice
        imgSrc = `/images/${computerChoice}.png`;
        altText = `Computer chose ${computerChoice}`;
    }

   return (
        <section id="computer-throw">
            <h2>Computer's Throw:</h2>
            <img 
                src={imgSrc} 
                alt={altText} 
                id="computer-choice-img" 
            />
        </section>
    );
}

export default ComputerThrow;