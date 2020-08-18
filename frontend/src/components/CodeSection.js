import React, { useEffect } from 'react';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/snippets/java"
import "ace-builds/src-noconflict/snippets/python"
import "ace-builds/src-noconflict/snippets/c_cpp"
function CodeSection(props) {
    useEffect(() => {
        let editor = window.ace.edit('code-editor');
        const session = editor.getSession();
        const undoManager = session.getUndoManager();
        undoManager.reset();
        session.setUndoManager(undoManager);
        editor.moveCursorTo(0, 0);
    },[props.code.language.name]);
    return (
        <div className="code-section" style={{ "display": "relative" }}>
            <AceEditor
                mode={props.code.language.aceName}
                theme="monokai"
                value={props.code.prevCode ? props.code.prevCode : props.code.initCode}
                name="code-editor" // id
                width="100%"
                fontSize="1.0rem"
                wrapEnabled={false}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                }}
                onLoad={(editor) => {
                    document.querySelector(".code-section").style.height = document.querySelector("#code-editor").style.height;
                }}
            />
        </div>
    );
}
export default CodeSection;