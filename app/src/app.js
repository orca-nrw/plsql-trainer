const express = require('express')
const app = express()
const db = require('./database')

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

// Start server
app.listen(8080, () => {
    console.log(`Server listening at http://localhost:8080/`)
})

// Handle Shutdown
process.on('SIGINT', () => {
    console.log('Exiting application')
    process.exit(0)
})