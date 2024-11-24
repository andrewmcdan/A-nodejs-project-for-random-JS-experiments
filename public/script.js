let secondsBar, minutesBar, hoursBar, daysBar, weeksBar, monthsBar, yearsBar, centuriesBar, universeBar;

function cacheDOMElements() {
  secondsBar = document.querySelector('#seconds .bar');
  minutesBar = document.querySelector('#minutes .bar');
  hoursBar = document.querySelector('#hours .bar');
  daysBar = document.querySelector('#days .bar');
  weeksBar = document.querySelector('#weeks .bar');
  monthsBar = document.querySelector('#months .bar');
  yearsBar = document.querySelector('#years .bar');
  centuriesBar = document.querySelector('#centuries .bar');
universeBar = document.querySelector('#universe .bar');
}

function updateClock() {
  // Existing code to calculate progress
  // ...

  const now = new Date();

  const seconds = now.getSeconds();
  const secondsProgress = (seconds / 60) * 100;

  const minutes = now.getMinutes();
  const minutesProgress = (minutes / 60) * 100;

  const hours = now.getHours();
  const hoursProgress = (hours / 24) * 100;

const dayOfMonth = now.getDate();  
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();  
const daysProgress = (dayOfMonth / daysInMonth) * 100;  
// Weeks progress  
const weekDay = now.getDay();  
const weeksProgress = ((weekDay + 1) / 7) * 100;  
// Months progress  
const month = now.getMonth();  
const monthsProgress = ((month + 1) / 12) * 100;  
// Years progress  
const startOfYear = new Date(now.getFullYear(), 0, 1);  
const endOfYear = new Date(now.getFullYear() + 1, 0, 1);  
const yearProgress = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;  
// Centuries progress  
const currentYear = now.getFullYear();  
const centuryStart = Math.floor(currentYear / 100) * 100;  
const centuryEnd = centuryStart + 100;  
const centuryProgress = ((currentYear - centuryStart) / 100) * 100;  

const formationOfEarth = -4540e6; 
// 4.54 billion years ago  
const heatDeath = 1e100; 
// Estimated in a googol years  
//const currentYear = now.getFullYear();  
// Convert currentYear to years since formation of Earth  
const yearsSinceFormation = currentYear - (formationOfEarth);  
const totalYears = (heatDeath - formationOfEarth);  
const universeProgress = (yearsSinceFormation / totalYears) * 100;  
// Ensure progress doesn't exceed 100%  
//const universeProgressClamped = Math.min(universeProgress, 100);  

const universeProgressLog = Math.log10(yearsSinceFormation) / Math.log10(totalYears) * 100;
const universeProgressClamped = Math.min(universeProgressLog, 100);
universeBar.style.width = `${universeProgressClamped}%`;


// Update universe bar  
//universeBar.style.width = `${universeProgressClamped}%`;

  // Update bars using cached elements
  secondsBar.style.width = `${secondsProgress}%`;
  minutesBar.style.width = `${minutesProgress}%`;
  hoursBar.style.width = `${hoursProgress}%`;
  daysBar.style.width = `${daysProgress}%`;
  weeksBar.style.width = `${weeksProgress}%`;
  monthsBar.style.width = `${monthsProgress}%`;
  yearsBar.style.width = `${yearProgress}%`;
  centuriesBar.style.width = `${centuryProgress}%`;

  requestAnimationFrame(updateClock);
}

document.addEventListener('DOMContentLoaded', () => {
  cacheDOMElements();
  updateClock();
  setInterval(updateClock, 1000);
});
