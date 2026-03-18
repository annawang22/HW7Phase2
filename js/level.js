// Holds the level layout, wall tiles, and interactive elements
const levelData = {
    walls: [
        // Exterior boundaries
        { x: 0, y: 550, width: 800, height: 50 }, // Ground
        { x: 0, y: 0, width: 50, height: 550 },   // Left wall
        { x: 750, y: 0, width: 50, height: 550 }, // Right wall
        { x: 0, y: 0, width: 800, height: 50 },   // Ceiling
        
        // Simple platforms for testing
        { x: 150, y: 450, width: 100, height: 20 },
        { x: 300, y: 350, width: 150, height: 20 },
        { x: 550, y: 250, width: 100, height: 20 }
    ],
    poolsInfo: [
        { x: 250, y: 540, width: 100, height: 10, type: 'lava' },
        { x: 450, y: 540, width: 100, height: 10, type: 'water' },
        { x: 650, y: 540, width: 100, height: 10, type: 'ooze' }
    ],
    doorsInfo: [
        { x: 60, y: 50, width: 45, height: 65, type: 'fire' },
        { x: 120, y: 50, width: 45, height: 65, type: 'water' }
    ],
    buttonsInfo: [
        { x: 260, y: 440, width: 30, height: 10, linkId: 'gate1', color: '#a832a8' }
    ],
    leversInfo: [
        { x: 400, y: 310, width: 30, height: 40, linkId: 'lift1' }
    ],
    gatesInfo: [
        { x: 410, y: 450, width: 20, height: 50, id: 'gate1', color: '#a832a8' }
    ],
    liftsInfo: [
        { x: 600, y: 450, width: 80, height: 15, id: 'lift1', targetY: 250 }
    ],
    gemsInfo: [
        { x: 220, y: 390, type: 'fire' },
        { x: 350, y: 310, type: 'water' },
        { x: 500, y: 220, type: 'water' },
        { x: 150, y: 410, type: 'fire' }
    ],
    spawnFireboy: { x: 80, y: 490 },
    spawnWatergirl: { x: 130, y: 490 }
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
    
    // Draw instructional text
    ctx.font = '20px Cinzel';
    ctx.fillStyle = '#fbd341';
    ctx.textAlign = 'left';
    ctx.fillText('USE A,W,D', 200, 470);
    ctx.fillText('TO MOVE WATERGIRL', 200, 495);
    
    ctx.fillText('USE THE ARROW KEYS', 500, 470);
    ctx.fillText('TO MOVE FIREBOY', 500, 495);
}
