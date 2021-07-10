const oracledb = require('oracledb')
const dbconfig = require('../database/dbconfig')

/**
 * Query database for a specific question
 * @param {number} questionId
 * @returns {Promise<DatabaseResponse>}
 */
async function getRawQuestion (questionId) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
        `SELECT *
         FROM QUESTIONS
         WHERE QUESTIONID = :questionId`,
        {
          questionId: questionId
        }
  )
  await connection.close()

  return result
}

/**
 * Query database for list of all questions
 * @returns {Promise<DatabaseResponse>}
 */
async function getRawQuestions () {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
        `SELECT *
         FROM QUESTIONS`
  )
  await connection.close()

  return result
}

/**
 * Use package-function evaluate_question to evaluate the testTrigger.
 *
 * WARNING: The shape of the return varies depending on the resultnumber.
 * @param {number} questionId
 * @param {string} testTrigger
 * @returns {DatabaseResponse}
 */
async function getRawTriggerEvaluation (questionId, testTrigger) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
        `BEGIN
            :cursor := edb_plsql_app.evaluate_question(:question_id, :test_trigger, :identifier_key);
        END;`,
        {
          question_id: questionId,
          test_trigger: testTrigger,
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
 * Query the database for all statements used to test the trigger
 * @param {number} questionId
 * @returns {DatabaseResponse}
 */
async function getRawFiringStatements (questionId) {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
        `SELECT FIRINGCODE
        FROM FIRINGSTATEMENTS
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
  getRawQuestion,
  getRawQuestions,
  getRawTriggerEvaluation,
  getRawFiringStatements
}
