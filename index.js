// Environment variables from .env file now available globally
require('dotenv').config()
const express = require('express')

const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Item = require('./models/item')

app.use(cors())

// Check if the build dir contains a
// file corresponding to the request's address
// and if so, return it.
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
// The order of middlewares matters!

app.get('/api/items', (req, res) => {
  Item.find({})
    .then((items) => {
      // Send as a json fomatted string
      res.json(items)
    })
})

app.get('/api/items/:id', (req, res, next) => {
  Item.findById(req.params.id)
    .then((item) => {
      item ? res.json(item) : res.status(404).end()
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// Use the middleware after the routes so it is
// only called if no route handles the request
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    // Status 400 means request should not be repeated without modifications
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(err)
}

app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
