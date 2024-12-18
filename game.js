// Sound Elements
let bgMusic = document.getElementById("bg-music");
let jumpSound = document.getElementById("jump-sound");
let coinSound = document.getElementById("coin-sound");

// Play background music
bgMusic.play();

// Player setup
let player = document.getElementById('player');
let coins = document.querySelectorAll('.coin');
let enemies = document.querySelectorAll('.enemy');
let gameContainer = document.getElementById('game-container');
let ground = document.getElementById('ground');
let gravity = 0.5;
let playerSpeed = 5;
let jumpPower = 10;
let isJumping = false;
let velocityY = 0;
let score = 0;
let playerLeft = 50;
let playerBottom = 50;
let level = 1;

// Enemy behavior
let enemySpeed = 2;
let enemyDirection = 1;

// Player movement
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    movePlayer(1);
  }
  if (e.key === 'ArrowLeft') {
    movePlayer(-1);
  }
  if (e.key === ' ' && !isJumping) {
    jump();
  }
});

// Move the player left or right
function movePlayer(direction) {
  playerLeft += direction * playerSpeed;
  if (playerLeft >= 0 && playerLeft <= gameContainer.offsetWidth - player.offsetWidth) {
    player.style.left = playerLeft + 'px';
    // Scroll the game container
    if (playerLeft > gameContainer.offsetWidth / 2) {
      gameContainer.style.left = -(playerLeft - gameContainer.offsetWidth / 2) + 'px';
    }
  }
}

// Jump logic
function jump() {
  isJumping = true;
  velocityY = jumpPower;
  jumpSound.play();
}

// Coin collection
function collectCoins() {
  coins.forEach((coin) => {
    let coinRect = coin.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();

    if (
      playerRect.left < coinRect.left + coinRect.width &&
      playerRect.left + playerRect.width > coinRect.left &&
      playerRect.top < coinRect.top + coinRect.height &&
      playerRect.top + playerRect.height > coinRect.top
    ) {
      coin.remove();
      score += 10;
      coinSound.play();
      console.log("Score: " + score);
    }
  });
}

// Enemy movement and collision detection
function moveEnemies() {
  enemies.forEach(enemy => {
    let enemyLeft = parseInt(window.getComputedStyle(enemy).left);
    if (enemyLeft < 0 || enemyLeft > gameContainer.offsetWidth - 50) {
      enemyDirection *= -1;
    }
    enemy.style.left = enemyLeft + enemyDirection * enemySpeed + 'px';

    let enemyRect = enemy.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();
    if (
      playerRect.left < enemyRect.left + enemyRect.width &&
      playerRect.left + playerRect.width > enemyRect.left &&
      playerRect.top < enemyRect.top + enemyRect.height &&
      playerRect.top + playerRect.height > enemyRect.top
    ) {
      alert("Game Over! Hit by enemy.");
      resetGame();
    }
  });
}

// Reset the game when the player hits an enemy
function resetGame() {
  playerLeft = 50;
  playerBottom = 50;
  score = 0;
  level = 1;
  gameContainer.style.left = "0px";
  player.style.left = playerLeft + 'px';
  player.style.bottom = playerBottom + 'px';
  enemies.forEach(enemy => enemy.style.left = '1000px');
}

// Game loop
function gameLoop() {
  if (isJumping) {
    velocityY -= gravity;
    player.style.bottom = (playerBottom + velocityY) + 'px';

    if (parseInt(window.getComputedStyle(player).bottom) <= 50) {
      player.style.bottom = '50px';
      isJumping = false;
    }
  } else {
    if (parseInt(window.getComputedStyle(player).bottom) > 50) {
      velocityY -= gravity;
      player.style.bottom = (parseInt(window.getComputedStyle(player).bottom) + velocityY) + 'px';
    }
  }

  collectCoins();
  moveEnemies();
  requestAnimationFrame(gameLoop);
}

gameLoop();
