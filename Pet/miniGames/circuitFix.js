const { name } = require("ejs");

// circuitFix.js
const gameName = "Circuit Fix";
const gamePath = "miniGames/circuitFix.js";

// load circuitFix.css and inject it into the document
const circuitFixCSS = document.createElement("link");
circuitFixCSS.rel = "stylesheet";
circuitFixCSS.href = "miniGames/circuitFix.css";
document.head.appendChild(circuitFixCSS);

const COMPONENTS = {
    blank: {
        type: "blank",
        connections: [],
        signals: [],
        polarized: [],
        image: "images/blank.png",
    },
    wire: {
        type: "wire",
        variants: [
            {
                name: "Straight Wire",
                connections: [1, 0, 1, 0],
                polarized: [0, 0, 0, 0],
                image: "images/wire_straight.png",
            },
            {
                name: "Corner Wire",
                connections: [1, 0, 0, 1],
                polarized: [0, 0, 0, 0],
                image: "images/wire_corner.png",
            },
            {
                name: "Tee Wire",
                connections: [1, 0, 1, 1],
                polarized: [0, 0, 0, 0],
                image: "images/wire_tee.png",
            },
            {
                name: "Cross Wire",
                connections: [1, 1, 1, 1],
                polarized: [0, 0, 0, 0],
                image: "images/wire_cross.png",
            },
        ],
        signals: ["positive", "negative", "wave"],
        rotatable: true,
    },
    battery: {
        type: "battery",
        name: "Battery",
        connections: [1, 0, 1, 0],
        polarized: [1, 0, -1, 0],
        signals: ["positive", "negative"],
        image: "images/battery.png",
        rotatable: true,
    },
    lightBulb: {
        type: "lightBulb",
        name: "Light Bulb",
        connections: [1, 0, 1, 0],
        polarized: [0, 0, 0, 0],
        signals: ["positive", "negative"],
        image: "images/light_bulb.png",
        rotatable: true,
    },
    led: {
        type: "led",
        name: "LED",
        connections: [1, 0, 1, 0],
        polarized: [1, 0, -1, 0],
        signals: ["positive", "negative"],
        image: "images/led.png",
        rotatable: true,
    },
    waveGenerator: {
        type: "waveGenerator",
        name: "Wave Generator",
        connections: [1, 1, 1, 0],
        polarized: [1, 2, -1, 0],
        signals: ["positive", "negative", "wave"],
        image: "images/wave_generator.png",
        rotatable: true,
    },
    speaker: {
        type: "speaker",
        name: "Speaker",
        connections: [1, 1, 1, 0],
        polarized: [1, 2, -1, 0],
        signals: ["positive", "negative", "wave"],
        image: "images/speaker.png",
        rotatable: true,
    },
    switch: {
        type: "switch",
        name: "Switch",
        connections: [1, 0, 1, 0],
        polarized: [0, 0, 0, 0],
        signals: ["positive", "negative"],
        image: "images/switch.png",
        rotatable: true,
        isClosed: false,
    },
};

const difficultyLevels = {
    easy: {
        gridSize: 5,
        maxMoves: 15,
    },
    medium: {
        gridSize: 7,
        maxMoves: 25,
    },
    hard: {
        gridSize: 9,
        maxMoves: 35,
    },
};

const gameUIHTML = `
    <div id="move-counter">Moves: 0</div>
    <div id="timer">Time: 00:00</div>
    <div id="feedback-message"></div>
    <button id="restart-button">Restart</button>
  <button id="next-level-button" style="display: none;">Next Level</button>
  `;

