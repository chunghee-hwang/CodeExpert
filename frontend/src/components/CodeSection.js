import React, { useEffect } from 'react';
import { initAceEditor } from 'utils/AceEditor';
function CodeSection(props) {
    useEffect(() => {
        if (!props.code) return;
        let codeValue;
        if (props.code.prevCode) {
            codeValue = props.code.prevCode;
        } else {
            codeValue = props.code.initCode;
        }
        initAceEditor(codeValue, props.code.language.aceName, 'code-editor');
    }, [props.code]);

    return (
        <div style={{ "display": "relative" }}>
            <div id="code-editor">

            </div>

        </div>

    );

}
export default CodeSection;