const oracledb = require('oracledb')
const dbconfig = require('../database/dbconfig')

/**
 * An unformatted response from the database
 * @typedef {{metaData: [{name: string}], rows: any[]}} DatabaseResponse
 */

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

/**
 * Use package-function evaluate_question to evaluate the function written by the user
 * @param {number} questionId
 * @param {string} userFunction
 * @returns {DatabaseResponse}
 */
async function getRawFunctionEvaluation (questionId, userFunction) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
        `BEGIN
            :cursor := edb_plsql_func_app.evaluate_question(:question_id, :user_function, :identifier_key);
        END;`,
        {
          question_id: questionId,
          user_function: userFunction,
          identifier_key: 'Test',
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }
  )
  const resultSet = result.outBinds.cursor

  const metaData = resultSet.metaData
  const rows = await resultSet.getRows(1)

  await connection.close()

  return { metaData: metaData, rows: rows }
}

/**
 * Query the database for all statements used to test the function
 * @param {number} questionId
 * @returns {DatabaseResponse}
 */
async function getRawTestCalls (questionId) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
        `SELECT CALL
        FROM FUNC_CALLS
        WHERE QUESTIONID = :question_id
        ORDER BY EXECORDER ASC`,
        {
          question_id: questionId
        }
  )
  await connection.close()

  return result
}

module.exports = {
  getRawFuncQuestions,
  getRawFuncQuestion,
  getRawFunctionEvaluation,
  getRawTestCalls
}