function startCircuitFixGame(renderElement, difficulty = "easy") {
    if (petData === undefined) {
        console.error("Pet data not loaded!");
        return;
    }
    if (renderElement === undefined) {
        console.error("No render element provided!");
        return;
    }

    const gameUIContainer = document.createElement("div");
    gameUIContainer.innerHTML = gameUIHTML;
    gameUIContainer.id = "game-ui";
    renderElement.appendChild(gameUIContainer);

    const canvasElement = document.createElement("canvas");
    canvasElement.id = "game-canvas";
    renderElement.appendChild(canvasElement);

    const moveCounterElement = document.getElementById("move-counter");
    const timerElement = document.getElementById("timer");
    const feedbackMessageElement = document.getElementById("feedback-message");
    const restartButton = document.getElementById("restart-button");
    const nextLevelButton = document.getElementById("next-level-button");

    restartButton.addEventListener('click', () => {
        // Restart the game
        stopTimer(gameState);
        containerElement.innerHTML = ''; // Clear the game container
        startCircuitFixGame(containerElement, difficulty); // Restart
      });
    
      nextLevelButton.addEventListener('click', () => {
        // Proceed to next level
        stopTimer(gameState);
        containerElement.innerHTML = '';
        // Increase difficulty or load next level as desired
        startCircuitFixGame(containerElement, difficulty);
      });

    const context = canvas.getContext("2d");

    // Handle high-DPI displays
    const rect = containerElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    const difficultySettings = difficultyLevels[difficulty];
    const { grid, solutionMoves } = generateLevel(difficultySettings);

    const gameState = {
        gridSize: difficultySettings.gridSize,
        grid: grid,
        moveCount: 0,
        maxMoves: difficultySettings.maxMoves,
        solutionMoves: solutionMoves,
        canvas: canvasElement,
        context: context,
        animations: [],
        cellSize: rect.width / difficultySettings.gridSize,
        moveCounterElement,
        timerElement,
        feedbackMessageElement,
    };

    // alert("Starting Circuit Fix Mini-Game!");
    let rewardTypes = [];
    let rewardValues = [];
    for (let g of petData.miniGames) {
        console.log(g);
        if (g.name === gameName) {
            for (let k in g.rewards) {
                rewardTypes.push(k);
                rewardValues.push(g.rewards[k]);
                console.log(`Added reward: ${k} ${g.rewards[k]}`);
            }
            break;
        }
    }

    // Game logic goes here...

    // Generate level
    generateLevel(gameState);

    // Render grid
    renderGrid(containerElement, gameState);

    // Add event listeners for interactions
    addEventListeners(containerElement, gameState);

    // Check for win/loss conditions
    //   checkGameStatus(gameState);

    // After the game is over:
    for (let i = 0; i < rewardTypes.length; i++) {
        petData.needs[rewardTypes[i]].current += rewardValues[i];
        if (
            petData.needs[rewardTypes[i]].current >
            petData.needs[rewardTypes[i]].max
        ) {
            petData.needs[rewardTypes[i]].current =
                petData.needs[rewardTypes[i]].max;
        }
        console.log(`Added ${rewardValues[i]} to ${rewardTypes[i]}`);
        console.log(petData);
        updateNeedDisplay(rewardTypes[i]);
    }
    savePetState();
    // remove the injected css
    document.head.removeChild(circuitFixCSS);
}

if (games !== undefined) {
    games[gamePath] = startCircuitFixGame;
} else {
    var games = {
        [gamePath]: startCircuitFixGame,
    };
}

function generateLevel(difficultySettings) {
    const { gridSize, maxMoves } = difficultySettings;

    let levelGenerated = false;
    let finalGrid;
    let solutionMoves;

    while (!levelGenerated) {
        try {
            // Step 1: Build a solved circuit
            const solvedGrid = buildSolvedCircuit(gridSize);

            // Step 2: Scramble the circuit
            const { scrambledGrid } = scrambleCircuit(solvedGrid, maxMoves);

            // Step 3: Attempt to solve the scrambled circuit
            const movesToSolve = solveCircuit(scrambledGrid, maxMoves);

            if (movesToSolve && movesToSolve.length <= maxMoves) {
                // Level is solvable within move limit
                finalGrid = scrambledGrid;
                solutionMoves = movesToSolve;
                levelGenerated = true;
            } else {
                // Retry with a different scramble or circuit generation
                continue;
            }
        } catch (error) {
            console.error("Error generating level:", error);
            // Retry level generation
            continue;
        }
    }

    return {
        grid: finalGrid,
        solutionMoves,
    };
}

function createComponent(type, variantName = null, options = {}) {
    const componentData = { ...COMPONENTS[type] };

    if (componentData.variants && variantName) {
        const variant = componentData.variants.find(
            (v) => v.name === variantName
        );
        Object.assign(componentData, variant);
    }

    // Set default properties
    componentData.orientation = options.orientation || 0;
    componentData.isClosed = options.isClosed || false;
    componentData.id = generateUniqueId();

    return componentData;
}

function generateUniqueId() {
    return "comp-" + Math.random().toString(36).substring(2, 9);
}

function drawGrid(gameState) {
    const { context, grid, gridSize, cellSize } = gameState;

    // Clear the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw grid lines (optional)
    context.strokeStyle = "#ccc";
    for (let i = 0; i <= gridSize; i++) {
        // Vertical lines
        context.beginPath();
        context.moveTo(i * cellSize, 0);
        context.lineTo(i * cellSize, gridSize * cellSize);
        context.stroke();

        // Horizontal lines
        context.beginPath();
        context.moveTo(0, i * cellSize);
        context.lineTo(gridSize * cellSize, i * cellSize);
        context.stroke();
    }

    // Draw components
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const component = grid[y][x];
            if (component && component.type !== "blank") {
                drawComponent(context, component, x, y, cellSize);
            }
        }
    }

    // Draw animations (e.g., signal flows)
    gameState.animations.forEach((animation) => {
        animation.draw(context);
    });
}

