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
function formatQuestion (metaData, row) {
  const question = {}
  for (const i in metaData) {
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
async function getQuestion (questionId) {
  const rawQuestion = await database.getRawQuestion(questionId)
  return formatQuestion(rawQuestion.metaData, rawQuestion.rows[0])
}

/**
 * Wrapper to turn a DatabaseResponse into list of question objects
 * @returns {Promise<Question[]>}
 */
async function getQuestions () {
  const formattedQuestions = []
  const rawQuestions = await database.getRawQuestions()
  for (const row of rawQuestions.rows) {
    const formattedQuestion = formatQuestion(rawQuestions.metaData, row)
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
async function evaluateTrigger (questionId, testTrigger) {
  const evaluation = {}
  const rawEvaluation = await database.getRawTriggerEvaluation(questionId, testTrigger)

  // Map metaData-Keys to corresponding values
  for (const i in rawEvaluation.metaData) {
    evaluation[rawEvaluation.metaData[i].name.toLowerCase()] = rawEvaluation.rows[0][i]
  }

  return evaluation
}

/**
 * Wrapper to turn a DatabaseResponse into a firingStatement
 * @param {number} questionId
 * @returns {Promise<*>}
 */
async function getFiringStatements (questionId) {
  const firingStatements = []
  const rawFiringStatements = await database.getRawFiringStatements(questionId)

  for (const currentRow in rawFiringStatements.rows) {
    const firingStatement = {}
    for (const i in rawFiringStatements.metaData) {
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
