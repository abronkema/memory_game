/*jshint esversion: 6*/

/*
 * Create a list that holds all of your cards
 */

 // TODO use this array of Font Awesome icon classes to generate the cards programmatically. 
const cards = [
    "fa fa-diamond", "fa fa-diamond",
    "fa fa-paper-plane-o", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-anchor",
    "fa fa-bolt", "fa fa-bolt",
    "fa fa-cube", "fa fa-cube",
    "fa fa-leaf", "fa fa-leaf",
    "fa fa-bicycle", "fa fa-bicycle",
    "fa fa-bomb", "fa fa-bomb",
];

const cardContainer = document.querySelector('.deck');
const cardDeck = document.querySelectorAll('.card');
// our temp array to hold clicked cards
let openCards = [];
let moves = 0;
let movesRating = 4;
const starsContainer = document.querySelector('.stars');
let starsContainerChildren = starsContainer.children;
let movesCountDisplay = document.querySelector('.moves');
const resetButton = document.querySelector('.restart');
const timerDisplay = document.querySelector('.timer');
const minutesDisplay = document.querySelector('.minutes');
const secondsDisplay = document.querySelector('.seconds');
let totalSeconds = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 /* randomize the icons to "shuffle" the deck, thanks to Matthew Cranford
https://matthewcranford.com/memory-game-walkthrough-part-4-shuffling-decks/
*/
function shuffleCards() {
    // grab all the cards in the deck, turn the NodeList into an array for shuffle()
        const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
        const shuffledCards = shuffle(cardsToShuffle);
    //append shuffled cards to the deck
        for (let card of shuffledCards) {
            cardContainer.append(card);
        }
    }
shuffleCards();
generateStars();
// removeStars();
//TODO: programmatically generate the cards using the list of icons
// function createCards(cards) {
//     for (let i = 0; i < cards.length; i++) {
//         let newCard = document.createElement('li');
//         cardContainer.appendChild(newCard);
//         newCard.classList.add("card");
//     }
// }


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// display cards when clicked, with the Event Listener on the entire deck, instead of individual items
cardContainer.addEventListener('click', function(event) {
    const clickTarget = event.target;

// validate click target is a card, and that temp array doesn't have 2 cards
    if (clickTarget.classList.contains('card') && openCards.length < 2) { 
        showCard(clickTarget);
        addOpenCards(clickTarget);
// once the temp array has 2 cards, check to see if they match
        if (openCards.length == 2) {
            checkForMatch();
            calculateMoveRating();
        }
    }
});
// adding the classes needed to display cards
function showCard(clickTarget) {
    clickTarget.classList.add('open', 'show');
}
// push clicked card to temp array
function addOpenCards(clickTarget) {
    openCards.push(clickTarget);
}
// check that the cards in temp array match
function checkForMatch() {
    if (
// check the <i> element, which is the first child element of the card that's clicked
        openCards[0].firstElementChild.className ===
        openCards[1].firstElementChild.className
    ) {
// if both cards have the same icon, add matching class and clear the temp array
        openCards[0].classList.add('match');
        openCards[1].classList.add('match');
        openCards = [];
    } else {
// if the cards do not match, wait 1s and remove the open/show classes to "flip" them over
        setTimeout(function() {
        flipCards(openCards[0]);
        flipCards(openCards[1]);
        openCards = [];
        }, 1000);
    }
    moveCounter();
}
// removing the classes from cards when they don't match in the temp array
function flipCards(card) {
    card.classList.remove('open', 'show');
}
/*
When a set of cards (2) are flipped and checkForMatch is invoked: 
the move counter should increment and 
reduce the star rating for every X number of moves
*/
function moveCounter(move) {
    moves += 1;
    movesCountDisplay.innerText = moves;
}

function calculateMoveRating() {
    if (moves <= 15) {
        movesRating = 4;
        console.log("movesRating: " + movesRating + ", moves: " + moves);
        removeStars();
        generateStars();
        return 4;
    } else if (moves > 15 && moves < 20) {
        movesRating = 3;
        console.log("movesRating: " + movesRating + ", moves: " + moves);
        removeStars();
        generateStars();
        return 3;
    } else if (moves >= 20 && moves < 25) {
        movesRating = 2;
        console.log("movesRating: " + movesRating + ", moves: " + moves);
        removeStars();
        generateStars();
        return 2;
    } else {
        movesRating = 1;
        console.log("movesRating: " + movesRating + ", moves: " + moves);
        removeStars();
        generateStars();
        return 1;
    }
}

function removeStars() {
    while (starsContainerChildren.length > 0) {
        for (let i = 0; i < starsContainerChildren.length; i++) {
            starsContainerChildren[i].remove();
        }
    }
}

function generateStars(moves) {
    for (var i = 1; i <= movesRating; i++) {
        let starItem = document.createElement('i');
        starItem.className = 'fa fa-star';
        let starListEl = document.createElement('li');
        starListEl.appendChild(starItem);
        starsContainer.appendChild(starListEl);
    }
}

function playTimer() {
    let timerUpdate = setInterval(playTimer, 1000);
    totalSeconds++;
    let minutes = Math.floor(totalSeconds/60);
    let seconds = Math.floor(totalSeconds - (minutes*60));
        if (seconds < 10) { //because I can't figure out an alt to toFixed() for a non-float
        minutesDisplay.innerHTML = minutes;
        secondsDisplay.innerHTML = '0' + seconds;
    } else {
    minutesDisplay.innerHTML = minutes;
    secondsDisplay.innerHTML = seconds;
    }
}

function resetTimer() {
    minutesDisplay.innerHTML = "0";
    secondsDisplay.innerHTML = "00";
    totalSeconds = 0;
}

/* 
@Sachin on Slack provided this helpful walkthrough
create an array of all elements with .card class
remove any classes making them visible
reset moves variable
*/
function resetGame() {
    const resetCards = Array.from(cardDeck);
    for (card of resetCards) {
        card.classList.remove('open', 'show', 'match');
    }
    movesCountDisplay.innerText = 0;
    moves = 0;
}

resetButton.addEventListener('click', function() {
    resetGame();
    shuffleCards();
    calculateMoveRating();
    resetTimer();
});

