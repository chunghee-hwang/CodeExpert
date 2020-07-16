import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'pages/css/AlgorithmTest.css';
import Split from 'react-split';
import ProblemInfoSection from 'components/ProblemInfoSection';
import ProblemSolutionSection from 'components/ProblemSolutionSection';
import { Button, Nav } from 'react-bootstrap';
import Media from 'react-media';
import { paths } from 'constants/Paths';
import { getIntegerPathParameter, moveToPage } from 'utils/PageControl';
import { showWarningAlert } from 'utils/AlertManager';
function AlgorithmTest(props) {
    const { user } = props.account;
    const { is_progressing, data, which } = props.problem;
    const { problem_actions } = props;
    const [code, setCode] = useState(null);
    const problem_id = getIntegerPathParameter(useParams, 'problem_id');
    useEffect(() => {
        if (!user) {
            moveToPage(props.history, paths.pages.login_form);
        }
        else if (problem_id) {
            if (!data.problem_data_and_code) {
                //- request problem data and code using problem id
                problem_actions.getProblemDataAndCode({ problem_id });
            } else if (!data.problem_meta_data) problem_actions.getProblemMetaData();
            else {
                setCode(data.problem_data_and_code.codes[0]);
            }
        }
    }, [user, props.history, data.problem_data_and_code, problem_actions, problem_id, data.problem_meta_data]);
    const is_marking = is_progressing && which === 'submit_problem_code';
    const is_resetting = is_progressing && which === 'reset_problem_code';

    const problem_info_section = <ProblemInfoSection problem_meta_data={data.problem_meta_data ? data.problem_meta_data : null} problem={data.problem_data_and_code ? data.problem_data_and_code.problem : null} />;
    const problem_solution_section = <ProblemSolutionSection codes={data.problem_data_and_code ? data.problem_data_and_code.codes : null} code={code} onChangeLanguage={langauge_id => changeLangauge(langauge_id)} code_results={data.submit_results} is_marking={is_marking} is_resetting={is_resetting} />;


    return (
        <div>

            <Media query={{ minWidth: 1025 }}>
                {matches =>
                    matches ? (
                        /* computer screen */
                        <Split className="algorithm-test"
                            sizes={[50, 50]}
                            minSize={0}
                            expandToMin={true}
                            gutterSize={10}
                            gutterAlign="center"
                            snapOffset={30}
                            dragInterval={1}
                            direction="horizontal"
                            cursor="col-resize"
                        >
                            {problem_info_section}
                            {problem_solution_section}
                        </Split>
                    ) : (
                            /* smart device screen */
                            <div className="algorithm-test">
                                {problem_info_section}
                                {problem_solution_section}
                            </div>
                        )
                }
            </Media>


            <div id="answer-btn-bar">
                {!is_progressing ?
                    <>
                        <Nav.Link href={`${paths.pages.others_solutions.prefix}/${problem_id}`}><Button variant="dark mr-3">다른 사람의 풀이</Button></Nav.Link>
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
        </div>


    );


    function changeLangauge(language_id) {
        if (data.problem_data_and_code) {
            language_id = Number(language_id);
            let language_coressponding_code = data.problem_data_and_code.codes.find(code => language_id === code.language.id);
            if (language_coressponding_code) {
                setCode(language_coressponding_code);
                if (data.submit_results) problem_actions.clearSubmitResults();
            }
        }
    }

    function resetCode() {
        showWarningAlert({ title: '정말 코드를 초기화 할까요?', btn_text: '초기화' }).then((will_reset) => {
            if (will_reset) {
                //- request reset problem code
                problem_actions.resetProblemCode({ problem_id });
                let editor = window.ace.edit('code-editor');
                editor.setValue(code.init_code);
                editor.gotoLine(1);
            }
        });
    }
    function submitCode() {
        const submitted_code = window.ace.edit('code-editor').getValue();
        const language_id = code.language.id;

        //- request Marking the code using problem_id, submitted_code, language_id
        problem_actions.submitProblemCode({ problem_id, submitted_code, language_id });
    }
}

export default AlgorithmTest;