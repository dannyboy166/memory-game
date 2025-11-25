// ============================================
// 🎮 SASCO GAMES - SOUND EFFECTS & CONFETTI
// ============================================

// Load audio files
const audioFiles = {
    flip: new Audio('audio/sfx/flip.wav'),
    match: new Audio('audio/sfx/match.wav'),
    wrong: new Audio('audio/sfx/wrong.wav'),
    win: new Audio('audio/sfx/win.mp3'),
    highscore: new Audio('audio/sfx/highscore.mp3'),
    background: new Audio('audio/music/background.mp3')
};

// Set background music to loop
audioFiles.background.loop = true;
audioFiles.background.volume = 0.3; // 30% volume for background

// Set volumes for sound effects
audioFiles.flip.volume = 0.5;
audioFiles.match.volume = 0.6;
audioFiles.wrong.volume = 0.5;
audioFiles.win.volume = 0.7;
audioFiles.highscore.volume = 0.7;

// Sound effects
function playFlipSound() {
    audioFiles.flip.currentTime = 0; // Reset to start
    audioFiles.flip.play().catch(e => console.log('Audio play failed:', e));
}

function playMatchSound() {
    audioFiles.match.currentTime = 0;
    audioFiles.match.play().catch(e => console.log('Audio play failed:', e));
}

function playWrongSound() {
    audioFiles.wrong.currentTime = 0;
    audioFiles.wrong.play().catch(e => console.log('Audio play failed:', e));
}

function playWinSound() {
    audioFiles.win.currentTime = 0;
    audioFiles.win.play().catch(e => console.log('Audio play failed:', e));
}

function playHighScoreSound() {
    audioFiles.highscore.currentTime = 0;
    audioFiles.highscore.play().catch(e => console.log('Audio play failed:', e));
}

