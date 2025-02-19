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
    
    document.getElementById("winMessage").style.display = "none";

    generateMaze();
    placeCat();
    player = { x: 1, y: 1 };
    gameRunning = true;
    drawMaze();
}

function generateMaze() {
    maze = Array.from({ length: mazeSize }, () => Array(mazeSize).fill(1));
    
    function carvePath(x, y) {
        maze[y][x] = 0;
        let directions = [
            { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
        ];
        directions.sort(() => Math.random() - 0.5);

        for (let { dx, dy } of directions) {
            let nx = x + dx * 2, ny = y + dy * 2;
            if (nx > 0 && ny > 0 && nx < mazeSize - 1 && ny < mazeSize - 1 && maze[ny][nx] === 1) {
                maze[y + dy][x + dx] = 0;
                carvePath(nx, ny);
            }
        }
    }
    
    carvePath(1, 1);
    maze[mazeSize - 2][mazeSize - 2] = 0;
}

function placeCat() {
    cat.x = mazeSize - 2;
    cat.y = mazeSize - 2;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]); // Dotted line pattern

    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                if (x > 0 && maze[y][x - 1] === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x * tileSize, y * tileSize);
                    ctx.lineTo(x * tileSize, (y + 1) * tileSize);
                    ctx.stroke();
                }
                if (y > 0 && maze[y - 1][x] === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x * tileSize, y * tileSize);
                    ctx.lineTo((x + 1) * tileSize, y * tileSize);
                    ctx.stroke();
                }
            }
        }
    }

    ctx.setLineDash([]); // Reset to solid lines

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize + 5, player.y * tileSize + 5, tileSize - 10, tileSize - 10);

    // Draw cat emoji
    ctx.font = `${tileSize * 0.8}px Arial`;
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
        document.getElementById("winMessage").style.display = "block";
    }
}
