import React, { useCallback } from 'react';
import LoadingScreen from './LoadingScreen';
import { showSuccessAlert, showErrorAlert } from 'utils/AlertManager';

function AnswerSection(props) {
    const getMarkResultTableRows = useCallback((markResults) => {
        if (!markResults) return null;
        return markResults.reduce((accumulator, result, idx) => {
            accumulator.push(
                <tr key={idx}>
                    <td className="font-weight-bold">테스트 {result.testcaseNumber}</td>
                    <td>{result.isAnswer ? <><span className="result-success">성공</span>{getSuccessDetail(result)}</> : <><span className="result-fail">실패</span>{getFailDetail(result)}</>}</td>
                </tr>
            )
            return accumulator;
        }, []);
    }, [])

    const makeResults = useCallback(() => {


        if (props.isResetting) {
            return <LoadingScreen label="코드 초기화 중입니다." />
        }
        else if (props.isMarking) {
            return <LoadingScreen label="채점 중입니다." />
        }
        else if (props.markResults) {
            const exampleTableMarkResults = props.markResults.exampleTableMarkResults;
            const answerTableMarkResults = props.markResults.answerTableMarkResults;
            let exampleTableResultTableRows = null;
            let answerTableResultTableRows = null;
            exampleTableResultTableRows = getMarkResultTableRows(exampleTableMarkResults);
            if (exampleTableResultTableRows == null) return null;
            answerTableResultTableRows = getMarkResultTableRows(answerTableMarkResults);

            if (props.which === "submitProblemCode") {
                const allIsAnswer =
                    exampleTableMarkResults &&
                    answerTableMarkResults &&
                    exampleTableMarkResults.every(markResult => markResult.isAnswer) &&
                    answerTableMarkResults.every(markResult => markResult.isAnswer);
                if (allIsAnswer) {
                    showSuccessAlert({ successWhat: "정답입니다!", appendSuccessText: false });
                } else {
                    showErrorAlert({ errorWhat: "틀렸습니다!", appendFailureText: false });
                }
                props.problemActions.clearWhich()
            }

            return <>
                <h5 className="mark-result-title">입출력 예시 테스트케이스</h5>
                <table className="test-result-table">
                    <tbody>
                        {exampleTableResultTableRows}
                    </tbody>
                </table>
                <h5 className="mark-result-title">정답 테스트케이스</h5>
                {!answerTableResultTableRows ?
                    <div className="mark-result-subtitle"><div>입출력 예시 테스트케이스를 모두 통과해야 정답 테스트케이스를 채점할 수 있습니다.</div></div>
                    :
                    <table className="test-result-table">
                        <tbody>
                            {answerTableResultTableRows}
                        </tbody>
                    </table>
                }
            </>
        }
        else {
            return <div className="text-center">
                실행 결과가 여기 표시됩니다.
                </div>
        }
    }, [props.markResults, props.isMarking, props.isResetting, props.which, props.problemActions, getMarkResultTableRows]);


    const getSuccessDetail = (result) => {
        return <>

            {result.input != null ? <div className="prewrap"><div className="font-weight-bold">입력 값</div>{result.input}</div>: null}
            {result.expected && result.actual && <div className="prewrap"><div className="font-weight-bold">예상 값</div>{result.expected}<br /><div className="font-weight-bold">실제 값</div>{result.actual}</div>}
            {result.outputMessage && <div className="prewrap"><div className="font-weight-bold">출력</div>{result.outputMessage}</div>}
            {result.timeElapsed != null ? <div><div className="font-weight-bold">걸린 시간</div>{result.timeElapsed} ms</div> : null}
        </>
    };

    const getFailDetail = (result) => {
        return <>
            {result.isTimeOut ? <div>시간 초과</div> :
                <>
                    {result.errorMessage && <div className="prewrap"><div className="font-weight-bold">에러 메시지</div> {result.errorMessage}</div>}
                    {result.input != null ? <div className="prewrap"><div className="font-weight-bold">입력 값</div>{result.input}</div>: null}
                    {result.expected && result.actual && <div className="prewrap"><div className="font-weight-bold">예상 값</div>{result.expected}<br /><div className="font-weight-bold">실제 값</div>{result.actual}</div>}
                    {result.outputMessage && <div className="prewrap"><div className="font-weight-bold">출력</div>{result.outputMessage}</div>}
                    {result.timeElapsed != null ? <div><div className="font-weight-bold">걸린 시간</div>{result.timeElapsed} ms</div> : null}
                </>
            }
        </>
    };

    return (
        <div className="answer-section">
            <div id="answer-section-title-bar">
                실행 결과
            </div>
            {makeResults()}

        </div>
    );


}
export default AnswerSection;