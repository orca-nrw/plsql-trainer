const express = require('express')
const app = express()
const triggerRouter = require('./trigger/router')
const service = require('./service')

/*
    Server Configuration
 */

let path = __dirname + '/views/'

// Use pug
app.set('view engine', 'pug')

// Handle static css and js files automatically
app.use(express.static(__dirname))

/*
Application Code
*/
app.get(["/", "/index"], async (req, res) => {
    res.render(path + 'plsql', {})
})

app.get('/table/:tableName', async (req, res) => {
    let variables = {
        tableName: req.params.tableName,
        table: await service.getFormattedTable(req.params.tableName)
    }
    res.render(path + 'table', variables)
})

/*
Submodules
 */
app.use('/trigger', triggerRouter)

// Start server
app.listen(8080, () => {
    console.log(`Server listening at http://localhost:8080/`)
})

// Handle Shutdown
process.on('SIGINT', () => {
    console.log('Exiting application')
    process.exit(0)
})