import React, { useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { input_names } from 'constants/FormInputNames';
import { paths } from 'constants/Paths';
import { table_mode } from 'constants/InputOutputTableMode';

import ProblemExplainEditor from 'components/ProblemExplainEditor';
import InputOutputTable from 'components/InputOutputTable';
import { fillWithParametersAndTestcases, getParamsAndTestcases } from 'utils/InputOutputTableUtil';
import { validateMakeProblem, validateUpdateProblem, validateDeleteProblem } from 'utils/validation/MakeProblemValidation';
import { showValidationFailureAlert, showErrorAlert, showSuccessAlert, showWarningAlert } from 'utils/AlertManager';
import { getIntegerQueryParameter } from 'utils/PageControl';

import 'pages/css/Form.css';
import 'pages/css/MakeProblem.css';
import LoadingScreen from 'components/LoadingScreen';
import { moveToPage } from 'utils/PageControl';
function MakeProblem(props) {
    const { user } = props.account;
    const { data, which, is_progressing, is_success } = props.problem;
    const { problem_actions } = props;
    const problem_id = getIntegerQueryParameter("id");
    const is_registering_or_updating = (which === 'register_problem' || which === 'update_problem') && is_progressing;
    const is_deleting = (which === 'delete_problem') && is_progressing;
    useEffect(() => {
        if (!user) {
            moveToPage(props.history, paths.pages.login_form);
            return;
        } else if (!is_progressing) {
            //- request get problem_types, levels
            if (!data.problem_meta_data) problem_actions.getProblemMetaData();

            //- request get problem data if problem_id is not null 
            if (problem_id) {
                if (!data.problem_data) problem_actions.getProblemData({ problem_id });

                // check the problem is made by same user.
                else if (data.problem_data.creator.id !== user.id) {
                    showErrorAlert({ error_what: '문제 접근', text: '사용자님은 문제 작성자가 아닙니다.' }).then(() => {
                        moveToPage(props.history, paths.pages.login_form);
                    });
                } else {
                    const type_select = document.querySelector('#problem-type-select');
                    const type_select_idx = Array.from(type_select.children).findIndex(option => Number(option.dataset.id) === data.problem_data.type.id);
                    if (type_select_idx !== -1) type_select.selectedIndex = type_select_idx;

                    const level_select = document.querySelector('#problem-level-select');
                    const level_select_idx = Array.from(level_select.children).findIndex(option => Number(option.dataset.level) === data.problem_data.level);
                    if (level_select_idx !== -1) level_select.selectedIndex = level_select_idx;
                }
            } else {
                //- request new problem id if problem id is null
                if (!data.new_problem_id) {
                    problem_actions.getNewProblemId();
                }
            }

            if (which === 'register_problem') {

                if (is_success) {
                    showSuccessAlert({ success_what: "문제 등록" }).then(() => {
                        moveToPage(props.history, paths.pages.problem_list);
                    });
                }
                else if (data.fail_cause) {
                    showErrorAlert({ error_what: "문제 등록", text: data.fail_cause })
                }

            } else if (which === 'update_problem') {

                if (is_success) {
                    showSuccessAlert({ success_what: "문제 수정" });
                }
                else {
                    showErrorAlert({ error_what: "문제 수정", text: data.fail_cause })
                }

            } else if (which === 'delete_problem') {

                if (is_success) {
                    showSuccessAlert({ success_what: "문제 삭제" }).then(() => {
                        moveToPage(props.history, paths.pages.problem_list);
                    });
                }
                else {
                    showErrorAlert({ error_what: "문제 삭제", text: data.fail_cause })
                }

            }
        }
    }, [user, problem_id, props.history, problem_actions, data.problem_data, data.problem_meta_data, data.fail_cause, data.new_problem_id, is_progressing, is_success, which]);

    const getProblemTypeOptions = () => {
        return data.problem_meta_data.problem_types.reduce((accumulator, problem_type, idx) => {
            accumulator.push(<option key={problem_type.id} data-id={problem_type.id}>{problem_type.name}</option>);
            return accumulator;
        }, []);

    }

    const getLevelOptions = () => {
        return data.problem_meta_data.levels.reduce((accumulator, level) => {
            accumulator.push(<option key={level} data-level={level}>{level}</option>);
            return accumulator;
        }, []);

    }


    /* 입출력 예시 설정 테이블 */
    let io_ex_table = <InputOutputTable id="io-ex-set-table" table_mode={table_mode.write.testcase} label_name='입출력 예시' init_value={data.problem_data ? data.problem_data.input_output_table : null} />;

    /* 테스트케이스 설정 테이블 */
    let testcase_set_table = <InputOutputTable id="testcase-set-table" table_mode={table_mode.write.param_and_testcase} label_name='테스트 케이스'
        init_value={data.problem_data ? data.problem_data.testcase_table : null}
        onChangeParamNames={table_value => {
            let new_props = {
                ...io_ex_table.props,
                init_value: table_value
            }
            fillWithParametersAndTestcases(new_props);
        }} />

    const registerProblem = () => {
        const testcase_table_info = getParamsAndTestcases(testcase_set_table.props);
        const io_table_info = getParamsAndTestcases(io_ex_table.props);

        let form = document.getElementById('make_problem_form');
        let validation = validateMakeProblem(data.new_problem_id, form, testcase_table_info, io_table_info);
        console.log({ validation });
        if (validation.is_valid) {
            //- request register problem
            problem_actions.registerProblem(validation.values);
        }
        else {
            showValidationFailureAlert({ validation, fail_what: "문제 등록", text: data.fail_cause });
        }
    }

    const updateProblem = () => {
        const testcase_table_info = getParamsAndTestcases(testcase_set_table.props);
        const io_table_info = getParamsAndTestcases(io_ex_table.props);

        let form = document.getElementById('make_problem_form');
        let validation = validateUpdateProblem(user, data.problem_data, form, testcase_table_info, io_table_info);
        console.log({ validation });
        if (validation.is_valid) {
            //- request update problem
            problem_actions.updateProblem(validation.values);
        }
        else {
            showValidationFailureAlert({ validation, fail_what: "문제 수정", text: data.fail_cause });
        }
    }

    const deleteProblem = () => {
        showWarningAlert({ title: '문제 삭제', text: '정말 삭제할까요?', btn_text: '삭제' }).then((will_delete) => {
            if (will_delete) {
                let validation = validateDeleteProblem(user, data.problem_data);
                console.log({ validation });
                if (validation.is_valid) {
                    //- request delete problem
                    problem_actions.deleteProblem(validation.values);
                }
                else {
                    showValidationFailureAlert({ validation, fail_what: "문제 삭제", text: data.fail_cause });
                }
            }
        });

    }
    return (
        <div>
            <Form id="make_problem_form" method="post" className="text-center" action={paths.actions.make_problem} onSubmit={e => e.preventDefault()}>
                {(which === 'problem_data' && is_progressing) ? <LoadingScreen label="문제 정보를 불러오는 중입니다." /> :
                    <>
                        <Form.Label className="font-weight-bold">문제 제목</Form.Label>
                        <Form.Control name={input_names.problem_title} type="text" placeholder="문제 제목" maxLength="100" defaultValue={data.problem_data ? data.problem_data.title : null} />
                        <Form.Group className="my-5">
                            <Form.Label className="font-weight-bold">문제 유형</Form.Label>

                            <Form.Control as="select" id="problem-type-select" custom className="form-control" onChange={e => e.target.form[input_names.problem_type].value = e.target.options[e.target.selectedIndex].dataset.id}>
                                {data.problem_meta_data ? getProblemTypeOptions() : null}
                            </Form.Control>
                            <input type="hidden" name={input_names.problem_type} value="1"></input>
                        </Form.Group>
                        <Form.Label className="font-weight-bold">문제 설명</Form.Label>
                        <ProblemExplainEditor content={data.problem_data ? data.problem_data.explain : null} problem_id={data.new_problem_id ? data.new_problem_id : problem_id} images={data.images} is_progressing={is_progressing} which={which} is_success={is_success} problem_actions={problem_actions} />
                        {testcase_set_table}
                        {io_ex_table}

                        <Form.Group className="limit-control-container my-5 text-center">
                            <Form.Label className="font-weight-bold">제한 사항</Form.Label>
                            <textarea className="limit-explain-control form-control rounded-0" name={input_names.limit_explain} placeholder="제한사항 입력" rows="3" maxLength="200" defaultValue={data.problem_data ? data.problem_data.limit_explain : null} />

                            <Form.Label className="font-weight-bold">제한 시간</Form.Label>
                            <Form.Control className="limit-time-control" name={input_names.time_limit} placeholder="제한시간" maxLength="5" defaultValue={data.problem_data ? data.problem_data.time_limit : null} />
                            <span>ms</span>

                            <Form.Label className="font-weight-bold ml-3">메모리 제한</Form.Label>
                            <Form.Control className="limit-memory-control" name={input_names.memory_limit} placeholder="메모리 제한" maxLength="3" defaultValue={data.problem_data ? data.problem_data.memory_limit : null} />
                            <span>MB</span>
                        </Form.Group>
                        <Form.Group className="level-control-container my-5 align-center text-center">
                            <Form.Label className="font-weight-bold">난이도</Form.Label>
                            <Form.Control id="problem-level-select" as="select" custom className="level-control form-control align-center" onChange={e => e.target.form[input_names.level].value = e.target.options[e.target.selectedIndex].dataset.level}>
                                {data.problem_meta_data ? getLevelOptions() : null}
                            </Form.Control>
                            <input type="hidden" name={input_names.level} value="1"></input>
                        </Form.Group>
                        {is_progressing ?
                            <Button variant="primary" block disabled>{is_registering_or_updating ? <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> : null}
                                {data.problem_data ? is_registering_or_updating ? '수정 중' : '수정' : is_registering_or_updating ? '등록 중' : '등록'}</Button>
                            :
                            <Button type="submit" variant="primary" block onClick={e => { data.problem_data ? updateProblem() : registerProblem() }}>{data.problem_data ? '수정' : '등록'}</Button>}
                        {data.problem_data ?
                            is_deleting ? <Button variant="danger" block disabled>삭제 중<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /></Button> : <Button type="submit" variant="danger" block onClick={e => deleteProblem()}>삭제</Button> : null
                        }
                    </>}

            </Form >
        </div>

    );


}

export default MakeProblem;