import { tileDistributions } from "./data.js";

let currentLevel = 1; // Start at Level 1
let firstTile, secondTile;
let lockBoard = false;
let matchedPairs = 0; // Track matched pairs to determine level completion

// Function to set up game with selected tiles
function setupGame(level) {
  const selectedData = tileDistributions.find((data) => data.level === level);
  if (!selectedData) return;

  const tiles = selectedData.tilesDistribution.concat(
    selectedData.tilesDistribution
  ); // Duplicate for matching pairs
  tiles.sort(() => 0.5 - Math.random()); // Shuffle tiles

  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // Clear board
  gameBoard.style.display = "grid"; // Show the game board
  gameBoard.style.opacity = "1"; // Fade in

  // Reset game variables
  matchedPairs = 0;
  [firstTile, secondTile] = [null, null];
  lockBoard = false;

  // Create and display tiles
  tiles.forEach((tile) => {
    const tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.dataset.tile = tile;
    tileElement.innerText = "?"; // Hidden initially
    tileElement.addEventListener("click", handleTileClick);
    gameBoard.appendChild(tileElement);
  });
}

// Tile click handler
function handleTileClick() {
  if (lockBoard || this === firstTile) return;

  this.innerText = this.dataset.tile;

  if (!firstTile) {
    firstTile = this;
  } else {
    secondTile = this;
    checkForMatch();
  }
}

// Match checking
function checkForMatch() {
  lockBoard = true;

  if (firstTile.dataset.tile === secondTile.dataset.tile) {
    disableTiles();
  } else {
    unflipTiles();
  }
}

function disableTiles() {
  firstTile.classList.add("matched");
  secondTile.classList.add("matched");
  firstTile.removeEventListener("click", handleTileClick);
  secondTile.removeEventListener("click", handleTileClick);

  matchedPairs++;
  const tilesInLevel = tileDistributions.find(
    (data) => data.level === currentLevel
  ).tilesDistribution.length;

  if (matchedPairs === tilesInLevel) {
    // All pairs matched for this level
    if (currentLevel === 1) {
      currentLevel = 2;
      setTimeout(() => setupGame(currentLevel), 1000); // Load Level 2
      showToast("Level 1 Complete! Moving to Level 2...");
    } else {
      showToast("Congratulations! Game Over. You've completed all levels.");
    }
  }
  resetBoard();
}

function unflipTiles() {
  setTimeout(() => {
    firstTile.innerText = "?";
    secondTile.innerText = "?";
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstTile, secondTile] = [null, null];
  lockBoard = false;
}

// Toast function to show messages
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerText = message;
  document.body.appendChild(toast);

  // Show the toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 500); // Clean up after animation
  }, 3000);
}

// Initialize game with Level 1 by default
setupGame(currentLevel);
