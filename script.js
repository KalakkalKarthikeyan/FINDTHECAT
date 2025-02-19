const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const miniMap = document.getElementById("miniMap");
const miniCtx = miniMap.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE_SIZE = 40;
const MAZE_SIZE = 15;
let maze = [];
let player = { x: 1, y: 1, angle: 0 };
let cat = { x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 };

// Generate Maze (Ensuring a path exists)
function generateMaze() {
    maze = Array.from({ length: MAZE_SIZE }, () => Array(MAZE_SIZE).fill(1));

    function carve(x, y) {
        maze[y][x] = 0;
        const directions = [[0,1], [1,0], [0,-1], [-1,0]].sort(() => Math.random() - 0.5);
        for (const [dx, dy] of directions) {
            const nx = x + dx * 2, ny = y + dy * 2;
            if (nx > 0 && ny > 0 && nx < MAZE_SIZE - 1 && ny < MAZE_SIZE - 1 && maze[ny][nx] === 1) {
                maze[y + dy][x + dx] = 0;
                carve(nx, ny);
            }
        }
    }

    carve(1, 1);
    maze[cat.y][cat.x] = 0;
}

generateMaze();

// Raycasting for 3D Effect
function castRays() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const FOV = Math.PI / 3;
    const NUM_RAYS = 120;
    const SLICE_WIDTH = canvas.width / NUM_RAYS;
    
    for (let i = 0; i < NUM_RAYS; i++) {
        let angle = player.angle - FOV / 2 + (FOV / NUM_RAYS) * i;
        let dist = 0;
        let hitWall = false;

        let rayX = player.x;
        let rayY = player.y;

        while (!hitWall && dist < MAZE_SIZE) {
            rayX += Math.cos(angle) * 0.1;
            rayY += Math.sin(angle) * 0.1;
            dist += 0.1;
            if (maze[Math.floor(rayY)][Math.floor(rayX)] === 1) hitWall = true;
        }

        const wallHeight = Math.min(canvas.height / (dist * 0.5), canvas.height);
        let brightness = Math.max(0.3, 1 - dist / 10); // Lighting effect (darker at distance)
        const color = `rgb(${50 * brightness}, ${205 * brightness}, ${50 * brightness})`; // Parrot Green Walls with Light Effect

        ctx.fillStyle = color;
        ctx.fillRect(i * SLICE_WIDTH, (canvas.height - wallHeight) / 2, SLICE_WIDTH, wallHeight);
    }

    // Sky & Floor
    ctx.fillStyle = "lightblue"; // Sky
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

    ctx.fillStyle = "#E0D6B8"; // Light-colored Floor
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
}

// Mini-Map
function drawMiniMap() {
    miniCtx.clearRect(0, 0, miniMap.width, miniMap.height);

    const scale = miniMap.width / MAZE_SIZE;

    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            miniCtx.fillStyle = maze[y][x] === 1 ? "black" : "white";
            miniCtx.fillRect(x * scale, y * scale, scale, scale);
        }
    }

    // Player Position
    miniCtx.fillStyle = "blue";
    miniCtx.fillRect(player.x * scale, player.y * scale, scale, scale);

    // Cat Position
    miniCtx.fillStyle = "orange";
    miniCtx.fillRect(cat.x * scale, cat.y * scale, scale, scale);
}

// Movement Controls
document.addEventListener("keydown", (e) => {
    let newX = player.x, newY = player.y;

    if (e.key === "ArrowUp") {
        newX += Math.cos(player.angle) * 0.5;
        newY += Math.sin(player.angle) * 0.5;
    }
    if (e.key === "ArrowDown") {
        newX -= Math.cos(player.angle) * 0.5;
        newY -= Math.sin(player.angle) * 0.5;
    }
    if (e.key === "ArrowLeft") player.angle -= 0.1;
    if (e.key === "ArrowRight") player.angle += 0.1;

    if (maze[Math.floor(newY)][Math.floor(newX)] === 0) {
        player.x = newX;
        player.y = newY;
    }

    if (Math.floor(player.x) === cat.x && Math.floor(player.y) === cat.y) {
        alert("🎉 You found the cat!");
        generateMaze();
        player = { x: 1, y: 1, angle: 0 };
    }
});

// Game Loop
function gameLoop() {
    castRays();
    drawMiniMap();
    requestAnimationFrame(gameLoop);
}

gameLoop();
