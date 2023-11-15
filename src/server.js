const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const imageFolderPath = '/Users/trancuong/Downloads';

// Serve images directly if requested
app.use('/images', express.static(imageFolderPath));

// Generate and serve an HTML page with image links
app.get('/', (req, res) => {
    fs.readdir(imageFolderPath, (err, files) => {
        if (err) {
            res.status(500).send('Error reading the folder');
            return;
        }

        let html = '<h1>Image Gallery</h1>';
        files.forEach(file => {
          // check if file is image
          if (path.extname(file) === '.jpg' || path.extname(file) === '.jpeg' || path.extname(file) === '.png') {
            html += `<img src="/images/${file}" style="max-width: 200px; max-height: 200px; margin: 10px;">`;
          }
        });

        res.send(html);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
