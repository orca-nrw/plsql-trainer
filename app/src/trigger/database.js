const oracledb = require('oracledb')
const dbconfig = require('../database/dbconfig')

/**
 * An unformatted response from the database
 * @typedef {{metaData: [{name: string}], rows: any[]}} DatabaseResponse
 */

/**
 * Query database for a specific question
 * @param {number} questionId
 * @returns {Promise<DatabaseResponse>}
 */
async function getRawQuestion(questionId) {
    let connection
    let result

    connection = await oracledb.getConnection(dbconfig)
    result = await connection.execute(
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
async function getRawQuestions() {
    let connection
    let result

    connection = await oracledb.getConnection(dbconfig)
    result = await connection.execute(
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
 * @returns 
 */
async function getRawTriggerEvaluation(questionId, testTrigger) {
    let connection
    let result

    connection = await oracledb.getConnection(dbconfig)
    result = await connection.execute(
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
    let resultSet = result.outBinds.cursor

    let metaData = resultSet.metaData
    let rows = await resultSet.getRows(1)

    await connection.close()

    return { metaData: metaData, rows: rows }
}

async function getRawFiringStatements(questionId) {
    let connection
    let result

    connection = await oracledb.getConnection(dbconfig)
    result = await connection.execute(
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
    getRawQuestions
}