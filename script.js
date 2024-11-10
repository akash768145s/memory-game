// script.js

async function fetchGameConfig(level) {
  const url = `https://academy.karky.in:8881/api/games/memory/random/${level}`;

  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      alert("No configuration found for the specified level.");
    }
  } catch (error) {
    console.error("Error fetching game configuration:", error);
  }
}

document.getElementById("start-game").addEventListener("click", async () => {
  const level = document.getElementById("level-select").value;
  const gameConfig = await fetchGameConfig(level);

  if (gameConfig) {
    const tilesArray = gameConfig.tilesDistribution.split(",");
    setupGameBoard(tilesArray);
  }
});

function setupGameBoard(tilesArray) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  const doubledTiles = [...tilesArray, ...tilesArray];
  const shuffledTiles = doubledTiles.sort(() => Math.random() - 0.5);

  shuffledTiles.forEach((tileValue) => {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    tile.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front"></div>
          <div class="tile-back">${tileValue}</div>
        </div>
      `;

    tile.addEventListener("click", () => revealTile(tile));
    gameBoard.appendChild(tile);
  });
}

let revealedTiles = [];
let matchedPairs = 0;

function revealTile(tile) {
  if (tile.classList.contains("revealed") || revealedTiles.length === 2) return;

  tile.classList.add("revealed");
  revealedTiles.push(tile);

  if (revealedTiles.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  const [tile1, tile2] = revealedTiles;

  if (
    tile1.querySelector(".tile-back").innerText ===
    tile2.querySelector(".tile-back").innerText
  ) {
    matchedPairs++;
    revealedTiles = [];

    if (matchedPairs === document.querySelectorAll(".tile").length / 2) {
      alert("Congratulations! You've won!");
    }
  } else {
    setTimeout(() => {
      tile1.classList.remove("revealed");
      tile2.classList.remove("revealed");
      revealedTiles = [];
    }, 300); // Keep a very short delay to make sure it’s noticeable, but fast
  }
}
