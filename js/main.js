const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;
let gameState = 'START'; // START, PLAYING, GAMEOVER, VICTORY
let elapsedTime = 0; // seconds

// Game Objects
let fireboy;
let watergirl;
let pools = [];
let doors = [];
let buttons = [];
let levers = [];
let gates = [];
let lifts = [];
let gems = [];

function initGame() {
    fireboy = new Player(levelData.spawnFireboy.x, levelData.spawnFireboy.y, '#ff3b3b'); // Red
    watergirl = new Player(levelData.spawnWatergirl.x, levelData.spawnWatergirl.y, '#3b82f6'); // Blue
    pools = levelData.poolsInfo.map(p => new Pool(p.x, p.y, p.width, p.height, p.type));
    doors = levelData.doorsInfo.map(d => new Door(d.x, d.y, d.width, d.height, d.type));
    buttons = levelData.buttonsInfo ? levelData.buttonsInfo.map(b => new Button(b.x, b.y, b.width, b.height, b.linkId, b.color)) : [];
    levers = levelData.leversInfo ? levelData.leversInfo.map(l => new Lever(l.x, l.y, l.width, l.height, l.linkId)) : [];
    gates = levelData.gatesInfo ? levelData.gatesInfo.map(g => new Gate(g.x, g.y, g.width, g.height, g.id, g.color)) : [];
    lifts = levelData.liftsInfo ? levelData.liftsInfo.map(l => new Lift(l.x, l.y, l.width, l.height, l.id, l.targetY)) : [];
    gems = levelData.gemsInfo ? levelData.gemsInfo.map(g => new Gem(g.x, g.y, g.type)) : [];
    elapsedTime = 0;
    lastTime = performance.now();
    gameState = 'PLAYING';
    document.getElementById('start-screen').classList.replace('visible', 'hidden');
    document.getElementById('end-screen').classList.replace('visible', 'hidden');
}

function update(dt) {
    if (gameState !== 'PLAYING') return;
    
    elapsedTime += dt;
    document.getElementById('timer-display').innerText = formatTime(elapsedTime);
    
    // Controls Fireboy
    if (keys.left) fireboy.velocityX = -fireboy.speed;
    else if (keys.right) fireboy.velocityX = fireboy.speed;
    else fireboy.velocityX = 0;
    
    if (keys.up && fireboy.isGrounded) {
        fireboy.velocityY = fireboy.jumpForce;
        fireboy.isGrounded = false;
    }
    
    // Controls Watergirl
    if (keys.a) watergirl.velocityX = -watergirl.speed;
    else if (keys.d) watergirl.velocityX = watergirl.speed;
    else watergirl.velocityX = 0;
    
    if (keys.w && watergirl.isGrounded) {
        watergirl.velocityY = watergirl.jumpForce;
        watergirl.isGrounded = false;
    }
    
    // Mechanism updates
    levers.forEach(l => l.update(dt));
    gates.forEach(g => g.update(dt));
    lifts.forEach(l => l.update(dt));
    
    // Check buttons
    buttons.forEach(b => {
        b.isPressed = checkAABB(fireboy, b) || checkAABB(watergirl, b);
    });
    
    // Update mechanism states based on buttons and levers
    gates.forEach(g => {
        g.isActive = buttons.some(b => b.linkId === g.id && b.isPressed) || 
                     levers.some(l => l.linkId === g.id && l.isPulled);
    });
    fillsLiftsState();
    
    function fillsLiftsState() {
        lifts.forEach(lf => {
            lf.isActive = buttons.some(b => b.linkId === lf.id && b.isPressed) || 
                          levers.some(l => l.linkId === lf.id && l.isPulled);
        });
    }

    // Y-axis updates and collisions first
    fireboy.velocityY += GRAVITY * dt;
    if (fireboy.velocityY > MAX_FALL_SPEED) fireboy.velocityY = MAX_FALL_SPEED;
    fireboy.y += fireboy.velocityY * dt;
    fireboy.isGrounded = false;
    
    watergirl.velocityY += GRAVITY * dt;
    if (watergirl.velocityY > MAX_FALL_SPEED) watergirl.velocityY = MAX_FALL_SPEED;
    watergirl.y += watergirl.velocityY * dt;
    watergirl.isGrounded = false;
    
    let colliders = [...levelData.walls, ...gates, ...lifts];
    
    colliders.forEach(w => resolveCollisionY(fireboy, w));
    colliders.forEach(w => resolveCollisionY(watergirl, w));

    // X-axis updates and collisions
    fireboy.x += fireboy.velocityX * dt;
    watergirl.x += watergirl.velocityX * dt;
    
    colliders.forEach(w => resolveCollisionX(fireboy, w));
    colliders.forEach(w => resolveCollisionX(watergirl, w));
    
    // Check levers (interaction key Space or Down, or just overlap + movement)
    // We will use standing in front of lever and pressing 'up' for fireboy, 'w' for watergirl to pull it.
    // Or just simple overlap + down to pull. Let's make it simpler: touching it pulls it slowly.
    // In fireboy and watergirl, you just stand near it and it toggles.
    levers.forEach(l => {
        let fireTouched  = checkAABB(fireboy, l);
        let waterTouched = checkAABB(watergirl, l);
        let anyTouched   = fireTouched || waterTouched;
        // Only toggle on the moment of contact, not while standing in it
        if (anyTouched && !l.wasTouched) {
            l.isPulled = !l.isPulled;
        }
        l.wasTouched = anyTouched;
    });
    
    // Elemental pools collision
    pools.forEach(pool => {
        if (checkAABB(fireboy, pool)) handlePoolCollision(fireboy, pool);
        if (checkAABB(watergirl, pool)) handlePoolCollision(watergirl, pool);
    });
    
    // Gem logic
    gems.forEach(g => {
        if (!g.isCollected) {
            g.update(dt);
            if (g.type === 'fire' && checkAABB(fireboy, g)) g.isCollected = true;
            if (g.type === 'water' && checkAABB(watergirl, g)) g.isCollected = true;
        }
    });

    // Check goals
    let fireDoor = doors.find(d => d.type === 'fire');
    let waterDoor = doors.find(d => d.type === 'water');
    if (fireDoor && waterDoor && fireboy.isAlive && watergirl.isAlive) {
        if (checkAABB(fireboy, fireDoor) && checkAABB(watergirl, waterDoor)) {
            levelComplete();
        }
    }
}

