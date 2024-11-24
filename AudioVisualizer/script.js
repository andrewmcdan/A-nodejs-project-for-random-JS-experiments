const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = 400;

// wait for user to move mouse
let started = false;
document.onclick = function(){
if(started) return;
started = true;
let currentVisualization = 1;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 256; // Controls resolution
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

let animationId = null;

function visualizeBars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
  
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
  
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 3;
  
      // Dynamic color based on frequency
      const red = (i + 50) % 255;
      const green = (i * 2) % 255;
      const blue = (i * 4) % 255;
  
      ctx.fillStyle = `rgb(${red},${green},${blue})`;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
  
      x += barWidth + 1;
    }
    

    animationId = requestAnimationFrame(animate);
  }
  
  const microphoneButton = document.getElementById('microphoneButton');

microphoneButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    cancelAnimationFrame(animationId); // Stop any current animation
    visualizeBars();
  } catch (err) {
    console.error('Microphone access denied:', err);
  }
});
const audioFileInput = document.getElementById('audioFile');

audioFileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    audioCtx.decodeAudioData(e.target.result, (buffer) => {
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(analyser);
      source.connect(audioCtx.destination); // Play the audio
      source.start();

      cancelAnimationFrame(animationId); // Stop any current animation
      visualizeBars();
    });
  };
  reader.readAsArrayBuffer(file);
});



document.addEventListener('keydown', (e) => {
    console.log('keydown: ' + e.key);
  if (e.key == '1') {
    currentVisualization = 1;
  } else if (e.key == '2') {
    currentVisualization = 2;
  }
});

function animate() {
  if (currentVisualization == 1) {
    visualizeBars();
  } else if (currentVisualization == 2) {
    visualizeWaves();
  }
}
function visualizeWaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteTimeDomainData(dataArray);
  
    ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
  
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
  
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
  
      x += sliceWidth;
    }
  
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = 'rgb(0, 255, 255)';
    ctx.lineWidth = 2;
    ctx.stroke();
    animationId = requestAnimationFrame(animate);
  }
};