const express = require('express')
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {StatusCodes} = require('http-status-codes')
const PORT = process.env.PORT
const connectD = require('./db/connect')

// instance
const app = express()

//body parser
app.use(express.urlencoded({extended: false}))// query format of data
app.use(express.json())// json format of data

// middleware
app.use(cors())// cross origin resource sharing
app.use(cookieParser(process.env.ACCESS_SECRET))

// api route
app.use(`/api/auth`, require('./route/authRoute'))

// default route
app.use(`**`, (req, res) => {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ msg : `Requsted service path is not available`})
})

// server
app.listen(PORT,() => {
    connectD()
    console.log(`server is started and running @ http://localhost:${PORT}`)
})