// Holds the level layout, wall tiles, and interactive elements
const levelData = {
    walls: [
        // Exterior boundaries
        { x: 0, y: 550, width: 800, height: 50 }, // Ground
        { x: 0, y: 0, width: 50, height: 550 },   // Left wall
        { x: 750, y: 0, width: 50, height: 550 }, // Right wall
        { x: 0, y: 0, width: 800, height: 50 },   // Ceiling
        
        // Platform 1 — low ledge on the left, reachable from ground
        { x: 50, y: 420, width: 220, height: 20 },
        // Platform 2 — mid ledge in the center, blocked by a gate
        { x: 300, y: 300, width: 200, height: 20 },
        // Platform 3 — upper ledge on the right, leads to the doors
        { x: 530, y: 180, width: 220, height: 20 },
        // Small step connecting ground to Platform 1 (makes jump reachable)
        { x: 150, y: 480, width: 60, height: 20 }
    ],
    poolsInfo: [
        { x: 270, y: 530, width: 80, height: 20, type: 'lava' },   // blocks path right of step
        { x: 430, y: 530, width: 80, height: 20, type: 'water' },  // further right obstacle
        { x: 350, y: 530, width: 80, height: 20, type: 'ooze' },   // between lava and water
    ],
    doorsInfo: [
        { x: 610, y: 115, width: 45, height: 65, type: 'fire' },
        { x: 670, y: 115, width: 45, height: 65, type: 'water' }
    ],
    buttonsInfo: [
        { x: 220, y: 410, width: 30, height: 10, linkId: 'gate1', color: '#a832a8' }
    ],
    leversInfo: [
        { x: 460, y: 260, width: 30, height: 40, linkId: 'lift1' }
    ],
    gatesInfo: [
        { x: 295, y: 230, width: 20, height: 70, id: 'gate1', color: '#a832a8' }
    ],
    liftsInfo: [
        { x: 510, y: 280, width: 70, height: 15, id: 'lift1', targetY: 165 }
    ],
    gemsInfo: [
        { x: 80,  y: 500, type: 'fire' },   // ground floor near Fireboy spawn
        { x: 130, y: 500, type: 'water' },  // ground floor near Watergirl spawn
        { x: 160, y: 395, type: 'fire' },   // Platform 1
        { x: 200, y: 395, type: 'water' },  // Platform 1
        { x: 360, y: 275, type: 'fire' },   // Platform 2
        { x: 420, y: 275, type: 'water' },  // Platform 2
        { x: 570, y: 155, type: 'fire' },   // Platform 3
        { x: 600, y: 155, type: 'water' }   // Platform 3
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
    
    // Draw instructional text on the ground floor open area
    ctx.font = '14px Cinzel';
    ctx.fillStyle = '#fbd341';
    ctx.textAlign = 'center';
    ctx.fillText('A/W/D = WATERGIRL', 110, 545);
    ctx.fillText('ARROWS = FIREBOY', 110, 562);
}