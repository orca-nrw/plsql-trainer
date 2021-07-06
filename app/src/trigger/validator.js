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
 * @returns {ValidationResults} validationResults
 */
function validateTrigger(trigger, neededTables) {
    trigger = trigger.toUpperCase()

    // Perform checks
    let results = checkContents(trigger)
    if (!results.isValid) return results

    results = checkAccessesTables(trigger, neededTables)
    if (!results.isValid) return results

    results = checkForIllegalSQL(trigger)
    if (!results.isValid) return results

    return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a trigger string contains all nescessary keywords
 * @param {String} trigger 
 * @returns {ValidationResults}  validationResults
 */
function checkContents(trigger) {
    let errorBase = "Der Trigger muss mindestens einen der folgenden Strings enthalten: "

    if (!stringContains(trigger, ['CREATE OR REPLACE TRIGGER', 'CREATE TRIGGER']))
        return { isValid: false, errorMessage: errorBase + "['CREATE OR REPLACE TRIGGER','CREATE TRIGGER']" }
    if (!stringContains(trigger, ['BEFORE', 'AFTER', 'INSTEAD OF']))
        return { isValid: false, errorMessage: errorBase + "['BEFORE','AFTER','INSTEAD OF']" }
    if (!stringContains(trigger, ['INSERT', 'UPDATE', 'DELETE']))
        return { isValid: false, errorMessage: errorBase + "['INSERT', 'UPDATE', 'DELETE']" }
    if (!stringContains(trigger, ['ON']))
        return { isValid: false, errorMessage: errorBase + "['ON']" }
    if (!stringContains(trigger, ['BEGIN']))
        return { isValid: false, errorMessage: errorBase + "['BEGIN']" }
    if (!stringContains(trigger, ['END']))
        return { isValid: false, errorMessage: errorBase + "['END']" }

    return { isValid: true, errorMessage: '' }
}

/**
 * Checks whether a trigger accesses unnecessary tables
 * @param {string} trigger 
 * @param {string[]} neededTables 
 * @returns {ValidationResults}
 */
function checkAccessesTables(trigger, neededTables) {
    let allAllowedTables = ['ABTEILUNGEN', 'ANGESTELLTE', 'ARTIKEL', 'AUFTRAEGE', 'AUFTRAGSPOSITIONEN', 'GEH_KLASSEN', 'LIEFERUNGEN',
        'GEHALTSPROTOKOLL', 'KUNDEN', 'LAGER', 'LAGERBESTAND', 'LIEFERANTEN', 'LIEFERPROGRAMME', 'ORTE',
        'POSITIONSARCHIV', 'QUESTIONS', 'STRUKTUR', 'TEILE', 'TEILE_WERKE', 'WERKE', 'RECHNUNGEN']

    neededTables = neededTables.split(',')
    neededTables = neededTables.map(table => table.toUpperCase())

    // All tables without needed tables = List of unnecessary tables
    let unnecessaryTables = allAllowedTables.filter(table => !neededTables.includes(table))

    if (stringContains(trigger, unnecessaryTables)) {
        return { isValid: false, errorMessage: `Der Trigger greift auf Tabellen zu, auf die er nicht zugreifen muss! (${unnecessaryTables.toString()})` }
    }

    return { isValid: true, errorMessage: '' }
}

/**
 * Checks the string for forbidden SQL statements (e.g. hidden tables or statements like DROP)
 * @param {string} trigger 
 * @returns {ValidationResults}
 */
function checkForIllegalSQL(trigger) {
    let forbiddenTables = ['QUESTIONS', 'FIRINGSTATEMENTS']
    if (stringContains(trigger, forbiddenTables)) return {isValid: false, errorMessage: 'Der Trigger greift auf Tabellen zu, auf die er nicht zugreifen darf!'}

    let forbiddenSQL = ['DROP', 'IMMEDIATE', 'CREATE TABLE', 'CREATE VIEW', 'EXEC', 'EXECUTE', 'DISABLE', 'GRANT']
    if (stringContains(trigger, forbiddenSQL)) return {isValid: false, errorMessage: "Der Trigger enthält verbotenen SQL-Code: ['DROP','IMMEDIATE','CREATE TABLE','CREATE VIEW', 'EXEC','EXECUTE']"}

    return {isValid: true, errorMessage: ''}
}

/**
 * Checks whether a given string contains atleast one out of an array of strings
 * @param {String} string
 * @param {String[]} array
 * @returns {Boolean}
 */
 function stringContains(string, array) {
    for (let element of array) {
        if (RegExp('\\b' + element + '\\b', 'i').test(string)) return true
    }
    return false
}

module.exports = {
    validateTrigger
}