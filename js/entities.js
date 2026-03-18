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
        // apply gravity
        this.velocityY += GRAVITY * dt;
        if (this.velocityY > MAX_FALL_SPEED) this.velocityY = MAX_FALL_SPEED;
        
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        this.isGrounded = false; // Reset grounded state each frame
    }
    
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player extends Entity {
    constructor(x, y, color) {
        super(x, y, 28, 40); // Standard character size
        this.color = color;
        this.speed = 220;
        this.jumpForce = -450;
        this.isAlive = true;
        this.type = color === '#ff3b3b' ? 'fire' : 'water';
    }
    
    draw(ctx) {
        if (!this.isAlive) return;
        // Basic rendering matching the element
        ctx.fillStyle = this.color;
        
        // Draw body with rounded border
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 8);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 12, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 20, this.y + 12, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.beginPath();
        ctx.arc(this.x + 14, this.y + 20, 5, 0, Math.PI, false);
        ctx.stroke();
    }
}

class Pool extends Entity {
    constructor(x, y, width, height, type) {
        super(x, y, width, height);
        this.type = type;
        this.isGrounded = true; 
    }
    
    update(dt) {
        // Pools are static, do nothing
    }
    
    draw(ctx) {
        if (this.type === 'lava') ctx.fillStyle = '#ff3b3b';
        else if (this.type === 'water') ctx.fillStyle = '#3b82f6';
        else if (this.type === 'ooze') ctx.fillStyle = '#00ff2a';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(this.x, this.y, this.width, 3);
    }
}

class Door extends Entity {
    constructor(x, y, width, height, type) {
        super(x, y, width, height);
        this.type = type; // 'fire' or 'water'
    }
    
    draw(ctx) {
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = this.type === 'fire' ? '#ff3b3b' : '#3b82f6';
        ctx.font = 'bold 24px Cinzel';
        ctx.textAlign = 'center';
        ctx.fillText(this.type === 'fire' ? 'F' : 'W', this.x + this.width/2, this.y + this.height/2 + 8);
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
        ctx.fillStyle = this.color;
        let h = this.isPressed ? 4 : this.height;
        ctx.fillRect(this.x, this.y + (this.height - h), this.width, h);
    }
}

class Lever extends Entity {
    constructor(x, y, width, height, linkId) {
        super(x, y, width, height);
        this.linkId = linkId;
        this.isPulled = false;
        this.cooldown = 0;
    }
    update(dt) {
        if (this.cooldown > 0) this.cooldown -= dt;
    }
    draw(ctx) {
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(this.x, this.y + this.height - 5, this.width, 5); // base
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y + this.height);
        if (this.isPulled) {
            ctx.lineTo(this.x + this.width, this.y + 5);
        } else {
            ctx.lineTo(this.x, this.y + 5);
        }
        ctx.stroke();
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Lift extends Entity {
    constructor(x, y, width, height, id, targetY) {
        super(x, y, width, height);
        this.id = id;
        this.startY = y;
        this.targetY = targetY; // where it goes if activated
        this.isActive = false;
    }
    update(dt) {
        let ty = this.isActive ? this.targetY : this.startY;
        this.y += (ty - this.y) * 2 * dt;
    }
    draw(ctx) {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Gem extends Entity {
    constructor(x, y, type) {
        super(x, y, 18, 18);
        this.type = type; // 'fire' or 'water'
        this.isCollected = false;
        this.startY = y;
        this.time = 0;
    }
    update(dt) {
        if (this.isCollected) return;
        this.time += dt;
        this.y = this.startY + Math.sin(this.time * 3) * 4;
    }
    draw(ctx) {
        if (this.isCollected) return;
        
        ctx.fillStyle = this.type === 'fire' ? '#ff2a00' : '#00aeff';
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height/2);
        ctx.lineTo(this.x + this.width/2, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height/2);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y + 3);
        ctx.lineTo(this.x + this.width/2 + 4, this.y + this.height/2 - 2);
        ctx.lineTo(this.x + this.width/2 - 4, this.y + this.height/2 - 2);
        ctx.closePath();
        ctx.fill();
    }
}
