const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;
let score = 0;
let lives = 3;
let ship;
let asteroids = [];
let bullets = [];
let keys = {};

let level = 1;

// Constants
const FPS = 60; // Frames per second
const SHIP_SIZE = 20; // Ship size in pixels
const SHIP_MAX_SPEED = 10; // Max speed of the ship in pixels per second
const TURN_SPEED = 120; // Turn speed in degrees per second
const SHIP_THRUST = 3; // Acceleration of the ship
const FRICTION = 0.8; // Friction coefficient (0 = no friction, 1 = full friction)
let ASTEROID_NUM = 3; // Starting number of asteroids
const ASTEROID_SIZE = 100; // Starting size of asteroids in pixels
const ASTEROID_SPEED = 40; // Max starting speed of asteroids in pixels per second
const BULLET_SPEED = 500; // Speed of bullets
const BULLET_LIFE = 0.5; // Seconds bullets remain on screen
const BULLET_MAX = 50; // Maximum number of bullets on screen at once
class Ship {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.r = SHIP_SIZE / 2;
        this.a = (90 / 180) * Math.PI; // Convert to radians
        this.rotation = 0;
        this.thrusting = false;
        this.thrust = {
            x: 0,
            y: 0,
        };
        this.canShoot = true;
        this.blinkTime = Math.ceil(0.1 * FPS);
        this.blinkNum = Math.ceil(3 * FPS);
        this.exploding = false;
        this.explodeTime = 0;
    }

    draw() {
        ctx.strokeStyle = "white";
        ctx.lineWidth = SHIP_SIZE / 20;
        ctx.beginPath();
        // Nose of the ship
        ctx.moveTo(
            this.x + (4 / 3) * this.r * Math.cos(this.a),
            this.y - (4 / 3) * this.r * Math.sin(this.a)
        );
        // Rear left
        ctx.lineTo(
            this.x - this.r * ((2 / 3) * Math.cos(this.a) + Math.sin(this.a)),
            this.y + this.r * ((2 / 3) * Math.sin(this.a) - Math.cos(this.a))
        );
        // Rear right
        ctx.lineTo(
            this.x - this.r * ((2 / 3) * Math.cos(this.a) - Math.sin(this.a)),
            this.y + this.r * ((2 / 3) * Math.sin(this.a) + Math.cos(this.a))
        );
        ctx.closePath();
        ctx.stroke();

        // Draw the thruster flame
        if (this.thrusting) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "orange";
            ctx.lineWidth = SHIP_SIZE / 10;
            ctx.beginPath();
            ctx.moveTo(
                this.x -
                    this.r *
                        ((2 / 3) * Math.cos(this.a) + 0.5 * Math.sin(this.a)),
                this.y +
                    this.r *
                        ((2 / 3) * Math.sin(this.a) - 0.5 * Math.cos(this.a))
            );
            ctx.lineTo(
                this.x - ((this.r * 5) / 3) * Math.cos(this.a),
                this.y + ((this.r * 5) / 3) * Math.sin(this.a)
            );
            ctx.lineTo(
                this.x -
                    this.r *
                        ((2 / 3) * Math.cos(this.a) - 0.5 * Math.sin(this.a)),
                this.y +
                    this.r *
                        ((2 / 3) * Math.sin(this.a) + 0.5 * Math.cos(this.a))
            );
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    update() {
        // Rotation
        this.a += this.rotation;

        // Calculate vector thrust
        const vThrust = this.thrust.x ** 2 + this.thrust.y ** 2;

        // Thrust
        if (this.thrusting && vThrust < SHIP_MAX_SPEED ** 2) {
            this.thrust.x += (SHIP_THRUST * Math.cos(this.a)) / FPS;
            this.thrust.y -= (SHIP_THRUST * Math.sin(this.a)) / FPS;
        } else {
            // Apply friction
            this.thrust.x -= (FRICTION * this.thrust.x) / FPS;
            this.thrust.y -= (FRICTION * this.thrust.y) / FPS;
        }

        // Position
        this.x += this.thrust.x;
        this.y += this.thrust.y;

        // Handle edge of screen
        if (this.x < 0 - this.r) {
            this.x = canvas.width + this.r;
        } else if (this.x > canvas.width + this.r) {
            this.x = 0 - this.r;
        }
        if (this.y < 0 - this.r) {
            this.y = canvas.height + this.r;
        } else if (this.y > canvas.height + this.r) {
            this.y = 0 - this.r;
        }
    }
}
// Event listeners for key presses
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(/** @type {KeyboardEvent} */ ev) {
    keys[ev.code] = true;

    switch (ev.code) {
        case "Space": // Spacebar (shoot)
            setInterval(shootBullet, 10); // Bullets go brrrr
            // shootBullet();
            break;
        case "ArrowLeft": // Left arrow (rotate left)
            ship.rotation = ((TURN_SPEED / 180) * Math.PI) / FPS;
            break;
        case "ArrowUp": // Up arrow (thrust forward)
            ship.thrusting = true;
            break;
        case "ArrowRight": // Right arrow (rotate right)
            ship.rotation = ((-TURN_SPEED / 180) * Math.PI) / FPS;
            break;
    }
}

