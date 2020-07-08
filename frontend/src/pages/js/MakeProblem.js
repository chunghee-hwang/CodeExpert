import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { input_names } from 'constants/FormInputNames';
import { paths } from 'constants/Paths';
import { table_mode } from 'constants/InputOutputTableMode';

import ProblemExplainEditor from 'components/ProblemExplainEditor';
import InputOutputTable from 'components/InputOutputTable';
import { fillWithParametersAndTestcases, getParamsAndTestcases } from 'utils/InputOutputTableUtil';
import { validateMakeProblem } from 'utils/validation/MakeProblemValidation';
import { showValidationFailureAlert } from 'utils/AlertManager';
import { getIntegerQueryParameter } from 'utils/PageControl';

import 'pages/css/Form.css';
import 'pages/css/MakeProblem.css';

function MakeProblem(props) {
    const { user } = props;
    const problem_id = getIntegerQueryParameter("id");
    console.log(problem_id);
    useEffect(() => {
        if (!user) {
            props.history.push(paths.pages.login_form);
        } else {
            // request get problem_types, levels

            // request get problem data if problem_id is not null and the problem is made by same user.
            if (problem_id) {

            }
        }
    }, [user, problem_id, props.history]);

    // 문제 유형
    let problem_types = [
        { id: 1, name: "정렬" },
        { id: 2, name: "스택/큐" },
        { id: 3, name: "동적 계획법" },
        { id: 4, name: "탐욕법" },
        { id: 5, name: "완전 탐색" },
        { id: 6, name: "힙" },
        { id: 7, name: "해시" },
        { id: 8, name: "기타" },
    ]
    // 난이도
    let levels = [1, 2, 3, 4]



    let problem_type_options = problem_types.reduce((accumulator, problem_type) => {
        accumulator.push(<option key={problem_type.id} data-id={problem_type.id}>{problem_type.name}</option>);
        return accumulator;
    }, []);

    let level_options = levels.reduce((accumulator, level) => {
        accumulator.push(<option key={level} data-level={level}>{level}</option>);
        return accumulator;
    }, []);

    /* 입출력 예시 설정 테이블 */
    let io_ex_table = <InputOutputTable id="io-ex-set-table" table_mode={table_mode.write.testcase} label_name='입출력 예시' />;

    /* 테스트케이스 설정 테이블 */
    let testcase_set_table = <InputOutputTable id="testcase-set-table" table_mode={table_mode.write.param_and_testcase} label_name='테스트 케이스'
        onChangeParamNames={table_value => {
            let new_props = {
                ...io_ex_table.props,
                init_value: table_value
            }
            fillWithParametersAndTestcases(new_props);
        }} />
    return (
        <div>
            <Form id="make_problem_form" method="post" className="text-center" action={paths.actions.make_problem} onSubmit={e => e.preventDefault()}>
                <Form.Label className="font-weight-bold">문제 제목</Form.Label>
                <Form.Control name={input_names.problem_title} type="text" placeholder="문제 제목" maxLength="100" />
                <Form.Group className="my-5">
                    <Form.Label className="font-weight-bold">문제 유형</Form.Label>
                    <Form.Control as="select" custom className="form-control" onChange={e => e.target.form[input_names.problem_type].value = e.target.options[e.target.selectedIndex].dataset.id}>
                        {problem_type_options}
                    </Form.Control>
                    <input type="hidden" name={input_names.problem_type} value="1"></input>
                </Form.Group>
                <Form.Label className="font-weight-bold">문제 설명</Form.Label>
                <ProblemExplainEditor />
                {testcase_set_table}
                {io_ex_table}

                <Form.Group className="limit-control-container my-5 text-center">
                    <Form.Label className="font-weight-bold">제한 사항</Form.Label>
                    <textarea className="limit-explain-control form-control rounded-0" name={input_names.limit_explain} placeholder="제한사항 입력" rows="3" maxLength="200" />

                    <Form.Label className="font-weight-bold">제한 시간</Form.Label>
                    <Form.Control className="limit-time-control" name={input_names.time_limit} placeholder="제한시간" maxLength="5" />
                    <span>ms</span>

                    <Form.Label className="font-weight-bold ml-3">메모리 제한</Form.Label>
                    <Form.Control className="limit-memory-control" name={input_names.memory_limit} placeholder="메모리 제한" maxLength="3" />
                    <span>MB</span>
                </Form.Group>
                <Form.Group className="level-control-container my-5 align-center text-center">
                    <Form.Label className="font-weight-bold">난이도</Form.Label>
                    <Form.Control as="select" custom className="level-control form-control align-center" onChange={e => e.target.form[input_names.level].value = e.target.options[e.target.selectedIndex].dataset.level}>
                        {level_options}
                    </Form.Control>
                    <input type="hidden" name={input_names.level} value="1"></input>
                </Form.Group>
                <Button type="submit" variant="primary" block onClick={e => registerProblem()}>등록</Button>
            </Form >
        </div>

    );

    function registerProblem() {
        const testcase_table_info = getParamsAndTestcases(testcase_set_table.props);
        const io_table_info = getParamsAndTestcases(io_ex_table.props);

        let form = document.getElementById('make_problem_form');
        let validation = validateMakeProblem(form, testcase_table_info, io_table_info);
        console.log({ validation });
        if (validation.is_valid) {
            // request register problem

        }
        else {
            showValidationFailureAlert({ validation, fail_what: "문제 등록" });
        }
    }
}

export default MakeProblem;