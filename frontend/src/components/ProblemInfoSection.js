import React from 'react';
import InputOutputTable from './InputOutputTable';
import { tableMode } from 'constants/InputOutputTableMode';
import LoadingScreen from './LoadingScreen';

function ProblemInfoSection(props) {
    const { problem, problemMetaData } = props;
    const loadingScreen = <LoadingScreen label="문제 정보를 불러오는 중입니다." />;
    return (
        <div className="problem-info-section">
            {(!problem || !problemMetaData) ? loadingScreen :
                <>
                    <div className="problem-info-title text-center">
                        <h3>{problem.title}</h3>
                        <div className="problem-info-subtitle">문제 유형</div>
                        <div>{problem.problemType.name}</div>
                        <div className="problem-info-subtitle">난이도</div>
                        <div>{`Level ${problem.level.name}`}</div>

                    </div>
                    <div className="problem-info-content">
                        <div className="problem-info-subtitle">문제 설명</div>
                        <div dangerouslySetInnerHTML={{ __html: problem.explain }}></div>
                    </div>
                    <InputOutputTable id="io-info-table" labelName="입출력 예시" tableMode={tableMode.read} initValue={problem.exampleTable} dataTypes={problemMetaData.dataTypes} />
                    <div className="problem-info-limit prewrap">
                        <div className="problem-info-subtitle">제한 사항</div>
                        {problem.limitExplain}
                        <div className="time-memory-limit">
                            <div className="mt-2">
                                <span className="problem-info-subtitle">제한 시간</span> {problem.timeLimit} ms
                            </div>
                        </div>
                        <div className="problem-creator mb-4">
                            <div className="mt-2">
                                <span className="problem-info-subtitle">문제 작성자</span> {decodeURI(problem.creator.nickname)}
                            </div>
                        </div>
                    </div>
                </>
            }

        </div>
    );
}
export default ProblemInfoSection;