// Confetti celebration
function celebrateWin() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// Encouraging messages - positioned at TOP of screen, outside game area
function showMessage(text, color = '#22c55e') {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: ${color};
        color: white;
        padding: 15px 35px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease-out;
        font-family: 'Gloria Hallelujah', cursive;
    `;
    document.body.appendChild(message);
    setTimeout(() => {
        message.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => message.remove(), 300);
    }, 1200);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        0% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// ORIGINAL GAME CODE
// ============================================

// cards array holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card];

// deck of all cards in game
const deck = document.getElementById("card-deck");

// declaring move variable
let moves = 0;
let counter = document.querySelector(".moves");

// declare variables for star icons
const stars = document.querySelectorAll(".fa-star");

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

 // stars list
 let starsList = document.querySelectorAll(".stars li");

 // close icon in modal
 let closeicon = document.querySelector(".close");

 // declare modal
 let modal = document.getElementById("popup1")

 // array for opened cards
var openedCards = [];

// Streak/combo tracking
let currentStreak = 0;
let streakDisplay = null;
let streakCount = null;

// Multiplayer mode tracking
let isMultiplayer = false;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1Name = "Player 1";
let player2Name = "Player 2";


// @description shuffles cards
// @param {array}
// @returns shuffledarray
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
};


// @description shuffles cards when page is refreshed / loads
document.body.onload = startGame();


// @description function to start a new play
function startGame(){

    // Clear any pending unmatched timeouts to prevent errors
    if (unmatchedTimeout) {
        clearTimeout(unmatchedTimeout);
    }

    // empty the openCards array
    openedCards = [];

    // Reset streak counter
    currentStreak = 0;
    if (!streakDisplay) {
        streakDisplay = document.getElementById('streakDisplay');
        streakCount = document.getElementById('streakCount');
    }
    streakDisplay.style.display = 'none';
    streakCount.textContent = '0';

    // Reset multiplayer scores
    if (isMultiplayer) {
        currentPlayer = 1;
        player1Score = 0;
        player2Score = 0;
        updateMultiplayerUI();
    }

    // shuffle deck
    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled", "unmatched");
        // Reset card background to grey
        cards[i].style.background = '';
    }
    // reset moves
    moves = 0;
    counter.innerHTML = moves;
    // reset rating
    for (var i= 0; i < stars.length; i++){
        stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    //reset timer
    second = 0;
    minute = 0;
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}


// @description toggles open and show class to display cards
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");

    // Apply the card's unique color when opened
    if (this.classList.contains("open")) {
        const cardColor = this.getAttribute('data-color');
        if (cardColor) {
            this.style.background = cardColor;
        }
    }

    playFlipSound(); // 🔊 Play flip sound!
};


// @description add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
    var len = openedCards.length;
    if(len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            matched();
        } else {
            unmatched();
        }
    }
};


// @description when cards match
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");

    // Create sparkle particles on both matched cards
    createSparkles(openedCards[0]);
    createSparkles(openedCards[1]);

    openedCards = [];

    // Multiplayer: Award point to current player (don't switch turn!)
    if (isMultiplayer) {
        if (currentPlayer === 1) {
            player1Score++;
        } else {
            player2Score++;
        }
        updateMultiplayerUI();
    }

    // Increment streak
    currentStreak++;
    updateStreakDisplay();

    // 🎉 Play match sound and show message!
    playMatchSound();

    // Show streak-based or player messages
    let message;
    if (isMultiplayer) {
        const currentName = currentPlayer === 1 ? player1Name : player2Name;
        message = `${currentName} scored! 🎉`;
    } else if (currentStreak >= 5) {
        message = "🔥 ON FIRE! " + currentStreak + " in a row!";
    } else if (currentStreak >= 3) {
        message = "⚡ STREAK! " + currentStreak + " matches!";
    } else {
        const messages = ["Great match! 🌟", "Awesome! 🎉", "Perfect! ⭐", "Nice one! 💫", "Brilliant! ✨"];
        message = messages[Math.floor(Math.random() * messages.length)];
    }
    showMessage(message, '#22c55e');

    // Note: In multiplayer, player keeps their turn after a match!
}

// Update streak display
function updateStreakDisplay() {
    if (currentStreak >= 2) {
        streakDisplay.style.display = 'flex';
        streakCount.textContent = currentStreak;
        // Add pulse animation to streak counter
        streakCount.style.animation = 'none';
        setTimeout(() => {
            streakCount.style.animation = 'pulse 0.5s ease';
        }, 10);
    }
}

// Create sparkle particle effect
function createSparkles(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create 8 sparkles radiating outward
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = centerX + 'px';
        sparkle.style.top = centerY + 'px';

        // Calculate random direction
        const angle = (i * 45) + (Math.random() * 30 - 15); // Spread evenly with randomness
        const distance = 50 + Math.random() * 30;
        const tx = Math.cos(angle * Math.PI / 180) * distance;
        const ty = Math.sin(angle * Math.PI / 180) * distance;

        sparkle.style.setProperty('--tx', tx + 'px');
        sparkle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => sparkle.remove(), 800);
    }
}


// Track unmatched timeout so we can clear it on restart
var unmatchedTimeout;

// description when cards don't match
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();

    // Reset streak on wrong match
    currentStreak = 0;
    streakDisplay.style.display = 'none';

    // 🔊 Play wrong sound and show message!
    playWrongSound();
    const messages = ["Try again! 💪", "Keep going! 🎯", "Almost! 🌈", "You got this! 🚀", "So close! 🌟", "Nice try! 💫"];
    showMessage(messages[Math.floor(Math.random() * messages.length)], '#f97316');

    unmatchedTimeout = setTimeout(function(){
        if (openedCards[0] && openedCards[1]) {
            openedCards[0].classList.remove("show", "open", "no-event","unmatched");
            openedCards[1].classList.remove("show", "open", "no-event","unmatched");
            // Reset to grey card back
            openedCards[0].style.background = '';
            openedCards[1].style.background = '';
        }
        enable();
        openedCards = [];

        // Multiplayer: Switch turns on wrong match
        if (isMultiplayer) {
            switchPlayer();
        }
    },1100);
}


// @description disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


// @description enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}


// @description count player's moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0; 
        hour = 0;
        startTimer();
    }
    // setting rates based on moves
    if (moves > 8 && moves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "collapse";
            }
        }
    }
}


// @description game timer
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}


// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
    // Check if all cards are matched (dynamic based on difficulty)
    const totalCards = cards.length;
    if (matchedCard.length == totalCards){
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // 🎉 CELEBRATE WITH CONFETTI AND SOUNDS!
        playWinSound();
        celebrateWin();

        // Multiplayer: Announce winner!
        if (isMultiplayer) {
            let winnerMessage;
            if (player1Score > player2Score) {
                winnerMessage = `🏆 ${player1Name} WINS! 🏆<br>${player1Score} vs ${player2Score}`;
            } else if (player2Score > player1Score) {
                winnerMessage = `🏆 ${player2Name} WINS! 🏆<br>${player2Score} vs ${player1Score}`;
            } else {
                winnerMessage = `🤝 IT'S A TIE! 🤝<br>${player1Score} - ${player2Score}`;
            }
            document.querySelector('.content-1').innerHTML = winnerMessage;
            document.querySelector('.content-2').innerHTML = `<p>Great game! Play again?</p>`;
        } else {
            // Single player mode - show normal stats
            // 🏆 Save high scores!
            saveHighScore();

            // declare star rating variable
            var starRating = document.querySelector(".stars").innerHTML;

            //showing move, rating, time on modal
            document.querySelector('.content-1').innerHTML = "Congratulations you're a winner 🎉🎉";
            document.getElementById("finalMove").innerHTML = moves;
            document.getElementById("starRating").innerHTML = starRating;
            document.getElementById("totalTime").innerHTML = finalTime;
        }

        // show congratulations modal
        modal.classList.add("show");

        //closeicon on modal
        closeModal();
    };
}


