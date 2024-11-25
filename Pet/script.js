// script.js

let petData = null;
let petState = {};
const petNameElement = document.getElementById("pet-name");
const petContainer = document.getElementById("pet-container");
const needsContainer = document.getElementById("needs-container");
const actionsContainer = document.getElementById("actions-container");
const minigamesContainer = document.getElementById("minigames-container");

async function loadPet(petFile) {
    let petFileFound = false;
    let index = 1;
    do {
        try {
            const response = await fetch(`pets/pet${index}.json`);
            petData = await response.json();
            console.log(petData);
            console.log({ petFile });
            if (petData.name == petFile) break;
            petFileFound = true;
            index++;
        } catch (error) {
            petFileFound = false;
        }
    } while (petFileFound);
    initializePet();
}

function initializePet() {
    petNameElement.textContent = petData.name;
    loadPetImage(petData.image);
    initializeNeeds();
    initializeActions();
    initializeMiniGames();
    loadPetState();
}

function loadPetImage(imagePath) {
    const img = document.createElement("img");
    img.src = imagePath;
    img.id = "pet-image";
    petContainer.appendChild(img);
}

function initializeNeeds() {
    needsContainer.innerHTML = ""; // Clear existing needs
    for (const [needName, needInfo] of Object.entries(petData.needs)) {
        // Create progress bar for each need
        const needDiv = document.createElement("div");
        needDiv.className = "need";

        const label = document.createElement("span");
        label.textContent = `${
            needName.charAt(0).toUpperCase() + needName.slice(1)
        }: `;

        const progressBar = document.createElement("progress");
        progressBar.id = `need-${needName}`;
        progressBar.max = needInfo.max;
        progressBar.value = needInfo.current;

        needDiv.appendChild(label);
        needDiv.appendChild(progressBar);
        needsContainer.appendChild(needDiv);
    }
}

function initializeActions() {
    actionsContainer.innerHTML = ""; // Clear existing actions
    for (const needName of Object.keys(petData.needs)) {
        const actionButton = document.createElement("button");
        actionButton.textContent = `Replenish ${needName}`;
        actionButton.onclick = () => replenishNeed(needName);
        actionsContainer.appendChild(actionButton);
    }
}

function replenishNeed(needName) {
    petData.needs[needName].current = petData.needs[needName].max;
    updateNeedDisplay(needName);
    savePetState();
}

function updateNeeds() {
    const now = Date.now();
    const elapsedMinutes = (now - petState.lastUpdate) / 60000; // Convert ms to minutes
    petState.lastUpdate = now;

    let petIsUnhappy = false;

    for (const [needName, needInfo] of Object.entries(petData.needs)) {
        const depletion = needInfo.depletionRate * elapsedMinutes;
        needInfo.current = Math.max(0, needInfo.current - depletion);
        updateNeedDisplay(needName);

        if (needInfo.current <= 0) {
            petIsUnhappy = true;
        }
    }

    updatePetMood(petIsUnhappy ? "sad" : "happy");
    savePetState();
}

function updateNeedDisplay(needName) {
    const progressBar = document.getElementById(`need-${needName}`);
    progressBar.value = petData.needs[needName].current;
}

function updatePetMood(mood) {
    const petImage = document.getElementById("pet-image");
    petImage.className = `pet ${mood}`;
}

setInterval(updateNeeds, 60000); // Update needs every minute

function savePetState() {
    petState.needs = petData.needs;
    localStorage.setItem("petState", JSON.stringify(petState));
}

function loadPetState() {
    const savedState = localStorage.getItem("petState");
    if (savedState) {
        petState = JSON.parse(savedState);
        petData.needs = petState.needs;
        petState.lastUpdate = Date.now();
        initializeNeeds();
    } else {
        petState = {
            lastUpdate: Date.now(),
        };
    }
}

function initializeMiniGames() {
    minigamesContainer.innerHTML = ""; // Clear existing mini-games
    petData.miniGames.forEach((game) => {
        const gameButton = document.createElement("button");
        gameButton.textContent = `Play ${game.name}`;
        gameButton.onclick = () => loadMiniGame(game.script);
        minigamesContainer.appendChild(gameButton);
    });
}

let loadedScripts = [];
if(games === undefined) {
    var games = {};
}

function loadMiniGame(scriptPath) {
    if (loadedScripts.includes(scriptPath)) {
        if(games !== undefined) {
            games[scriptPath]();
        }
        return;
    }
    loadedScripts.push(scriptPath);
    const script = document.createElement("script");
    script.src = scriptPath;
    document.body.appendChild(script);
    script.onload = () => {
        if(games !== undefined) {
            console.log(games);
            games[scriptPath]();
        }
    };
}

const petSelector = document.getElementById("pet-selector");
petSelector.addEventListener("change", () => {
    loadPet(petSelector.value);
});

// Load the selected pet on startup
loadPet(petSelector.value);
