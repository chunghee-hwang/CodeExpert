import React, { useEffect, useCallback } from 'react';
import { table_mode } from 'constants/InputOutputTableMode';
import { fillWithParametersAndTestcases, addParam, addTestcase, createReturnDiv, getParamsCount, getTestcaseCount } from 'utils/InputOutputTableUtil';
import { data_types } from 'constants/DataTypes';
import DataTypeTooltip from './DataTypeTooltip';
/**
 * @param {*} props
 *
 * -id : 테이블을 구분하기 위한 아이디
 * 
 * -label_name: 테이블 위에 표시될 라벨
 * 
 *-table_mode: 테이블 모드 constants/InputOutputTableMode에 정의됨
 *
 *-init_value : 테이블을 처음에 채울 값 
 *                 ex)init_value={ {param_names: ['name1', 'name2'], testcases: [{ params: [13, 15], return: 28 }]} }
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
        createReturnDiv(props);
        if (props.table_mode === table_mode.write.param_and_testcase) {
            if (getParamsCount(props) < 1) {
                addParam(props, { name: '', data_type: data_types.integer });
            }
            if (getTestcaseCount(props) < 1) {
                addTestcase(props);
            }
        }
        fillWithParametersAndTestcases(props);

        setTableEnabled(props.table_mode !== table_mode.read);

    }, [props, setTableEnabled]);

    useEffect(() => {
        initTable();
    }, [initTable]);

    return (
        <div id={props.id} className="my-5 text-center">
            <label className="my-3 font-weight-bold">{props.label_name}</label>{createButtonControl()}
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
        let add_button_control;
        let add_param_button = <button className="btn btn-outline-success btn-sm mx-2" onClick={() => {
            addParam(props)
        }} >파라미터 추가</button>;
        let add_testcase_button = <button className="btn btn-outline-info btn-sm mx-2" onClick={() => addTestcase(props)} >테스트케이스 추가</button>;
        switch (props.table_mode) {
            case table_mode.write.param_and_testcase:
                add_button_control =
                    <span className="my-3 text-left">
                        {add_param_button}
                        {add_testcase_button}
                        <DataTypeTooltip />
                    </span>
                break;
            case table_mode.write.testcase:
                add_button_control =
                    <span className="my-3 text-left">
                        {add_testcase_button}
                    </span>
                break;
            default:
                add_button_control = null;
                break;
        }
        return add_button_control;
    }
}

export default InputOutputTable;