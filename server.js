require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIEDEX = require('./movies-data-small.json')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIEDEX;
  
    if (req.query.country) {
      response = response.filter(movie =>
        // case insensitive searching
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
      )
    }
  
    if (req.query.genre) {
      response = response.filter(movie =>
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      )
    }

    if (req.query.avg_vote) {
        response = response.filter(movie =>
          movie.avg_vote >= Number(req.query.avg_vote)
        )
      }
  
    res.json(response)
  })

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})