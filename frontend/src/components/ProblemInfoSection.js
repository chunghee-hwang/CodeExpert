import React from 'react';
import InputOutputTable from './InputOutputTable';
import { table_mode } from 'constants/InputOutputTableMode';
/*
  let problem =
    {
        title: "오름차순으로 정렬하기",
        type: {
            id: 1,
            name: "정렬"
        },
        explain: '파라미터로 int형 배열이 넘어오면,<div>오름차순으로 정렬 후, 문자열의 형태로 출력하는 프로그램을 작성하세요.</div><div><img src="https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg" class="attached_pic"><br></div><div>결과는 위 사진처럼 나오면 됩니다.</div>',
        limit_explain: "arr의 원소 x: 1<=x<=<1000 인 자연수",
        time_limit: 500,
        memory_limit: 256,
        level: 1,
        input_output: {
            param_names: ['arr'],
            testcases: [
                {
                    params: ['[1, 9, 7, 6]'],
                    return: '1-6-7-9'
                },
                {
                    params: ['[2, 6, 3, 7]'],
                    return: '2-3-6-7'
                }
            ]
        }
    }
*/

function ProblemInfoSection(props) {
    const problem = props.problem;
    return (
        <div className="problem-info-section">
            <div className="problem-info-title text-center">
                <h3>{problem.title}</h3>
                <div className="problem-info-subtitle">문제 유형</div>
                <div>{problem.type.name}</div>
                <div className="problem-info-subtitle">난이도</div>
                <div>Level {problem.level}</div>

            </div>
            <div className="problem-info-content">
                <div className="problem-info-subtitle">문제 설명</div>
                <div dangerouslySetInnerHTML={{ __html: problem.explain }}></div>
            </div>
            <InputOutputTable id="io-info-table" label_name="입출력 예시" table_mode={table_mode.read} init_value={problem.input_output} />
            <div className="problem-info-limit text-center">
                <div className="problem-info-subtitle">제한 사항</div>
                {problem.limit_explain}
                <div className="time-memory-limit mb-4">
                    <div className="mt-2">
                        <span className="problem-info-subtitle">제한 시간</span> {problem.time_limit} ms
                    &nbsp;<span className="problem-info-subtitle align-right">메모리 제한</span> {problem.memory_limit} MB
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProblemInfoSection;