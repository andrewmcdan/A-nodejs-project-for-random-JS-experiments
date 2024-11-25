# A Collection of JS Experiments

This is a collection of Javascript experiments that I work on from time to time. I use this repository to learn new things and to experiment with new ideas. The experiments are mostly small and self-contained, and they are not meant to be used in production.

For most of these, I used ChatGPT to get me started. Then I fixed all of the errors that AI doesn't understand and made a bunch of modifications.

## Experiments

- [**Progress**](./progress) - A clock that shows the current time, date, and others.
- [**AudioVisualizer**](./AudioVisualizer) - A simple audio visualizer that uses the Web Audio API. Can get audio from the microphone or a file.
- [**Generative Art**](./Generative%20Art) - Generate "Art" using the canvas API, Perlin noise, and fractals.
- [**Landscape**](./Landscape) - CSS drawing of a landscape.
- [**Interactive Particles**](./Interactive%20Particles) - Interactive particles will various parameters.
- [**Cube**](./Cube) - A 3D cube with random images on each face that rotates. Clicking a face will change the image.
- [**Space Rocks**](./Space%20Rocks) - A simple game where you control a spaceship and blast rocks.
- [**Pet**](./Pet) - A virtual pet. ...work in progress.

## How to run
```
git clone https://github.com/andrewmcdan/A-nodejs-project-for-random-JS-experiments.git
cd A-nodejs-project-for-random-experiments
npm install
npm start
```

By default, the server will run on port 3000. You can change this by specifying the port in the `.env` file.

The server will detect all the folders in the root directory and create an endpoint for each one. The endpoint will be the name of the folder. For example, if you have a folder called "progress", you can access it by going to `localhost:3000/progress`.

The index.html of the root directory will be served when you go to `localhost:3000` and it has links to all the experiments. (This works only if you have an index.html file in the root directory.)

The server does not automatically refresh the endpoints for the experiments. You will need to restart the server to see the changes.

## TODO:
- Make the server automatically detect new folders and create endpoints for them.
- The landing page should show a recursive search through all the subdirectories and display them in a tree-like structure.
- Maybe make the landing page something interactive, like a 3D cloud of cards that you can click on to go to the experiment.

## Contributing

If you have any ideas for experiments or if you want to contribute to this repository, feel free to open an issue or a pull request. I am always looking for new ideas and ways to improve the experiments. 

## Ideas for Future Experiments

1. Real-Time Drawing App
    - Description: Collaborative drawing app where multiple users can draw on the same canvas in real time.
    - Techniques:
      - Dynamically import the necessary code on the server side to create this functionality.
      - HTML Canvas for the drawing interface.
      - WebSockets for real-time updates.
      - CSS for styling the tools (e.g., brushes, colors).
    - Ideas:
      - Include undo/redo functionality.
      - Add different brushes and effects.

2. 3D Model Viewer
    - Description: A 3D model viewer that allows users to upload and view 3D models.
    - Techniques:
      - Three.js for rendering 3D models.
      - Drag-and-drop functionality for uploading models.
      - CSS for styling the interface.
    - Ideas:
      - Add lighting and shading effects.
      - Include different camera angles and controls.

3. Text-to-Speech and Speech-to-Text
    - Description: Build an app that converts typed text to speech and spoken words to text.
    - Techniques:
      - OpenAI API for speech synthesis and recognition.
      - JavaScript for managing user input and output.
      - CSS for styling.
    - Ideas:
      - Add multiple language support.
      - Allow customization of voice and speed.

4. Interactive Shader Experiments
    - Description: Explore WebGL or Three.js to create interactive shaders and 3D graphics.
    - Techniques:
        - Use shaders for dynamic effects like water, fire, or ripples.
        - Add interactivity with mouse or keyboard input.
        - Text input with shader compilation.
    - Ideas:
        - Create a portal effect or kaleidoscope pattern.

5. Maze Generator and Solver
    - Description: Generate a random maze and allow users to solve it. Include an option to visualize the solution algorithm.
    - Techniques:
        - Use recursive backtracking or other maze generation algorithms.
        - JavaScript for rendering and user input.
        - CSS for styling.
    - Ideas:
        - Include a timer for added challenge.
        - Add multiple difficulty levels.

6. Procedural Terrain Generator
    - Description: Create a 2D or 3D terrain generator that produces random hills, valleys, or mountains.
    - Techniques:
        - Perlin noise for terrain generation.
        - Canvas or WebGL for rendering.
        - CSS for UI controls.
    - Ideas:
        - Allow users to adjust parameters like height and frequency.
        - Include a "fly-through" mode.

7. Virtual Pet - Work in Progress
    - Description: Build a virtual pet app where users can interact with and take care of a digital creature.
    - Techniques:
        - JavaScript for managing pet states (hungry, happy, tired).
        - CSS animations for pet interactions.
    - Ideas:
        - Include mini-games to earn "food" or "toys" for the pet.
        - Save the pet's state using local storage.

## Ideas from ChatGPT

Here are **50 project/experiment suggestions** ranging from simple ideas to advanced projects leveraging modern browser APIs and technologies:

---

### **Basic to Intermediate**

