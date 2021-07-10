const oracledb = require('oracledb')
const dbconfig = require('../database/dbconfig')

/**
 * Query database for list of all function questions
 * @returns {DatabaseResponse}
 */
async function getRawFuncQuestions () {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
    `SELECT *
    FROM FUNC_QUESTIONS`
  )
  await connection.close()

  return result
}

/**
 * Query database for a function question
 * @param {number} questionId
 * @returns {DatabaseResponse}
 */
async function getRawFuncQuestion (questionId) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
    `SELECT *
    FROM FUNC_QUESTIONS
    WHERE QUESTIONID = :questionId`,
    {
      questionId: questionId
    }
  )
  await connection.close()

  return result
}

module.exports = {
  getRawFuncQuestions,
  getRawFuncQuestion
}
