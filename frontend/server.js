const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the Angular build output folder
// Angular 21 outputs to dist/frontend/browser
const distPath = path.join(__dirname, 'dist', 'frontend', 'browser');
app.use(express.static(distPath));

// SPA fallback - redirect all routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
