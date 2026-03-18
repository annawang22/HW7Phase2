// Simple AABB Physics config
const GRAVITY = 1000; // pixels per second squared
const MAX_FALL_SPEED = 600;

function checkAABB(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function resolveCollisionY(entity, wall) {
    if (checkAABB(entity, wall)) {
        if (entity.velocityY > 0) { // falling
            entity.y = wall.y - entity.height;
            entity.velocityY = 0;
            entity.isGrounded = true;
        } else if (entity.velocityY < 0) { // moving up
            entity.y = wall.y + wall.height;
            entity.velocityY = 0;
        }
    }
}

function resolveCollisionX(entity, wall) {
    if (checkAABB(entity, wall)) {
        if (entity.velocityX > 0) { // moving right
            entity.x = wall.x - entity.width;
            entity.velocityX = 0;
        } else if (entity.velocityX < 0) { // moving left
            entity.x = wall.x + wall.width;
            entity.velocityX = 0;
        }
    }
}
