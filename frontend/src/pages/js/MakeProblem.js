import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { inputNames } from 'constants/FormInputNames';
import ProblemExplainEditor from 'components/js/ProblemExplainEditor';
import InputOutputTable from 'components/js/InputOutputTable';
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
    }, [])
    return (
        <div>

            <Form.Label>문제 제목</Form.Label>
            <Form.Control name={inputNames.problemTitle} type="text" placeholder="문제 제목" maxLength="100" />

            <Form.Group>
                <Form.Label>문제 유형</Form.Label>
                <Form.Control as="select" custom>
                    {options}
                </Form.Control>
            </Form.Group>
            <h6>문제 설명</h6>
            <ProblemExplainEditor />
            <h6 className="mt-3">테스트케이스 설정</h6>
            <InputOutputTable id="table1" />

            <Button variant="primary" block>
                등록
            </Button>
        </div>
    );
}

export default MakeProblem;