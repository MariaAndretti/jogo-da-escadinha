// Variáveis do jogo da memória
const emojis = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍍', '🥝', '🍓'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pairsFound = 0;

// Elementos DOM
const gameBoard = document.getElementById('gameBoard');
const pairsFoundSpan = document.getElementById('pairsFound');
const resultsList = document.getElementById('resultsList');
const finalScore = document.getElementById('finalScore');

// Controle de telas
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Embaralha o array (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Cria o tabuleiro
function createBoard() {
  pairsFound = 0;
  pairsFoundSpan.textContent = pairsFound;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  cards = [...emojis, ...emojis];
  shuffle(cards);
  gameBoard.innerHTML = '';

  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.textContent = '❓';
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

// Lógica para virar cartas
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.textContent = this.dataset.emoji;
  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

// Checa se as cartas são iguais
function checkMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    pairsFound++;
    pairsFoundSpan.textContent = pairsFound;
    if (pairsFound === emojis.length) {
      setTimeout(showFinalScreen, 500);
    }
    resetTurn();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.textContent = '❓';
      secondCard.textContent = '❓';
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetTurn();
    }, 1000);
  }
}

// Reseta estado das cartas viradas
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Mostra tela inicial -> regras
function startGame() {
  createBoard();
  showScreen('gameScreen');
}

// Mostra resultados parciais (pares encontrados)
function showPartialResults() {
  resultsList.innerHTML = '';

  // Cartas já encontradas
  const matchedEmojis = [];

  document.querySelectorAll('.card.matched').forEach(card => {
    matchedEmojis.push(card.dataset.emoji);
  });

  if (matchedEmojis.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nenhum par encontrado ainda.';
    resultsList.appendChild(li);
  } else {
    const countPairs = {};
    matchedEmojis.forEach(emoji => {
      countPairs[emoji] = (countPairs[emoji] || 0) + 1;
    });

    // Como cada par tem 2 cartas, conta 1 par para cada 2 emojis encontrados
    for (const emoji in countPairs) {
      const li = document.createElement('li');
      li.textContent = `${emoji} - Par encontrado`;
      resultsList.appendChild(li);
    }
  }

  showScreen('partialResultsScreen');
}

// Tela final
function showFinalScreen() {
  showScreen('finalScreen');
  finalScore.textContent = `Você encontrou ${pairsFound} pares!`;
}

// Reiniciar o jogo
function restartGame() {
  createBoard();
  showScreen('startScreen');
}

// Inicializa mostrando tela inicial
showScreen('startScreen');