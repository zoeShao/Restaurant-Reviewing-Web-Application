const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')

const model = require('./model')
const {User} = model.User
const {Restaurant} = model.Restaurant
const {Review} = model.Review

// express
const app = express();
app.use(bodyParser.json())

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
}) 