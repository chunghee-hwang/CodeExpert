import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { inputNames } from 'constants/FormInputNames';
import { table_mode } from 'constants/InputOutputTableMode';

import ProblemExplainEditor from 'components/js/ProblemExplainEditor';
import InputOutputTable from 'components/js/InputOutputTable';
import { fillWithParametersAndTestcases } from 'utils/InputOutputTableUtil';
import 'pages/css/Form.css'
function MakeProblem() {
    let problemTypes = [
        { id: 1, name: "정렬" },
        { id: 2, name: "스택/큐" },
        { id: 3, name: "동적 계획법" },
        { id: 4, name: "탐욕법" },
        { id: 5, name: "완전 탐색" }
    ]
    let options = problemTypes.reduce((accumulator, problemType) => {
        accumulator.push(<option key={problemType.id} data-id={problemType.id}>{problemType.name}</option>);
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
            <Form.Label className="font-weight-bold">문제 제목</Form.Label>
            <Form.Control name={inputNames.problemTitle} type="text" placeholder="문제 제목" maxLength="100" />
            <Form.Group className="my-5">
                <Form.Label className="font-weight-bold">문제 유형</Form.Label>
                <Form.Control as="select" custom>
                    {options}
                </Form.Control>
            </Form.Group>
            <h6 className="font-weight-bold">문제 설명</h6>
            <ProblemExplainEditor />

            {testcase_set_table}

            {io_ex_table}
            <Button variant="primary" block>등록</Button>
        </div>
    );
}

export default MakeProblem;