const database = require('./database')

/**
 * Formatted Question to be used in pug
 * @typedef {{QuestionId: number, Text: string, TestTable: string, TriggerName: string, SampleTrigger: string, QuestionTyp: string, NeededTable: string}} Question
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
    return formattedQuestions
}

module.exports = {
    getQuestion,
    getQuestions
}