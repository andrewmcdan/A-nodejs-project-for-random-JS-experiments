const express = require("express");
const path = require("path");
const app = express();
const fs = require('fs'); // We'll use this later


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Serve static files for each experiment
const experimentsDir = __dirname;
fs.readdir(experimentsDir, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error("Error reading experiments directory");
        return;
    }

    files
        .filter(
            (file) =>
                file.isDirectory() &&
                !["node_modules", "public", "views", ".git"].includes(file.name)
        )
        .forEach((dir) => {
            console.log(`Route: /${encodeURI(dir.name).charAt(0).toUpperCase() + encodeURI(dir.name).slice(1).replace(/[\(\)]/g, '')}`);
            console.log(`Path: ${path.join(experimentsDir, dir.name)}`);
            app.use(
                `/${encodeURI(dir.name).charAt(0).toUpperCase() + encodeURI(dir.name).slice(1).replace(/[\(\)]/g, '')}`,
                express.static(path.join(experimentsDir, dir.name))
            );
        });
    app.use('/test%20\(\)', express.static(path.join(__dirname, 'public')));
});

app.get("/", (req, res) => {
    // Read the directories to find experiments
    const experimentsDir = __dirname;
    fs.readdir(experimentsDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).send("Error reading experiments directory");
        }

        // Filter directories that are not 'node_modules', 'public', or 'views'
        const experiments = files
            .filter(
                (file) =>
                    file.isDirectory() &&
                    !["node_modules", "public", "views", ".git"].includes(file.name)
            )
            .map((dir) => dir.name);
        
        res.render("index", { experiments });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
