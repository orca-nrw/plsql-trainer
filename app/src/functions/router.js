const express = require('express')
const router = express.Router()
const path = require('path')
// const service = require('./service')
// const validator = require('./validator')

/*
    Server Configuration
 */

const viewPath = path.join(__dirname, 'views')

router.get('/', async (req, res) => {
  res.render(path.join(viewPath, 'functions'), {})
})

/*
    Routes
*/

router.get('/questions', async (req, res, next) => {
  try {
    const variables = {
      // TODO
    }
    res.render(path.join(viewPath, 'questions'), variables)
  } catch (err) {
    next(err)
  }
})

router.get('/question/:id', async (req, res, next) => {
  try {
    const variables = {
      // TODO
    }
    res.render(path.join(viewPath, 'question'), variables)
  } catch (err) {
    next(err)
  }
})

router.post('/question/:id', async (req, res, next) => {
  try {
    const variables = {
      // TODO
    }

    res.render(path.join(viewPath, 'question'), variables)
  } catch (err) {
    next(err)
  }
})

router.post('/evaluation', async (req, res, next) => {
  try {
    const variables = {}

    // TODO

    res.render(path.join(viewPath, 'evaluation'), variables)
  } catch (err) {
    next(err)
  }
})

module.exports = router
