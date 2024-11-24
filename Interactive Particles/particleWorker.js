// TODO: make workers work

let particles = [];
let settings = {};
var elasticity = 0;
var friction = 0;
var speedFactor = 0;
var mousePos = {};
var maxDistance = 0;

// Initialize particles
function initParticles(count, width, height, config) {
  particles = [];
  settings = config;

  for (let i = 0; i < count; i++) {
    const size = Math.random() * settings.particleSize + 1;
    const x = Math.random() * width;
    const y = Math.random() * height;
    const dx = (Math.random() - 0.5) * settings.particleSpeed;
    const dy = (Math.random() - 0.5) * settings.particleSpeed;
    const colorIndex = Math.floor(Math.random() * settings.colors.length);

    particles.push({ x, y, dx, dy, size, colorIndex });
  }
}

// Update particles
function updateParticles(mouse, width, height) {
  const friction = 0.99;
  const elasticity = 0.9;

  particles.forEach((p) => {
    // Gravity
    p.dy += settings.gravity * 0.005;

    // Mouse interaction
    if (mouse && mouse.x && mouse.y) {
      const distX = mouse.x - p.x;
      const distY = mouse.y - p.y;
      const distance = Math.sqrt(distX ** 2 + distY ** 2);
      const maxDistance = 250;

      if (distance < maxDistance) {
        const force = (1 - distance / maxDistance) * settings.mouseAntiGrav;
        const forceX = (distX / distance) * force;
        const forceY = (distY / distance) * force;
        p.dx += forceX * 0.1;
        p.dy += forceY * 0.1;
      }
    }

    // Movement
    p.x += p.dx;
    p.y += p.dy;

    // Bounce off edges
    if (p.x + p.size > width || p.x - p.size < 0) {
      p.dx *= -elasticity;
      p.x = Math.max(Math.min(p.x, width - p.size), p.size);
    }
    if (p.y + p.size > height || p.y - p.size < 0) {
      p.dy *= -elasticity;
      p.y = Math.max(Math.min(p.y, height - p.size), p.size);
    }

    // Apply friction
    p.dx *= friction;
    p.dy *= friction;
  });

  return particles;
}

// Handle messages from the main thread
onmessage = (e) => {
  const { type, data } = e.data;

  if (type === 'init') {
    initParticles(data.count, data.width, data.height, data.settings);
  } else if (type === 'update') {
    const updatedParticles = updateParticles(data.mouse, data.width, data.height);
    postMessage({ type: 'update', particles: updatedParticles });
  }
};
