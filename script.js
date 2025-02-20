const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 1, y: 1 };
let cat = { x: 0, y: 0 };
let maze = [];
let mazeSize = 10;
let tileSize = 40;
let gameRunning = false;
let monsters = [];

// Set your background image link here
const backgroundImage = "https://raw.githubusercontent.com/KalakkalKarthikeyan/FINDTHECAT/refs/heads/main/istockphoto-1397509122-612x612.jpg";

const levelSettings = {
    easy: { size: 40 },
    normal: { size: 50 },
    hard: { size: 60 },
    vasanth: { size: 85 }
};

function startGame(difficulty) {
    mazeSize = levelSettings[difficulty].size;
    tileSize = Math.min(600 / mazeSize, 40);
    canvas.width = mazeSize * tileSize;
    canvas.height = mazeSize * tileSize;

    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("controls").style.display = "block";

    generateMaze();
    player = { x: 1, y: 1 };
    gameRunning = true;
    drawMaze();
}

function generateMaze() {
    maze = Array.from({ length: mazeSize }, () =>
        Array.from({ length: mazeSize }, () => 1)
    );
    monsters = [];

    function carvePath(x, y) {
        let directions = [
            { dx: 0, dy: -2 },
            { dx: 0, dy: 2 },
            { dx: -2, dy: 0 },
            { dx: 2, dy: 0 }
        ];
        directions.sort(() => Math.random() - 0.5);

        for (let { dx, dy } of directions) {
            let nx = x + dx;
            let ny = y + dy;

            if (nx > 0 && nx < mazeSize - 1 && ny > 0 && ny < mazeSize - 1 && maze[ny][nx] === 1) {
                maze[y + dy / 2][x + dx / 2] = 0;
                maze[ny][nx] = 0;
                carvePath(nx, ny);
            }
        }
    }

    maze[1][1] = 0;
    carvePath(1, 1);

    cat = { x: mazeSize - 2, y: mazeSize - 2 };
    maze[cat.y][cat.x] = 0;

    // Place monsters in dead ends
    function isDeadEnd(x, y) {
        let paths = 0;
        if (x > 0 && maze[y][x - 1] === 0) paths++;
        if (x < mazeSize - 1 && maze[y][x + 1] === 0) paths++;
        if (y > 0 && maze[y - 1][x] === 0) paths++;
        if (y < mazeSize - 1 && maze[y + 1][x] === 0) paths++;
        return paths === 1; 
    }

    for (let y = 1; y < mazeSize - 1; y++) {
        for (let x = 1; x < mazeSize - 1; x++) {
            if (maze[y][x] === 0 && isDeadEnd(x, y) && Math.random() > 0.5) {
                monsters.push({ x, y });
            }
        }
    }
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let bg = new Image();
    bg.src = backgroundImage;
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    ctx.font = `${tileSize}px Arial`;

    // Draw Monsters (👺)
    monsters.forEach(monster => {
        ctx.fillText("👺", monster.x * tileSize + 5, monster.y * tileSize + tileSize - 5);
    });

    // Draw Player (🧍)
    ctx.fillText("🧍", player.x * tileSize + 5, player.y * tileSize + tileSize - 5);

    // Draw Cat (🐈)
    ctx.fillText("🐈", cat.x * tileSize + 5, cat.y * tileSize + tileSize - 5);
}

document.addEventListener("keydown", movePlayer);

function movePlayer(event) {
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

    // Check if player touches a monster
    monsters.forEach(monster => {
        if (player.x === monster.x && player.y === monster.y) {
            alert("👺 A monster got you! Restarting...");
            restartGame();
        }
    });

    drawMaze();
    checkWin();
}

function checkWin() {
    if (player.x === cat.x && player.y === cat.y) {
        gameRunning = false;
        document.getElementById("game-over").style.display = "block";
    }
}

function restartGame() {
    location.reload();
}

// Mobile Controls
document.getElementById("up").addEventListener("click", () => movePlayer({ key: "ArrowUp" }));
document.getElementById("down").addEventListener("click", () => movePlayer({ key: "ArrowDown" }));
document.getElementById("left").addEventListener("click", () => movePlayer({ key: "ArrowLeft" }));
document.getElementById("right").addEventListener("click", () => movePlayer({ key: "ArrowRight" }));
