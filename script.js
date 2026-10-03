'use strict';

const CONFIG = {
    pairs: 8,
    delay: 1000,
};

let headerEl;
let movesEl;
let matchesEl;

function init () {
    createHeader();
}

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

init();