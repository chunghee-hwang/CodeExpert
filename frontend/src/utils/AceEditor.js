// ace 사용법: https://ace.c9.io/#nav=howto
export const initAceEditor = (init_code = '', language_ace_name, editor_id_or_element, is_read_only = false) => {
    const ace = window.ace;
    if (!ace) return;
    const editor = ace.edit(editor_id_or_element);
    editor.setValue(init_code);
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode(`ace/mode/${language_ace_name}`);
    editor.session.setUseWrapMode(true);
    editor.session.setTabSize(4);
    editor.session.setWrapLimitRange(null, null);
    editor.setBehavioursEnabled(true);//auto pairing of quotes & brackets
    editor.setShowPrintMargin(false);
    editor.session.setUseSoftTabs(true);//use soft tabs (likely the default)
    editor.setOptions({ readOnly: is_read_only, highlightActiveLine: !is_read_only, highlightGutterLine: !is_read_only });

    if (is_read_only) {
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
        ace.config.loadModule(`ace/snippets/${language_ace_name}`, function (m) {
            if (m) {
                snippetManager.files[language_ace_name] = m;
            }
            m.snippets = snippetManager.parseSnippetFile(m.snippetText);

        });
    });

    editor.resize();
    editor.gotoLine(1);
};