const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let score = 0;

// Player settings
let player = {
    x: 200,
    y: 400.1,
    width: 30,
    height: 30,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    moveSpeed: 5,
};

// Platforms settings
let platforms = [];
const platformWidth = 85;
const platformHeight = 15;
const platformCount = 8; // Número inicial de plataformas

// Create initial platforms
function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
        let platform = {
            x: Math.random() * (canvas.width - platformWidth),
            y: canvas.height - i * (canvas.height / platformCount) - 20,
            width: platformWidth,
            height: platformHeight
        };
        platforms.push(platform);
    }
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = "#ff5722";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw platforms
function drawPlatforms() {
    ctx.fillStyle = "#4caf50";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Handle player movement and physics
function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;
    player.x += player.dx;

    // Check boundaries for player
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // If the player falls off the screen, reset position to the last platform
    if (player.y > canvas.height) {
        resetPlayerPosition(); // Chame a função de reinicialização
    }
}

// Check for collision with platforms
function checkPlatformCollision() {
    platforms.forEach(platform => {
        if (player.dy > 0 && 
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height) {
            player.dy = player.jumpPower;
            score += 1;
        }
    });
}

// Move platforms and scroll screen as player jumps higher
function movePlatforms() {
    if (player.y < canvas.height / 3) {
        let scrollOffset = (canvas.height / 3) - player.y;
        player.y = canvas.height / 3;

        // Mover todas as plataformas para baixo
        platforms.forEach(platform => {
            platform.y += scrollOffset;
        });

        // Adicionar novas plataformas no topo se necessário
        while (platforms.length < 10) {  // Manter sempre 10 plataformas na tela
            let lastPlatform = platforms[platforms.length - 1];
            let newPlatform = {
                x: Math.random() * (canvas.width - platformWidth),
                y: lastPlatform ? lastPlatform.y - Math.random() * 100 - 20 : canvas.height - 100  // Posicionar a nova plataforma acima da última
            };
            platforms.push(newPlatform);
        }

        // Remover plataformas que saem da tela
        platforms = platforms.filter(platform => platform.y <= canvas.height);
    }
}

// Reset player position
function resetPlayerPosition() {
    player.x = 200;
    let highestPlatform = platforms[platforms.length - 1];
    player.y = highestPlatform ? highestPlatform.y - 50 : canvas.height - 50; // Start near the highest platform
    player.dy = 0; // Reset fall speed
}

// Handle keyboard input
function handleInput() {
    document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowLeft") {
            player.dx = -player.moveSpeed;
        } else if (event.code === "ArrowRight") {
            player.dx = player.moveSpeed;
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
            player.dx = 0;
        }
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    checkPlatformCollision();
    movePlatforms();
    drawPlatforms();
    drawPlayer();

    // Display score
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Initialize game
createPlatforms();
handleInput();
gameLoop();
