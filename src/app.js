const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./routes/index')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', router)
app.use(morgan('dev'));

module.exports = app