function handlePoolCollision(player, pool) {
    if (!player.isAlive) return;
    
    if (pool.type === 'ooze') {
        player.isAlive = false;
    } else if (pool.type === 'lava' && player.type === 'water') {
        player.isAlive = false;
    } else if (pool.type === 'water' && player.type === 'fire') {
        player.isAlive = false;
    }
    
    if (!player.isAlive) {
        gameOver("A character died in an opposing element!");
    }
}

function gameOver(reason) {
    gameState = 'GAMEOVER';
    document.getElementById('end-title').innerText = "Game Over";
    document.getElementById('end-message').innerText = reason;
    document.getElementById('end-screen').classList.replace('hidden', 'visible');
}

function levelComplete() {
    gameState = 'VICTORY';
    document.getElementById('end-title').innerText = "Level Complete!";
    
    let totalGems = gems.length;
    let collectedGems = gems.filter(g => g.isCollected).length;
    document.getElementById('end-message').innerText = `You both made it! Gems: ${collectedGems}/${totalGems}`;
    document.getElementById('final-time').innerText = formatTime(elapsedTime);
    
    let rank = elapsedTime < 60 && collectedGems === totalGems ? 'A' : (elapsedTime < 120 ? 'B' : 'C');
    document.getElementById('final-rank').innerText = rank;
    document.getElementById('end-screen').classList.replace('hidden', 'visible');
}

function draw(ctx) {
    if (gameState === 'START') return;

    // Draw background
    ctx.fillStyle = '#3a3a2a'; // Dark temple background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawLevel(ctx);
    doors.forEach(d => d.draw(ctx));
    gates.forEach(g => g.draw(ctx));
    lifts.forEach(l => l.draw(ctx));
    buttons.forEach(b => b.draw(ctx));
    levers.forEach(l => l.draw(ctx));
    pools.forEach(p => p.draw(ctx));
    gems.forEach(g => g.draw(ctx));
    
    if (fireboy && watergirl) {
        fireboy.draw(ctx);
        watergirl.draw(ctx);
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000; // in seconds
    lastTime = timestamp;

    update(dt);
    draw(ctx);

    requestAnimationFrame(gameLoop);
}

document.getElementById('start-button').addEventListener('click', initGame);
document.getElementById('restart-button').addEventListener('click', initGame);

requestAnimationFrame(gameLoop);