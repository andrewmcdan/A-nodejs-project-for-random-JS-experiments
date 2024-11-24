const toggleButton = document.getElementById('toggleMode');
const sky = document.querySelector('.sky');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');
const stars = document.querySelector('.stars');
stars.style.display = "none";

let isDay = true;

toggleButton.addEventListener('click', () => {
  if (isDay) {
    sky.classList.remove('day');
    sky.classList.add('night');
    sun.style.opacity = 0;
    moon.style.opacity = 1;
    stars.style.display = "inherit";
    toggleButton.textContent = 'Switch to Day';
  } else {
    sky.classList.remove('night');
    sky.classList.add('day');
    sun.style.opacity = 1;
    moon.style.opacity = 0;
    stars.style.display = "none";
    toggleButton.textContent = 'Switch to Night';
  }
  isDay = !isDay;
});

const cloudsContainer = document.querySelector('.clouds');

// Function to create a cloud
function createCloud(top, left, duration) {
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  cloud.style.top = `${top}%`;
  cloud.style.left = `${left}%`;
  cloud.style.animationDuration = `${duration}s`;
  cloudsContainer.appendChild(cloud);
}

// Generate multiple clouds
for (let i = 0; i < 5; i++) {
  const top = Math.random() * 50; // Random vertical position
  const left = Math.random() * 100; // Random starting position
  const duration = 15 + Math.random() * 10; // Random animation duration
  createCloud(top, left, duration);
}
