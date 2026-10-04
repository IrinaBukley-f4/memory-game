'use strict';

const CONFIG = {
    pairs: 8,
    delay: 1000,
};

const state = {
    cards: [],
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    moves: 0,
    matches: 0,
    closeTimer: null,
    gameActive: false,  
};

const IMAGES = ['./img/1.jpg', './img/2.jpg', './img/3.jpg', './img/4.jpg', './img/5.jpg', './img/6.jpg', './img/7.jpg', './img/8.jpg'];

let headerEl;
let movesEl;
let matchesEl;
let boardEl;

function init () {
    createHeader();
    createBoard();
    startNewGame();
}

// HEADER

function createHeader() {
    headerEl = document.createElement('header');
    headerEl.className = 'header';

    // title
    const title = document.createElement('h1');
    title.className = 'header__title';
    title.textContent = 'Memory Game';

    // counters
    const stats = document.createElement('div');
    stats.className = 'header__stats';

    movesEl = document.createElement('span');
    movesEl.className = 'header__stat';
    movesEl.innerHTML = 'Ходы: <b>0</b>';

    matchesEl = document.createElement('span');
    matchesEl.className = 'header__stat';
    matchesEl.innerHTML = 'Пары: <b>0</b> / ' + CONFIG.pairs;

    stats.append(movesEl, matchesEl);

    // buttons
    const buttons = document.createElement('div');
    buttons.className = 'header__buttons';

    const newGameBtn = document.createElement('button');
    newGameBtn.className = 'btn btn--primary';
    newGameBtn.textContent = 'Новая игра';
    newGameBtn.addEventListener('click', startNewGame);

    const leadersBtn = document.createElement('button');
    leadersBtn.className = 'btn btn--secondary';
    leadersBtn.textContent = 'Таблица лидеров';
    leadersBtn.addEventListener('click', openLeaders);

    buttons.append(newGameBtn, leadersBtn);

    headerEl.append(title, stats, buttons);
    document.body.append(headerEl);
}

function startNewGame () {

}

function openLeaders () {

}

// MAIN SECTION

function createBoard() {
    boardEl = document.createElement('main');
    boardEl.className = 'board';
    document.body.append(boardEl);
    renderBoard();
}

function createDeck() {
    const deck = [];
    IMAGES.slice(0, CONFIG.pairs).forEach((icon, index) => {
        deck.push({ id: index, icon, matched: false, flipped: false });
        deck.push({ id: index, icon, matched: false, flipped: false });
    });
    return deck;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderBoard() {
    boardEl.innerHTML = '';

    state.cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.dataset.index = index;

        if (card.matched) cardEl.classList.add('card--matched');
        if (card.flipped) cardEl.classList.add('card--flipped');

        const inner = document.createElement('div');
        inner.className = 'card__inner';

        const back = document.createElement('div');
        back.className = 'card__face card__face--back';
        back.innerHTML = `
            <img src="./img/question.jpg" alt="icon-back">
        `;

        const front = document.createElement('div');
        front.className = 'card__face card__face--front';
        front.innerHTML = `
            <img src="./${card.icon}" alt="card-icon">
        `;;

        inner.append(back, front);
        cardEl.append(inner);
        cardEl.addEventListener('click', () => onCardClick(index));

        boardEl.append(cardEl);
    });
}

//start game 
function startNewGame() {

    if (state.closeTimer) {
        clearTimeout(state.closeTimer);
        state.closeTimer = null;
    }

    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
    state.moves = 0;
    state.matches = 0;
    state.gameActive = true;

     updateStats();

    state.cards = createDeck();
    shuffle(state.cards);

    renderBoard();
}

function onCardClick(index) {
    const card = state.cards[index];

    if (state.lockBoard) return;
    if (card.flipped || card.matched) return;
    if (state.firstCard === index) return;

    card.flipped = true;
    updateCardElement(index);

    if (state.firstCard === null) {
        state.firstCard = index;
        return;
    }

    state.secondCard = index;
    state.moves++;
    updateStats();

    checkMatch();
}

function checkMatch() {
    const first = state.cards[state.firstCard];
    const second = state.cards[state.secondCard];

    if (first.id === second.id) {
        first.matched = true;
        second.matched = true;

        updateCardElement(state.firstCard);
        updateCardElement(state.secondCard);

        state.matches++;
        updateStats();

        resetTurn();

        if (state.matches === CONFIG.pairs) {
            onWin();
        }
    } else {

        state.lockBoard = true;

        state.closeTimer = setTimeout(() => {
            first.flipped = false;
            second.flipped = false;

            updateCardElement(state.firstCard);
            updateCardElement(state.secondCard);

            state.closeTimer = null;
            resetTurn();
        }, CONFIG.delay);
    }
}

function updateCardElement(index) {
    const card = state.cards[index];
    const cardEl = boardEl.querySelector(`[data-index="${index}"]`);
    if (!cardEl) return;

    cardEl.classList.toggle('card--flipped', card.flipped);
    cardEl.classList.toggle('card--matched', card.matched);
}

function updateStats() {
    movesEl.innerHTML = `Ходы: <b>${state.moves}</b>`;
    matchesEl.innerHTML = `Пары: <b>${state.matches}</b> / ${CONFIG.pairs}`;
}

function resetTurn() {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
}

function onWin() {
    state.gameActive = false;

    saveLeader(state.moves);

    setTimeout(() => {
        alert(`Победа! Вы нашли все пары за ${state.moves} ходов.`);
    }, 300);
}


init();
