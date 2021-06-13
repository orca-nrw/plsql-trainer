SET DEFINE OFF;

CREATE OR REPLACE PACKAGE edb_plsql_app AUTHID CURRENT_USER IS
  FUNCTION evaluate_question ( question_id IN NUMBER, test_trigger IN VARCHAR2, identifier_key IN VARCHAR2) RETURN sys_refcursor;
  FUNCTION create_table ( table_name IN varchar2, identifier_key IN varchar2 ) RETURN NUMBER;
  FUNCTION delete_table_if_exists ( table_name IN varchar2, identifier_key IN varchar2 ) RETURN NUMBER;
  FUNCTION delete_table ( table_name IN varchar2, identifier_key IN varchar2 ) RETURN NUMBER;
  FUNCTION create_view ( table_name IN varchar2, identifier_key IN varchar2 ) RETURN NUMBER;
  FUNCTION delete_view ( table_name IN varchar2, identifier_key IN varchar2 ) RETURN NUMBER;
  FUNCTION create_trigger( trigger IN VARCHAR2, msg OUT VARCHAR ) RETURN NUMBER;
  FUNCTION fire_trigger ( question_id IN NUMBER, l_needed_table IN varchar2, identifier_key IN VARCHAR2 ) RETURN NUMBER;
  FUNCTION get_question ( question_id IN NUMBER) RETURN  sys_refcursor;
  FUNCTION get_questions RETURN sys_refcursor;
  FUNCTION get_table_colum_names ( v_table_name IN VARCHAR2 ) RETURN sys_refcursor;
  FUNCTION get_table_data ( v_table_name IN VARCHAR2 ) RETURN sys_refcursor;
  FUNCTION get_firing_statements ( question_id IN NUMBER ) RETURN  sys_refcursor;
  FUNCTION get_json_fnc(ip_rfc VARCHAR2) RETURN CLOB;
END edb_plsql_app;
/

