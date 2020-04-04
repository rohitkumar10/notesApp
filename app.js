const express = require('express')
const userRouter = require('./routes/userRoutes')
const notesRouter = require('./routes/notesRoutes')

const app = express();

app.use(express.json())
app.use('/users', userRouter)
app.use('/notes', notesRouter)

module.exports = app
