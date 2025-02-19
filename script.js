const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 1, y: 1 };
let cat = { x: 0, y: 0 };
let maze = [];
let mazeSize = 10;
let tileSize = 40;
let gameRunning = false;
let backgroundImage = new Image();
backgroundImage.src = "YOUR_BACKGROUND_IMAGE_URL_HERE"; // Change this

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
        Array(mazeSize).fill(1) // Start with walls
    );

    let stack = [{ x: 1, y: 1 }];
    maze[1][1] = 0;

    let directions = [
        { x: 0, y: -2 },
        { x: 0, y: 2 },
        { x: -2, y: 0 },
        { x: 2, y: 0 }
    ];

    while (stack.length > 0) {
        let current = stack.pop();
        directions.sort(() => Math.random() - 0.5); // Shuffle directions

        for (let dir of directions) {
            let nx = current.x + dir.x;
            let ny = current.y + dir.y;

            if (nx > 0 && ny > 0 && nx < mazeSize - 1 && ny < mazeSize - 1 && maze[ny][nx] === 1) {
                maze[ny][nx] = 0;
                maze[current.y + dir.y / 2][current.x + dir.x / 2] = 0;
                stack.push({ x: nx, y: ny });
            }
        }
    }

    maze[1][1] = 0;
    maze[mazeSize - 2][mazeSize - 2] = 0;
}

function placeCat() {
    cat.x = mazeSize - 2;
    cat.y = mazeSize - 2;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw walls as lines
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                if (y > 0 && maze[y - 1][x] === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x * tileSize, y * tileSize);
                    ctx.lineTo((x + 1) * tileSize, y * tileSize);
                    ctx.stroke();
                }
                if (x > 0 && maze[y][x - 1] === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x * tileSize, y * tileSize);
                    ctx.lineTo(x * tileSize, (y + 1) * tileSize);
                    ctx.stroke();
                }
            }
        }
    }

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize + 5, player.y * tileSize + 5, tileSize - 10, tileSize - 10);

    // Draw cat emoji
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

