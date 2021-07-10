const oracledb = require('oracledb')
const dbconfig = require('../database/dbconfig')

async function getRawQuestions () {
  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
    `SELECT *
    FROM FUNC_QUESTIONS`
  )
  await connection.close()

  return result
}

async function getRawQuestion (questionId) {
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
  getRawQuestions,
  getRawQuestion
}
