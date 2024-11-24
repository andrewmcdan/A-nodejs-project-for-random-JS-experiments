const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");
var noise = new Noise(Math.random());
// Set canvas size
canvas.width = window.innerWidth * 0.8;
canvas.height = 500;

const width = canvas.width;
const height = canvas.height;
function drawFractalTree(
    x,
    y,
    angle,
    depth,
    branchLength,
    branchWidth,
    color,
    numBranches
) {
    if (depth === 0) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = branchWidth;

    const x1 = x + branchLength * Math.cos(angle);
    const y1 = y - branchLength * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    for (let i = 1; i <= numBranches; i++) {
        let numberOfBranches = 2 + Math.floor(Math.random() * 3);
        drawFractalTree(
            x1,
            y1,
            angle + Math.random() * (i % 2 == 0 ? -1 : 1),
            depth - 1,
            branchLength * 0.7,
            branchWidth * 0.7,
            color,
            numberOfBranches
        );
    }
}
function generatePerlinNoise(ctx, width, height, scale) {
    noise.seed(Math.random());
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const value = Math.abs(noise.perlin2(x / scale, y / scale));
            const color = Math.floor(value * 255);

            const index = (y * width + x) * 4;
            data[index] = color; // Red
            data[index + 1] = color; // Green
            data[index + 2] = color; // Blue
            data[index + 3] = 50; // Alpha
        }
    }

    ctx.putImageData(imgData, 0, 0);
}
function generateArt() {
    ctx.clearRect(0, 0, width, height);

    // Perlin noise background
    generatePerlinNoise(ctx, width, height, 50);

    // Fractal trees
    let colors = [];
    for (let i = 0; i < 25; i++) {
        // Generate random red, green, and blue components
        let r = Math.floor(Math.random() * 256); // Random value between 0 and 255
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);

        // Convert to RGB string
        let color = `rgb(${r}, ${g}, ${b})`;

        // Add to the colors array
        colors.push(color);
    }
    for (let i = 0; i < (12 + Math.floor(Math.random() * 25)); i++) {
        const x = Math.random() * width;
        const y = height - 20;
        const angle = Math.PI / 2 + (Math.random() - 0.5);
        const depth = 3 + Math.floor(Math.random() * 8);
        const branchLength = 80 + Math.random() * 40;
        const branchWidth = 2 + Math.random() * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const numberOfBranches = 2 + Math.floor(Math.random() * 3);
        drawFractalTree(
            x,
            y,
            angle,
            depth,
            branchLength,
            branchWidth,
            color,
            numberOfBranches
        );
    }
}
document.getElementById("saveButton").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "generative-art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
document
    .getElementById("generateButton")
    .addEventListener("click", generateArt);

// Generate initial art
generateArt();
