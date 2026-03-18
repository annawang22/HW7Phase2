const keys = {
    up: false,
    left: false,
    right: false,
    w: false,
    a: false,
    d: false
};

window.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'ArrowUp': keys.up = true; break;
        case 'ArrowLeft': keys.left = true; break;
        case 'ArrowRight': keys.right = true; break;
        case 'KeyW': keys.w = true; break;
        case 'KeyA': keys.a = true; break;
        case 'KeyD': keys.d = true; break;
        // Prevent default scrolling for arrows/space
        case 'ArrowUp': case 'ArrowDown': case 'Space': e.preventDefault(); break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'ArrowUp': keys.up = false; break;
        case 'ArrowLeft': keys.left = false; break;
        case 'ArrowRight': keys.right = false; break;
        case 'KeyW': keys.w = false; break;
        case 'KeyA': keys.a = false; break;
        case 'KeyD': keys.d = false; break;
    }
});