CREATE OR REPLACE PACKAGE BODY edb_plsql_app IS

  FUNCTION evaluate_question
        ( question_id IN NUMBER, test_trigger IN VARCHAR2, identifier_key IN VARCHAR2)
    RETURN sys_refcursor AS
    evaluation_result sys_refcursor;
    sample_trigger VARCHAR(4048);
    new_test_trigger VARCHAR(4048);
    table_name VARCHAR(128);
    l_needed_table VARCHAR(128);
    l_tablen  BINARY_INTEGER;
    l_tab DBMS_UTILITY.uncl_array;
    function_result NUMBER;
    result_diffrence NUMBER;
    message VARCHAR2(512);
    resultnumber NUMBER;
    exceptiontesttable NUMBER;
    exceptionreferencetable NUMBER;
    resulttesttable CLOB;
    resultreferencetable CLOB;
    v_object_type VARCHAR2(32);
  BEGIN

    SELECT SAMPLETRIGGER, UPPER(TESTTABLE), NEEDEDTABLE INTO sample_trigger, table_name, l_needed_table FROM QUESTIONS WHERE QUESTIONID = question_id;

    ---------------------------------------------------------------------
    -- Aufbau der benötigten Tabellen für den zu prüfenden Trigger ------
    ---------------------------------------------------------------------

     DBMS_UTILITY.comma_to_table (
     list   => l_needed_table,
     tablen => l_tablen,
     tab    => l_tab);

    FOR i IN 1 .. l_tablen LOOP
        SELECT object_type INTO v_object_type FROM all_objects WHERE object_name LIKE UPPER(l_tab(i));
        IF v_object_type = 'TABLE' THEN
            function_result := delete_table_if_exists(UPPER(l_tab(i)),UPPER(identifier_key));
            function_result := create_table(UPPER(l_tab(i)),UPPER(identifier_key));
        ELSIF v_object_type = 'VIEW' THEN
            function_result := create_view(UPPER(l_tab(i)),UPPER(identifier_key));
        END IF;
    END LOOP;

    ---------------------------------------------------------------------
    -- Der zu prüfende Trigger ------------------------------------------
    ---------------------------------------------------------------------

    new_test_trigger := test_trigger;

    FOR i IN 1 .. l_tablen LOOP
        new_test_trigger := REPLACE(UPPER(new_test_trigger),UPPER(l_tab(i)),UPPER(l_tab(i)||'_'||identifier_key));
    END LOOP;

    function_result := create_trigger(REPLACE(UPPER(new_test_trigger),'TRIGGER ','TRIGGER '||identifier_key|| '_'),message);
    IF function_result = -1 THEN
        FOR i IN 1 .. l_tablen LOOP
            SELECT object_type INTO v_object_type FROM all_objects WHERE object_name LIKE UPPER(l_tab(i));
            IF v_object_type = 'TABLE' THEN
                function_result := delete_table(UPPER(l_tab(i)),UPPER(identifier_key));
            ELSIF v_object_type = 'VIEW' THEN
                function_result := delete_view(UPPER(l_tab(i)),UPPER(identifier_key));
            END IF;
        END LOOP;

        OPEN evaluation_result FOR
            Select -2 AS RESULTNUMBER, message AS RESULTMESSAGE FROM DUAL;

        RETURN evaluation_result;
    END IF;

    function_result := fire_trigger(question_id,l_needed_table,identifier_key);
    IF function_result = -1 THEN
        exceptiontesttable := function_result;
    END IF;

    ---------------------------------------------------------------------
    -- Aufbau der benötigten Tabellen für den Sample Trigger ------------
    ---------------------------------------------------------------------

    FOR i IN 1 .. l_tablen LOOP
        SELECT object_type INTO v_object_type FROM all_objects WHERE object_name LIKE UPPER(l_tab(i));
        IF v_object_type = 'TABLE' THEN
            function_result := delete_table_if_exists(UPPER(l_tab(i)),UPPER(identifier_key || '_res'));
            function_result := create_table(UPPER(l_tab(i)),UPPER(identifier_key || '_res'));
        ELSIF v_object_type = 'VIEW' THEN
            function_result := create_view(UPPER(l_tab(i)),UPPER(identifier_key || '_res'));
        END IF;
    END LOOP;

    ---------------------------------------------------------------------
    -- Der Sample Trigger -----------------------------------------------
    ---------------------------------------------------------------------

    FOR i IN 1 .. l_tablen LOOP
        sample_trigger := REPLACE(UPPER(sample_trigger),UPPER(l_tab(i)),UPPER(l_tab(i)||'_'||identifier_key|| '_res'));
    END LOOP;

    function_result := create_trigger(REPLACE(UPPER(sample_trigger),'TRIGGER ','TRIGGER '||identifier_key|| '_res_'),message);
    IF function_result = -1 THEN
        FOR i IN 1 .. l_tablen LOOP
            SELECT object_type INTO v_object_type FROM all_objects WHERE object_name LIKE UPPER(l_tab(i));
            IF v_object_type = 'TABLE' THEN
                function_result := delete_table(UPPER(l_tab(i)),UPPER(identifier_key || '_res'));
            ELSIF v_object_type = 'VIEW' THEN
                function_result := delete_view(UPPER(l_tab(i)),UPPER(identifier_key || '_res'));
            END IF;
        END LOOP;

        OPEN evaluation_result FOR
            Select -2 AS RESULTNUMBER, message AS RESULTMESSAGE FROM DUAL;

        RETURN evaluation_result;
    END IF;

    function_result := fire_trigger(question_id,l_needed_table,identifier_key || '_res');
    IF function_result = -1 THEN
        exceptionreferencetable := function_result;
    END IF;

    ---------------------------------------------------------------------

    IF table_name <> 'EXCEPTION' THEN
        EXECUTE IMMEDIATE ' select count(*) from(
                            (select * from ' || table_name || '_' || identifier_key || ' MINUS select * from ' || table_name || '_' || identifier_key || '_res)
                            UNION ALL
                            (select * from ' || table_name || '_' || identifier_key || '_res MINUS select * from ' || table_name || '_' || identifier_key || ')
                            )' INTO result_diffrence;
    ELSE
        IF exceptionreferencetable <> exceptiontesttable THEN
            result_diffrence := -1;
        ELSE
            EXECUTE IMMEDIATE ' select count(*) from(
                                (select * from ' || l_needed_table || '_' || identifier_key || ' MINUS select * from ' || l_needed_table || '_' || identifier_key || '_res)
                                UNION ALL
                                (select * from ' || l_needed_table || '_' || identifier_key || '_res MINUS select * from ' || l_needed_table || '_' || identifier_key || ')
                                )' INTO result_diffrence;
            IF result_diffrence <> 0 THEN
                table_name := l_needed_table;
            END IF;
        END IF;
    END IF;

    IF result_diffrence = 0 THEN
        message := 'Der Trigger hat das gewünschte Ergebniss zurück geliefert!';
        resultnumber := 1;

        OPEN evaluation_result FOR
            SELECT resultnumber AS RESULTNUMBER, message AS RESULTMESSAGE FROM DUAL;
    ELSE
        SELECT get_json_fnc('edb_plsql_app.get_table_data(''' || table_name || '_' || identifier_key || ''')') INTO resulttesttable FROM DUAL;
        SELECT get_json_fnc('edb_plsql_app.get_table_data(''' || table_name || '_' || identifier_key || '_res'')') INTO resultreferencetable FROM DUAL;

        message := 'Der Trigger hat das falsche Ergebniss zurück geliefert!';
        resultnumber := -1;

        OPEN evaluation_result FOR
            SELECT resultnumber AS RESULTNUMBER, message AS RESULTMESSAGE, REPLACE(resulttesttable,'&quot;','"') AS resulttesttable, REPLACE(resultreferencetable,'&quot;','"') AS resultreferencetable FROM DUAL;
    END IF;

    ---------------------------------------------------------------------
    -- Abbau der benötigten Tabellen ------------------------------------
    ---------------------------------------------------------------------

    FOR i IN 1 .. l_tablen LOOP
        SELECT object_type INTO v_object_type FROM all_objects WHERE object_name LIKE UPPER(l_tab(i));
        IF v_object_type = 'TABLE' THEN
            function_result := delete_table(UPPER(l_tab(i)),UPPER(identifier_key));
        ELSIF v_object_type = 'VIEW' THEN
            function_result := delete_view(UPPER(l_tab(i)),UPPER(identifier_key));
        END IF;
    END LOOP;

    FOR i IN 1 .. l_tablen LOOP
        SELECT object_type INTO v_object_type FROM all_objects WHERE object_name LIKE UPPER(l_tab(i));
        IF v_object_type = 'TABLE' THEN
            function_result := delete_table(UPPER(l_tab(i)),UPPER(identifier_key || '_res'));
        ELSIF v_object_type = 'VIEW' THEN
            function_result := delete_view(UPPER(l_tab(i)),UPPER(identifier_key || '_res'));
        END IF;
    END LOOP;

    ---------------------------------------------------------------------
    RETURN evaluation_result;

  END evaluate_question;

  FUNCTION create_table
        ( table_name IN varchar2, identifier_key IN varchar2 )
    RETURN NUMBER AS
    command VARCHAR2(2048);
  BEGIN
    SELECT dbms_metadata.get_ddl('TABLE', table_name) INTO command FROM dual;
    command := REPLACE(REPLACE(REPLACE(REPLACE(command,table_name,table_name||'_'||identifier_key),'CONSTRAINT "','CONSTRAINT "'||identifier_key||'_'),'"',''),';','');
    EXECUTE IMMEDIATE command;
    EXECUTE IMMEDIATE 'INSERT INTO '||table_name||'_'||identifier_key||' SELECT * FROM '||table_name;
    COMMIT;
    RETURN 1;
  EXCEPTION WHEN OTHERS THEN
    raise_application_error(-20101, 'Fehler: Die Tabelle ' ||table_name||'_'||identifier_key|| ' konnte nicht angelegt werden! ('||sqlerrm||')');
  END create_table;

  FUNCTION create_view
        ( table_name IN varchar2, identifier_key IN varchar2 )
    RETURN NUMBER AS
    command VARCHAR2(2048);
  BEGIN
    command := 'CREATE VIEW ' || table_name || '_' || identifier_key || ' AS SELECT * FROM ' || table_name;
    EXECUTE IMMEDIATE command;
    COMMIT;
    RETURN 1;
  EXCEPTION WHEN OTHERS THEN
    raise_application_error(-20101, 'Fehler: Die View ' || table_name || '_' || identifier_key || ' konnte nicht angelegt werden! (' || sqlerrm || ')');
  END create_view;

  FUNCTION delete_table
        ( table_name IN varchar2, identifier_key IN varchar2 )
    RETURN NUMBER AS
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE '||table_name||'_'||identifier_key;
    RETURN 1;
  EXCEPTION WHEN OTHERS THEN
    raise_application_error(-20101, 'Fehler: Die Tabelle konnte nicht gelöscht werden! ('||sqlerrm||')');
  END delete_table;

  FUNCTION delete_table_if_exists
        ( table_name IN varchar2, identifier_key IN varchar2 )
    RETURN NUMBER AS
        total number(2) := 0;
  BEGIN
    SELECT count(tname) into total from tab where tname = upper(table_name||'_'||identifier_key);
    IF total = 1 THEN
        EXECUTE IMMEDIATE 'DROP TABLE '||table_name||'_'||identifier_key;
    END IF;
    RETURN 1;
  EXCEPTION WHEN OTHERS THEN
    raise_application_error(-20101, 'Fehler: Die Tabelle konnte nicht gelöscht werden! ('||sqlerrm||')');
  END delete_table_if_exists;

  FUNCTION delete_view
        ( table_name IN varchar2, identifier_key IN varchar2 )
    RETURN NUMBER AS
  BEGIN
    EXECUTE IMMEDIATE 'DROP View '||table_name||'_'||identifier_key;
    RETURN 1;
  EXCEPTION WHEN OTHERS THEN
    raise_application_error(-20101, 'Fehler: Die Tabelle konnte nicht gelöscht werden! (' || sqlerrm || ')');
  END delete_view;

  FUNCTION create_trigger
        ( trigger IN VARCHAR2, msg OUT VARCHAR )
    RETURN NUMBER AS
  BEGIN
    EXECUTE IMMEDIATE trigger;

    msg:= 'Erfolgreich: Der Trigger wurde ohne Fehler kompiliert!';
    RETURN 1;
  EXCEPTION WHEN OTHERS THEN
    msg := 'Fehler: Der Trigger konnte nicht kompiliert werden! (' || sqlerrm || ')';
    RETURN -1;
  END create_trigger;

  FUNCTION fire_trigger
    ( question_id IN NUMBER, l_needed_table IN VARCHAR2, identifier_key IN VARCHAR2 )
    RETURN NUMBER AS
    test_statement VARCHAR2(1024);
    l_tablen  BINARY_INTEGER;
    l_tab DBMS_UTILITY.uncl_array;
    CURSOR test_statement_cursor IS
		      SELECT FIRINGCODE
		      FROM FIRINGSTATEMENTS
		      WHERE QUESTIONID = question_id
          ORDER BY EXECORDER ASC;
  BEGIN
     DBMS_UTILITY.comma_to_table (
     list   => l_needed_table,
     tablen => l_tablen,
     tab    => l_tab);

    OPEN test_statement_cursor;
	  LOOP
		  FETCH test_statement_cursor INTO test_statement;
		  EXIT WHEN test_statement_cursor%NOTFOUND;
            FOR i IN 1 .. l_tablen LOOP
                test_statement := REPLACE(UPPER(test_statement),UPPER(l_tab(i)),UPPER(l_tab(i) || '_' || identifier_key));
            END LOOP;
		  EXECUTE IMMEDIATE test_statement;
	  END LOOP;
	  CLOSE test_statement_cursor;
      COMMIT;
    RETURN 1;
  EXCEPTION WHEN OTHERS THEN
    RETURN 1;
  END fire_trigger;

  FUNCTION get_question
    ( question_id IN NUMBER)
    RETURN  sys_refcursor AS
    select_result sys_refcursor;
  BEGIN
    OPEN select_result FOR
        SELECT  QUESTIONID ,
                QUESTIONTYP ,
                NEEDEDTABLE ,
                TEXT ,
                TESTTABLE ,
                TRIGGERNAME ,
                SAMPLETRIGGER  FROM QUESTIONS WHERE QUESTIONID = question_id;

    RETURN select_result;
  END get_question;

  FUNCTION get_questions
    RETURN  sys_refcursor AS
    select_result sys_refcursor;
  BEGIN
    OPEN select_result FOR
        SELECT  QUESTIONID ,
                QUESTIONTYP ,
                NEEDEDTABLE ,
                TEXT ,
                TESTTABLE ,
                TRIGGERNAME ,
                SAMPLETRIGGER  FROM QUESTIONS ORDER BY QUESTIONID ASC;

    RETURN select_result;
  END get_questions;

  FUNCTION get_table_colum_names
    ( v_table_name IN VARCHAR2 )
    RETURN  sys_refcursor AS
    select_result sys_refcursor;
  BEGIN
    OPEN select_result FOR
      SELECT COLUMN_NAME FROM ALL_TAB_COLUMNS WHERE TABLE_NAME=UPPER(v_table_name);

    RETURN select_result;
  END get_table_colum_names;

  FUNCTION get_table_data
    ( v_table_name IN VARCHAR2 )
    RETURN  sys_refcursor AS
    select_result sys_refcursor;
  BEGIN
    OPEN select_result FOR
      'SELECT * FROM ' || v_table_name;

    RETURN select_result;
  END get_table_data;

  FUNCTION get_firing_statements
    ( question_id IN NUMBER )
    RETURN  sys_refcursor AS
    select_result sys_refcursor;
  BEGIN
    OPEN select_result FOR
      SELECT FIRINGCODE
		      FROM FIRINGSTATEMENTS
		      WHERE QUESTIONID = question_id
          ORDER BY EXECORDER ASC;

    RETURN select_result;
  END get_firing_statements;

  FUNCTION get_json_fnc(ip_rfc VARCHAR2) RETURN CLOB AS
        /*====================================================================================================+
        FUNCTION:   GET_JSON_FNC

        SUMMARY:   TO generate JSON string dynamically from SYS_REFCURSOR

        Revision History:
        Date          Name                             Revision      Description
        ======================================================================================================
         11-AUG-13     Swadhin Ray(Sloba)                   1.0       First Version
        ======================================================================================================*/
        lhtmloutput   xmltype;
        lxsl          LONG;
        lxmldata      xmltype;
        lcontext      dbms_xmlgen.ctxhandle;
        l_ret_clob    CLOB;
        desc_cur      NUMBER;
        l_descr_tab   dbms_sql.desc_tab2;
        l_num_cols    NUMBER;
        l_header_clob CLOB;
        l_row_data    VARCHAR2(100);
        l_ip_rfc      SYS_REFCURSOR;
        l_exec_comm   VARCHAR2(250);
