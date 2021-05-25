window.onload = function() {
    window.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'text/x-plsql',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets : true,
        autofocus: true
    });
};