const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth-routes')
const cors = require('cors')

dotenv.config()
const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000', // your Next.js frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if you plan to send cookies
  }),
)

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

//routes
app.use('/api/auth', authRoutes)

// connect to db
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db listening on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  })