// @description close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}


// @desciption for user to play Again 
function playAgain(){
    modal.classList.remove("show");
    startGame();
}


// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",congratulations);
};


// ============================================
// 🎵 BACKGROUND MUSIC & HIGH SCORES & DIFFICULTY
// ============================================

// Background music control
let musicPlaying = true; // Default to on

function playBackgroundMusic() {
    if (musicPlaying) return;
    musicPlaying = true;
    audioFiles.background.play().catch(e => {
        console.log('Background music play failed:', e);
        musicPlaying = false;
    });
    document.getElementById('musicToggle').textContent = '🔊 Music On';
}

// Auto-start background music on page load (after user interaction)
window.addEventListener('load', function() {
    // Try to auto-play (will only work after user clicks something due to browser policies)
    document.addEventListener('click', function startMusic() {
        if (musicPlaying && audioFiles.background.paused) {
            audioFiles.background.play().catch(e => console.log('Auto-play prevented:', e));
        }
        // Remove listener after first click
        document.removeEventListener('click', startMusic);
    }, { once: true });
});

function stopBackgroundMusic() {
    musicPlaying = false;
    audioFiles.background.pause();
    audioFiles.background.currentTime = 0;
    document.getElementById('musicToggle').textContent = '🔇 Music Off';
}

function toggleMusic() {
    if (musicPlaying) {
        stopBackgroundMusic();
    } else {
        playBackgroundMusic();
    }
}

// Difficulty system - dynamically generate cards based on grid size
let currentDifficulty = '4x4';

// High Scores Management - Per Difficulty
function loadHighScores() {
    const difficulty = currentDifficulty;
    const bestTime = localStorage.getItem(`bestTime_${difficulty}`) || '--';
    const bestMoves = localStorage.getItem(`bestMoves_${difficulty}`) || '--';
    document.getElementById('bestTime').textContent = bestTime;
    document.getElementById('bestMoves').textContent = bestMoves;
}