function keyUp(/** @type {KeyboardEvent} */ ev) {
    keys[ev.code] = false;

    switch (ev.code) {
        case "Space": // Spacebar
            ship.canShoot = true;
            break;
        case "ArrowLeft": // Left arrow
        case "ArrowRight": // Right arrow
            ship.rotation = 0;
            break;
        case "ArrowUp": // Up arrow
            ship.thrusting = false;
            break;
    }
}
function shootBullet() {
    // Limit the number of bullets on screen
    if (bullets.length >= BULLET_MAX) return;
    if (!ship.canShoot) {
        ship.canShoot = true; // Remove this for normal shooting
        return;
    }
    ship.canShoot = false;

    // Create bullet object
    bullets.push({
        x: ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
        y: ship.y - (4 / 3) * ship.r * Math.sin(ship.a),
        xv: (BULLET_SPEED * Math.cos(ship.a)) / FPS,
        yv: (-BULLET_SPEED * Math.sin(ship.a)) / FPS,
        dist: 0,
    });
}
function updateBullets() {
    // Move the bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += bullets[i].xv;
        bullets[i].y += bullets[i].yv;

        // Handle edge of screen
        if (bullets[i].x < 0) {
            bullets[i].x = canvas.width;
        } else if (bullets[i].x > canvas.width) {
            bullets[i].x = 0;
        }
        if (bullets[i].y < 0) {
            bullets[i].y = canvas.height;
        } else if (bullets[i].y > canvas.height) {
            bullets[i].y = 0;
        }

        // Increase distance traveled
        bullets[i].dist += Math.sqrt(bullets[i].xv ** 2 + bullets[i].yv ** 2);

        // Remove bullet if it has reached max distance
        if (bullets[i].dist > BULLET_LIFE * canvas.width) {
            bullets.splice(i, 1);
        }
    }
}

function drawBullets() {
    // Draw bullets
    ctx.fillStyle = "salmon";
    for (let i = 0; i < bullets.length; i++) {
        ctx.beginPath();
        ctx.arc(
            bullets[i].x,
            bullets[i].y,
            SHIP_SIZE / 5,
            0,
            Math.PI * 2,
            false
        );
        ctx.fill();
    }
}
function createAsteroidBelt() {
    asteroids = [];
    for (let i = 0; i < ASTEROID_NUM; i++) {
        asteroids.push(newAsteroid());
    }
}

function newAsteroid() {
    let x, y;
    do {
        x = Math.floor(Math.random() * canvas.width);
        y = Math.floor(Math.random() * canvas.height);
    } while (
        distanceBetweenPoints(ship.x, ship.y, x, y) <
        ASTEROID_SIZE * 2 + ship.r
    );
    let asteroid = {
        x: x,
        y: y,
        xv:
            ((Math.random() * ASTEROID_SPEED) / FPS) *
            (Math.random() < 0.5 ? 1 : -1),
        yv:
            ((Math.random() * ASTEROID_SPEED) / FPS) *
            (Math.random() < 0.5 ? 1 : -1),
        r: ASTEROID_SIZE / 1.5,
        a: Math.random() * Math.PI * 2, // In radians
        vert: Math.floor(Math.random() * 10 + 5), // Number of vertices
        offs: [],
    };

    // Create the vertex offsets array
    for (let i = 0; i < asteroid.vert; i++) {
        asteroid.offs.push(Math.random() * 0.4 + 0.6);
    }

    return asteroid;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
function updateAsteroids() {
    // Move asteroids
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].x += asteroids[i].xv;
        asteroids[i].y += asteroids[i].yv;

        // Handle edge of screen
        if (asteroids[i].x < 0 - asteroids[i].r) {
            asteroids[i].x = canvas.width + asteroids[i].r;
        } else if (asteroids[i].x > canvas.width + asteroids[i].r) {
            asteroids[i].x = 0 - asteroids[i].r;
        }
        if (asteroids[i].y < 0 - asteroids[i].r) {
            asteroids[i].y = canvas.height + asteroids[i].r;
        } else if (asteroids[i].y > canvas.height + asteroids[i].r) {
            asteroids[i].y = 0 - asteroids[i].r;
        }
    }
}

