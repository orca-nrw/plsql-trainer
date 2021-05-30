const express = require('express')
const router = express.Router()
const service = require('./service')

/*
    Server Configuration
 */

let path = __dirname + '/views/'

router.get('/', async (req, res) => {
    res.render(path + 'trigger', {})
})

router.get('/questions', async (req, res, next) => {
    try {
        let variables = { questions: await service.getQuestions() }
        res.render(path + 'questions', variables)
    } catch (err) {
        next(err)
    }
})

router.get('/question/:id', async (req, res, next) => {
    try {
        let variables = { question: await service.getQuestion(req.params.id) }
        res.render(path + 'question', variables)
    } catch (err) {
        next(err)
    }
})

router.post('trigger/evaluation', async (req, res) => {
    res.send("Temp")
})

module.exports = router