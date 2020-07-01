import React from 'react';
import Split from 'react-split'
import CodeSection from './CodeSection';
import AnswerSection from './AnswerSection';
function ProblemSolutionSection(props) {
    const language_options = props.codes.reduce((accumulator, code, idx) => {
        accumulator.push(<option key={idx} data-language_id={code.language.id}>{code.language.name}</option>);
        return accumulator;
    }, []);

    return (
        <div>
            <div id="code-title-bar">
                <div id="code-file-name">solution.{props.code.language.file_extension}</div>
                <select id="language-select-input" onChange={e => props.onChangeLanguage(e.target.options[e.target.selectedIndex].dataset.language_id)}>
                    {language_options}
                </select>
            </div>

            <Split className="problem-solution-section"
                sizes={[50, 50]}
                minSize={0}
                expandToMin={true}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="vertical"
                cursor="row-resize"
            >
                <CodeSection code={props.code} />
                <AnswerSection code_results={props.code_results} />
            </Split>
        </div>
    );
}
export default ProblemSolutionSection;