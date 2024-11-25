// Select all faces of the cube
const faces = document.querySelectorAll(".face");
const width = 400;
const height = 400;

// Add click event listener to each face
faces.forEach((face) => {
    face.addEventListener("click", function () {
        this.style.backgroundImage = getNextImage();
    });
});

let randomNum = Math.floor(Math.random() * 1000);
let nextImg = new Image();
nextImg.src =  `https://picsum.photos/seed/${randomNum}/${width}/${height}`;

function getNextImage() {
    let prevImg = nextImg.src;
    nextImg = new Image();
    let randomNum = Math.floor(Math.random() * 10000);
    nextImg.src =  `https://picsum.photos/seed/${randomNum}/${width}/${height}`;
    return `url(${prevImg})`;
}
