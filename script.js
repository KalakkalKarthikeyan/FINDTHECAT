const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 1, y: 1 };
let cat = { x: 0, y: 0 };
let maze = [];
let mazeSize = 10;
let tileSize = 40;
let gameRunning = false;

// Set your background image link here
const backgroundImage = "https://raw.githubusercontent.com/KalakkalKarthikeyan/FINDTHECAT/refs/heads/main/istockphoto-1397509122-612x612.jpg";

const levelSettings = {
    easy: { size: 30 },
    normal: { size: 40 },
    hard: { size: 50 },
    vasanth: { size: 70 }
};

function startGame(difficulty) {
    mazeSize = levelSettings[difficulty].size;
    tileSize = Math.min(600 / mazeSize, 40);
    canvas.width = mazeSize * tileSize;
    canvas.height = mazeSize * tileSize;

    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";

    generateMaze();
    player = { x: 1, y: 1 };
    gameRunning = true;
    drawMaze();
}

function generateMaze() {
    // Create a full grid of walls (1s)
    maze = Array.from({ length: mazeSize }, () =>
        Array.from({ length: mazeSize }, () => 1)
    );

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

    // Ensure a valid path to the cat
    cat = { x: mazeSize - 2, y: mazeSize - 2 };
    maze[cat.y][cat.x] = 0;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    if (backgroundImage) {
        let bg = new Image();
        bg.src = backgroundImage;
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    }

    // Draw maze walls (small black boxes)
    ctx.fillStyle = "black";
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);

    // Draw cat (🐈)
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


