'use strict';

const CONFIG = {
    pairs: 8,
    delay: 1000,
    storageKey: 'memory-game-leaders',
    maxLeaders: 10,
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

const IMAGES = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg'];

let headerEl;
let movesEl;
let matchesEl;
let boardEl;

let movesValueEl;
let matchesValueEl;

let modalEl;
let modalBodyEl;

function init () {
    createHeader();
    createBoard();
    createModal();
    startNewGame();
}

// HEADER

function createHeader() {
    headerEl = document.createElement('header');
    headerEl.className = 'header';

    const title = document.createElement('h1');
    title.className = 'header__title';
    title.textContent = 'Memory Game';

    const stats = document.createElement('div');
    stats.className = 'header__stats';

    // Ходы
    movesEl = document.createElement('span');
    movesEl.className = 'header__stat';
    movesEl.append('Ходы: ');
    movesValueEl = document.createElement('b');
    movesValueEl.textContent = '0';
    movesEl.append(movesValueEl);

    // Пары
    matchesEl = document.createElement('span');
    matchesEl.className = 'header__stat';
    matchesEl.append('Пары: ');
    matchesValueEl = document.createElement('b');
    matchesValueEl.textContent = '0';
    matchesEl.append(matchesValueEl);
    matchesEl.append(` / ${CONFIG.pairs}`);

    stats.append(movesEl, matchesEl);

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

// MAIN SECTION

function createBoard() {
    boardEl = document.createElement('main');
    boardEl.className = 'board';
    document.body.append(boardEl);
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
    boardEl.replaceChildren();

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
        const backImg = document.createElement('img');
        backImg.src = './img/question.jpg';
        backImg.alt = 'icon-back';
        back.append(backImg);

        const front = document.createElement('div');
        front.className = 'card__face card__face--front';
        const frontImg = document.createElement('img');
        frontImg.src = `./img/${card.icon}`;
        frontImg.alt = 'card-icon';
        front.append(frontImg);

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

    closeModal();
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
     movesValueEl.textContent = state.moves;
    matchesValueEl.textContent = state.matches;
}

function resetTurn() {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
}

function onWin() {
    state.gameActive = false;

    saveLeader(state.moves);

    openWinModal(state.moves);
}

// modal window

function createModal() {
    modalEl = document.createElement('div');
    modalEl.className = 'modal';
    modalEl.hidden = true;

    const content = document.createElement('div');
    content.className = 'modal__content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal__close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', closeModal);

    modalBodyEl = document.createElement('div');
    modalBodyEl.className = 'modal__body';

    content.append(closeBtn, modalBodyEl);
    modalEl.append(content);

    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalEl.hidden) closeModal();
    });

    document.body.append(modalEl);
}

function openModal(contentNode) {
    modalBodyEl.replaceChildren();
    modalBodyEl.append(contentNode);
    modalEl.hidden = false;
    document.body.classList.add('no-scroll');
}

function closeModal() {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove('no-scroll');
}

function openWinModal(moves) {
    const content = buildWinContent(moves);
    openModal(content);
}

function buildWinContent(moves) {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-win';

    const title = document.createElement('h2');
    title.className = 'modal__title';
    title.textContent = 'Победа!';

    const text = document.createElement('p');
    text.className = 'modal__text';
    text.textContent = `Вы нашли все пары за ${moves} ходов.`;

    const buttons = document.createElement('div');
    buttons.className = 'modal__buttons';

    const newGameBtn = document.createElement('button');
    newGameBtn.className = 'btn btn--modal';
    newGameBtn.textContent = 'Новая игра';
    newGameBtn.addEventListener('click', () => {
        closeModal();
        startNewGame();
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn--modal';
    closeBtn.textContent = 'Закрыть';
    closeBtn.addEventListener('click', closeModal);

    buttons.append(newGameBtn, closeBtn);

    // buttons.append(newGameBtn);
    wrapper.append(title, text, buttons);
    return wrapper;
}

function openLeaders() {
    const content = buildLeadersContent();
    openModal(content);
}

function buildLeadersContent() {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-leaders';

    const title = document.createElement('h2');
    title.className = 'modal__title';
    title.textContent = 'Таблица лидеров';

    const leaders = getLeaders();
    const list = document.createElement('ol');
    list.className = 'modal__list';

    if (leaders.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'modal__empty';
        empty.textContent = 'Пока нет результатов';
        list.append(empty);
    } else {
        leaders.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'modal__item';

            const rank = document.createElement('span');
            rank.className = 'modal__rank';
            rank.textContent = index + 1;

            const moves = document.createElement('span');
            moves.className = 'modal__moves';
            moves.textContent = `${item.moves} ходов`;

            const date = document.createElement('span');
            date.className = 'modal__date';
            date.textContent = formatDate(item.date);

            li.append(rank, moves, date);
            list.append(li);
        });
    }

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn--modal';
    closeBtn.textContent = 'Закрыть';
    closeBtn.addEventListener('click', closeModal);

    wrapper.append(title, list, closeBtn);
    return wrapper;
}

function getLeaders() {
    try {
        const raw = localStorage.getItem(CONFIG.storageKey);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveLeader(moves) {
    const leaders = getLeaders();
    leaders.push({ moves, date: Date.now() });

    leaders.sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
        return a.date - b.date;
    });

    const top = leaders.slice(0, 10);

    localStorage.setItem(CONFIG.storageKey, JSON.stringify(top));
}

function formatDate(timestamp) {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

init();