function drawAsteroids() {
    ctx.strokeStyle = "slategrey";
    ctx.lineWidth = SHIP_SIZE / 20;
    for (let i = 0; i < asteroids.length; i++) {
        let a = asteroids[i];
        ctx.beginPath();
        ctx.moveTo(
            a.x + a.r * a.offs[0] * Math.cos(a.a),
            a.y + a.r * a.offs[0] * Math.sin(a.a)
        );

        // Draw polygon
        for (let j = 1; j < a.vert; j++) {
            ctx.lineTo(
                a.x +
                    a.r *
                        a.offs[j] *
                        Math.cos(a.a + (j * Math.PI * 2) / a.vert),
                a.y +
                    a.r * a.offs[j] * Math.sin(a.a + (j * Math.PI * 2) / a.vert)
            );
        }
        ctx.closePath();
        ctx.stroke();
    }
}
function checkBulletAsteroidCollisions() {
    // Loop over bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        // Loop over asteroids
        for (let j = asteroids.length - 1; j >= 0; j--) {
            // Distance between bullet and asteroid
            if (
                distanceBetweenPoints(
                    bullets[i].x,
                    bullets[i].y,
                    asteroids[j].x,
                    asteroids[j].y
                ) < asteroids[j].r
            ) {
                // Remove asteroid
                destroyAsteroid(j);
                bullets.splice(i, 1);
                break;
            }
        }
    }
}

function destroyAsteroid(index) {
    let x = asteroids[index].x;
    let y = asteroids[index].y;
    let r = asteroids[index].r;

    // Split the asteroid if necessary
    if (r > ASTEROID_SIZE / 4) {
        asteroids.push(createAsteroidFragment(x, y, r / 2));
        asteroids.push(createAsteroidFragment(x, y, r / 2));
        asteroids.push(createAsteroidFragment(x, y, r / 2));
    }

    // Remove the asteroid
    asteroids.splice(index, 1);

    // Update the score
    score += 20;

    // Check if level is cleared
    if (asteroids.length === 0) {
        // Next level
        levelUp();
    }
}

function createAsteroidFragment(x, y, r) {
    let asteroid = {
        x: x,
        y: y,
        xv:
            ((Math.random() * ASTEROID_SPEED) / FPS) *
            (Math.random() < 0.5 ? 1 : -1),
        yv:
            ((Math.random() * ASTEROID_SPEED) / FPS) *
            (Math.random() < 0.5 ? 1 : -1),
        r: r,
        a: Math.random() * Math.PI * 2, // In radians
        vert: Math.floor(Math.random() * 10 + 5), // Number of vertices
        offs: [],
    };

    // Create the vertex offsets array
    for (let i = 0; i < asteroid.vert; i++) {
        asteroid.offs.push(Math.random() * 0.4 + 0.6);
    }

    return asteroid;
}
function checkShipAsteroidCollisions() {
    if (ship.exploding) return;

    for (let i = 0; i < asteroids.length; i++) {
        if (
            distanceBetweenPoints(
                ship.x,
                ship.y,
                asteroids[i].x,
                asteroids[i].y
            ) <
            ship.r + asteroids[i].r
        ) {
            explodeShip();
            destroyAsteroid(i);
            break;
        }
    }
}

// TODO: 
function spawnExtraLifePowerUp() {
    // Define power-up properties

}
// TODO: 
function checkShipPowerUpCollision() {
    // Check if ship collects power-up
}

function explodeShip() {
    ship.exploding = true;
    ship.explodeTime = Math.ceil(0.3 * FPS);
    lives--;
    if (lives === 0) {
        // Game over
        gameOver();
    }
}
function gameOver() {
    // Stop the game loop
    cancelAnimationFrame(loop);
    alert("Game Over! Your score: " + score);
    // Reload the page or reset the game variables
    document.location.reload();
}

function levelUp() {
    // Increase the number of asteroids
    ASTEROID_NUM+=2;
    level++;
    createAsteroidBelt();
}
function updateHUD() {
    document.getElementById("score").textContent = "Score: " + score;
    document.getElementById("lives").textContent = "Lives: " + lives;
    document.getElementById("level").textContent = "Level: " + level;
}
function update() {
    // Draw space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update ship
    ship.update();
    ship.draw();

    // Update and draw bullets
    updateBullets();
    drawBullets();

    // Update and draw asteroids
    updateAsteroids();
    drawAsteroids();

    // Collision detection
    checkBulletAsteroidCollisions();
    checkShipAsteroidCollisions();

    // Update HUD
    updateHUD();

    // Next frame
    requestAnimationFrame(update);
}

// Start the game
function startGame() {
    ship = new Ship();
    createAsteroidBelt();
    update();
}

startGame();
