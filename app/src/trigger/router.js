const express = require('express')
const router = express.Router()
const service = require('./service')
const validator = require('../util/validator')
const path = require('path')

/*
    Server Configuration
 */

const viewPath = path.join(__dirname, 'views')

/*
    Routes
*/

router.get('/', async (req, res) => {
  res.render(path.join(viewPath, 'trigger'), {})
})

router.get('/questions', async (req, res, next) => {
  try {
    const variables = {
      questions: await service.getQuestions()
    }
    res.render(path.join(viewPath, 'questions'), variables)
  } catch (err) {
    next(err)
  }
})

router.get('/question/:id', async (req, res, next) => {
  try {
    const variables = {
      question: await service.getQuestion(req.params.id)
    }
    res.render(path.join(viewPath, 'question'), variables)
  } catch (err) {
    next(err)
  }
})

router.post('/question/:id', async (req, res, next) => {
  try {
    const variables = {
      question: await service.getQuestion(req.params.id)
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
    const testTrigger = req.body.test_trigger
    const neededTables = req.body.needed_tables

    variables.question_id = questionId
    variables.test_trigger = testTrigger

    // Try-Catch might be more elegant?
    const validationResults = validator.validateTrigger(testTrigger, neededTables)
    if (validationResults.isValid) {
      const triggerEvaluation = await service.evaluateTrigger(questionId, testTrigger)
      const firingStatements = await service.getFiringStatements(questionId)

      variables.evaluation = triggerEvaluation
      variables.test_success = true
      variables.firing_statements = firingStatements
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