function saveHighScore() {
    const difficulty = currentDifficulty;
    const currentMoves = moves;
    const currentTime = finalTime;
    let isNewHighScore = false;

    // Save best moves (lowest is best) for this difficulty
    const savedBestMoves = localStorage.getItem(`bestMoves_${difficulty}`);
    if (!savedBestMoves || savedBestMoves === '--' || currentMoves < parseInt(savedBestMoves)) {
        localStorage.setItem(`bestMoves_${difficulty}`, currentMoves);
        document.getElementById('bestMoves').textContent = currentMoves;
        isNewHighScore = true;
    }

    // Save best time (convert to seconds for comparison) for this difficulty
    const timeInSeconds = minute * 60 + second;
    const savedBestTimeSeconds = localStorage.getItem(`bestTimeSeconds_${difficulty}`);
    if (!savedBestTimeSeconds || timeInSeconds < parseInt(savedBestTimeSeconds)) {
        localStorage.setItem(`bestTime_${difficulty}`, currentTime);
        localStorage.setItem(`bestTimeSeconds_${difficulty}`, timeInSeconds);
        document.getElementById('bestTime').textContent = currentTime;
        isNewHighScore = true;
    }

    // Play special sound if new high score achieved
    if (isNewHighScore) {
        setTimeout(() => playHighScoreSound(), 1000);
    }
}

// Fix initial grid layout on page load - regenerate cards properly
window.addEventListener('load', function() {
    // Wait a bit for DOM to be ready, then regenerate the default 4x4 grid
    setTimeout(() => {
        changeDifficulty();
        updateColorDebugger(); // Show initial color palette
    }, 100);
});