function drawComponent(context, component, x, y, cellSize) {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;

    context.save();
    context.translate(centerX, centerY);
    context.rotate((component.orientation * Math.PI) / 180);

    // Draw component based on its type
    switch (component.type) {
        case "wire":
            drawWire(context, component, cellSize);
            break;
        case "battery":
            drawBattery(context, component, cellSize);
            break;
        case "lightBulb":
            drawLightBulb(context, component, cellSize);
            break;
        // Add cases for other component types
    }

    context.restore();
}

function drawWire(context, component, cellSize) {
    context.strokeStyle = "#8B4513"; // Brown color for wires
    context.lineWidth = cellSize / 10;
    context.lineCap = "round";

    context.beginPath();
    // Draw lines based on connections
    const connections = getComponentConnections(component);
    if (connections.top) {
        context.moveTo(0, 0);
        context.lineTo(0, -cellSize / 2);
    }
    if (connections.right) {
        context.moveTo(0, 0);
        context.lineTo(cellSize / 2, 0);
    }
    if (connections.bottom) {
        context.moveTo(0, 0);
        context.lineTo(0, cellSize / 2);
    }
    if (connections.left) {
        context.moveTo(0, 0);
        context.lineTo(-cellSize / 2, 0);
    }
    context.stroke();
}

function drawBattery(context, component, cellSize) {
    // Draw battery body
    context.fillStyle = "#000";
    context.fillRect(-cellSize / 6, -cellSize / 4, cellSize / 3, cellSize / 2);

    // Draw positive and negative terminals
    context.fillStyle = "#FF0000"; // Red for positive
    context.fillRect(-cellSize / 12, -cellSize / 2, cellSize / 6, cellSize / 4);

    context.fillStyle = "#0000FF"; // Blue for negative
    context.fillRect(-cellSize / 12, cellSize / 4, cellSize / 6, cellSize / 4);
}

function drawLightBulb(context, component, cellSize) {
    // Draw bulb outline
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(0, 0, cellSize / 4, 0, 2 * Math.PI);
    context.stroke();

    // Fill bulb if lit
    if (component.isLit) {
        context.fillStyle = "#FFFF00"; // Yellow for lit bulb
        context.fill();
    }

    // Draw base
    context.fillStyle = "#666";
    context.fillRect(-cellSize / 8, cellSize / 4, cellSize / 4, cellSize / 8);
}

function getGridPosition(gameState, event) {
    const { canvas, cellSize } = gameState;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    const gridX = Math.floor(x / (cellSize * window.devicePixelRatio));
    const gridY = Math.floor(y / (cellSize * window.devicePixelRatio));
    return { gridX, gridY };
}

function setupEventListeners(gameState) {
    const { canvas } = gameState;

    // Left-click to rotate components
    canvas.addEventListener("click", (event) => {
        const { gridX, gridY } = getGridPosition(gameState, event);
        handleLeftClick(gameState, gridX, gridY);
    });

    // Right-click to toggle switches
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const { gridX, gridY } = getGridPosition(gameState, event);
        handleRightClick(gameState, gridX, gridY);
    });

    // Drag and drop for moving components
    // Implement as needed
}

function handleLeftClick(gameState, x, y) {
    const component = gameState.grid[y][x];
    if (component && component.rotatable) {
        // Animate rotation
        animateRotation(gameState, component, x, y, 90);
        gameState.moveCount++;
        updateMoveCounter(gameState);
        checkGameStatus(gameState);
    }
}

function handleRightClick(gameState, x, y) {
    const component = gameState.grid[y][x];
    if (component && component.type === "switch") {
        component.isClosed = !component.isClosed;
        gameState.moveCount++;
        updateMoveCounter(gameState);
        checkGameStatus(gameState);
    }
}

function updateMoveCounter(gameState) {
    const { moveCounterElement, moveCount, maxMoves } = gameState;
    moveCounterElement.textContent = `Moves: ${moveCount} / ${maxMoves}`;
}

function startTimer(gameState) {
    const { timerElement } = gameState;
  
    function updateTimer() {
      const elapsed = Date.now() - gameState.startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      timerElement.textContent = `Time: ${formatTime(minutes)}:${formatTime(seconds)}`;
    }
  
    gameState.timerInterval = setInterval(updateTimer, 1000);
  }
  
  function formatTime(value) {
    return value.toString().padStart(2, '0');
  }
  
  function stopTimer(gameState) {
    clearInterval(gameState.timerInterval);
  }
  
  function showFeedbackMessage(gameState, message, duration = 3000) {
    const { feedbackMessageElement } = gameState;
    feedbackMessageElement.textContent = message;
    feedbackMessageElement.style.display = 'block';
  
    // Hide the message after the specified duration
    setTimeout(() => {
      feedbackMessageElement.style.display = 'none';
    }, duration);
  }
  

function animateRotation(gameState, component, x, y, angle) {
    const duration = 300; // Animation duration in milliseconds
    const startTime = performance.now();
    const initialOrientation = component.orientation;
    const targetOrientation = (component.orientation + angle) % 360;

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        component.orientation = initialOrientation + angle * progress;
        if (component.orientation >= 360) {
            component.orientation -= 360;
        }
        render(gameState);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Ensure final orientation is set
            component.orientation = targetOrientation;
            render(gameState);
        }
    }

    requestAnimationFrame(animate);
}

