const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional: JSON body parsing for API routes later
app.use(express.json());

// Health check / root API
app.get('/api', (req, res) => {
  res.json({ message: 'Express backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
