import React, { useCallback } from 'react';
import LoadingScreen from './LoadingScreen';

function AnswerSection(props) {

    const makeResult = useCallback(() => {
        if (props.isResetting) {
            return <LoadingScreen label="코드 초기화 중입니다." />
        }
        else if (props.isMarking) {
            return <LoadingScreen label="채점 중입니다." />
        }
        else if (props.codeResults) {
            let trs = props.codeResults.reduce((accumulator, result, idx) => {
                accumulator.push(
                    <tr key={idx}>
                        <td>테스트 {idx + 1}</td>
                        <td>{result.isAnswer ? <><span className="result-success">성공</span>{getSuccessDetail(result)}</> : <><span className="result-fail">실패</span>{getFailDetail(result)}</>}</td>
                    </tr>
                )
                return accumulator;
            }, []);
            return <>
                <table id="test-result-table">
                    <tbody>
                        {trs}
                    </tbody>

                </table>
                {props.codeResults.every(codeResult => codeResult.isAnswer) ? <div className="result-success text-center">맞았습니다!</div> : <div className="result-fail text-center">틀렸습니다!</div>}
            </>
        }
        else {
            return <div className="text-center">
                실행 결과가 여기 표시됩니다.
                </div>
        }
    }, [props.codeResults, props.isMarking, props.isResetting]);

    const getSuccessDetail = (result) => {
        return <>
            {result.timeElapsed != null ? <div><div className="font-weight-bold">걸린 시간</div>{result.timeElapsed} ms</div> : null}
            {result.outputMessage && <div><div className="font-weight-bold">출력</div>{result.outputMessage}</div>}
        </>
    };

    const getFailDetail = (result) => {
        return <>
            {result.isTimeOut ? <div>시간 초과</div> :
                <>
                    {result.errorMessage && <div><div className="font-weight-bold">에러 메시지</div> {result.errorMessage}</div>}
                    {result.outputMessage && <div><div className="font-weight-bold">출력</div>{result.outputMessage}</div>}
                    {result.timeElapsed != null ? <div><div className="font-weight-bold">걸린 시간</div>{result.timeElapsed} ms</div> : null}
                    {result.expected && result.actual && <div><div className="font-weight-bold">예상 값</div>{result.expected}<br /><div className="font-weight-bold">실제 값</div>{result.actual}</div>}
                </>
            }
        </>
    };

    return (
        <div className="answer-section">
            <div id="answer-section-title-bar">
                실행 결과
            </div>
            {makeResult()}

        </div>
    );


}
export default AnswerSection;