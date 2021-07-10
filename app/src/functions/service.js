const database = require('./database')

/**
 * A function Question
 * @typedef {Object} Question
 * @property {string} functionname - Name of the function to be created
 * @property {string} neededtable - Commaseperated list of required tables
 * @property {number} questionid - ID of the question
 * @property {string} questiontyp - Type of the question (Trigger, Function, ...)
 * @property {string} samplefunction - Example solution
 * @property {string} testtable - Table to be tested
 * @property {string} text - Text of the question
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
 * Wrapper to turn DatabaseResponse into a list of FuncQuestions
 * @returns {Promise<Question[]>}
 */
async function getFuncQuestions () {
  const formattedQuestions = []
  const rawQuestions = await database.getRawFuncQuestions()
  for (const row of rawQuestions.rows) {
    const formattedQuestion = formatQuestion(rawQuestions.metaData, row)
    formattedQuestions.push(formattedQuestion)
  }
  formattedQuestions.sort((x, y) => x.questionid - y.questionid)
  return formattedQuestions
}

/**
 * Wrapper to turn DatabaseResponse into a FuncQuestion
 * @param {number} questionId - Question ID
 * @returns {Promise<Question>}
 */
async function getFuncQuestion (questionId) {
  const rawQuestion = await database.getRawFuncQuestion(questionId)
  return formatQuestion(rawQuestion.metaData, rawQuestion.rows[0])
}

// TODO: Typedef FunctionEvaluation
/**
 * Wrapper to turn a DatabaseResponse into a FunctionEvaluation
 * @param {number} questionId
 * @param {string} userFunction
 * @returns {Promise<*>}
 */
async function evaluateFunction (questionId, userFunction) {
  const evaluation = {}
  const rawEvaluation = await database.getRawFunctionEvaluation(questionId, userFunction)

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
  getFuncQuestions,
  getFuncQuestion,
  evaluateFunction,
  getTestCalls
}
