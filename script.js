const items = ['🍎', '🚀', '🐱', '⚽', '🎸', '🍔', '⚡', '🎮'];
let cards = [...items, ...items]; // Duplicar para hacer parejas
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let timer = null;
let seconds = 0;
let gameStarted = false;

const grid = document.getElementById('grid');
const intentosSpan = document.getElementById('intentos');
const tiempoSpan = document.getElementById('tiempo');
const btnReiniciar = document.getElementById('reiniciar');

function startGame() {
    grid.innerHTML = '';
    cards.sort(() => Math.random() - 0.5);
    matchedPairs = 0;
    attempts = 0;
    seconds = 0;
    gameStarted = false;
    clearInterval(timer);
    intentosSpan.textContent = attempts;
    tiempoSpan.textContent = seconds;

    cards.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = item;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(() => {
            seconds++;
            tiempoSpan.textContent = seconds;
        }, 1000);
    }

    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        this.classList.add('flipped');
        this.textContent = this.dataset.value;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            attempts++;
            intentosSpan.textContent = attempts;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedPairs++;

        if (matchedPairs === items.length) {
            clearInterval(timer);
            setTimeout(() => alert(`¡Ganaste! 🎉 Tiempo: ${seconds}s, Intentos: ${attempts}`), 300);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            flippedCards = [];
        }, 800);
    }
}

btnReiniciar.addEventListener('click', startGame);
startGame();

// --- LÓGICA DE INSTALACIÓN PWA (BOTÓN DE DESCARGA) ---
let deferredPrompt;
const btnInstalar = document.getElementById('btnInstalar');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btnInstalar.style.display = 'block'; // Muestra el botón de descarga en el celular/PC

    btnInstalar.addEventListener('click', () => {
        btnInstalar.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó instalar la PWA');
            }
            deferredPrompt = null;
        });
    });
});

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}