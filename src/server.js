const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const mediaFolderPath = '/Users/trancuong/Downloads';

// Serve media files directly if requested
app.use('/media', express.static(mediaFolderPath));

// Function to recursively read through folders
function readDirectory(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            readDirectory(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// Generate and serve an HTML page with media links
app.get('/', (req, res) => {
    const allFiles = readDirectory(mediaFolderPath);

    let html = '<h1>Media Gallery</h1>';
    allFiles.forEach(file => {
        const relativeFilePath = path.relative(mediaFolderPath, file);
        const fileUrl = `/media/${relativeFilePath.split(path.sep).join('/')}`;

        if (file.match(/\.(jpeg|jpg|gif|png)$/)) {
            html += `<img src="${fileUrl}" style="max-width: 200px; max-height: 200px; margin: 10px;">`;
        } else if (file.match(/\.(mp4|webm)$/)) {
            html += `<video src="${fileUrl}" controls style="max-width: 320px; max-height: 240px; margin: 10px;"></video>`;
        }
    });

    res.send(html);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
