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

async function getFunctionResult() {
    let connection

    connection = await oracledb.getConnection(dbconfig)
    const result = await connection.execute(
        `BEGIN
                :cursor := get_question(:id);
             END;`,
        {
            id: 2,
            cursor: {dir: oracledb.BIND_OUT, type: oracledb.CURSOR}
        }
    )
    console.log(result.outBinds.cursor.metaData)
    let rows = await result.outBinds.cursor.getRows(50)
    console.log(rows[0][4])

    await connection.close()


}

module.exports = {
    getRawQuestion,
    getRawQuestions
}