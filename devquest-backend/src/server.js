const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')
const questRoutes = require('./routes/questRoutes')
const progressRoutes = require('./routes/progressRoutes')
const leaderboardRoutes = require('./routes/leaderboardRoutes')
const badgeRoutes = require('./routes/badgeRoutes')

dotenv.config()
const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

//routes
app.use('/api/auth', authRoutes)
app.use('/api/quests', questRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/badges', badgeRoutes)

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db listening on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  })
