const database = require('./database')

/**
 * Formatted Question to be used in pug
 * @typedef {{questionid: number, text: string, testtable: string, triggername: string, sampletrigger: string, questiontyp: string, neededtable: string}} Question
 */

/**
 * Transform DatabaseResponse with a single row into a formatted Question
 * @param {{name: string}[]} metaData
 * @param {any[]} row
 * @returns {Question}
 */
function formatQuestion(metaData, row) {
    let question = {}
    for (let i in metaData) {
        // Match DatabaseResponse metaData to corresponding row entries
        question[metaData[i].name.toLowerCase()] = row[i]
    }
    return question
}

/**
 * Wrapper to turn a DatabaseResponse into question objects
 * @param {number} questionId
 * @returns {Promise<Question>}
 */
async function getQuestion(questionId) {
    let rawQuestion = await database.getRawQuestion(questionId)
    return formatQuestion(rawQuestion.metaData, rawQuestion.rows[0])
}

/**
 * Wrapper to turn a DatabaseResponse into list of question objects
 * @returns {Promise<Question[]>}
 */
async function getQuestions() {
    let formattedQuestions = []
    let rawQuestions = await database.getRawQuestions()
    for (let row of rawQuestions.rows) {
        let formattedQuestion = formatQuestion(rawQuestions.metaData, row)
        formattedQuestions.push(formattedQuestion)
    }
    formattedQuestions.sort((x, y) => x.questionid - y.questionid)
    return formattedQuestions
}

/**
 * Wrapper to turn a DatabaseResponse into an evaluation
 * 
 * Warning: Depending on the resultnumber the format of the resulting object returned by the database varies
 * @param {number} questionId 
 * @param {string} testTrigger 
 * @returns {Promise<*>}
 */
async function evaluateTrigger(questionId, testTrigger) {
    let evaluation = {}
    let rawEvaluation = await database.getRawTriggerEvaluation(questionId, testTrigger)
    
    // Map metaData-Keys to corresponding values
    for (let i in rawEvaluation.metaData) {
        evaluation[rawEvaluation.metaData[i].name.toLowerCase()] = rawEvaluation.rows[0][i]
    }

    return evaluation
}

/**
 * Wrapper to turn a DatabaseResponse into a firingStatement
 * @param {number} questionId 
 * @returns {Promise<*>}
 */
async function getFiringStatements(questionId) {
    let firingStatements = []
    let rawFiringStatements = await database.getRawFiringStatements(questionId)

    for(let currentRow in rawFiringStatements.rows) {
        let firingStatement = {}
        for(let i in rawFiringStatements.metaData) {
            firingStatement[rawFiringStatements.metaData[i].name.toLowerCase()] = rawFiringStatements.rows[currentRow][i]
        }
        firingStatements.push(firingStatement)
    } 

    return firingStatements
}

module.exports = {
    getQuestion,
    getQuestions,
    evaluateTrigger,
    getFiringStatements
}