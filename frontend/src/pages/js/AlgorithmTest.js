import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'pages/css/AlgorithmTest.css';
import Split from 'react-split';
import ProblemInfoSection from 'components/ProblemInfoSection';
import ProblemSolutionSection from 'components/ProblemSolutionSection';
import { Button } from 'react-bootstrap';
import Media from 'react-media';
import { paths } from 'constants/Paths';
import { getIntegerPathParameter, moveToPage } from 'utils/PageControl';
import { showWarningAlert } from 'utils/AlertManager';
import AuthenticateManager from 'utils/AuthenticateManager';
function AlgorithmTest(props) {
    const { user } = props.account;
    const { isProgressing, data, which } = props.problem;
    const { problemActions } = props;
    const [code, setCode] = useState(null);
    const problemId = getIntegerPathParameter(useParams()['problemId']);
    useEffect(() => {
        if (!user || !AuthenticateManager.isUserLoggedIn()) {
            moveToPage(props.history, paths.pages.loginForm);
        }
        else if (problemId) {
            if (!data.problemDataAndCode) {
                //- request problem data and code using problem id
                problemActions.getProblemDataAndCode({ problemId });
            } else if (!data.problemMetaData) problemActions.getProblemMetaData();
            else {
                setCode(data.problemDataAndCode.codes[0]);
            }
        }
    }, [user, props.history, data.problemDataAndCode, problemActions, problemId, data.problemMetaData]);
    const isMarking = isProgressing && which === 'submitProblemCode';
    const isResetting = isProgressing && which === 'resetProblemCode';

    const problemInfoSection = <ProblemInfoSection problemMetaData={data.problemMetaData ? data.problemMetaData : null} problem={data.problemDataAndCode ? data.problemDataAndCode.problem : null} />;
    const problemSolutionSection = <ProblemSolutionSection codes={data.problemDataAndCode ? data.problemDataAndCode.codes : null} code={code} onChangeLanguage={langaugeId => changeLangauge(langaugeId)} markResults={data.submitResults} isMarking={isMarking} isResetting={isResetting} which={which} problemActions={problemActions} />;
    const answerButtonBar =
        <div id="answer-btn-bar">
            {!isProgressing ?
                <>
                    <Button variant="dark mr-3" onClick={() => moveToPage(props.history, `${paths.pages.othersSolutions.prefix}/${problemId}`)}>
                        다른 사람의 풀이
            </Button>
                    <Button variant="dark align-right" onClick={e => resetCode()}>초기화</Button>
                    <Button variant="primary ml-3" onClick={e => submitCode()}>코드 채점</Button>
                </>
                :
                <>
                    <Button disabled variant="dark mr-3">다른 사람의 풀이</Button>
                    <Button disabled variant="dark align-right">초기화</Button>
                    <Button disabled variant="primary ml-3">코드 채점</Button>
                </>
            }
        </div>

    return (
        <div>

            <Media query={{ minWidth: 1025 }}>
                {matches =>
                    matches ? (
                        /* computer screen */
                        <div>
                            <Split className="algorithm-test"
                                sizes={[50, 50]}
                                minSize={0}
                                expandToMin={true}
                                gutterSize={5}
                                gutterAlign="center"
                                snapOffset={30}
                                dragInterval={1}
                                direction="horizontal"
                                cursor="col-resize"
                            >
                                {problemInfoSection}
                                {problemSolutionSection}
                            </Split>
                            {answerButtonBar}
                        </div>

                    ) : (
                            /* smart device screen */
                            <div className="algorithm-test">
                                {problemInfoSection}
                                {problemSolutionSection}
                                {answerButtonBar}
                            </div>
                        )
                }
            </Media>
        </div>


    );


    function changeLangauge(languageId) {
        if (data.problemDataAndCode) {
            languageId = Number(languageId);
            let languageCoresspondingCode = data.problemDataAndCode.codes.find(code => languageId === code.language.id);
            if (languageCoresspondingCode) {
                setCode(languageCoresspondingCode);
                if (data.submitResults) problemActions.clearSubmitResults();
            }
        }
    }

    function resetCode() {
        showWarningAlert({ title: '정말 코드를 초기화 할까요?', text: '초기화하면 코드 정보를 다시 되돌릴 수 없고, 정답 기록 또한 초기화 됩니다.', btnText: '초기화' }).then((willReset) => {
            if (willReset) {
                //- request reset problem code
                problemActions.resetProblemCode({ problemId, languageId: code.language.id });
                let editor = window.ace.edit('code-editor');
                editor.setValue(code.initCode);
                editor.gotoLine(1);
            }
        });
    }
    function submitCode() {
        const submittedCode = window.ace.edit('code-editor').getValue();
        const languageId = code.language.id;
        //- request Marking the code using problemId, submittedCode, languageId
        problemActions.submitProblemCode({ problemId, submittedCode, languageId });
        problemActions.updateCodeFromProblemData({submittedCode, languageId});
    }
}

export default AlgorithmTest;