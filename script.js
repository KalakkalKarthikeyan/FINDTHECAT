const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 1, y: 1 };
let cat = { x: 0, y: 0 };
let maze = [];
let mazeSize = 10;
let tileSize = 40;
let gameRunning = false;

const levelSettings = {
    easy: { size: 10 },
    normal: { size: 15 },
    hard: { size: 20 },
    vasanth: { size: 35 } // Hardest level
};

function startGame(difficulty) {
    mazeSize = levelSettings[difficulty].size;
    tileSize = Math.min(600 / mazeSize, 40);
    canvas.width = mazeSize * tileSize;
    canvas.height = mazeSize * tileSize;
    
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";

    generateMaze();
    placeCat();
    player = { x: 1, y: 1 };
    gameRunning = true;
    drawMaze();
}

function generateMaze() {
    maze = Array.from({ length: mazeSize }, () =>
        Array.from({ length: mazeSize }, () => (Math.random() > 0.3 ? 0 : 1))
    );

    // Ensure player and cat positions are open
    maze[1][1] = 0;
    maze[mazeSize - 2][mazeSize - 2] = 0;
}

function placeCat() {
    cat.x = mazeSize - 2;
    cat.y = mazeSize - 2;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);

    // Draw cat (emoji)
    ctx.font = `${tileSize}px Arial`;
    ctx.fillText("🐈", cat.x * tileSize + 5, cat.y * tileSize + tileSize - 5);
}

document.addEventListener("keydown", (event) => {
    if (!gameRunning) return;

    let newX = player.x;
    let newY = player.y;

    if (event.key === "ArrowUp") newY--;
    if (event.key === "ArrowDown") newY++;
    if (event.key === "ArrowLeft") newX--;
    if (event.key === "ArrowRight") newX++;

    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
    }

    drawMaze();
    checkWin();
});

function checkWin() {
    if (player.x === cat.x && player.y === cat.y) {
        gameRunning = false;
        document.getElementById("game-over").style.display = "block";
    }
}

function restartGame() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("menu").style.display = "block";
    canvas.style.display = "none";
}
