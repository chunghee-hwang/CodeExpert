import React, { useCallback, useEffect } from 'react';
import Split from 'react-split'
import CodeSection from './CodeSection';
import AnswerSection from './AnswerSection';
import LoadingScreen from './LoadingScreen';
function ProblemSolutionSection(props) {
    const getLanguageOptions = useCallback(() => {
        return props.codes.reduce((accumulator, code, idx) => {
            accumulator.push(<option key={idx} data-languageid={code.language.id}>{code.language.name}</option>);
            return accumulator;
        }, [])
    }, [props.codes]);
    useEffect(()=>{
        if(props.code){
            const languageSelect = document.getElementById('language-select-input');
            const foundCodeIndex = props.codes.findIndex(code=>props.code.language.id === code.language.id);
            if(languageSelect && foundCodeIndex!==-1){
                if(languageSelect.selectedIndex !== foundCodeIndex)
                    languageSelect.selectedIndex= foundCodeIndex;
            }
        }
    },[props.codes, props.code]);
    return (
        <div className="problem-solution-section">
            {!props.codes || !props.code ? <LoadingScreen label="코드 정보를 불러오는 중입니다." /> :
                <>
                    <div id="code-title-bar">
                        <div id="code-file-name">{`solution.${props.code.language.fileExtension}`}</div>
                        {(props.isMarking||props.isResetting) ?
                            <select className="custom-select" id="language-select-input" disabled>
                                {getLanguageOptions()}
                            </select> :
                            <select className="custom-select" id="language-select-input" onChange={e => props.onChangeLanguage(e.target.options[e.target.selectedIndex].dataset.languageid)}>
                                {getLanguageOptions()}
                            </select>
                        }
                    </div>

                    <Split className="problem-solution-section"
                        sizes={[50, 50]}
                        minSize={0}
                        expandToMin={true}
                        gutterSize={5}
                        gutterAlign="center"
                        snapOffset={30}
                        dragInterval={1}
                        direction="vertical"
                        cursor="row-resize"
                    >
                        <CodeSection code={props.code} />
                        <AnswerSection isMarking={props.isMarking} isResetting={props.isResetting} markResults={props.markResults} which={props.which} problemActions={props.problemActions}/>
                    </Split>
                </>
            }
        </div>
    );
}
export default ProblemSolutionSection;