function animateSignalFlow(gameState) {
    // Implement signal propagation visualization
    // For example, draw glowing lines that move along wires
}

function render(gameState) {
    drawGrid(gameState);
}

function startAnimationLoop(gameState) {
    function loop() {
        updateAnimations(gameState);
        render(gameState);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

function addEventListeners(containerElement, gameState) {
    // Left-click to rotate components
    containerElement.addEventListener("click", (event) => {
        const cell = event.target.closest(".grid-cell");
        if (!cell) return;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const component = gameState.grid[y][x];

        if (component.type !== "blank") {
            rotateComponent(component);
            gameState.moveCount++;
            renderGrid(containerElement, gameState);
            checkGameStatus(gameState);
        }
    });

    // Right-click to toggle switches
    containerElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const cell = event.target.closest(".grid-cell");
        if (!cell) return;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const component = gameState.grid[y][x];

        if (component.type === "switch") {
            component.isClosed = !component.isClosed;
            gameState.moveCount++;
            renderGrid(containerElement, gameState);
            checkGameStatus(gameState);
        }
    });

    // Drag and drop to move components (simplified)
    let draggedComponent = null;

    containerElement.addEventListener("dragstart", (event) => {
        const componentElement = event.target.closest(".component");
        if (!componentElement) return;
        const x = parseInt(componentElement.parentElement.dataset.x);
        const y = parseInt(componentElement.parentElement.dataset.y);
        draggedComponent = gameState.grid[y][x];
        event.dataTransfer.setData("text/plain", "");
    });

    containerElement.addEventListener("dragover", (event) => {
        event.preventDefault();
        const cell = event.target.closest(".grid-cell");
        if (cell) {
            cell.classList.add("drag-over");
        }
    });

    containerElement.addEventListener("dragleave", (event) => {
        const cell = event.target.closest(".grid-cell");
        if (cell) {
            cell.classList.remove("drag-over");
        }
    });

    containerElement.addEventListener("drop", (event) => {
        event.preventDefault();
        const cell = event.target.closest(".grid-cell");
        if (!cell || !draggedComponent) return;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        // Move component to new location if target is blank
        if (gameState.grid[y][x].type === "blank") {
            const originalX = parseInt(draggedComponent.x);
            const originalY = parseInt(draggedComponent.y);
            gameState.grid[y][x] = draggedComponent;
            gameState.grid[originalY][originalX] = createComponent("blank");
            gameState.moveCount++;
            renderGrid(containerElement, gameState);
            checkGameStatus(gameState);
        }
        draggedComponent = null;
    });
}

function rotateComponent(component) {
    if (component.rotatable) {
        component.orientation = (component.orientation + 90) % 360;
        // Update connections based on new orientation
        component.connections = component.connections.map((direction) =>
            rotateDirection(direction)
        );
    }
}

function rotateDirection(direction) {
    const directions = ["top", "right", "bottom", "left"];
    const index = directions.indexOf(direction);
    return directions[(index + 1) % 4];
}

function checkGameStatus(gameState) {
    const signalsMap = {}; // Map of signals at each cell
    const visited = {}; // To avoid infinite loops
    let hasShortCircuit = false;

    if (gameState.hasShortCircuit || gameState.moveCount >= gameState.maxMoves) {
        // Show restart button
        document.getElementById('restart-button').style.display = 'inline-block';
      } else if (checkWinCondition(gameState)) {
        // Show next level button
        document.getElementById('next-level-button').style.display = 'inline-block';
      }

    // Start signal propagation from power sources
    gameState.grid.forEach((row, y) => {
        row.forEach((component, x) => {
            if (component.type === "battery") {
                propagateSignal(
                    x,
                    y,
                    "positive",
                    component.orientation,
                    signalsMap,
                    visited
                );
                propagateSignal(
                    x,
                    y,
                    "negative",
                    component.orientation,
                    signalsMap,
                    visited
                );
            }
        });
    });

    propagateSignals(gameState);

    if (gameState.hasShortCircuit) {
        alert("Short circuit detected! You lose.");
        // Handle game over logic
    } else if (checkWinCondition(gameState)) {
        alert("Circuit complete! You win.");
        // Handle level completion logic
    } else if (gameState.moveCount >= gameState.maxMoves) {
        alert("Maximum moves exceeded! You lose.");
        // Handle game over logic
    }
}

function togglePause(gameState) {
    if (gameState.isPaused) {
      // Resume the game
      startTimer(gameState);
      gameState.isPaused = false;
    } else {
      // Pause the game
      stopTimer(gameState);
      gameState.isPaused = true;
    }
  }
  

