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

router.get('/questions', async (req, res) => {
    let variables = {questions: await service.getQuestions()}
    res.render(path + 'questions', variables)
})

router.get('/question/:id', async (req, res) => {
    let variables = {question: await service.getQuestion(req.params.id)}
    res.render(path + 'question', variables)
})

router.post('trigger/evaluation', async (req, res) => {
    res.send("Temp")
})

module.exports = router