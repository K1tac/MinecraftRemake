// app.js

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x87CEEB); // Add background color (light blue for sky effect)

const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

function createBlock(x, y, z) {
    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    block.position.set(x, y, z);
    scene.add(block);
}

// Create a 5x5 grid of blocks, positioned on the ground
for (let x = -2; x < 3; x++) {
    for (let z = -2; z < 3; z++) {
        createBlock(x, 0, z);
    }
}

camera.position.set(0, 2, 5); // Position camera slightly above the ground

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let jump = false;
let velocity = new THREE.Vector3();
let isJumping = false;
let jumpVelocity = 0.1;
let gravity = -0.01;

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') moveForward = true;
    if (event.key === 's') moveBackward = true;
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
    if (event.key === ' ' && !isJumping) jump = true;
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'w') moveForward = false;
    if (event.key === 's') moveBackward = false;
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
    if (event.key === ' ') jump = false;
});

document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
document.addEventListener('click', () => {
    document.body.requestPointerLock();
});

let pitch = 0;
let yaw = 0;
document.addEventListener('mousemove', (event) => {
    yaw -= event.movementX * 0.002;
    pitch -= event.movementY * 0.002;

    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
});

function animate() {
    requestAnimationFrame(animate);

    if (moveForward) player.position.z -= 0.1;
    if (moveBackward) player.position.z += 0.1;
    if (moveLeft) player.position.x -= 0.1;
    if (moveRight) player.position.x += 0.1;

    if (jump && !isJumping) {
        isJumping = true;
        jumpVelocity = 0.1;
    }

    if (isJumping) {
        player.position.y += jumpVelocity;
        jumpVelocity -= gravity;

        if (player.position.y <= 1) {
            player.position.y = 1;
            isJumping = false;
        }
    }

    camera.rotation.x = pitch;
    camera.rotation.y = yaw;

    renderer.render(scene, camera);
}

animate();
