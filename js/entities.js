class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
    }
    
    update(dt) {
        this.velocityY += GRAVITY * dt;
        if (this.velocityY > MAX_FALL_SPEED) this.velocityY = MAX_FALL_SPEED;
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        this.isGrounded = false;
    }
    
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player extends Entity {
    constructor(x, y, color) {
        super(x, y, 28, 40);
        this.color = color;
        this.speed = 220;
        this.jumpForce = -450;
        this.isAlive = true;
        this.type = color === '#ff3b3b' ? 'fire' : 'water';
        this.animTime = Math.random() * 6;
        this.facing = 1;
    }
    
    draw(ctx) {
        if (!this.isAlive) return;
        this.animTime += 0.016;
        if (this.velocityX > 0) this.facing = 1;
        if (this.velocityX < 0) this.facing = -1;

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const bob = Math.sin(this.animTime * 6) * 1.5;

        ctx.save();
        ctx.translate(cx, cy + bob);

        if (this.type === 'fire') {
            this._drawFireboy(ctx);
        } else {
            this._drawWatergirl(ctx);
        }

        ctx.restore();
    }

    _drawFireboy(ctx) {
        // Outer glow
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
        glow.addColorStop(0, 'rgba(255,120,0,0.35)');
        glow.addColorStop(1, 'rgba(255,60,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.ellipse(0, 4, 26, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillStyle = '#b01818';
        ctx.beginPath();
        ctx.roundRect(-10, 10, 8, 10, [0, 0, 4, 4]);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(2, 10, 8, 10, [0, 0, 4, 4]);
        ctx.fill();

        // Body
        const bodyGrad = ctx.createLinearGradient(-10, -2, 10, 14);
        bodyGrad.addColorStop(0, '#ff5a2a');
        bodyGrad.addColorStop(1, '#cc1a00');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.roundRect(-10, -2, 20, 14, 4);
        ctx.fill();

        // Flame head
        const flameGrad = ctx.createRadialGradient(-1, -12, 1, 0, -6, 18);
        flameGrad.addColorStop(0, '#ffee88');
        flameGrad.addColorStop(0.35, '#ff9900');
        flameGrad.addColorStop(0.75, '#e83020');
        flameGrad.addColorStop(1, 'rgba(180,20,0,0)');
        ctx.fillStyle = flameGrad;

        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.bezierCurveTo(8, -16, 16, -6, 12, 2);
        ctx.bezierCurveTo(8, 7, -8, 7, -12, 2);
        ctx.bezierCurveTo(-16, -6, -8, -16, 0, -22);
        ctx.fill();

        // Secondary smaller flame
        ctx.fillStyle = 'rgba(255,220,80,0.5)';
        ctx.beginPath();
        ctx.moveTo(0, -19);
        ctx.bezierCurveTo(4, -14, 7, -7, 4, -2);
        ctx.bezierCurveTo(2, 1, -2, 1, -4, -2);
        ctx.bezierCurveTo(-7, -7, -4, -14, 0, -19);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-4.5, -8, 4, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(4.5, -8, 4, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1a0800';
        ctx.beginPath();
        ctx.arc(-3.5 + this.facing * 1.5, -8, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5.5 + this.facing * 1.5, -8, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(-2.5, -9.5, 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6.5, -9.5, 1.1, 0, Math.PI * 2);
        ctx.fill();
    }

    _drawWatergirl(ctx) {
        // Outer glow
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
        glow.addColorStop(0, 'rgba(80,160,255,0.35)');
        glow.addColorStop(1, 'rgba(40,100,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.ellipse(0, 4, 26, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillStyle = '#1440b0';
        ctx.beginPath();
        ctx.roundRect(-10, 10, 8, 10, [0, 0, 4, 4]);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(2, 10, 8, 10, [0, 0, 4, 4]);
        ctx.fill();

        // Body
        const bodyGrad = ctx.createLinearGradient(-10, -2, 10, 14);
        bodyGrad.addColorStop(0, '#60a8ff');
        bodyGrad.addColorStop(1, '#1e50d0');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.roundRect(-10, -2, 20, 14, 4);
        ctx.fill();

        // Teardrop head
        const headGrad = ctx.createRadialGradient(-3, -14, 1, 0, -8, 16);
        headGrad.addColorStop(0, '#b8e0ff');
        headGrad.addColorStop(0.4, '#4fa0ff');
        headGrad.addColorStop(0.8, '#1a60e0');
        headGrad.addColorStop(1, 'rgba(10,40,180,0)');
        ctx.fillStyle = headGrad;

        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.bezierCurveTo(10, -16, 13, -5, 11, 2);
        ctx.bezierCurveTo(7, 8, -7, 8, -11, 2);
        ctx.bezierCurveTo(-13, -5, -10, -16, 0, -22);
        ctx.fill();

        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.ellipse(-4, -15, 4.5, 3, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-4.5, -9, 3.8, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(4.5, -9, 3.8, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#001828';
        ctx.beginPath();
        ctx.arc(-3.5 + this.facing * 1.5, -9, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5.5 + this.facing * 1.5, -9, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(-2.5, -10.5, 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6.5, -10.5, 1.1, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Pool extends Entity {
    constructor(x, y, width, height, type) {
        super(x, y, width, height);
        this.type = type;
        this.isGrounded = true;
        this.time = Math.random() * 10;
    }
    
    update(dt) {
        this.time += dt;
    }
    
    draw(ctx) {
        let topColor, midColor, baseColor, glowColor;
        if (this.type === 'lava') {
            topColor = '#ff7744'; midColor = '#dd2200'; baseColor = '#880000';
            glowColor = 'rgba(255,80,0,0.45)';
        } else if (this.type === 'water') {
            topColor = '#66ccff'; midColor = '#1177cc'; baseColor = '#003388';
            glowColor = 'rgba(40,140,255,0.4)';
        } else {
            topColor = '#66ff88'; midColor = '#009933'; baseColor = '#004400';
            glowColor = 'rgba(0,200,60,0.4)';
        }

        // Ambient glow above pool
        const glowGrad = ctx.createLinearGradient(this.x, this.y - 8, this.x, this.y + 4);
        glowGrad.addColorStop(0, 'transparent');
        glowGrad.addColorStop(1, glowColor);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(this.x, this.y - 8, this.width, 12);

        // Pool body
        const poolGrad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        poolGrad.addColorStop(0, topColor);
        poolGrad.addColorStop(0.3, midColor);
        poolGrad.addColorStop(1, baseColor);
        ctx.fillStyle = poolGrad;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Animated surface shimmer
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x + 1, this.y, this.width - 2, this.height);
        ctx.clip();
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
            const offset = (this.time * 35 + i * 28) % (this.width + 24);
            const wx = this.x + offset - 12;
            ctx.beginPath();
            ctx.moveTo(wx, this.y + 5);
            ctx.quadraticCurveTo(wx + 7, this.y + 2, wx + 14, this.y + 5);
            ctx.stroke();
        }
        ctx.restore();
    }
}

class Door extends Entity {
    constructor(x, y, width, height, type) {
        super(x, y, width, height);
        this.type = type;
        this.time = Math.random() * 6;
    }
    
    draw(ctx) {
        this.time += 0.016;
        const isfire = this.type === 'fire';
        const col = isfire ? '#e83030' : '#2563eb';
        const glowCol = isfire ? 'rgba(255,80,0,0.5)' : 'rgba(60,130,255,0.5)';
        const pulse = 0.6 + Math.sin(this.time * 2.5) * 0.4;

        // Pulsing glow
        ctx.save();
        ctx.globalAlpha = pulse;
        const gr = ctx.createRadialGradient(this.x + this.width/2, this.y + this.height/2, 4, this.x + this.width/2, this.y + this.height/2, 38);
        gr.addColorStop(0, glowCol);
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.fillRect(this.x - 22, this.y - 12, this.width + 44, this.height + 24);
        ctx.restore();

        // Stone frame
        ctx.fillStyle = '#3d2b1a';
        ctx.beginPath();
        ctx.roundRect(this.x - 4, this.y - 4, this.width + 8, this.height + 4, 4);
        ctx.fill();
        ctx.fillStyle = '#2a1a08';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Arch
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 4, this.width / 2 - 1, Math.PI, 0);
        ctx.fill();

        // Vertical stripe (door body color band)
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fillRect(this.x + this.width/2 - 3, this.y + 4, 6, this.height - 4);

        // Label
        ctx.fillStyle = col;
        ctx.font = 'bold 18px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = col;
        ctx.shadowBlur = 8;
        ctx.fillText(isfire ? 'F' : 'W', this.x + this.width / 2, this.y + this.height - 10);
        ctx.shadowBlur = 0;
    }
}

class Button extends Entity {
    constructor(x, y, width, height, linkId, color) {
        super(x, y, width, height);
        this.linkId = linkId;
        this.isPressed = false;
        this.color = color || '#a832a8';
    }
    draw(ctx) {
        const h = this.isPressed ? 4 : this.height;
        const yOff = this.y + (this.height - h);

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(this.x + 2, yOff + 2, this.width, h);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, yOff, this.width, h, 3);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillRect(this.x + 3, yOff + 2, this.width - 6, 3);
    }
}

class Lever extends Entity {
    constructor(x, y, width, height, linkId) {
        super(x, y, width, height);
        this.linkId = linkId;
        this.isPulled = false;
        this.cooldown = 0;
        this.animAngle = -1;
    }
    update(dt) {
        if (this.cooldown > 0) this.cooldown -= dt;
        const target = this.isPulled ? 1 : -1;
        this.animAngle += (target - this.animAngle) * 10 * dt;
    }
    draw(ctx) {
        const bx = this.x + this.width / 2;
        const by = this.y + this.height;

        // Base
        ctx.fillStyle = '#7a5010';
        ctx.beginPath();
        ctx.roundRect(this.x - 3, by - 8, this.width + 6, 9, 3);
        ctx.fill();
        ctx.fillStyle = '#c8860a';
        ctx.fillRect(this.x, by - 7, this.width, 5);

        // Lever arm
        const angle = this.animAngle * 0.6;
        const len = this.height - 10;
        const tx = bx + Math.sin(angle) * len;
        const ty = by - Math.cos(angle) * len;

        ctx.strokeStyle = '#c87810';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx, by - 5);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        ctx.strokeStyle = '#ffcc44';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx, by - 5);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Knob
        const kg = ctx.createRadialGradient(tx - 2, ty - 2, 1, tx, ty, 7);
        kg.addColorStop(0, '#fff0a0');
        kg.addColorStop(0.5, '#ffcc00');
        kg.addColorStop(1, '#996600');
        ctx.fillStyle = kg;
        ctx.beginPath();
        ctx.arc(tx, ty, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pivot
        ctx.fillStyle = '#604010';
        ctx.beginPath();
        ctx.arc(bx, by - 5, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#aa8030';
        ctx.beginPath();
        ctx.arc(bx, by - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Gate extends Entity {
    constructor(x, y, width, height, id, color) {
        super(x, y, width, height);
        this.id = id;
        this.isActive = false;
        this.startY = y;
        this.color = color || '#a832a8';
    }
    update(dt) {
        let targetY = this.isActive ? this.startY - this.height : this.startY;
        this.y += (targetY - this.y) * 5 * dt;
    }
    draw(ctx) {
        const visible = this.startY - this.y;
        if (visible < 2) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Bar stripes
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        const bars = Math.max(2, Math.floor(this.width / 9));
        for (let i = 0; i < bars; i++) {
            ctx.fillRect(this.x + i * (this.width / bars), this.y, 3, this.height);
        }
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(this.x, this.y + this.height - 4, this.width, 4);
    }
}

class Lift extends Entity {
    constructor(x, y, width, height, id, targetY) {
        super(x, y, width, height);
        this.id = id;
        this.startY = y;
        this.targetY = targetY;
        this.isActive = false;
    }
    update(dt) {
        let ty = this.isActive ? this.targetY : this.startY;
        this.y += (ty - this.y) * 2 * dt;
    }
    draw(ctx) {
        // Drop shadow
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fillRect(this.x + 4, this.y + this.height + 1, this.width - 4, 5);

        // Main body gradient
        const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        grad.addColorStop(0, '#e8ddc0');
        grad.addColorStop(0.4, '#c8aa70');
        grad.addColorStop(1, '#8a6030');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 3);
        ctx.fill();

        // Top highlight
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fillRect(this.x + 5, this.y + 2, this.width - 10, 3);

        // Edge border
        ctx.strokeStyle = '#604820';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 3);
        ctx.stroke();

        // Rivets
        [10, this.width / 2, this.width - 10].forEach(rx => {
            ctx.fillStyle = '#5a3810';
            ctx.beginPath();
            ctx.arc(this.x + rx, this.y + this.height / 2, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#c89050';
            ctx.beginPath();
            ctx.arc(this.x + rx - 0.8, this.y + this.height / 2 - 0.8, 1.2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Chain lines
        ctx.strokeStyle = 'rgba(140,100,40,0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y);
        ctx.lineTo(this.x + 12, this.y - 30);
        ctx.moveTo(this.x + this.width - 12, this.y);
        ctx.lineTo(this.x + this.width - 12, this.y - 30);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

class Gem extends Entity {
    constructor(x, y, type) {
        super(x, y, 18, 18);
        this.type = type;
        this.isCollected = false;
        this.startY = y;
        this.time = Math.random() * Math.PI * 2;
    }
    update(dt) {
        if (this.isCollected) return;
        this.time += dt;
        this.y = this.startY + Math.sin(this.time * 3) * 4;
    }
    draw(ctx) {
        if (this.isCollected) return;
        const isfire = this.type === 'fire';
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Outer glow
        const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
        if (isfire) {
            gr.addColorStop(0, 'rgba(255,100,0,0.5)');
        } else {
            gr.addColorStop(0, 'rgba(40,160,255,0.5)');
        }
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 18, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Diamond
        const dg = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        if (isfire) {
            dg.addColorStop(0, '#ffaa66');
            dg.addColorStop(0.45, '#ff3300');
            dg.addColorStop(1, '#881100');
        } else {
            dg.addColorStop(0, '#aaeeff');
            dg.addColorStop(0.45, '#0088dd');
            dg.addColorStop(1, '#003366');
        }
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.moveTo(cx, this.y);
        ctx.lineTo(this.x + this.width, cy);
        ctx.lineTo(cx, this.y + this.height);
        ctx.lineTo(this.x, cy);
        ctx.closePath();
        ctx.fill();

        // Top-left facet highlight
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.moveTo(cx, this.y + 3);
        ctx.lineTo(cx + 5, cy - 1);
        ctx.lineTo(cx, cy - 2);
        ctx.lineTo(cx - 5, cy - 1);
        ctx.closePath();
        ctx.fill();

        // Small inner sparkle
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(cx - 2, this.y + 5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Rotating sparkle cross
        const spark = Math.sin(this.time * 5);
        if (spark > 0.5) {
            ctx.strokeStyle = 'rgba(255,255,255,' + ((spark - 0.5) * 2 * 0.8) + ')';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(cx, this.y - 5); ctx.lineTo(cx, this.y - 2);
            ctx.moveTo(cx - 3.5, this.y - 3.5); ctx.lineTo(cx + 3.5, this.y - 3.5);
            ctx.stroke();
        }
    }
}