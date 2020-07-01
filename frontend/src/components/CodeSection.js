import React, { useEffect } from 'react';
import { initAceEditor } from 'utils/AceEditor';
function CodeSection(props) {
    useEffect(() => {
        initAceEditor(props.code.init_code, props.code.language.ace_name, 'code-editor');
    }, [props.code]);

    return (
        <div style={{ "display": "relative" }}>
            <div id="code-editor">

            </div>

        </div>

    );

}
export default CodeSection;