// Card Themes
const themes = {
    australian: [
        {name: 'kangaroo', emoji: '🦘', display: 'Kangaroo'},
        {name: 'koala', emoji: '🐨', display: 'Koala'},
        {name: 'crocodile', emoji: '🐊', display: 'Crocodile'},
        {name: 'snake', emoji: '🐍', display: 'Snake'},
        {name: 'turtle', emoji: '🐢', display: 'Sea Turtle'},
        {name: 'shark', emoji: '🦈', display: 'Shark'},
        {name: 'dolphin', emoji: '🐬', display: 'Dolphin'},
        {name: 'whale', emoji: '🐋', display: 'Whale'},
        {name: 'eagle', emoji: '🦅', display: 'Wedge-tailed Eagle'},
        {name: 'parrot', emoji: '🦜', display: 'Parrot'},
        {name: 'platypus', emoji: '🦫', display: 'Platypus'},
        {name: 'spider', emoji: '🕷️', display: 'Spider'},
        {name: 'boomerang', emoji: '🪃', display: 'Boomerang'},
        {name: 'surfboard', emoji: '🏄', display: 'Surfing'},
        {name: 'beach', emoji: '🏖️', display: 'Beach'},
        {name: 'flag', emoji: '🇦🇺', display: 'Australian Flag'},
        {name: 'operahouse', emoji: '🎭', display: 'Opera House'},
        {name: 'cricket', emoji: '🏏', display: 'Cricket'},
        {name: 'football', emoji: '🏉', display: 'Rugby'},
        {name: 'tree', emoji: '🌳', display: 'Eucalyptus'},
        {name: 'flower', emoji: '🌸', display: 'Waratah'},
        {name: 'sun', emoji: '☀️', display: 'Aussie Sun'},
        {name: 'bbq', emoji: '🍖', display: 'BBQ'},
        {name: 'shrimp', emoji: '🦐', display: 'Prawns'}
    ],
    animals: [
        {name: 'dog', emoji: '🐶', display: 'Dog'},
        {name: 'cat', emoji: '🐱', display: 'Cat'},
        {name: 'cow', emoji: '🐮', display: 'Cow'},
        {name: 'pig', emoji: '🐷', display: 'Pig'},
        {name: 'horse', emoji: '🐴', display: 'Horse'},
        {name: 'sheep', emoji: '🐑', display: 'Sheep'},
        {name: 'chicken', emoji: '🐔', display: 'Chicken'},
        {name: 'duck', emoji: '🦆', display: 'Duck'},
        {name: 'rabbit', emoji: '🐰', display: 'Rabbit'},
        {name: 'frog', emoji: '🐸', display: 'Frog'},
        {name: 'bear', emoji: '🐻', display: 'Bear'},
        {name: 'panda', emoji: '🐼', display: 'Panda'},
        {name: 'lion', emoji: '🦁', display: 'Lion'},
        {name: 'tiger', emoji: '🐯', display: 'Tiger'},
        {name: 'elephant', emoji: '🐘', display: 'Elephant'},
        {name: 'giraffe', emoji: '🦒', display: 'Giraffe'},
        {name: 'zebra', emoji: '🦓', display: 'Zebra'},
        {name: 'monkey', emoji: '🐵', display: 'Monkey'},
        {name: 'penguin', emoji: '🐧', display: 'Penguin'},
        {name: 'owl', emoji: '🦉', display: 'Owl'},
        {name: 'butterfly', emoji: '🦋', display: 'Butterfly'},
        {name: 'bee', emoji: '🐝', display: 'Bee'},
        {name: 'ladybug', emoji: '🐞', display: 'Ladybug'},
        {name: 'snail', emoji: '🐌', display: 'Snail'}
    ],
    space: [
        {name: 'rocket', emoji: '🚀', display: 'Rocket'},
        {name: 'satellite', emoji: '🛰️', display: 'Satellite'},
        {name: 'ufo', emoji: '🛸', display: 'UFO'},
        {name: 'alien', emoji: '👽', display: 'Alien'},
        {name: 'planet', emoji: '🪐', display: 'Planet'},
        {name: 'earth', emoji: '🌍', display: 'Earth'},
        {name: 'moon', emoji: '🌙', display: 'Moon'},
        {name: 'star', emoji: '⭐', display: 'Star'},
        {name: 'comet', emoji: '☄️', display: 'Comet'},
        {name: 'sun', emoji: '☀️', display: 'Sun'},
        {name: 'milkyway', emoji: '🌌', display: 'Milky Way'},
        {name: 'telescope', emoji: '🔭', display: 'Telescope'},
        {name: 'astronaut', emoji: '👨‍🚀', display: 'Astronaut'},
        {name: 'astronaut2', emoji: '👩‍🚀', display: 'Astronaut'},
        {name: 'fullmoon', emoji: '🌕', display: 'Full Moon'},
        {name: 'crescentmoon', emoji: '🌙', display: 'Crescent Moon'},
        {name: 'shooting', emoji: '🌠', display: 'Shooting Star'},
        {name: 'ringed', emoji: '🪐', display: 'Ringed Planet'},
        {name: 'meteor', emoji: '☄️', display: 'Meteor'},
        {name: 'nebula', emoji: '🌌', display: 'Nebula'},
        {name: 'blackhole', emoji: '🕳️', display: 'Black Hole'},
        {name: 'constellation', emoji: '✨', display: 'Constellation'},
        {name: 'spaceship', emoji: '🚀', display: 'Spaceship'},
        {name: 'mars', emoji: '🔴', display: 'Mars'}
    ],
    food: [
        {name: 'pizza', emoji: '🍕', display: 'Pizza'},
        {name: 'burger', emoji: '🍔', display: 'Burger'},
        {name: 'fries', emoji: '🍟', display: 'Fries'},
        {name: 'hotdog', emoji: '🌭', display: 'Hot Dog'},
        {name: 'taco', emoji: '🌮', display: 'Taco'},
        {name: 'icecream', emoji: '🍦', display: 'Ice Cream'},
        {name: 'donut', emoji: '🍩', display: 'Donut'},
        {name: 'cookie', emoji: '🍪', display: 'Cookie'},
        {name: 'cake', emoji: '🍰', display: 'Cake'},
        {name: 'cupcake', emoji: '🧁', display: 'Cupcake'},
        {name: 'apple', emoji: '🍎', display: 'Apple'},
        {name: 'banana', emoji: '🍌', display: 'Banana'},
        {name: 'strawberry', emoji: '🍓', display: 'Strawberry'},
        {name: 'watermelon', emoji: '🍉', display: 'Watermelon'},
        {name: 'grapes', emoji: '🍇', display: 'Grapes'},
        {name: 'orange', emoji: '🍊', display: 'Orange'},
        {name: 'pineapple', emoji: '🍍', display: 'Pineapple'},
        {name: 'carrot', emoji: '🥕', display: 'Carrot'},
        {name: 'broccoli', emoji: '🥦', display: 'Broccoli'},
        {name: 'corn', emoji: '🌽', display: 'Corn'},
        {name: 'popcorn', emoji: '🍿', display: 'Popcorn'},
        {name: 'candy', emoji: '🍬', display: 'Candy'},
        {name: 'lollipop', emoji: '🍭', display: 'Lollipop'},
        {name: 'chocolate', emoji: '🍫', display: 'Chocolate'}
    ],
    sports: [
        {name: 'soccer', emoji: '⚽', display: 'Soccer Ball'},
        {name: 'basketball', emoji: '🏀', display: 'Basketball'},
        {name: 'football', emoji: '🏈', display: 'Football'},
        {name: 'baseball', emoji: '⚾', display: 'Baseball'},
        {name: 'tennis', emoji: '🎾', display: 'Tennis'},
        {name: 'volleyball', emoji: '🏐', display: 'Volleyball'},
        {name: 'rugby', emoji: '🏉', display: 'Rugby'},
        {name: 'cricket', emoji: '🏏', display: 'Cricket'},
        {name: 'hockey', emoji: '🏒', display: 'Hockey'},
        {name: 'pingpong', emoji: '🏓', display: 'Ping Pong'},
        {name: 'badminton', emoji: '🏸', display: 'Badminton'},
        {name: 'trophy', emoji: '🏆', display: 'Trophy'},
        {name: 'medal', emoji: '🥇', display: 'Gold Medal'},
        {name: 'medal2', emoji: '🥈', display: 'Silver Medal'},
        {name: 'medal3', emoji: '🥉', display: 'Bronze Medal'},
        {name: 'skateboard', emoji: '🛹', display: 'Skateboard'},
        {name: 'surfing', emoji: '🏄', display: 'Surfing'},
        {name: 'swimming', emoji: '🏊', display: 'Swimming'},
        {name: 'running', emoji: '🏃', display: 'Running'},
        {name: 'cycling', emoji: '🚴', display: 'Cycling'},
        {name: 'boxing', emoji: '🥊', display: 'Boxing'},
        {name: 'karate', emoji: '🥋', display: 'Karate'},
        {name: 'bowling', emoji: '🎳', display: 'Bowling'},
        {name: 'golf', emoji: '⛳', display: 'Golf'}
    ],
    faces: [
        {name: 'happy', emoji: '😀', display: 'Happy'},
        {name: 'laughing', emoji: '😂', display: 'Laughing'},
        {name: 'cool', emoji: '😎', display: 'Cool'},
        {name: 'love', emoji: '😍', display: 'Love'},
        {name: 'silly', emoji: '😜', display: 'Silly'},
        {name: 'thinking', emoji: '🤔', display: 'Thinking'},
        {name: 'sleepy', emoji: '😴', display: 'Sleepy'},
        {name: 'excited', emoji: '🤩', display: 'Excited'},
        {name: 'party', emoji: '🥳', display: 'Party'},
        {name: 'crying', emoji: '😭', display: 'Crying'},
        {name: 'angry', emoji: '😠', display: 'Angry'},
        {name: 'worried', emoji: '😟', display: 'Worried'},
        {name: 'shocked', emoji: '😱', display: 'Shocked'},
        {name: 'sick', emoji: '🤒', display: 'Sick'},
        {name: 'dizzy', emoji: '😵', display: 'Dizzy'},
        {name: 'robot', emoji: '🤖', display: 'Robot'},
        {name: 'alien', emoji: '👽', display: 'Alien'},
        {name: 'ghost', emoji: '👻', display: 'Ghost'},
        {name: 'poop', emoji: '💩', display: 'Poop'},
        {name: 'fire', emoji: '🔥', display: 'Fire'},
        {name: 'heart', emoji: '❤️', display: 'Heart'},
        {name: 'star', emoji: '⭐', display: 'Star'},
        {name: 'rainbow', emoji: '🌈', display: 'Rainbow'},
        {name: 'sparkles', emoji: '✨', display: 'Sparkles'}
    ]
};

