import React from 'react';
import InputOutputTable from './InputOutputTable';
import { table_mode } from 'constants/InputOutputTableMode';
import LoadingScreen from './LoadingScreen';

function ProblemInfoSection(props) {
    const problem = props.problem;
    const loading_screen = <LoadingScreen label="문제 정보를 불러오는 중입니다." />;
    return (
        <div className="problem-info-section">
            {!problem ? loading_screen :
                <>
                    <div className="problem-info-title text-center">
                        <h3>{problem.title}</h3>
                        <div className="problem-info-subtitle">문제 유형</div>
                        <div>{problem.type.name}</div>
                        <div className="problem-info-subtitle">난이도</div>
                        <div>{`Level ${problem.level}`}</div>

                    </div>
                    <div className="problem-info-content">
                        <div className="problem-info-subtitle">문제 설명</div>
                        <div dangerouslySetInnerHTML={{ __html: problem.explain }}></div>
                    </div>
                    <InputOutputTable id="io-info-table" label_name="입출력 예시" table_mode={table_mode.read} init_value={problem.input_output_table} />
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
                </>
            }

        </div>
    );
}
export default ProblemInfoSection;