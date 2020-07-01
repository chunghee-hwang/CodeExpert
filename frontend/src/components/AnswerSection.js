import React, { useCallback } from 'react';

function AnswerSection(props) {

    const makeResultTable = useCallback(() => {
        if (props.code_results) {
            let trs = props.code_results.reduce((accumulator, result, idx) => {
                accumulator.push(
                    <tr key={idx}>
                        <td>테스트 {idx + 1}</td>
                        <td>{result.success ? <span className="result-success">성공</span> : <span className="result-fail">실패</span>}( {result.interval_time}ms, {result.used_memory}MB )</td>
                    </tr>
                )
                return accumulator;
            }, []);
            return <table id="test-result-table">
                <tbody>
                    {trs}
                </tbody>

            </table>
        }
        else {
            return <div>
                실행 결과가 여기 표시됩니다.
                </div>
        }
    }, [props.code_results]);

    return (
        <div className="answer-section">
            <div id="answer-section-title-bar">
                실행 결과
            </div>
            {makeResultTable()}
            {props.code_results ?
                props.code_results.every(code_result => code_result.success) ? <div className="result-success text-center">맞았습니다!</div> : <div className="result-fail text-center">틀렸습니다!</div>
                : null}
        </div>
    );


}
export default AnswerSection;