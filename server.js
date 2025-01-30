require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')

app.use(cors())

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const ordersRouter = require('./routes/orders.js')
app.use('/api/orders', ordersRouter)

const usersRouter = require('./routes/users.js')
app.use('/api/users', usersRouter)

app.listen(3000, () => {console.log('Server Started')})