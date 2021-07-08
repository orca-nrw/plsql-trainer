const db = require('./database')

/**
 * typedef {{headers: string[], rows: *[] }} Table
 */

/**
 * Wrapper to turn DatabaseResponse into Table
 * @param {string} tableName
 * @returns {Table}
 */
async function getFormattedTable (tableName) {
  const rawTables = await db.getTable(tableName)
  const table = {
    headers: rawTables.metaData.map(meta => meta.name),
    rows: rawTables.rows
  }
  return table
}

module.exports = {
  getFormattedTable
}
