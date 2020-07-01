import React, { useEffect, useCallback } from 'react';
// ace 사용법: https://ace.c9.io/#nav=howto
function CodeSection(props) {
    const initAceEditor = useCallback(() => {
        const ace = window.ace;
        const code = props.code;
        const editor = ace.edit('editor');
        editor.setValue(code.init_code);
        editor.setTheme("ace/theme/twilight");
        editor.session.setMode(`ace/mode/${code.language.ace_name}`);
        editor.session.setUseWrapMode(true);
        editor.session.setTabSize(4);
        editor.session.setWrapLimitRange(null, null);
        editor.setBehavioursEnabled(true);//auto pairing of quotes & brackets
        editor.setShowPrintMargin(false);
        editor.session.setUseSoftTabs(true);//use soft tabs (likely the default)

        //Include auto complete- Only for Template Editor page
        ace.config.loadModule('ace/ext/language_tools', function () {
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true
            })

            var snippetManager = ace.require("ace/snippets").snippetManager;
            ace.config.loadModule(`ace/snippets/${code.language.ace_name}`, function (m) {
                if (m) {
                    snippetManager.files[code.language.ace_name] = m;
                }
                m.snippets = snippetManager.parseSnippetFile(m.snippetText);

            });
        });
    }, [props.code]);

    useEffect(() => {
        initAceEditor();
    }, [initAceEditor]);

    return (
        <div style={{ "display": "relative" }}>
            <div id="editor">

            </div>

        </div>

    );

}
export default CodeSection;