import { tileDistributions } from "./data.js";

// Function to set up game with selected tiles
function setupGame(level) {
  const selectedData = tileDistributions.find((data) => data.level === level);
  if (!selectedData) return; // If no data, exit function

  const tiles = selectedData.tilesDistribution.concat(
    selectedData.tilesDistribution
  ); // Duplicate for matching pairs
  tiles.sort(() => 0.5 - Math.random()); // Shuffle tiles

  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // Clear board

  // Show the game board
  gameBoard.style.display = "grid";
  gameBoard.style.opacity = "1"; // Set opacity to trigger fade-in

  // Create tiles
  tiles.forEach((tile) => {
    const tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.dataset.tile = tile;
    tileElement.innerText = "?"; // Hidden initially
    tileElement.addEventListener("click", handleTileClick);
    gameBoard.appendChild(tileElement);
  });
}

// Set up variables to track tile matching state
let firstTile, secondTile;
let lockBoard = false;

// Handle tile click event
function handleTileClick() {
  if (lockBoard) return;
  if (this === firstTile) return;

  this.innerText = this.dataset.tile;

  if (!firstTile) {
    firstTile = this;
  } else {
    secondTile = this;
    checkForMatch();
  }
}

// Check if the two selected tiles match
function checkForMatch() {
  lockBoard = true;

  if (firstTile.dataset.tile === secondTile.dataset.tile) {
    disableTiles();
  } else {
    unflipTiles();
  }
}

// Disable matched tiles
function disableTiles() {
  firstTile.classList.add("matched");
  secondTile.classList.add("matched");
  firstTile.removeEventListener("click", handleTileClick);
  secondTile.removeEventListener("click", handleTileClick);
  resetBoard();
}

// Unflip unmatched tiles
function unflipTiles() {
  setTimeout(() => {
    firstTile.innerText = "?";
    secondTile.innerText = "?";
    resetBoard();
  }, 1000);
}

// Reset board state after each turn
function resetBoard() {
  [firstTile, secondTile] = [null, null];
  lockBoard = false;
}

// Add event listeners for level selection buttons
document.getElementById("level1").addEventListener("click", () => setupGame(1));
document.getElementById("level2").addEventListener("click", () => setupGame(2));
