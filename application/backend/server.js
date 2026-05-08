if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session');
const cors = require('cors')
const path = require('path')
const searchRoute = require('./routes/searchRoute')
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const listingRoute = require('./routes/listingRoute')
const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,    //change to true in production
    sameSite: "strict"
  }
}));

//  API ROUTES 
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from backend!" })
})

app.use("/auth", authRoute);
app.use('/api/search', searchRoute)
app.use('/api/user', userRoute)
app.use('/api/items', listingRoute)

//  SERVE REACT BUILD 
app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

//  START SERVER 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})