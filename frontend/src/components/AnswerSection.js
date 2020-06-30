import React from 'react';

let results = [
    {
        success: false,
        interval_time: 5.75,
        used_memory: 50.9
    },
    {
        success: true,
        interval_time: 31.20,
        used_memory: 100.5
    },
    {
        success: false,
        interval_time: 1.57,
        used_memory: 12.9
    },
];

const result_table = results.reduce((accumulator, result, idx) => {
    accumulator.push(
        <tr key={idx}>
            <td>테스트 {idx + 1}</td>
            <td>{result.success ? <span className="result-success">성공</span> : <span className="result-fail">실패</span>}( {result.interval_time}ms, {result.used_memory}MB )</td>
        </tr>
    )
    return accumulator;
}, []);

function AnswerSection() {
    return (
        <div className="answer-section">
            <div id="answer-section-title-bar">
                실행 결과
            </div>
            <table id="test-result-table">
                <tbody>
                    {result_table}
                </tbody>
            </table>

        </div>
    );
}
export default AnswerSection;