import React, { useEffect, useCallback } from 'react';
import { tableMode } from 'constants/InputOutputTableMode';
import { fillWithParametersAndTestcases, addParam, addTestcase, createReturnDiv, getParamsCount, getTestcaseCount } from 'utils/InputOutputTableUtil';
import DataTypeTooltip from './DataTypeTooltip';
/**
 * @param {*} props
 *
 * -id : 테이블을 구분하기 위한 아이디
 * 
 * -labelName: 테이블 위에 표시될 라벨
 * 
 *-tableMode: 테이블 모드 constants/InputOutputTableMode에 정의됨
 *
 *-initValue : 테이블을 처음에 채울 값 
 *                 ex)initValue={ {paramNames: ['name1', 'name2'], testcases: [{ params: [13, 15], returns: 28 }]} }
 * 
 * -dataTypes: 자료형 목록
 * 
 * -onChangeParamNames: 파라미터가 바뀔 경우 호출되는 메소드
 */
function InputOutputTable(props) {


    /**
     * 테이블의 모든 요소 수정 여부 설정 메소드
     * @param {boolean} enable true: 수정 가능, false: 수정 불가
     */
    const setTableEnabled = useCallback((enable) => {
        let root = document.querySelector(`#${props.id}`);
        let table = root.querySelector('table');
        let inputs = table.querySelectorAll('input');
        if (!enable) {
            inputs.forEach(input => {
                input.setAttribute('disabled', 'true');
            });
        }
        else {
            inputs.forEach(input => {
                input.removeAttribute('disabled');
            });
        }
    }, [props.id]);

    const initTable = useCallback(() => {
        if (props.dataTypes) {
            createReturnDiv(props);
            if (props.tableMode === tableMode.write.paramAndTestcase) {
                
                if (getParamsCount(props) < 1) {
                    addParam(props, { name: '', dataType: props.dataTypes[0] });
                }
                if (getTestcaseCount(props) < 1) {
                    addTestcase(props);
                }
            }
            fillWithParametersAndTestcases(props);

            setTableEnabled(props.tableMode !== tableMode.read);
        }

    }, [props, setTableEnabled]);

    useEffect(() => {
        initTable();
    }, [initTable]);

    return (
        <div id={props.id} className="my-5 text-center">
            <label className="my-3 font-weight-bold">{props.labelName}</label>{createButtonControl()}
            <div className="horizontal-scroll">
                <table className="io-table my-3">
                    <tbody>
                        <tr className="param-tr"><th className="return-th"></th></tr>
                    </tbody>
                    <tfoot>
                        <tr className="remove-column-tr hidden"></tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );




    function createButtonControl() {
        let addButtonControl;
        let addParamButton = <button className="btn btn-outline-success btn-sm mx-2" onClick={() => {
            addParam(props)
        }} >파라미터 추가</button>;
        let addTestcaseButton = <button className="btn btn-outline-info btn-sm mx-2" onClick={() => addTestcase(props)} >테스트케이스 추가</button>;
        switch (props.tableMode) {
            case tableMode.write.paramAndTestcase:
                addButtonControl =
                    <span className="my-3 text-left">
                        {addParamButton}
                        {addTestcaseButton}
                        <DataTypeTooltip />
                    </span>
                break;
            case tableMode.write.testcase:
                addButtonControl =
                    <span className="my-3 text-left">
                        {addTestcaseButton}
                    </span>
                break;
            default:
                addButtonControl = null;
                break;
        }
        return addButtonControl;
    }
}

export default InputOutputTable;