function getDirectionDelta(direction, orientation) {
    // Map direction to grid delta considering orientation
    const directions = {
        0: { top: [0, -1], right: [1, 0], bottom: [0, 1], left: [-1, 0] },
        90: { top: [1, 0], right: [0, 1], bottom: [-1, 0], left: [0, -1] },
        180: { top: [0, 1], right: [-1, 0], bottom: [0, -1], left: [1, 0] },
        270: { top: [-1, 0], right: [0, -1], bottom: [1, 0], left: [0, 1] },
    };
    return directions[orientation % 360][direction];
}

function checkWinCondition(gameState, signalsMap) {
    // Check if all non-wire components are receiving correct signals
    let allComponentsConnected = true;
    gameState.grid.forEach((row, y) => {
        row.forEach((component, x) => {
            if (component.type !== "blank" && component.type !== "wire") {
                const key = `${x},${y}`;
                if (!signalsMap[key] || signalsMap[key].length === 0) {
                    allComponentsConnected = false;
                }
                // Additional checks for polarized components like LEDs
                if (component.type === "led") {
                    // Check for correct polarity
                    // If reversed, it's acceptable but doesn't count towards completion
                }
            }
        });
    });
    return allComponentsConnected;
}

function buildSolvedCircuit(gridSize, componentsList) {
    // Initialize empty grid
    const grid = Array.from({ length: gridSize }, () =>
        Array(gridSize).fill(null)
    );

    // Place components to form a complete circuit
    // This can be a predefined pattern or generated algorithmically
    // For this example, we'll generate a simple circuit connecting a battery to a light bulb

    // Example: Place battery at (0, 0) and light bulb at (gridSize - 1, gridSize - 1)
    grid[0][0] = createComponent("battery", null, { orientation: 0 });
    grid[gridSize - 1][gridSize - 1] = createComponent("lightBulb", null, {
        orientation: 0,
    });

    // Use a pathfinding algorithm to connect the battery to the light bulb with wires
    const path = findPath(grid, [0, 0], [gridSize - 1, gridSize - 1]);

    if (!path) {
        throw new Error("Failed to create a valid circuit.");
    }

    // Place wires along the path
    for (let i = 1; i < path.length - 1; i++) {
        const [x, y] = path[i];
        // Determine the correct wire type and orientation based on adjacent cells
        const wireComponent = determineWireComponent(path, i);
        grid[y][x] = wireComponent;
    }

    // Fill remaining cells with blank components
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (!grid[y][x]) {
                grid[y][x] = createComponent("blank");
            }
        }
    }

    return grid;
}

function scrambleCircuit(grid, maxScrambleMoves) {
    const scrambleMoves = [];
    let currentGrid = cloneGrid(grid);

    // Randomly rotate components
    for (let i = 0; i < maxScrambleMoves; i++) {
        const { x, y } = getRandomNonBlankCell(currentGrid);
        const component = currentGrid[y][x];

        if (component.rotatable) {
            // Rotate component randomly
            const rotations = [90, 180, 270];
            const rotation =
                rotations[Math.floor(Math.random() * rotations.length)];
            component.orientation = (component.orientation + rotation) % 360;
            scrambleMoves.push({ action: "rotate", x, y, rotation });
        }
    }

    // Optionally, swap components (excluding the blank space)
    // For advanced scrambling, you can implement swapping logic

    return { scrambledGrid: currentGrid, scrambleMoves };
}

function solveCircuit(grid, maxMoves) {
    // Implement a search algorithm to find the shortest sequence of moves to solve the circuit
    // For simplicity, we'll use BFS (Breadth-First Search)

    const queue = [];
    const visited = new Set();

    const startState = {
        grid: grid,
        moves: [],
        moveCount: 0,
    };

    queue.push(startState);
    visited.add(serializeGrid(grid));

    while (queue.length > 0) {
        const currentState = queue.shift();

        // Check if the current grid is solved
        if (isCircuitComplete(currentState.grid)) {
            return currentState.moves;
        }

        if (currentState.moveCount >= maxMoves) {
            continue; // Exceeds move limit
        }

        // Generate possible moves (rotate components)
        for (let y = 0; y < currentState.grid.length; y++) {
            for (let x = 0; x < currentState.grid[0].length; x++) {
                const component = currentState.grid[y][x];
                if (component.rotatable) {
                    const newGrid = cloneGrid(currentState.grid);
                    newGrid[y][x].orientation =
                        (newGrid[y][x].orientation + 90) % 360;

                    const gridKey = serializeGrid(newGrid);
                    if (!visited.has(gridKey)) {
                        visited.add(gridKey);
                        queue.push({
                            grid: newGrid,
                            moves: currentState.moves.concat({
                                action: "rotate",
                                x,
                                y,
                            }),
                            moveCount: currentState.moveCount + 1,
                        });
                    }
                }
            }
        }

        // Optionally, consider swapping components if allowed
    }

    // No solution found within move limit
    return null;
}

