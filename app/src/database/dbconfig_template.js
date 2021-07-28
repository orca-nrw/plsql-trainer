// Create a file called dbconfig.js or remove the _template from this file and fill in your information
const user = 'username'
const password = 'password1'
const connectString = '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=yourDatabaseUrl)(PORT=1521))(CONNECT_DATA=(SID=EDB)))'

module.exports = {
  user,
  password,
  connectString
}