1. **Interactive Clock**: Build a clock that represents time in a creative way (e.g., spirals, animations, or Morse code).
2. **Color Picker Tool**: Create a custom color picker with sliders for RGB, HSL, and HEX inputs.
3. **Maze Generator & Solver**: Generate random mazes and solve them using pathfinding algorithms.
4. **Weather Dashboard**: Fetch real-time weather data using an API like OpenWeatherMap and display it interactively.
5. **Personal Expense Tracker**: Create a tool that tracks expenses, generates graphs, and stores data locally.
6. **Dynamic Mandelbrot Set**: Visualize and zoom into Mandelbrot fractals using the HTML canvas.
7. **Typing Speed Test**: Build a typing speed test with a timer, scoring system, and leaderboard.
8. **Audio Equalizer**: Create an equalizer that lets users adjust frequency bands for audio playback.
9. **CSS Art Generator**: Allow users to customize and generate CSS-based art pieces with sliders for gradients, shapes, and patterns.
10. **Unit Converter**: A comprehensive tool for converting units like length, temperature, currency, etc., using APIs.

---

### **Advanced Graphics**

11. **3D Solar System**: Use WebGL or Three.js to create an interactive solar system with orbiting planets.
12. **Fluid Simulation**: Implement a 2D fluid dynamics simulator using canvas or WebGL.
13. **Image Editor**: Create a simple photo editor with cropping, filters, and brightness/contrast controls.
14. **Physics Engine Demo**: Build a small physics-based sandbox for simulating collisions, gravity, and forces.
15. **Procedural Terrain Generator**: Generate 3D terrain with Perlin noise and render it using Three.js.
16. **Waveform Visualizer**: Visualize audio waveforms dynamically as particles or waves.
17. **Real-Time Charting Library**: Build a library for rendering real-time data charts (e.g., stocks or sensor data).
18. **Space Invaders Clone**: Recreate Space Invaders with advanced animations and polished graphics.
19. **Dynamic Fireworks Display**: Build a fireworks simulation with customizable colors, shapes, and animations.
20. **Virtual Aquarium**: Simulate an interactive 3D fish tank where users can feed and move fish.

---

### **Web APIs and Browser Features**

21. **Webcam Filters**: Apply real-time filters to a live webcam feed (e.g., grayscale, sepia, edge detection).
22. **Face Detection Game**: Use the WebRTC and Face Detection API to create a game that tracks and responds to user face movements.
23. **Speech-to-Text Notes**: Implement a voice-based note-taking app using the Web Speech API.
24. **Custom Video Player**: Build a custom video player with advanced features like speed control, subtitles, and color grading.
25. **AR Viewer**: Use WebXR to build an augmented reality viewer for placing 3D objects in real-world spaces.
26. **Bluetooth Device Control**: Connect to and control a Bluetooth-enabled device like a smart bulb or fitness tracker.
27. **USB File Explorer**: Access and read files from USB drives using the WebUSB API.
28. **Gesture Recognition**: Implement hand gesture recognition using a webcam and TensorFlow.js.
29. **Barcode Scanner**: Build a real-time barcode scanner using the MediaStream API and QR code libraries.
30. **Screen Recorder**: Create a tool to record the user's screen using the MediaRecorder API.

---

### **Data and Visualization**

31. **Personal Data Dashboard**: Aggregate and visualize user activity from APIs like GitHub, Spotify, or Fitbit.
32. **Mind Map Builder**: Create an interactive tool for building and organizing mind maps.
33. **Heatmap Generator**: Build a heatmap generator for data visualization (e.g., website click maps or sales data).
34. **Family Tree Builder**: Allow users to create and visualize family trees interactively.
35. **Collaborative Whiteboard**: Implement a real-time collaborative drawing app using WebSockets.
36. **Algorithm Visualizer**: Create visualizations for sorting algorithms, graph traversal, or dynamic programming.
37. **Stock Market Simulator**: Simulate stock market trading with charts, historical data, and virtual accounts.
38. **Periodic Table Explorer**: Build an interactive periodic table with information about each element.
39. **World Data Map**: Use D3.js to visualize global datasets like population, GDP, or climate data.
40. **DNA Sequence Viewer**: Allow users to upload and visualize DNA sequences with annotations.

---

### **Games and Fun**

41. **Voice-Controlled Game**: Build a simple game where users control the character using their voice pitch or volume.
42. **Pixel Art Editor**: Create a pixel art editor where users can draw and export sprites.
43. **Trivia Quiz Generator**: Fetch questions dynamically from a trivia API and display interactive quizzes.
44. **Escape Room Puzzle**: Build a virtual escape room with puzzles, timers, and clues.
45. **AI-Powered Chess**: Use a chess engine like Stockfish in the browser for an interactive chess game.
46. **Roguelike Dungeon Crawler**: Develop a procedural dungeon crawler game with random levels and enemies.
47. **Physics-Based Breakout**: Create a polished breakout game with realistic physics and power-ups.
48. **Geolocation Treasure Hunt**: Build a treasure hunt game that uses the Geolocation API.
49. **Multiplayer Tic-Tac-Toe**: Use WebSockets to create a real-time multiplayer Tic-Tac-Toe game.
50. **Interactive Story Builder**: Allow users to create and play branching storylines interactively.



## [License](./LICENSE)

Any experiment that uses code from other sources will have the license information in the respective folder. The rest of the code is provided under the MIT license.

```
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
