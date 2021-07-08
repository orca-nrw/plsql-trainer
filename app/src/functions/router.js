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

/*
    Routes
*/

router.get('/questions', async (req, res, next) => {
    try {
        let variables = {
            // TODO
        }
        res.render(path + 'questions', variables)
    } catch (err) {
        next(err)
    }
    
})

router.get('/question/:id', async (req, res, next) => {
    try {
        let variables = {
            // TODO
        }
        res.render(path + 'question', variables)
    } catch (err) {
        next(err)
    }
})

router.post('/question/:id', async (req, res, next) => {
    try {
        let variables = {
            // TODO
        }
        
        res.render(path + 'question', variables)
    } catch (err) {
        next(err)
    }
})

router.post('/evaluation', async (req, res, next) => {
    try {
        let variables = {}

        // TODO
        
        res.render(path + 'evaluation', variables)
    } catch (err) {
        next(err)
    }
    
})

module.exports = router