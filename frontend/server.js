const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the dist folder
// Angular 21 outputs to dist/frontend by default
const distPath = path.join(__dirname, 'dist', 'frontend');
app.use(express.static(distPath));

// SPA fallback - redirect all routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
