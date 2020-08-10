import React, { useCallback } from 'react';
import LoadingScreen from './LoadingScreen';
import { showSuccessAlert, showErrorAlert } from 'utils/AlertManager';

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
                        <td className="font-weight-bold">테스트 {result.testcaseNumber}</td>
                        <td>{result.isAnswer ? <><span className="result-success">성공</span>{getSuccessDetail(result)}</> : <><span className="result-fail">실패</span>{getFailDetail(result)}</>}</td>
                    </tr>
                )
                return accumulator;
            }, []);
            if( props.which ==="submitProblemCode"){
                const allIsAnswer = props.codeResults.every(codeResult => codeResult.isAnswer);
                if(allIsAnswer){
                    showSuccessAlert({successWhat:"정답입니다!", appendSuccessText:false});
                }else{
                    showErrorAlert({errorWhat:"틀렸습니다!", appendFailureText:false});
                }
                props.problemActions.clearWhich()
            }

            return <>
                <table id="test-result-table">
                    <tbody>
                        {trs}
                    </tbody>

                </table>
            </>
        }
        else {
            return <div className="text-center">
                실행 결과가 여기 표시됩니다.
                </div>
        }
    }, [props.codeResults, props.isMarking, props.isResetting, props.which, props.problemActions]);

    const getSuccessDetail = (result) => {
        return <>
            {result.outputMessage && <div><div className="font-weight-bold">출력</div>{result.outputMessage}</div>}
            {result.timeElapsed != null ? <div><div className="font-weight-bold">걸린 시간</div>{result.timeElapsed} ms</div> : null}
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