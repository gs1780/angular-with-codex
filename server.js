const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const distRoot = path.join(__dirname, 'dist');
let appDist = distRoot;

try {
  const entries = fs.readdirSync(distRoot, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  if (entries.length === 1) {
    appDist = path.join(distRoot, entries[0]);
  }
} catch (err) {
  console.error('Dist folder not found. Make sure the Angular app is built.', err);
}

app.use(express.static(appDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(appDist, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
