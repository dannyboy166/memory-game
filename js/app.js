// ============================================
// 🎮 SASCO GAMES - SOUND EFFECTS & CONFETTI
// ============================================

// Sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Sound effects
function playFlipSound() {
    playSound(400, 0.1, 'sine');
}

function playMatchSound() {
    playSound(600, 0.2, 'sine');
    setTimeout(() => playSound(800, 0.2, 'sine'), 100);
}

function playWrongSound() {
    playSound(200, 0.3, 'sawtooth');
}

function playWinSound() {
    playSound(523, 0.15, 'sine');
    setTimeout(() => playSound(659, 0.15, 'sine'), 150);
    setTimeout(() => playSound(784, 0.15, 'sine'), 300);
    setTimeout(() => playSound(1047, 0.4, 'sine'), 450);
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

    // shuffle deck
    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled", "unmatched");
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
    openedCards = [];

    // 🎉 Play match sound and show message!
    playMatchSound();
    const messages = ["Great match! 🌟", "Awesome! 🎉", "Perfect! ⭐", "Nice one! 💫", "Brilliant! ✨"];
    showMessage(messages[Math.floor(Math.random() * messages.length)], '#22c55e');
}


// Track unmatched timeout so we can clear it on restart
var unmatchedTimeout;

// description when cards don't match
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();

    // 🔊 Play wrong sound and show message!
    playWrongSound();
    const messages = ["Try again! 💪", "Keep going! 🎯", "Almost! 🌈", "You got this! 🚀"];
    showMessage(messages[Math.floor(Math.random() * messages.length)], '#f97316');

    unmatchedTimeout = setTimeout(function(){
        if (openedCards[0] && openedCards[1]) {
            openedCards[0].classList.remove("show", "open", "no-event","unmatched");
            openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        }
        enable();
        openedCards = [];
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

        // 🏆 Save high scores!
        saveHighScore();

        // show congratulations modal
        modal.classList.add("show");

        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

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

// Background music using Web Audio API
let musicContext;
let musicGainNode;
let musicPlaying = false;
let musicInterval;

function createBackgroundMusic() {
    if (!musicContext) {
        musicContext = new (window.AudioContext || window.webkitAudioContext)();
        musicGainNode = musicContext.createGain();
        musicGainNode.gain.value = 0.1; // Quiet background music
        musicGainNode.connect(musicContext.destination);
    }
}

function playBackgroundMusic() {
    if (musicPlaying) return;
    createBackgroundMusic();
    musicPlaying = true;

    // Simple pleasant melody loop
    const notes = [523, 587, 659, 698, 784, 698, 659, 587]; // C, D, E, F, G, F, E, D
    let noteIndex = 0;

    function playNote() {
        if (!musicPlaying) return;

        const oscillator = musicContext.createOscillator();
        oscillator.connect(musicGainNode);
        oscillator.type = 'sine';
        oscillator.frequency.value = notes[noteIndex];
        oscillator.start(musicContext.currentTime);
        oscillator.stop(musicContext.currentTime + 0.3);

        noteIndex = (noteIndex + 1) % notes.length;
    }

    musicInterval = setInterval(playNote, 500);
    document.getElementById('musicToggle').textContent = '🔊 Music On';
}

function stopBackgroundMusic() {
    musicPlaying = false;
    if (musicInterval) clearInterval(musicInterval);
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

    // Save best moves (lowest is best) for this difficulty
    const savedBestMoves = localStorage.getItem(`bestMoves_${difficulty}`);
    if (!savedBestMoves || savedBestMoves === '--' || currentMoves < parseInt(savedBestMoves)) {
        localStorage.setItem(`bestMoves_${difficulty}`, currentMoves);
        document.getElementById('bestMoves').textContent = currentMoves;
    }

    // Save best time (convert to seconds for comparison) for this difficulty
    const timeInSeconds = minute * 60 + second;
    const savedBestTimeSeconds = localStorage.getItem(`bestTimeSeconds_${difficulty}`);
    if (!savedBestTimeSeconds || timeInSeconds < parseInt(savedBestTimeSeconds)) {
        localStorage.setItem(`bestTime_${difficulty}`, currentTime);
        localStorage.setItem(`bestTimeSeconds_${difficulty}`, timeInSeconds);
        document.getElementById('bestTime').textContent = currentTime;
    }
}

// Fix initial grid layout on page load - regenerate cards properly
window.addEventListener('load', function() {
    // Wait a bit for DOM to be ready, then regenerate the default 4x4 grid
    setTimeout(() => {
        changeDifficulty();
    }, 100);
});

// Australian wildlife emoji theme
const australianTheme = [
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
];

function changeDifficulty() {
    const difficulty = document.getElementById('difficulty').value;
    currentDifficulty = difficulty;

    // Parse grid size
    const [cols, rows] = difficulty.split('x').map(Number);
    const totalCards = cols * rows;

    // Use Australian theme
    const iconTypes = australianTheme;

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
