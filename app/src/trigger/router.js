const express = require('express')
const router = express.Router()
const service = require('./service')
const validator = require('./validator')

/*
    Server Configuration
 */

let path = __dirname + '/views/'

router.get('/', async (req, res) => {
    res.render(path + 'trigger', {})
})

router.get('/questions', async (req, res, next) => {
    try {
        let variables = { 
            questions: await service.getQuestions() 
        }
        res.render(path + 'questions', variables)
    } catch (err) {
        next(err)
    }
})

router.get('/question/:id', async (req, res, next) => {
    try {
        let variables = {
            question: await service.getQuestion(req.params.id)
        }
        res.render(path + 'question', variables)
    } catch (err) {
        next(err)
    }
})

router.post('/question/:id', async (req, res, next) => {
    try {
        let variables = {
            question: await service.getQuestion(req.params.id)
        }
        variables['test_trigger'] = req.body['test_trigger']
        
        res.render(path + 'question', variables)
    } catch (err) {
        next(err)
    }
})

router.post('/evaluation', async (req, res, next) => {
    let questionId = req.body['question_id']
    let testTrigger = req.body['test_trigger']
    let neededTables = req.body['needed_tables']

    // Try-Catch might be more elegant?
    let validationResults = validator.validateTrigger(testTrigger, neededTables)
    if (!validationResults.isValid) {
        
    } else {
        variables['test_success'] = false
        variables['test_result'] = validationResults.errorMessage
    }

    res.render(path + 'evaluation', variables)
})

module.exports = router