let currentTheme = 'australian';

function changeGameMode() {
    const mode = document.getElementById('gameMode').value;
    isMultiplayer = (mode === 'multiplayer');

    // Toggle UI visibility
    const nameInputSection = document.getElementById('nameInputSection');
    const multiplayerScores = document.getElementById('multiplayerScores');
    const scoresContainer = document.querySelector('.scores-container');

    if (isMultiplayer) {
        // Show name input section, hide scores until names are set
        nameInputSection.style.display = 'flex';
        multiplayerScores.style.display = 'none';
        scoresContainer.style.opacity = '0.5';
    } else {
        nameInputSection.style.display = 'none';
        multiplayerScores.style.display = 'none';
        scoresContainer.style.opacity = '1';
        // Reset and restart game for single player
        changeDifficulty();
    }
}

function setPlayerNames() {
    const p1Input = document.getElementById('player1Name').value.trim();
    const p2Input = document.getElementById('player2Name').value.trim();

    // Use input names or default to "Player 1" / "Player 2"
    player1Name = p1Input || "Player 1";
    player2Name = p2Input || "Player 2";

    // Update UI with names
    document.getElementById('player1Header').textContent = `👤 ${player1Name}`;
    document.getElementById('player2Header').textContent = `👤 ${player2Name}`;

    // Hide name input, show scores
    document.getElementById('nameInputSection').style.display = 'none';
    document.getElementById('multiplayerScores').style.display = 'flex';

    // Start the game
    changeDifficulty();
}

