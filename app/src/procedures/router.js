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
  res.render(path.join(viewPath, 'procedures'))
})

router.get('/questions', async (req, res, next) => {
  try {
    const variables = {
      questions: await service.getProcQuestions()
    }
    res.render(path.join(viewPath, 'questions'), variables)
  } catch (err) {
    next(err)
  }
})

router.get('/question/:id', async (req, res, next) => {
  try {
    const variables = {
      question: await service.getProcQuestion(req.params.id)
    }
    res.render(path.join(viewPath, 'question'), variables)
  } catch (err) {
    next(err)
  }
})

router.post('/question/:id', async (req, res, next) => {
  try {
    const variables = {
      question: await service.getProcQuestion(req.params.id)
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
    const userProcedure = req.body.user_procedure
    const neededTables = req.body.needed_tables
    const procedureName = req.body.procname

    const validationResults = validator.validateProcedure(userProcedure, neededTables, procedureName)
    if (validationResults.isValid) {
      const procedureEvaluation = await service.evaluateProcedure(questionId, userProcedure)
      const procedureCalls = await service.getTestCalls(questionId)

      variables.evaluation = procedureEvaluation
      variables.test_success = true
      variables.procedure_calls = procedureCalls
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
