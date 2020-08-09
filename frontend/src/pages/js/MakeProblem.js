import InputOutputTable from 'components/InputOutputTable';
import LoadingScreen from 'components/LoadingScreen';
import ProblemExplainEditor from 'components/ProblemExplainEditor';
import { inputNames } from 'constants/FormInputNames';
import { tableMode } from 'constants/InputOutputTableMode';
import { paths } from 'constants/Paths';
import 'pages/css/Form.css';
import 'pages/css/MakeProblem.css';
import React, { useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { showErrorAlert, showValidationFailureAlert, showWarningAlert } from 'utils/AlertManager';
import AuthenticateManager from 'utils/AuthenticateManager';
import { fillWithParametersAndTestcases, getParamsAndTestcases } from 'utils/InputOutputTableUtil';
import { getIntegerQueryParameter, moveToPage } from 'utils/PageControl';
import { validateDeleteProblem, validateMakeProblem, validateUpdateProblem } from 'utils/validation/MakeProblemValidation';


function MakeProblem(props) {
    const { user } = props.account;
    const { data, which, isProgressing, isSuccess } = props.problem;
    const { problemActions } = props;
    const problemId = getIntegerQueryParameter("id");
    const isRegisteringOrUpdating = (which === 'registerProblem' || which === 'updateProblem') && isProgressing;
    const isDeleting = (which === 'deleteProblem') && isProgressing;
    useEffect(() => {
        if (!user || !AuthenticateManager.isUserLoggedIn()) {
            moveToPage(props.history, paths.pages.loginForm);
            return;
        } else if (!isProgressing) {
            //- request get problemTypes, levels
            if (!data.problemMetaData) problemActions.getProblemMetaData();
            //- request get problem data if problemId is not null 
            else if (problemId) {
                if (data.problemData) {
                    // check the problem is made by same user.
                    if (data.problemData.creator.id !== user.id) {
                        showErrorAlert({ errorWhat: '문제 접근', text: '사용자님은 문제 작성자가 아닙니다.' }).then(() => {
                            moveToPage(props.history, paths.pages.loginForm);
                        });
                        return;
                    }
                    const typeSelect = document.querySelector('#problem-type-select');
                    const typeSelectIdx = Array.from(typeSelect.children).findIndex(option => Number(option.dataset.id) === data.problemData.problemType.id);

                    if (typeSelectIdx !== -1) typeSelect.selectedIndex = typeSelectIdx;

                    const levelSelect = document.querySelector('#problem-level-select');
                    const levelSelectIdx = Array.from(levelSelect.children).findIndex(option => Number(option.dataset.levelid) === data.problemData.level.id);
                    if (levelSelectIdx !== -1) levelSelect.selectedIndex = levelSelectIdx;
                    problemActions.clearWhich();
                }
                else if (!data.problemData) {
                    if (which === 'problemData' && !isSuccess) {
                        moveToPage(props.history, paths.pages.problemList);
                        return;
                    }
                    problemActions.getProblemData({ problemId });
                    return;
                }
            }
            if (which === 'registerProblem') {
                if (isSuccess) {
                    moveToPage(props.history, paths.pages.problemList);
                }
                else{
                    showErrorAlert({ errorWhat: "문제 등록", text: data.failCause })
                }

            } else if (which === 'updateProblem') {

                if (isSuccess) {
                    moveToPage(props.history, paths.pages.problemList);
                }
                else {
                    showErrorAlert({ errorWhat: "문제 수정", text: data.failCause })
                }

            } else if (which === 'deleteProblem') {

                if (isSuccess) {
                    moveToPage(props.history, paths.pages.problemList);
                }
                else {
                    showErrorAlert({ errorWhat: "문제 삭제", text: data.failCause })
                }

            }
        }
    }, [user, problemId, props.history, problemActions, data.problemData, data.problemMetaData, data.failCause, data.newProblemId, isProgressing, isSuccess, which]);

    const getProblemTypeOptions = () => {
        return data.problemMetaData.problemTypes.reduce((accumulator, problemType) => {
            accumulator.push(<option key={problemType.id} data-id={problemType.id}>{problemType.name}</option>);
            return accumulator;
        }, []);

    }

    const getLevelOptions = () => {
        return data.problemMetaData.problemLevels.reduce((accumulator, level) => {
            accumulator.push(<option key={level.id} data-levelid={level.id}>{level.name}</option>);
            return accumulator;
        }, []);

    }


    /* 입출력 예시 설정 테이블 */
    let ioExTable = <InputOutputTable id="io-ex-set-table" tableMode={tableMode.write.testcase} labelName='입출력 예시' initValue={data.problemData ? data.problemData.exampleTable : null} dataTypes={data.problemMetaData ? data.problemMetaData.dataTypes : null} />;

    /* 테스트케이스 설정 테이블 */
    let testcaseSetTable = <InputOutputTable id="testcase-set-table" tableMode={tableMode.write.paramAndTestcase} labelName='테스트 케이스'
        initValue={data.problemData ? data.problemData.answerTable : null}
        onChangeParamNames={tableValue => {
            if(which!=='problemData')
            {
                let newProps = {
                    ...ioExTable.props,
                    initValue: tableValue
                }
                fillWithParametersAndTestcases(newProps);
            }
        }} dataTypes={data.problemMetaData ? data.problemMetaData.dataTypes : null} />

    const registerProblem = () => {
        const answerTableInfo = getParamsAndTestcases(testcaseSetTable.props);
        const exampleTableInfo = getParamsAndTestcases(ioExTable.props);
        let form = document.getElementById('make-problem-form');
        let validation = validateMakeProblem(form, answerTableInfo, exampleTableInfo);
        if (validation.isValid) {
            //- request register problem
            problemActions.registerProblem(validation.values);
        }
        else {
            showValidationFailureAlert({ validation, failWhat: "문제 등록", text: data.failCause });
        }
    }

    const updateProblem = () => {
        const answerTableInfo = getParamsAndTestcases(testcaseSetTable.props);
        const exampleTableInfo = getParamsAndTestcases(ioExTable.props);

        let form = document.getElementById('make-problem-form');
        let validation = validateUpdateProblem(user, data.problemData, form, answerTableInfo, exampleTableInfo);
        if (validation.isValid) {
            //- request update problem
            problemActions.updateProblem(validation.values);
        }
        else {
            showValidationFailureAlert({ validation, failWhat: "문제 수정", text: data.failCause });
        }
    }

    const deleteProblem = () => {
        showWarningAlert({ title: '문제 삭제', text: '정말 삭제할까요?', btnText: '삭제' }).then((willDelete) => {
            if (willDelete) {
                let validation = validateDeleteProblem(user, data.problemData);
                if (validation.isValid) {
                    //- request delete problem
                    problemActions.deleteProblem(validation.values);
                }
                else {
                    showValidationFailureAlert({ validation, failWhat: "문제 삭제", text: data.failCause });
                }
            }
        });

    }
    return (
        <div>
            <Form id="make-problem-form" method="post" className="text-center" action={paths.actions.makeProblem} onSubmit={e => e.preventDefault()}>
                {(which === 'problemData' && isProgressing) ? <LoadingScreen label="문제 정보를 불러오는 중입니다." /> :
                    <>
                        <Form.Label className="font-weight-bold">문제 제목</Form.Label>
                        <Form.Control name={inputNames.problemTitle} type="text" placeholder="문제 제목" maxLength="100" defaultValue={data.problemData ? data.problemData.title : null} />
                        <Form.Group className="my-5">
                            <Form.Label className="font-weight-bold">문제 유형</Form.Label>

                            <Form.Control as="select" id="problem-type-select" custom className="form-control" onChange={e => e.target.form[inputNames.problemTypeId].value = e.target.options[e.target.selectedIndex].dataset.id}>
                                {data.problemMetaData ? getProblemTypeOptions() : null}
                            </Form.Control>
                            <input type="hidden" name={inputNames.problemTypeId} value="1"></input>
                        </Form.Group>
                        <Form.Label className="font-weight-bold">문제 설명</Form.Label>
                        <ProblemExplainEditor content={data.problemData ? data.problemData.explain : null} problemId={data.newProblemId ? data.newProblemId : problemId} urls={data.urls} isProgressing={isProgressing} which={which} isSuccess={isSuccess} problemActions={problemActions} />
                        {testcaseSetTable}
                        {ioExTable}

                        <Form.Group className="limit-control-container my-5 text-center">
                            <Form.Label className="font-weight-bold">제한 사항</Form.Label>
                            <textarea className="limit-explain-control form-control rounded-0" name={inputNames.limitExplain} placeholder="제한사항 입력" rows="3" maxLength="200" defaultValue={data.problemData ? data.problemData.limitExplain : null} />

                            <Form.Label className="font-weight-bold">제한 시간</Form.Label>
                            <Form.Control className="limit-time-control" name={inputNames.timeLimit} placeholder="제한시간" maxLength="5" defaultValue={data.problemData ? data.problemData.timeLimit : null} />
                            <span>ms</span>

                            <Form.Label className="font-weight-bold ml-3">메모리 제한</Form.Label>
                            <Form.Control className="limit-memory-control" name={inputNames.memoryLimit} placeholder="메모리 제한" maxLength="3" defaultValue={data.problemData ? data.problemData.memoryLimit : null} />
                            <span>MB</span>
                        </Form.Group>
                        <Form.Group className="level-control-container my-5 align-center text-center">
                            <Form.Label className="font-weight-bold">난이도</Form.Label>
                            <Form.Control id="problem-level-select" as="select" custom className="level-control form-control align-center" onChange={e => e.target.form[inputNames.problemLevelId].value = e.target.options[e.target.selectedIndex].dataset.levelid}>
                                {data.problemMetaData ? getLevelOptions() : null}
                            </Form.Control>
                            <input type="hidden" name={inputNames.problemLevelId} value="1"></input>
                        </Form.Group>
                        {isProgressing ?
                            <Button variant="primary" block disabled>{isRegisteringOrUpdating ? <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> : null}
                                {data.problemData ? isRegisteringOrUpdating ? '수정 중' : '수정' : isRegisteringOrUpdating ? '등록 중' : '등록'}</Button>
                            :
                            <Button type="submit" variant="primary" block onClick={e => { data.problemData ? updateProblem() : registerProblem() }}>{data.problemData ? '수정' : '등록'}</Button>}
                        {data.problemData ?
                            isDeleting ? <Button variant="danger" block disabled>삭제 중<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /></Button> : <Button type="submit" variant="danger" block onClick={e => deleteProblem()}>삭제</Button> : null
                        }
                    </>}

            </Form >
        </div>

    );


}

export default MakeProblem;