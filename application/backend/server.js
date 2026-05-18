if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const REQUIRED_ENV = [
  'SESSION_SECRET',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
]

function assertRequiredEnv() {
  const missing = REQUIRED_ENV.filter(
    (key) => process.env[key] === undefined || process.env[key] === ''
  )
  if (missing.length > 0) {
    console.error(
      'Startup aborted: missing required environment variables:',
      missing.join(', ')
    )
    process.exit(1)
  }
}

assertRequiredEnv()

const { verifyDatabase } = require('./database')
const express = require('express')
const session = require('express-session');
const cors = require('cors')
const path = require('path')
const searchRoute = require('./routes/searchRoute')
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const listingRoute = require('./routes/listingRoute')
const favoritesRoute = require('./routes/favoriteRoute')
const conversationRoute = require('./routes/conversationRoute')
const categoryRoute = require('./routes/categoryRoute')
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
app.use('/api/listings', listingRoute)
app.use('/api/favorites', favoritesRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/categories', categoryRoute)

//  SERVE REACT BUILD 
app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

async function start() {
  try {
    await verifyDatabase()
  } catch (err) {
    console.error('Startup aborted: could not connect to the database.', err.message)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()