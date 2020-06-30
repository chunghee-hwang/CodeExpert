import React, { useEffect } from 'react';

// ace 사용법: https://ace.c9.io/#nav=howto
function CodeSection(props) {
    useEffect(() => {
        initAceEditor();
    });
    return (
        <div style={{ "display": "relative" }}>
            <div id="editor">

            </div>

        </div>

    );

    function initAceEditor() {
        const ace = window.ace;
        const code = props.code;
        const editor = ace.edit('editor');
        editor.setValue(code.init_code);
        editor.setTheme("ace/theme/twilight");
        editor.session.setMode(`ace/mode/${code.ace_language}`);
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
            ace.config.loadModule(`ace/snippets/${code.ace_language}`, function (m) {
                if (m) {
                    switch (props.language) {
                        case 'java':
                            snippetManager.files.java = m;
                            break;
                        case 'python':
                            snippetManager.files.python = m;
                            break;
                        case 'c_pp':
                        default:
                            snippetManager.files.c_pp = m;
                            break;
                    }

                    m.snippets = snippetManager.parseSnippetFile(m.snippetText);
                }
            });
        });
    }

}
export default CodeSection;