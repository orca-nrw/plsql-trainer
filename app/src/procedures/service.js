const database = require('./database')

/**
 * A procedure Question
 * @typedef {Object} ProcQuestion
 * @property {number} questionid
 * @property {string} text
 * @property {string} testtable
 * @property {string} procname
 * @property {string} sampleproc
 * @property {string} questiontyp
 * @property {string} neededtable
 */

/**
 * Transform DatabaseResponse with a single row into a formatted Question
 * @param {{name: string}[]} metaData
 * @param {any[]} row
 * @returns {ProcQuestion}
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
 * Wrapper to turn DatabaseResponse into a list of ProcQuestions
 * @returns {Promise<ProcQuestion[]>}
 */
async function getProcQuestions () {
  const formattedQuestions = []
  const rawQuestions = await database.getRawProcQuestions()
  for (const row of rawQuestions.rows) {
    const formattedQuestion = formatQuestion(rawQuestions.metaData, row)
    formattedQuestions.push(formattedQuestion)
  }
  formattedQuestions.sort((x, y) => x.questionid - y.questionid)
  return formattedQuestions
}

/**
 * Wrapper to turn DatabaseResponse into a ProcQuestion
 * @param {number} questionId
 * @returns {Promise<ProcQuestion>}
 */
async function getProcQuestion (questionId) {
  const rawQuestion = await database.getRawProcQuestion(questionId)
  return formatQuestion(rawQuestion.metaData, rawQuestion.rows[0])
}

/**
 * Wrapper to turn a DatabaseResponse into a ProcedureEvaluation
 * @param {number} questionId
 * @param {string} userFunction
 * @returns {Promise<*>}
 */
async function evaluateProcedure (questionId, userProcedure) {
  const evaluation = {}
  const rawEvaluation = await database.getRawProcEvaluation(questionId, userProcedure)

  // Map metaData-Keys to corresponding values
  for (const i in rawEvaluation.metaData) {
    evaluation[rawEvaluation.metaData[i].name.toLowerCase()] = rawEvaluation.rows[0][i]
  }

  return evaluation
}

/**
 * Wrapper to turn a DatabaseResponse into a TestCall
 * @param {number} questionId
 * @returns {Promise<*>}
 */
async function getTestCalls (questionId) {
  const testCalls = []
  const rawTestCalls = await database.getRawTestCalls(questionId)

  for (const currentRow in rawTestCalls.rows) {
    const testCall = {}
    for (const i in rawTestCalls.metaData) {
      testCall[rawTestCalls.metaData[i].name.toLowerCase()] = rawTestCalls.rows[currentRow][i]
    }
    testCalls.push(testCall)
  }

  return testCalls
}

module.exports = {
  getProcQuestions,
  getProcQuestion,
  evaluateProcedure,
  getTestCalls
}
