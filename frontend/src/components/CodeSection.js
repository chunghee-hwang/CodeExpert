import React, { useEffect } from 'react';
import { initAceEditor } from 'utils/AceEditor';
function CodeSection(props) {
    useEffect(() => {
        let code_value;
        if (props.code.prev_code) {
            code_value = props.code.prev_code;
        } else {
            code_value = props.code.init_code;
        }
        initAceEditor(code_value, props.code.language.ace_name, 'code-editor');
    }, [props.code]);

    return (
        <div style={{ "display": "relative" }}>
            <div id="code-editor">

            </div>

        </div>

    );

}
export default CodeSection;