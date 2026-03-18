// Holds the level layout, wall tiles, and interactive elements
const levelData = {
    walls: [
        // Exterior boundaries
        { x: 0, y: 550, width: 800, height: 50 }, // Ground
        { x: 0, y: 0, width: 50, height: 550 },   // Left wall
        { x: 750, y: 0, width: 50, height: 550 }, // Right wall
        { x: 0, y: 0, width: 800, height: 50 },   // Ceiling
        
        // Step 1 — sits on top of the lava pool (x:300, y:530), same x and width
        { x: 300, y: 510, width: 90,  height: 20 },
        // Platform 1 — wide ledge, reachable from Step 1 (1 jump up ~90px)
        { x: 50,  y: 380, width: 200, height: 20 },
        // Platform 2 — middle ledge, reachable from right edge of P1 (1 jump right+up)
        { x: 280, y: 290, width: 200, height: 20 },
        // Platform 3 — upper right, reachable from right edge of P2 (1 jump right+up)
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
        { x: 190, y: 370, width: 30, height: 10, linkId: 'gate1', color: '#a832a8' }
    ],
    leversInfo: [
        { x: 430, y: 250, width: 30, height: 40, linkId: 'lift1' }
    ],
    gatesInfo: [
        { x: 275, y: 220, width: 20, height: 70, id: 'gate1', color: '#a832a8' }
    ],
    liftsInfo: [
        { x: 460, y: 275, width: 70, height: 15, id: 'lift1', targetY: 165 }
    ],
    gemsInfo: [
        { x: 100, y: 440, type: 'fire' },   // Platform 1
        { x: 140, y: 440, type: 'water' },  // Platform 1
        { x: 320, y: 260, type: 'fire' },   // Platform 2
        { x: 380, y: 260, type: 'water' },  // Platform 2
        { x: 550, y: 150, type: 'fire' },   // Platform 3
        { x: 590, y: 150, type: 'water' }   // Platform 3
    ],
    spawnFireboy:   { x: 80,  y: 500 },
    spawnWatergirl: { x: 115, y: 500 }
};

function drawLevel(ctx) {
    // Draw walls (brick texture style)
    ctx.fillStyle = '#6e5a3c'; // Brownish brick color like reference
    levelData.walls.forEach(w => {
        ctx.fillRect(w.x, w.y, w.width, w.height);
        
        ctx.strokeStyle = '#3e301d';
        ctx.lineWidth = 2;
        ctx.strokeRect(w.x, w.y, w.width, w.height);
    });
    
    // Instructions — drawn at the very top, inside the ceiling band (y=0–50)
    ctx.font = 'bold 13px Nunito';
    ctx.fillStyle = '#fbd341';
    ctx.textAlign = 'left';
    ctx.fillText('A/W/D  =  WATERGIRL', 58, 32);
    ctx.textAlign = 'right';
    ctx.fillText('ARROWS  =  FIREBOY', 742, 32);
}