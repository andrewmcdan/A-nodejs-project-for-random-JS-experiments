# A Collection of JS Experiments

This is a collection of Javascript experiments that I work on from time to time. I use this repository to learn new things and to experiment with new ideas. The experiments are mostly small and self-contained, and they are not meant to be used in production.

For most of these, I used ChatGPT to get me started. Then I fixed all of the errors that AI doesn't understand and made a bunch of modifications.

## Experiments

- [**Progress**](./progress) - A clock that shows the current time, date, and others.
- [**AudioVisualizer**](./AudioVisualizer) - A simple audio visualizer that uses the Web Audio API. Can get audio from the microphone or a file.
- [**Generative Art**](./Generative%20Art) - Generate "Art" using the canvas API, Perlin noise, and fractals.
- [**Landscape**](./Landscape) - CSS drawing of a landscape.
- [**Interactive Particles**](./Interactive%20Particles) - Interactive particles will various parameters.

## How to run
```
git clone
cd A-nodejs-project-for-random-experiments
npm install
npm start
```

By default, the server will run on port 3000. You can change this in the app.js file. 

The server will detect all the folders in the root directory and create an endpoint for each one. The endpoint will be the name of the folder. For example, if you have a folder called "progress", you can access it by going to `localhost:3000/progress`.

The index.html of the root directory will be served when you go to `localhost:3000` and it has links to all the experiments. (This works only if you have an index.html file in the root directory.)

The server does not automatically refresh the endpoints for the experiments. You will need to restart the server to see the changes.

## Contributing

If you have any ideas for experiments or if you want to contribute to this repository, feel free to open an issue or a pull request. I am always looking for new ideas and ways to improve the experiments. 

## License

Code is provided under the MIT license, copied below:
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