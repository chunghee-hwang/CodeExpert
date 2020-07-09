import React, { useCallback } from 'react';
import Split from 'react-split'
import CodeSection from './CodeSection';
import AnswerSection from './AnswerSection';
import LoadingScreen from './LoadingScreen';
function ProblemSolutionSection(props) {
    const getLanguageOptions = useCallback(() => {
        return props.codes.reduce((accumulator, code, idx) => {
            accumulator.push(<option key={idx} data-language_id={code.language.id}>{code.language.name}</option>);
            return accumulator;
        }, [])
    }, [props.codes]);

    return (
        <div className="problem-solution-section">
            {!props.codes || !props.code ? <LoadingScreen label="코드 정보를 불러오는 중입니다." /> :
                <>
                    <div id="code-title-bar">
                        <div id="code-file-name">{`solution.${props.code.language.file_extension}`}</div>
                        <select className="custom-select" id="language-select-input" onChange={e => props.onChangeLanguage(e.target.options[e.target.selectedIndex].dataset.language_id)}>
                            {getLanguageOptions()}
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
                        <AnswerSection is_marking={props.is_marking} is_resetting={props.is_resetting} code_results={props.code_results} />
                    </Split>
                </>
            }
        </div>
    );
}
export default ProblemSolutionSection;