const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasPadding = 10;
const canvasWidth = canvas.width - canvasPadding * 2;
const canvasHeight = canvas.height - canvasPadding * 2;

// Adjust canvas size on window resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Particle settings
let particles = [];
const settings = {
    particleCount: 100,
    particleSpeed: 5,
    particleSize: 8,
    gravity: 0,
    mouseAntiGrav: 5,
    friction: 5,
    bouncy: 5,
    colors: ["#ff8a00", "#e52e71", "#00c6ff", "#7ed56f"],
};

// Mouse position
const mouse = { x: null, y: null };

// Update mouse position
canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Clear mouse position on mouseout
canvas.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
});

var elasticity = 1 - settings.bouncy / 1000;
var friction = 1 - settings.friction / 10000;
var speedFactor = 1 - (51 - settings.particleSpeed) / 5000;
var mousePos = getMousePos(canvas, { clientX: mouse.x, clientY: mouse.y });
var maxDistance = Math.abs(250 * settings.mouseAntiGrav * 0.1);

// Particle class
class Particle {
    constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Apply gravity
        this.dy += settings.gravity * 0.005;

        // Move particle
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off top and bottom edges
        if (this.y + this.size > canvasHeight) {
            this.y = canvasHeight - this.size; // Prevent sinking below the bottom
            this.dy *= -elasticity; // Reverse and reduce vertical velocity
            if (Math.abs(this.dy) < 0.1) {
                this.dy = 0; // Threshold to stop sliding
                this.dx = 0;
            }
        } else if (this.y - this.size < 0 + canvasPadding) {
            this.y = this.size + canvasPadding; // Prevent moving above the top
            this.dy *= -elasticity; // Reverse and reduce vertical velocity
            if (Math.abs(this.dy) < 0.1) {
                this.dy = 0; // Threshold to stop sliding
                this.dx = 0;
            }
        }

        // Bounce off left and right edges
        if (this.x + this.size > canvasWidth) {
            this.x = canvasWidth - this.size; // Prevent moving past the right edge
            this.dx *= -elasticity; // Reverse and reduce horizontal velocity
        } else if (this.x - this.size < 0 + canvasPadding) {
            this.x = this.size + canvasPadding; // Prevent moving past the left edge
            this.dx *= -elasticity; // Reverse and reduce horizontal velocity
        }

        // Attract or repel by mouse
        if (mouse.x && mouse.y) {
            const distX = this.x - mousePos.x;
            const distY = this.y - mousePos.y;
            const distance = Math.sqrt(distX ** 2 + distY ** 2);
            if (distance < maxDistance) {
                const forceMagnitude = settings.mouseAntiGrav / 10;
                this.dx += (distX / distance) * forceMagnitude; // Scale force to maintain direction
                this.dy += (distY / distance) * forceMagnitude;
            }
        }

        // Apply friction to horizontal movement
        this.dx *= friction;
        this.dy *= friction;

        this.dx = this.dx * speedFactor;
        this.dy = this.dy * speedFactor;

        // set color on a range of blue to red based on speed
        this.color = `hsl(${(this.dx + this.dy) * 10}, 100%, 50%)`;

        // Draw the particle
        this.draw();
    }
}

function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < settings.particleCount; i++) {
        const size = Math.random() * settings.particleSize + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const dx = (Math.random() - 0.5) * settings.particleSpeed;
        const dy = (Math.random() - 0.5) * settings.particleSpeed;
        const color = settings.colors[Math.floor(Math.random() * settings.colors.length)];
        particles.push(new Particle(x, y, dx, dy, size, color));
    }
}

// Animate particles
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        elasticity = 1 - settings.bouncy / 1000;
        friction = 1 - settings.friction / 10000;
        speedFactor = 1 - (51 - settings.particleSpeed) / 5000;
        mousePos = getMousePos(canvas, { clientX: mouse.x, clientY: mouse.y });
        maxDistance = Math.abs(250 * settings.mouseAntiGrav * 0.1);
        particle.update();
    });
    requestAnimationFrame(animate);
}

// Handle controls
const particleCountInput = document.getElementById("particleCount");
const particleSpeedInput = document.getElementById("particleSpeed");
const particleCountValue = document.getElementById("particleCountValue");
const particleSpeedValue = document.getElementById("particleSpeedValue");
const gravityValue = document.getElementById("gravityValue");
const gravityInput = document.getElementById("gravity");
const mouseAntiGravInput = document.getElementById("mouseAntiGrav");
const mouseAntiGravValue = document.getElementById("mouseAntiGravValue");
const frictionInput = document.getElementById("friction");
const frictionValue = document.getElementById("frictionValue");
const bouncyInput = document.getElementById("bouncy");
const bouncyValue = document.getElementById("bouncyValue");

particleCountInput.addEventListener("input", (e) => {
    settings.particleCount = +e.target.value;
    particleCountValue.textContent = e.target.value;
    initParticles();
});

particleSpeedInput.addEventListener("input", (e) => {
    settings.particleSpeed = +e.target.value;
    particleSpeedValue.textContent = e.target.value;
    particles.forEach((particle) => {
        particle.dx = (Math.random() - 0.5) * settings.particleSpeed;
        particle.dy = (Math.random() - 0.5) * settings.particleSpeed;
    });
});

gravityInput.addEventListener("input", (e) => {
    settings.gravity = +e.target.value;
    gravityValue.textContent = e.target.value;
});

mouseAntiGravInput.addEventListener("input", (e) => {
    settings.mouseAntiGrav = +e.target.value;
    mouseAntiGravValue.textContent = e.target.value;
});

frictionInput.addEventListener("input", (e) => {
    settings.friction = +e.target.value;
    frictionValue.textContent = e.target.value;
});

bouncyInput.addEventListener("input", (e) => {
    settings.bouncy = +e.target.value;
    bouncyValue.textContent = e.target.value;
});

// Start the particle system
initParticles();
animate();