function skipNames() {
    // Use default names
    player1Name = "Player 1";
    player2Name = "Player 2";

    // Update UI with default names
    document.getElementById('player1Header').textContent = `👤 ${player1Name}`;
    document.getElementById('player2Header').textContent = `👤 ${player2Name}`;

    // Clear input fields
    document.getElementById('player1Name').value = '';
    document.getElementById('player2Name').value = '';

    // Hide name input, show scores
    document.getElementById('nameInputSection').style.display = 'none';
    document.getElementById('multiplayerScores').style.display = 'flex';

    // Start the game
    changeDifficulty();
}

function changeTheme() {
    currentTheme = document.getElementById('theme').value;
    changeDifficulty(); // Regenerate with new theme
    updateColorDebugger(); // Update color palette display
}

// Color debugger - shows all 24 card colors
function updateColorDebugger() {
    const debugGrid = document.getElementById('debugGrid');
    debugGrid.innerHTML = '';

    const themeData = themes[currentTheme];

    themeData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'debug-card';
        card.setAttribute('data-type', item.name);

        // Apply same background color as game cards would have
        card.style.background = getCardColor(item.name);

        card.innerHTML = `
            <div class="emoji">${item.emoji}</div>
            <div class="label">${item.display}</div>
        `;

        debugGrid.appendChild(card);
    });
}

// Universal 24 color palette
// These 24 colors are used for ALL themes, mapped by position (0-23)
// Includes different shades of red/green (distinct from feedback colors)
// Feedback colors: Match = #22c55e (bright green), Wrong = #ef4444 (bright red)
const universalColors = [
    'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', // 1. Orange
    'linear-gradient(135deg, #a3a3a3 0%, #737373 100%)', // 2. Grey
    'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', // 3. Gold
    'linear-gradient(135deg, #f4ef7d 0%, #eab308 100%)', // 4. Soft yellow (2048)
    'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', // 5. Ocean blue
    'linear-gradient(135deg, #475569 0%, #334155 100%)', // 6. Dark grey
    'linear-gradient(135deg, #a7f0f5 0%, #06b6d4 100%)', // 7. Light cyan (2048)
    'linear-gradient(135deg, #72a4de 0%, #1e40af 100%)', // 8. Medium blue (2048)
    'linear-gradient(135deg, #78350f 0%, #451a03 100%)', // 9. Brown
    'linear-gradient(135deg, #7ab9f1 0%, #0891b2 100%)', // 10. Sky blue (2048)
    'linear-gradient(135deg, #92400e 0%, #78350f 100%)', // 11. Dark brown
    'linear-gradient(135deg, #d793fa 0%, #7c3aed 100%)', // 12. Light purple (2048)
    'linear-gradient(135deg, #a16207 0%, #854d0e 100%)', // 13. Wood brown
    'linear-gradient(135deg, #b0acf1 0%, #8b5cf6 100%)', // 14. Soft purple (2048)
    'linear-gradient(135deg, #10b981 0%, #059669 100%)', // 15. Emerald green (darker than feedback)
    'linear-gradient(135deg, #ee836b 0%, #f97316 100%)', // 16. Coral/salmon (2048)
    'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', // 17. White/grey
    'linear-gradient(135deg, #f7f7f7 0%, #e5e7eb 100%)', // 18. Soft white (2048)
    'linear-gradient(135deg, #c026d3 0%, #a21caf 100%)', // 19. Magenta
    'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)', // 20. Lime green (yellowish green)
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // 21. Amber (replaced pink)
    'linear-gradient(135deg, #be185d 0%, #9f1239 100%)', // 22. Deep rose/maroon (dark red)
    'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)', // 23. Rose pink
    'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', // 24. Light orange
];

