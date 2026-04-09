/*
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
*/

const express = require('express')
const cors = require('cors')
const path = require('path')
const searchRoute = require('./routes/searchRoute')

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

//  API ROUTES 
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from backend!" })
})

app.use('/api/search', searchRoute)

//  SERVE REACT BUILD 
app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

//  START SERVER 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})