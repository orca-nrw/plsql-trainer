const oracledb = require('oracledb')
const dbconfig = require('./dbconfig')

// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {
    let connection

    try {
        connection = await oracledb.getConnection({
            user: dbconfig.user,
            password: dbconfig.password,
            connectString: dbconfig.connect_string
        })
        const result = await connection.execute(
            `SELECT 'HELLO WORLD' FROM DUAL`
        )
        console.log(result)

    } catch (err) {
        console.error(err)
    } finally {
        if (connection) {
            try {
                await connection.close()
            } catch (err) {
                console.error(err)
            }
        }
    }

}

module.exports = {
    run,
}
