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
                        <td>{result.success ? <span className="result-success">성공</span> : <span className="result-fail">실패</span>}( {result.intervalTime}ms, {result.usedMemory}MB )</td>
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
                {props.codeResults.every(codeResult => codeResult.success) ? <div className="result-success text-center">맞았습니다!</div> : <div className="result-fail text-center">틀렸습니다!</div>}
            </>
        }
        else {
            return <div className="text-center">
                실행 결과가 여기 표시됩니다.
                </div>
        }
    }, [props.codeResults, props.isMarking, props.isResetting]);

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