const oracledb = require('oracledb')
const dbconfig = require('../database/dbconfig')

/**
 * An unformatted response from the database
 * @typedef {{metaData: [{name: string}], rows: any[]}} DatabaseResponse
 */

/**
 * Query database for list of all procedure questions
 * @returns {DatabaseResponse}
 */
async function getRawProcQuestions () {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
    `SELECT *
    FROM PROC_QUESTIONS`
  )
  await connection.close()

  return result
}

/**
 * Query database for a procedure question
 * @param {number} questionId
 * @returns {DatabaseResponse}
 */
async function getRawProcQuestion (questionId) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
    `SELECT *
    FROM PROC_QUESTIONS
    WHERE QUESTIONID = :questionId`,
    {
      questionId: questionId
    }
  )
  await connection.close()

  return result
}

/**
 * Use package-function evaluate_question to evaluate the procedure written by the user
 * @param {number} questionId
 * @param {string} userProcedure
 * @returns {DatabaseResponse}
 */
async function getRawProcEvaluation (questionId, userProcedure) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
    `BEGIN
      :cursor := edb_plsql_proc_app.evaluate_question(:question_id, :user_function, :identifier_key);
    END;`,
    {
      question_id: questionId,
      user_function: userProcedure,
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
 * Query the database for all statements used to test the procedure
 * @param {number} questionId
 * @returns {DatabaseResponse}
 */
async function getRawTestCalls (questionId) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
        `SELECT CALL
        FROM PROC_CALLS
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
  getRawProcQuestions,
  getRawProcQuestion,
  getRawProcEvaluation,
  getRawTestCalls
}