function findPath(grid, start, end) {
    // Use BFS for pathfinding
    const queue = [];
    const visited = new Set();

    queue.push({ position: start, path: [start] });
    visited.add(start.toString());

    while (queue.length > 0) {
        const { position, path } = queue.shift();
        const [x, y] = position;

        if (x === end[0] && y === end[1]) {
            return path;
        }

        // Explore adjacent cells
        const neighbors = [
            [x, y - 1], // Up
            [x + 1, y], // Right
            [x, y + 1], // Down
            [x - 1, y], // Left
        ];

        for (const [nx, ny] of neighbors) {
            if (
                nx >= 0 &&
                ny >= 0 &&
                nx < grid[0].length &&
                ny < grid.length &&
                !visited.has([nx, ny].toString())
            ) {
                visited.add([nx, ny].toString());
                queue.push({
                    position: [nx, ny],
                    path: path.concat([[nx, ny]]),
                });
            }
        }
    }

    // No path found
    return null;
}

function determineWireComponent(path, index) {
    const [xPrev, yPrev] = path[index - 1];
    const [xCurr, yCurr] = path[index];
    const [xNext, yNext] = path[index + 1];

    const directionPrev = getDirection([xPrev, yPrev], [xCurr, yCurr]);
    const directionNext = getDirection([xCurr, yCurr], [xNext, yNext]);

    // Determine connections based on directions
    const connections = [directionPrev, directionNext];

    // Determine wire type
    let wireType = "wire";
    let variantName = "";

    if (
        (connections.includes("top") && connections.includes("bottom")) ||
        (connections.includes("left") && connections.includes("right"))
    ) {
        variantName = "straight";
    } else if (connections.includes("top") && connections.includes("right")) {
        variantName = "corner";
    } else if (connections.length === 3) {
        variantName = "tee";
    } else if (connections.length === 4) {
        variantName = "cross";
    } else {
        // Default to straight wire
        variantName = "straight";
    }

    // Determine orientation based on connections
    let orientation = 0;
    if (variantName === "straight") {
        if (connections.includes("left") && connections.includes("right")) {
            orientation = 90;
        }
    } else if (variantName === "corner") {
        if (connections.includes("top") && connections.includes("left")) {
            orientation = 270;
        } else if (
            connections.includes("bottom") &&
            connections.includes("left")
        ) {
            orientation = 180;
        } else if (
            connections.includes("bottom") &&
            connections.includes("right")
        ) {
            orientation = 90;
        }
    }

    return createComponent(wireType, variantName, { orientation });
}

function getDirection(from, to) {
    const [xFrom, yFrom] = from;
    const [xTo, yTo] = to;

    if (xFrom === xTo) {
        if (yFrom > yTo) return "top";
        if (yFrom < yTo) return "bottom";
    } else if (yFrom === yTo) {
        if (xFrom > xTo) return "left";
        if (xFrom < xTo) return "right";
    }
    return null;
}

function serializeGrid(grid) {
    return grid
        .map((row) =>
            row
                .map(
                    (cell) =>
                        `${cell.type}-${cell.orientation}-${
                            cell.isClosed ? 1 : 0
                        }`
                )
                .join(",")
        )
        .join(";");
}

function getComponentConnections(component) {
    // Base connections without orientation
    const baseConnections = component.baseConnections; // e.g., { top: 'input', bottom: 'output' }

    // Rotate connections based on orientation
    const rotatedConnections = {};
    const sides = ["top", "right", "bottom", "left"];
    const rotationSteps = component.orientation / 90;

    for (const [side, connection] of Object.entries(baseConnections)) {
        const index = sides.indexOf(side);
        const rotatedIndex = (index + rotationSteps) % 4;
        rotatedConnections[sides[rotatedIndex]] = connection;
    }

    return rotatedConnections;
}

