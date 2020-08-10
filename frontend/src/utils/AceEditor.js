// ace 사용법: https://ace.c9.io/#nav=howto
export const initAceEditor = (initCode = '', languageAceName, editorIdOrElement, isReadOnly = false) => {
    const ace = window.ace;
    if (!ace) return;
    const editor = ace.edit(editorIdOrElement);
    editor.setValue(initCode);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode(`ace/mode/${languageAceName}`);
    editor.session.setUseWrapMode(true);
    editor.session.setTabSize(4);
    editor.session.setWrapLimitRange(null, null);
    editor.setBehavioursEnabled(true);//auto pairing of quotes & brackets
    editor.setShowPrintMargin(false);
    editor.session.setUseSoftTabs(true);//use soft tabs (likely the default)
    editor.setOptions({ readOnly: isReadOnly, highlightActiveLine: !isReadOnly, highlightGutterLine: !isReadOnly });
    editor.getSession().setUndoManager(new ace.UndoManager()); // 뒤로가기 기록 모두 제거
    if (isReadOnly) {
        editor.renderer.$cursorLayer.element.style.display = "none"
        editor.setOptions({ maxLines: Infinity });
    }
    //Include auto complete- Only for Template Editor page
    ace.config.loadModule('ace/ext/language_tools', function () {
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true
        })

        var snippetManager = ace.require("ace/snippets").snippetManager;
        ace.config.loadModule(`ace/snippets/${languageAceName}`, function (m) {
            if (m) {
                snippetManager.files[languageAceName] = m;
            }
            m.snippets = snippetManager.parseSnippetFile(m.snippetText);

        });
    });

    editor.resize();
    editor.gotoLine(1);
};