const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 1, y: 1 };
let cat = { x: 0, y: 0 };
let maze = [];
let mazeSize = 10;
let tileSize = 40;
let gameRunning = false;

// Set your background image link here
const backgroundImage = "your-image-link-here";

const levelSettings = {
    easy: { size: 10 },
    normal: { size: 15 },
    hard: { size: 20 },
    vasanth: { size: 35 }
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
    // Create a full wall maze
    maze = Array.from({ length: mazeSize }, () =>
        Array.from({ length: mazeSize }, () => 1)
    );

    // Generate one correct path to the cat
    let x = 1, y = 1;
    maze[y][x] = 0;

    while (x < mazeSize - 2 || y < mazeSize - 2) {
        if (Math.random() > 0.5 && x < mazeSize - 2) x++;
        else if (y < mazeSize - 2) y++;

        maze[y][x] = 0;
    }

    // Place the cat at the end of the path
    cat.x = x;
    cat.y = y;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    if (backgroundImage) {
        let bg = new Image();
        bg.src = backgroundImage;
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    }

    // Draw maze walls using small black squares
    ctx.fillStyle = "black";
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * tileSize, y * tileSize, tileSize / 3, tileSize / 3);
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