function propagateSignals(gameState) {
    const { grid, gridSize } = gameState;
    const signalQueue = [];
    const signalMap = {}; // Key: 'x,y', Value: Array of signals at that cell
    const visited = {}; // Key: 'x,y,signalType', to prevent infinite loops

    // Initialize signal sources (e.g., batteries, wave generators)
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const component = grid[y][x];
            if (component && isSignalSource(component)) {
                const connections = getComponentConnections(component);
                for (const [side, connection] of Object.entries(connections)) {
                    if (isOutputConnection(connection)) {
                        const [dx, dy] = getDeltaFromDirection(side);
                        const nx = x + dx;
                        const ny = y + dy;
                        if (isValidCell(nx, ny, gridSize)) {
                            const signal = createSignal(
                                component,
                                side,
                                connection
                            );
                            signalQueue.push({
                                x: nx,
                                y: ny,
                                incomingSide: oppositeSide(side),
                                signal,
                            });
                        }
                    }
                }
            }
        }
    }

    // BFS traversal
    while (signalQueue.length > 0) {
        const { x, y, incomingSide, signal } = signalQueue.shift();
        const key = `${x},${y},${signal.type}`;
        if (visited[key]) continue;
        visited[key] = true;

        const component = grid[y][x];
        if (!component) continue;

        // Process the component with the incoming signal
        const result = processComponentSignal(
            component,
            incomingSide,
            signal,
            gameState
        );
        if (result.shortCircuit) {
            gameState.hasShortCircuit = true;
            return;
        }

        // Update signal map
        const cellKey = `${x},${y}`;
        signalMap[cellKey] = signalMap[cellKey] || [];
        signalMap[cellKey].push({ side: incomingSide, signal });

        // Enqueue signals to adjacent components
        for (const [side, outputSignal] of Object.entries(
            result.outputSignals
        )) {
            const [dx, dy] = getDeltaFromDirection(side);
            const nx = x + dx;
            const ny = y + dy;
            if (isValidCell(nx, ny, gridSize)) {
                signalQueue.push({
                    x: nx,
                    y: ny,
                    incomingSide: oppositeSide(side),
                    signal: outputSignal,
                });
            }
        }
    }

    gameState.signalMap = signalMap;
}

function processComponentSignal(component, incomingSide, signal, gameState) {
    // In processComponentSignal or propagateSignals
    const cellKey = `${x},${y}`;
    signalMap[cellKey] = signalMap[cellKey] || [];

    const existingSignals = signalMap[cellKey].filter(
        (s) => s.side === incomingSide
    );
    if (existingSignals.some((s) => s.signal.type !== signal.type)) {
        // Conflicting signals detected on the same side
        return { shortCircuit: true };
    }

    signalMap[cellKey].push({ side: incomingSide, signal });

    const connections = getComponentConnections(component);
    const connectionType = connections[incomingSide];

    // Check if the incoming side is connected
    if (!connectionType) {
        // Incoming signal on non-connected side, ignore
        return { outputSignals: {} };
    }

    // Initialize component state if not already set
    if (!component.state) component.state = {};

    // Short circuit detection
  if (conflictingSignalsDetected) {
    gameState.hasShortCircuit = true;
    showFeedbackMessage(gameState, 'Short circuit detected!');
    return { shortCircuit: true };
  }

    // Handle component-specific logic
    switch (component.type) {
        case "wire":
            return processWire(component, incomingSide, signal, connections);
        case "switch":
            return processSwitch(component, incomingSide, signal, connections);
        case "led":
            return processLED(component, incomingSide, signal, connections);
        case "lightBulb":
            return processLightBulb(
                component,
                incomingSide,
                signal,
                connections
            );
        case "battery":
            // Batteries are sources, should not receive signals
            return { outputSignals: {} };
        case "waveGenerator":
            return processWaveGenerator(
                component,
                incomingSide,
                signal,
                connections,
                gameState
            );
        case "speaker":
            return processSpeaker(component, incomingSide, signal, connections);
        // Add other components as needed
        default:
            return { outputSignals: {} };
    }
}

function checkForHints(gameState) {
    if (gameState.moveCount === Math.floor(gameState.maxMoves * 0.75)) {
      showFeedbackMessage(gameState, 'You\'re running out of moves!');
    }
  }
  

function processWire(component, incomingSide, signal, connections) {
    const outputSignals = {};
    // Propagate the signal to all connected sides except the incoming side
    for (const [side, connection] of Object.entries(connections)) {
        if (side !== incomingSide && connection) {
            outputSignals[side] = { ...signal };
        }
    }
    return { outputSignals };
}

function processSwitch(component, incomingSide, signal, connections) {
    if (!component.isClosed) {
        // Switch is open; do not propagate signal
        return { outputSignals: {} };
    }

    // Switch is closed; behave like a wire
    return processWire(component, incomingSide, signal, connections);
}

function processLED(component, incomingSide, signal, connections) {
    const outputSignals = {};
    const positiveSide = getPositiveSide(connections);
    const negativeSide = getNegativeSide(connections);

    // Initialize component state
    component.state.hasPositive = component.state.hasPositive || false;
    component.state.hasNegative = component.state.hasNegative || false;

    if (incomingSide === positiveSide && signal.type === "positive") {
        component.state.hasPositive = true;
    } else if (incomingSide === negativeSide && signal.type === "negative") {
        component.state.hasNegative = true;
    } else if (
        (incomingSide === positiveSide && signal.type === "negative") ||
        (incomingSide === negativeSide && signal.type === "positive")
    ) {
        // Reverse polarity; LED doesn't light but doesn't cause loss
    } else if (signal.type === "wave") {
        // Wave signal connected to LED; invalid, but doesn't cause loss
    }

    // If both positive and negative are present on correct sides, the LED is lit
    if (component.state.hasPositive && component.state.hasNegative) {
        component.isLit = true;
    }

    // LEDs do not propagate signals
    return { outputSignals };
}

