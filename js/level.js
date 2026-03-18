// Holds the level layout, wall tiles, and interactive elements
const levelData = {
    walls: [
        // Exterior boundaries
        { x: 0, y: 550, width: 800, height: 50 }, // Ground
        { x: 0, y: 0, width: 50, height: 550 },   // Left wall
        { x: 750, y: 0, width: 50, height: 550 }, // Right wall
        { x: 0, y: 0, width: 800, height: 50 },   // Ceiling
        
        // Step 1
        { x: 300, y: 460, width: 90,  height: 20 },
        // Platform 1
        { x: 50,  y: 380, width: 200, height: 20 },
        // Platform 2
        { x: 280, y: 290, width: 200, height: 20 },
        // Platform 3
        { x: 510, y: 180, width: 240, height: 20 }
    ],
    poolsInfo: [
        { x: 300, y: 530, width: 90,  height: 20, type: 'lava' },
        { x: 480, y: 530, width: 90,  height: 20, type: 'water' },
        { x: 390, y: 530, width: 90,  height: 20, type: 'ooze' }
    ],
    doorsInfo: [
        { x: 620, y: 115, width: 45, height: 65, type: 'fire' },
        { x: 680, y: 115, width: 45, height: 65, type: 'water' }
    ],
    buttonsInfo: [
        { x: 190, y: 370, width: 30, height: 10, linkId: 'gate1', color: '#a832a8' },
        { x: 290, y: 280, width: 30, height: 10, linkId: 'gate1', color: '#a832a8' }
    ],
    leversInfo: [
        { x: 430, y: 250, width: 30, height: 40, linkId: 'lift1' }
    ],
    gatesInfo: [
        { x: 275, y: 220, width: 20, height: 70, id: 'gate1', color: '#a832a8' }
    ],
    liftsInfo: [
        { x: 460, y: 275, width: 70, height: 15, id: 'lift1', targetY: 220 }
    ],
    gemsInfo: [
        { x: 100, y: 440, type: 'fire' },
        { x: 140, y: 440, type: 'water' },
        { x: 320, y: 260, type: 'fire' },
        { x: 380, y: 260, type: 'water' },
        { x: 550, y: 150, type: 'fire' },
        { x: 590, y: 150, type: 'water' }
    ],
    spawnFireboy:   { x: 80,  y: 500 },
    spawnWatergirl: { x: 115, y: 500 }
};

// Seeded noise helper for consistent moss placement
function seededRand(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
}

function drawBrickWall(ctx, wx, wy, ww, wh) {
    const brickH = 14;
    const brickW = 32;
    const mortarSize = 2;

    // Wall base
    ctx.fillStyle = '#5a4228';
    ctx.fillRect(wx, wy, ww, wh);

    // Brick rows
    const rows = Math.ceil(wh / brickH) + 1;
    const cols = Math.ceil(ww / brickW) + 1;

    for (let row = 0; row < rows; row++) {
        const ry = wy + row * brickH;
        const offset = (row % 2) * (brickW / 2);

        for (let col = -1; col < cols + 1; col++) {
            const rx = wx + col * brickW - offset;
            const bx = Math.max(rx, wx);
            const by = Math.max(ry, wy);
            const bw = Math.min(rx + brickW - mortarSize, wx + ww) - bx;
            const bh = Math.min(ry + brickH - mortarSize, wy + wh) - by;

            if (bw <= 0 || bh <= 0) continue;

            const shade = seededRand(col + row * 31, row) * 0.18;
            const r = Math.floor(100 + shade * 40);
            const g = Math.floor(72 + shade * 28);
            const b = Math.floor(42 + shade * 20);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(bx, by, bw, bh);

            // Top-left brick highlight
            ctx.fillStyle = 'rgba(255,255,220,0.06)';
            ctx.fillRect(bx, by, bw, 2);
            ctx.fillRect(bx, by, 2, bh);

            // Bottom-right brick shadow
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.fillRect(bx, by + bh - 2, bw, 2);
            ctx.fillRect(bx + bw - 2, by, 2, bh);
        }
    }

    // Mortar lines overlay
    ctx.strokeStyle = '#3a2810';
    ctx.lineWidth = mortarSize;

    // Horizontal mortar
    for (let row = 1; row < rows; row++) {
        const ly = wy + row * brickH - 1;
        if (ly < wy || ly > wy + wh) continue;
        ctx.beginPath();
        ctx.moveTo(wx, ly);
        ctx.lineTo(wx + ww, ly);
        ctx.stroke();
    }

    // Vertical mortar
    for (let row = 0; row < rows; row++) {
        const offset = (row % 2) * (brickW / 2);
        const ry = wy + row * brickH;
        for (let col = 0; col <= cols; col++) {
            const lx = wx + col * brickW - offset;
            if (lx < wx || lx > wx + ww) continue;
            ctx.beginPath();
            ctx.moveTo(lx, Math.max(ry, wy));
            ctx.lineTo(lx, Math.min(ry + brickH - mortarSize, wy + wh));
            ctx.stroke();
        }
    }
}

function drawMossAccents(ctx, wx, wy, ww, wh) {
    // Mossy drips from top edges
    const drops = Math.ceil(ww / 18);
    for (let i = 0; i < drops; i++) {
        const r = seededRand(wx + i * 7, wy);
        if (r < 0.45) continue;
        const mx = wx + i * (ww / drops) + seededRand(i, wy) * 12;
        const len = 4 + seededRand(i * 2, wy) * 12;
        const alpha = 0.5 + seededRand(i, wy + 1) * 0.45;

        ctx.fillStyle = `rgba(58,120,30,${alpha})`;
        ctx.beginPath();
        ctx.ellipse(mx, wy + len / 2, 3, len / 2 + 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lighter moss highlight
        ctx.fillStyle = `rgba(90,180,40,${alpha * 0.6})`;
        ctx.beginPath();
        ctx.ellipse(mx - 0.8, wy + 2, 1.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Corner moss patches
    if (ww > 40 && wh > 30) {
        ctx.fillStyle = 'rgba(50,110,20,0.6)';
        ctx.beginPath();
        ctx.ellipse(wx + 8, wy + 6, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(wx + ww - 8, wy + 6, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBackground(ctx) {
    // Deep dark stone background
    ctx.fillStyle = '#2a2018';
    ctx.fillRect(0, 0, 800, 600);

    // Background texture: faint large stone blocks
    ctx.fillStyle = 'rgba(60,45,25,0.4)';
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 7; col++) {
            const shade = seededRand(col + 100, row + 200) * 0.08;
            ctx.fillStyle = `rgba(${55+shade*30},${40+shade*20},${20+shade*10},0.35)`;
            ctx.fillRect(col * 120 + 10, row * 70 + 5, 110, 62);
        }
    }

    // Subtle vignette
    const vignette = ctx.createRadialGradient(400, 300, 100, 400, 300, 550);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 800, 600);
}

function drawLevel(ctx) {
    drawBackground(ctx);

    levelData.walls.forEach(w => {
        drawBrickWall(ctx, w.x, w.y, w.width, w.height);
        drawMossAccents(ctx, w.x, w.y, w.width, w.height);
    });

    // Timer label area — rendered on ceiling
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(251,211,65,0.85)';
    ctx.textAlign = 'left';
    ctx.fillText('A/W/D  =  WATERGIRL', 58, 33);
    ctx.textAlign = 'right';
    ctx.fillText('ARROWS  =  FIREBOY', 742, 33);
    ctx.textAlign = 'left';
}