import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { inputNames } from 'constants/FormInputNames';
import { paths } from 'constants/Paths';
import { table_mode } from 'constants/InputOutputTableMode';

import ProblemExplainEditor from 'components/js/ProblemExplainEditor';
import InputOutputTable from 'components/js/InputOutputTable';
import { fillWithParametersAndTestcases, getParamsAndTestcases } from 'utils/InputOutputTableUtil';
import 'pages/css/Form.css';
import 'pages/css/MakeProblem.css';
function MakeProblem() {
    // 문제 유형
    let problem_types = [
        { id: 1, name: "정렬" },
        { id: 2, name: "스택/큐" },
        { id: 3, name: "동적 계획법" },
        { id: 4, name: "탐욕법" },
        { id: 5, name: "완전 탐색" }
    ]
    // 난이도
    let levels = [
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
    ]
    let problem_type_options = problem_types.reduce((accumulator, problem_type) => {
        accumulator.push(<option key={problem_type.id} data-id={problem_type.id}>{problem_type.name}</option>);
        return accumulator;
    }, []);

    let level_options = levels.reduce((accumulator, level_option) => {
        accumulator.push(<option key={level_option.id} data-id={level_option.id}>{level_option.name}</option>);
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
        <Form id="make_problem_form" action={paths.actions.make_problem} onSubmit={e => e.preventDefault()}>
            <Form.Label className="font-weight-bold">문제 제목</Form.Label>
            <Form.Control name={inputNames.problem_title} type="text" placeholder="문제 제목" maxLength="100" />
            <Form.Group className="my-5">
                <Form.Label className="font-weight-bold">문제 유형</Form.Label>
                <Form.Control name={inputNames.problem_type} as="select" custom className="form-control">
                    {problem_type_options}
                </Form.Control>
            </Form.Group>
            <Form.Label className="font-weight-bold">문제 설명</Form.Label>
            <ProblemExplainEditor />
            {testcase_set_table}
            {io_ex_table}

            <Form.Group className="limit-control-container my-5 text-center">
                <Form.Label className="font-weight-bold">제한 사항</Form.Label>
                <textarea className="limit-explain-control form-control rounded-0" name={inputNames.limit_explain} placeholder="제한사항 입력" rows="3" maxLength="200" />

                <Form.Label className="font-weight-bold">제한 시간</Form.Label>
                <Form.Control className="limit-time-control" name={inputNames.time_limit} placeholder="제한시간" maxLength="5" />
                <span>ms</span>

                <Form.Label className="font-weight-bold ml-3">메모리 제한</Form.Label>
                <Form.Control className="limit-memory-control" name={inputNames.memory_limit} placeholder="메모리 제한" maxLength="3" />
                <span>MB</span>
            </Form.Group>
            <Form.Group className="level-control-container my-5 align-center-horizontal text-center">
                <Form.Label className="font-weight-bold">난이도</Form.Label>
                <Form.Control as="select" name={inputNames.level} custom className="level-control form-control align-center-horizontal">
                    {level_options}
                </Form.Control>

            </Form.Group>
            <Button type="submit" variant="primary" block onClick={e => {
                console.log('테스트케이스 정보: ', getParamsAndTestcases(testcase_set_table.props), '\n입출력 예시 정보: ', getParamsAndTestcases(io_ex_table.props))

                // let form = document.getElementById('make_problem_form');
                // form.submit();
            }}>등록</Button>
        </Form >
    );
}

export default MakeProblem;