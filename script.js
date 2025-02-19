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
    easy: { size: 10, trapCat: true },
    normal: { size: 15, trapCat: false },
    hard: { size: 20, trapCat: true },
    vasanth: { size: 35, trapCat: false } // Hardest level
};

function startGame(difficulty) {
    mazeSize = levelSettings[difficulty].size;
    tileSize = Math.min(600 / mazeSize, 40);
    canvas.width = mazeSize * tileSize;
    canvas.height = mazeSize * tileSize;
    
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";

    generateMaze(levelSettings[difficulty].trapCat);
    player = { x: 1, y: 1 };
    gameRunning = true;
    drawMaze();
}

function generateMaze(trapCat) {
    // Create random maze
    maze = Array.from({ length: mazeSize }, () =>
        Array.from({ length: mazeSize }, () => (Math.random() > 0.3 ? 0 : 1))
    );

    // Ensure player start position is open
    maze[1][1] = 0;

    // Place the cat
    if (trapCat) {
        // Trap the cat inside walls
        let cx = Math.floor(mazeSize / 2);
        let cy = Math.floor(mazeSize / 2);
        maze[cx][cy] = 0;
        cat = { x: cx, y: cy };

        // Surround the cat with walls
        maze[cx - 1][cy] = 1;
        maze[cx + 1][cy] = 1;
        maze[cx][cy - 1] = 1;
        maze[cx][cy + 1] = 1;
    } else {
        // Place the cat at the end with an open path
        cat.x = mazeSize - 2;
        cat.y = mazeSize - 2;
        maze[cat.y][cat.x] = 0;
    }
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    if (backgroundImage) {
        let bg = new Image();
        bg.src = backgroundImage;
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    }

    // Draw maze walls
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
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
