/**
 * Validation Results object
 * @typedef {{isValid: boolean, errorMessage: string}} ValidationResults
 */

/**
 * Checks whether trigger string is valid by performing 3 checks
 * 1. Whether the string contains all required keywords
 * 2. Whether the trigger is allowed to access all of its tables
 * 3. Whether the string contains illegal SQL statements
 *
 * @param {String} trigger
 * @param {String[]} neededTables
 * @returns {ValidationResults}
 */
function validateTrigger (trigger, neededTables) {
  trigger = trigger.toUpperCase()

  // Perform checks
  let results = checkTriggerContents(trigger)
  if (!results.isValid) return results

  results = checkAccessesTables(trigger, neededTables)
  if (!results.isValid) return results

  results = checkForIllegalSQL(trigger)
  if (!results.isValid) return results

  return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a function string is valid in a similar way to triggers
 * @param {string} userFunction
 * @param {string} neededTables
 * @param {string} functionName
 * @returns {ValidationResults}
 */
function validateFunction (userFunction, neededTables, functionName) {
  userFunction = userFunction.toUpperCase()
  functionName = functionName.toUpperCase()

  // Perform checks
  let results = checkFunctionContents(userFunction, functionName)
  if (!results.isValid) return results

  results = checkAccessesTables(userFunction, neededTables)
  if (!results.isValid) return results

  results = checkForIllegalSQL(userFunction)
  if (!results.isValid) return results

  return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a procedure string is valid in a similar way to triggers
 * @param {string} userProcedure
 * @param {string} neededTables
 * @param {string} procedureName
 * @returns {ValidationResults}
 */
function validateProcedure (userProcedure, neededTables, procedureName) {
  userProcedure = userProcedure.toUpperCase()
  procedureName = procedureName.toUpperCase()

  // Perform checks
  let results = checkProcedureContents(userProcedure, procedureName)
  if (!results.isValid) return results

  results = checkAccessesTables(userProcedure, neededTables)
  if (!results.isValid) return results

  results = checkForIllegalSQL(userProcedure)
  if (!results.isValid) return results

  return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a trigger string contains all necessary keywords
 * @param {String} trigger
 * @returns {ValidationResults}
 */
function checkTriggerContents (trigger) {
  const errorBase = 'Der Trigger muss mindestens einen der folgenden Strings enthalten: '

  if (!stringContains(trigger, ['CREATE OR REPLACE TRIGGER', 'CREATE TRIGGER'])) {
    return { isValid: false, errorMessage: errorBase + "['CREATE OR REPLACE TRIGGER','CREATE TRIGGER']" }
  }
  if (!stringContains(trigger, ['BEFORE', 'AFTER', 'INSTEAD OF'])) {
    return { isValid: false, errorMessage: errorBase + "['BEFORE','AFTER','INSTEAD OF']" }
  }
  if (!stringContains(trigger, ['INSERT', 'UPDATE', 'DELETE'])) {
    return { isValid: false, errorMessage: errorBase + "['INSERT', 'UPDATE', 'DELETE']" }
  }
  if (!stringContains(trigger, ['ON'])) {
    return { isValid: false, errorMessage: errorBase + "['ON']" }
  }
  if (!stringContains(trigger, ['BEGIN'])) {
    return { isValid: false, errorMessage: errorBase + "['BEGIN']" }
  }
  if (!stringContains(trigger, ['END'])) {
    return { isValid: false, errorMessage: errorBase + "['END']" }
  }

  return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a function contains all necessary keywords
 * @param {string} userFunction
 * @param {string} functionName
 * @returns {ValidationResults}
 */
function checkFunctionContents (userFunction, functionName) {
  const regex = /(?<=FUNCTION\W)(\w*)/gm
  let m

  if ((m = regex.exec(userFunction)) !== null) {
    if (m[0] !== functionName) {
      return 'Die Funktionsname muss ' + functionName + ' lauten. Dein Funktionsname lautet: ' + m[0]
    }
  }
  const errorBase = 'Die Funktion muss mindestens einen der folgenden Strings enthalten: '

  if (!stringContains(userFunction, ['CREATE OR REPLACE FUNCTION', 'CREATE FUNCTION'])) {
    return { isValid: false, errorMessage: errorBase + "['CREATE OR REPLACE FUNCTION', 'CREATE FUNCTION']" }
  }
  if (!stringContains(userFunction, ['RETURN'])) {
    return { isValid: false, errorMessage: errorBase + "['RETURN']" }
  }
  if (!stringContains(userFunction, ['IS', 'AS'])) {
    return { isValid: false, errorMessage: errorBase + "['IS', 'AS']" }
  }
  if (!stringContains(userFunction, ['BEGIN'])) {
    return { isValid: false, errorMessage: errorBase + "['BEGIN']" }
  }
  if (!stringContains(userFunction, ['END'])) {
    return { isValid: false, errorMessage: errorBase + "['END']" }
  }

  return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a procedure contains all necessary keywords
 * @param {string} userProcedure
 * @param {string} procedureName
 * @returns {ValidationResults}
 */
function checkProcedureContents (userProcedure, procedureName) {
  const regex = /(?<=PROCEDURE\W)(\w*)/gm
  let m

  if ((m = regex.exec(userProcedure)) !== null) {
    if (m[0] !== procedureName) {
      return 'Der Name der Prozedur muss ' + procedureName + ' lauten. Deine Prozedur heißt: ' + m[0]
    }
  }
  const errorBase = 'Die Prozedur muss mindestens einen der folgenden Strings enthalten: '

  if (!stringContains(userProcedure, ['CREATE OR REPLACE PROCEDURE', 'CREATE PROCEDURE'])) {
    return { isValid: false, errorMessage: errorBase + "['CREATE OR REPLACE PROCEDURE', 'CREATE PROCEDURE']" }
  }
  if (!stringContains(userProcedure, ['IS', 'AS'])) {
    return { isValid: false, errorMessage: errorBase + "['IS', 'AS']" }
  }
  if (!stringContains(userProcedure, ['BEGIN'])) {
    return { isValid: false, errorMessage: errorBase + "['BEGIN']" }
  }
  if (!stringContains(userProcedure, ['END'])) {
    return { isValid: false, errorMessage: errorBase + "['END']" }
  }

  return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a statement accesses unnecessary tables
 * @param {string} statement
 * @param {string[]} neededTables
 * @returns {ValidationResults}
 */
function checkAccessesTables (statement, neededTables) {
  const allAllowedTables = ['ABTEILUNGEN', 'ANGESTELLTE', 'ARTIKEL', 'AUFTRAEGE', 'AUFTRAGSPOSITIONEN', 'GEH_KLASSEN', 'LIEFERUNGEN',
    'GEHALTSPROTOKOLL', 'KUNDEN', 'LAGER', 'LAGERBESTAND', 'LIEFERANTEN', 'LIEFERPROGRAMME', 'ORTE',
    'POSITIONSARCHIV', 'QUESTIONS', 'STRUKTUR', 'TEILE', 'TEILE_WERKE', 'WERKE', 'RECHNUNGEN']

  neededTables = neededTables.split(',')
  neededTables = neededTables.map(table => table.toUpperCase())

  // All tables without needed tables = List of unnecessary tables
  const unnecessaryTables = allAllowedTables.filter(table => !neededTables.includes(table))

  if (stringContains(statement, unnecessaryTables)) {
    // TODO: Fix ugly output
    return { isValid: false, errorMessage: `Es wird auf Tabellen zugegriffen, auf die nicht zugegriffen werden muss! (${unnecessaryTables.toString()})` }
  }

  return { isValid: true, errorMessage: '' }
}

/**
 * Checks the string for forbidden SQL statements (e.g. hidden tables or statements like DROP)
 * @param {string} statement
 * @returns {ValidationResults}
 */
function checkForIllegalSQL (statement) {
  const forbiddenTables = ['QUESTIONS', 'FIRINGSTATEMENTS']
  if (stringContains(statement, forbiddenTables)) return { isValid: false, errorMessage: 'Es wird auf Tabellen zugegriffen, auf die nicht zugegriffen werden darf!' }

  const forbiddenSQL = ['DROP', 'IMMEDIATE', 'CREATE TABLE', 'CREATE VIEW', 'EXEC', 'EXECUTE', 'DISABLE', 'GRANT']
  if (stringContains(statement, forbiddenSQL)) return { isValid: false, errorMessage: "Das Statement enthält verbotenen SQL-Code: ['DROP','IMMEDIATE','CREATE TABLE','CREATE VIEW', 'EXEC','EXECUTE']" }

  return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a given string contains atleast one out of an array of strings
 * @param {String} string
 * @param {String[]} array
 * @returns {Boolean}
 */
function stringContains (string, array) {
  for (const element of array) {
    if (RegExp('\\b' + element + '\\b', 'i').test(string)) return true
  }
  return false
}

module.exports = {
  validateTrigger,
  validateFunction,
  validateProcedure
}
