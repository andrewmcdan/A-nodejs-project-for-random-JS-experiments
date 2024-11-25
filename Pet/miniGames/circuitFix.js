// circuitFix.js
const gameName = "Circuit Fix";
const gamePath = "miniGames/circuitFix.js";

function startCircuitFixGame() {
    if(petData === undefined) {
        console.error("Pet data not loaded!");
        return;
    }
    alert("Starting Circuit Fix Mini-Game!");

    let rewardTypes = [];
    let rewardValues = [];
    for(let g of petData.miniGames) {
        console.log(g);
        if(g.name === gameName) {
            for(let k in g.rewards) {
                rewardTypes.push(k);
                rewardValues.push(g.rewards[k]);
                console.log(`Added reward: ${k} ${g.rewards[k]}`);
            }
            break;
        }
    }

    // Game logic goes here...
    // After the game is over:

    for(let i = 0; i < rewardTypes.length; i++) {
        petData.needs[rewardTypes[i]].current += rewardValues[i];
        if(petData.needs[rewardTypes[i]].current > petData.needs[rewardTypes[i]].max) {
            petData.needs[rewardTypes[i]].current = petData.needs[rewardTypes[i]].max;
        }
        console.log(`Added ${rewardValues[i]} to ${rewardTypes[i]}`);
        console.log(petData);
        updateNeedDisplay(rewardTypes[i]);
    }
    savePetState();
}

if (games !== undefined) {
    games[gamePath] = startCircuitFixGame;
} else {
    var games = {
        [gamePath]: startCircuitFixGame,
    };
}
