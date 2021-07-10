const database = require('./database')

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
 * @returns {Promise<*>}
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
 * @param {number} questionId
 * @returns {Promise<*>}
 */
async function getFuncQuestion (questionId) {
  const rawQuestion = await database.getRawFuncQuestion(questionId)
  return formatQuestion(rawQuestion.metaData, rawQuestion.rows[0])
}

module.exports = {
  getFuncQuestions,
  getFuncQuestion
}