// Get color for a card by its position in the theme (0-23)
function getCardColor(type) {
    // Find the position of this card type in the current theme
    const themeData = themes[currentTheme];
    const index = themeData.findIndex(item => item.name === type);

    // Return the color at that position (0-23)
    if (index >= 0 && index < universalColors.length) {
        return universalColors[index];
    }

    // Fallback color if not found
    return 'linear-gradient(135deg, #7ab9f1 0%, #a7f0f5 100%)';
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateMultiplayerUI();
}

function updateMultiplayerUI() {
    if (!isMultiplayer) return;

    // Update turn indicator with player name
    const currentName = currentPlayer === 1 ? player1Name : player2Name;
    document.getElementById('currentTurn').textContent = `${currentName}'s Turn`;

    // Update scores
    document.querySelector('#player1Score .score').textContent = `${player1Score} pairs`;
    document.querySelector('#player2Score .score').textContent = `${player2Score} pairs`;

    // Highlight current player
    const p1 = document.getElementById('player1Score');
    const p2 = document.getElementById('player2Score');

    if (currentPlayer === 1) {
        p1.classList.add('active');
        p2.classList.remove('active');
    } else {
        p1.classList.remove('active');
        p2.classList.add('active');
    }
}

function changeDifficulty() {
    const difficulty = document.getElementById('difficulty').value;
    currentDifficulty = difficulty;

    // Parse grid size
    const [cols, rows] = difficulty.split('x').map(Number);
    const totalCards = cols * rows;

    // Use current theme
    const iconTypes = themes[currentTheme];

    // Clear existing cards
    deck.innerHTML = '';
    cards = [];

    // Generate pairs
    const pairsNeeded = totalCards / 2;
    const cardData = [];
    for (let i = 0; i < pairsNeeded; i++) {
        const item = iconTypes[i % iconTypes.length];
        cardData.push({type: item.name, emoji: item.emoji, display: item.display});
        cardData.push({type: item.name, emoji: item.emoji, display: item.display});
    }

    // Shuffle
    cardData.sort(() => 0.5 - Math.random());

    // Create card elements with emoji
    cardData.forEach((data, index) => {
        const li = document.createElement('li');
        li.className = 'card';
        li.setAttribute('type', data.type);
        li.setAttribute('data-display', data.display);
        li.setAttribute('data-color', getCardColor(data.type)); // Store color for later use
        li.innerHTML = `<span class="card-emoji">${data.emoji}</span>`;
        deck.appendChild(li);
    });

    // Update cards array
    card = document.getElementsByClassName("card");
    cards = [...card];

    // Add event listeners
    for (var i = 0; i < cards.length; i++){
        cards[i].addEventListener("click", displayCard);
        cards[i].addEventListener("click", cardOpen);
        cards[i].addEventListener("click", congratulations);
    }

    // Adjust grid size in CSS
    deck.style.gridTemplateColumns = `repeat(${cols}, 90px)`;
    deck.style.gridTemplateRows = `repeat(${rows}, 90px)`;
    deck.style.display = 'grid';
    deck.style.gap = '10px';
    // Remove width/height style overrides - let CSS handle it
    deck.style.width = '';
    deck.style.height = '';
    deck.style.minWidth = '';

    // Update card sizes to be consistent
    cards.forEach(card => {
        card.style.width = '90px';
        card.style.height = '90px';
    });

    // Load high scores for this difficulty
    loadHighScores();

    // Restart game
    startGame();
}