BEGIN
        l_exec_comm := 'SELECT ' || ip_rfc || ' from dual';

        EXECUTE IMMEDIATE l_exec_comm
                INTO l_ip_rfc;

        l_header_clob := '{"metadata":[';
        desc_cur      := dbms_sql.to_cursor_number(l_ip_rfc);

        dbms_sql.describe_columns2(desc_cur
                                  ,l_num_cols
                                  ,l_descr_tab);

        FOR i IN 1 .. l_num_cols
        LOOP
                CASE
                        WHEN l_descr_tab(i).col_type IN (2
                                         ,8) THEN
                                l_row_data := '{"name":"' || l_descr_tab(i)
                                             .col_name || '","type":"number"},';
                        WHEN l_descr_tab(i).col_type = 12 THEN
                                l_row_data := '{"name":"' || l_descr_tab(i)
                                             .col_name || '","type":"date"},';
                        ELSE
                                l_row_data := '{"name":"' || l_descr_tab(i)
                                             .col_name || '","type":"text"},';
                END CASE;
                dbms_lob.writeappend(l_header_clob
                                    ,length(l_row_data)
                                    ,l_row_data);
        END LOOP;
        l_header_clob := rtrim(l_header_clob
                              ,',') || '],"data":';

        EXECUTE IMMEDIATE l_exec_comm
                INTO l_ip_rfc;
        lcontext := dbms_xmlgen.newcontext(l_ip_rfc);
        dbms_xmlgen.setnullhandling(lcontext
                                   ,1);
        lxmldata := dbms_xmlgen.getxmltype(lcontext
                                          ,dbms_xmlgen.none);
        -- this is a XSL for JSON
        lxsl := '<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>
<xsl:template match="/">[<xsl:for-each select="/ROWSET/*">
  {<xsl:for-each select="./*">
    "<xsl:value-of select="name()"/>":"<xsl:value-of select="text()"/>"<xsl:choose>
      <xsl:when test="position()!= last()">,</xsl:when>
    </xsl:choose>
   </xsl:for-each>
  }<xsl:choose>
      <xsl:when test="position() != last()">,</xsl:when>
    </xsl:choose>
   </xsl:for-each>
]}</xsl:template></xsl:stylesheet>';

        lhtmloutput := lxmldata.transform(xmltype(lxsl));
        l_ret_clob  := lhtmloutput.getclobval();
        l_ret_clob  := REPLACE(l_ret_clob
                              ,'_x0020_'
                              ,' ');
        dbms_lob.writeappend(l_header_clob
                            ,length(l_ret_clob)
                            ,l_ret_clob);
        RETURN l_header_clob;
EXCEPTION
        WHEN OTHERS THEN
                dbms_output.put_line(SQLERRM);
                dbms_output.put_line(dbms_utility.format_error_backtrace);
                RETURN NULL;
END get_json_fnc;

END edb_plsql_app;
/