function processLightBulb(component, incomingSide, signal, connections) {
    const outputSignals = {};

    // Initialize component state
    component.state.receivedSignals =
        component.state.receivedSignals || new Set();
    component.state.receivedSignals.add(signal.type);

    // If both positive and negative are present, the bulb is lit
    if (
        component.state.receivedSignals.has("positive") &&
        component.state.receivedSignals.has("negative")
    ) {
        component.isLit = true;
    }

    // Propagate the signal to other connected sides
    for (const [side, connection] of Object.entries(connections)) {
        if (side !== incomingSide && connection) {
            outputSignals[side] = { ...signal };
        }
    }

    return { outputSignals };
}

function processWaveGenerator(
    component,
    incomingSide,
    signal,
    connections,
    gameState
) {
    const outputSignals = {};
    const positiveSide = getPositiveSide(connections);
    const negativeSide = getNegativeSide(connections);
    const waveOutSide = getWaveOutSide(connections);

    // Initialize component state
    component.state.hasPositive = component.state.hasPositive || false;
    component.state.hasNegative = component.state.hasNegative || false;

    if (incomingSide === positiveSide && signal.type === "positive") {
        component.state.hasPositive = true;
    } else if (incomingSide === negativeSide && signal.type === "negative") {
        component.state.hasNegative = true;
    } else if (signal.type === "wave") {
        // Wave signal connected to power inputs; invalid, may cause short circuit
        gameState.hasShortCircuit = true;
        return { shortCircuit: true };
    }

    if (component.state.hasPositive && component.state.hasNegative) {
        component.isPowered = true;
    }

    // Generate wave signal if powered
    if (component.isPowered && waveOutSide) {
        outputSignals[waveOutSide] = { type: "wave", source: component.id };
    }

    return { outputSignals };
}

function processSpeaker(component, incomingSide, signal, connections) {
    const positiveSide = getPositiveSide(connections);
    const negativeSide = getNegativeSide(connections);
    const waveInSide = getWaveInSide(connections);

    // Initialize component state
    component.state.hasPositive = component.state.hasPositive || false;
    component.state.hasNegative = component.state.hasNegative || false;
    component.state.hasWave = component.state.hasWave || false;

    if (incomingSide === positiveSide && signal.type === "positive") {
        component.state.hasPositive = true;
    } else if (incomingSide === negativeSide && signal.type === "negative") {
        component.state.hasNegative = true;
    } else if (incomingSide === waveInSide && signal.type === "wave") {
        component.state.hasWave = true;
    } else if (signal.type === "positive" || signal.type === "negative") {
        // Positive or negative power connected to wave input; invalid
        // May cause short circuit if required by game logic
    } else if (signal.type === "wave") {
        // Wave signal connected to power inputs; invalid, may cause short circuit
    }

    if (
        component.state.hasPositive &&
        component.state.hasNegative &&
        component.state.hasWave
    ) {
        component.isPlaying = true; // Speaker is functioning
    }

    // Speakers do not propagate signals
    return { outputSignals: {} };
}

function getDeltaFromDirection(direction) {
    switch (direction) {
        case "top":
            return [0, -1];
        case "right":
            return [1, 0];
        case "bottom":
            return [0, 1];
        case "left":
            return [-1, 0];
        default:
            return [0, 0];
    }
}

function oppositeSide(side) {
    switch (side) {
        case "top":
            return "bottom";
        case "right":
            return "left";
        case "bottom":
            return "top";
        case "left":
            return "right";
        default:
            return null;
    }
}

function isValidCell(x, y, gridSize) {
    return x >= 0 && y >= 0 && x < gridSize && y < gridSize;
}

function isSignalSource(component) {
    return component.type === "battery" || component.type === "waveGenerator";
}

function isOutputConnection(connectionType) {
    return connectionType === "output" || connectionType === "both";
}

function getPositiveSide(connections) {
    return Object.keys(connections).find(
        (side) => connections[side] === "positive"
    );
}

function getNegativeSide(connections) {
    return Object.keys(connections).find(
        (side) => connections[side] === "negative"
    );
}

function getWaveOutSide(connections) {
    return Object.keys(connections).find(
        (side) => connections[side] === "waveOut"
    );
}

function getWaveInSide(connections) {
    return Object.keys(connections).find(
        (side) => connections[side] === "waveIn"
    );
}

function checkWinCondition(gameState) {
    const { grid, gridSize } = gameState;
    let allComponentsFunctioning = true;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const component = grid[y][x];
            if (component) {
                if (component.type === "lightBulb" && !component.isLit) {
                    allComponentsFunctioning = false;
                }
                if (component.type === "led" && !component.isLit) {
                    allComponentsFunctioning = false;
                }
                if (component.type === "speaker" && !component.isPlaying) {
                    allComponentsFunctioning = false;
                }
                // Add checks for other components as needed
            }
        }
    }

    return allComponentsFunctioning;
}
