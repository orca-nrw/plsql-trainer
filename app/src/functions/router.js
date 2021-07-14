const express = require('express')
const router = express.Router()
const path = require('path')
const service = require('./service')
const validator = require('../util/validator')

/*
    Server Configuration
 */

const viewPath = path.join(__dirname, 'views')

/*
    Routes
*/

router.get('/', async (req, res) => {
  res.render(path.join(viewPath, 'functions'), {})
})

router.get('/questions', async (req, res, next) => {
  try {
    const variables = {
      questions: await service.getFuncQuestions()
    }
    res.render(path.join(viewPath, 'questions'), variables)
  } catch (err) {
    next(err)
  }
})

router.get('/question/:id', async (req, res, next) => {
  try {
    const variables = {
      question: await service.getFuncQuestion(req.params.id)
    }
    res.render(path.join(viewPath, 'question'), variables)
  } catch (err) {
    next(err)
  }
})

router.post('/question/:id', async (req, res, next) => {
  try {
    const variables = {
      question: await service.getFuncQuestion(req.params.id)
    }
    variables.test_trigger = req.body.test_trigger

    res.render(path.join(viewPath, 'question'), variables)
  } catch (err) {
    next(err)
  }
})

router.post('/evaluation', async (req, res, next) => {
  try {
    const variables = {}

    const questionId = req.body.question_id
    const userFunction = req.body.user_function
    const neededTables = req.body.needed_tables
    const functionName = req.body.functionname

    const validationResults = validator.validateFunction(userFunction, neededTables, functionName)
    if (validationResults.isValid) {
      const functionEvaluation = await service.evaluateFunction(questionId, userFunction)
      const functionCalls = await service.getTestCalls(questionId)

      variables.evaluation = functionEvaluation
      variables.test_success = true
      variables.function_calls = functionCalls
    } else {
      variables.test_success = false
      variables.test_result = validationResults.errorMessage
    }
    res.render(path.join(viewPath, 'evaluation'), variables)
  } catch (err) {
    next(err)
  }
})

module.exports = router
