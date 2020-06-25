import React, { useEffect } from 'react';
import 'components/css/InputOutputTable.css'
import { createElementWithElement, createElementWithText, createTextInput, removeClassName, addClassName } from 'utils/DomControl'
function InputOutputTable(props) {

    useEffect(() => {
        addColumn();
        addRow();
    })
    return (
        <div id={props.id}>
            <div className="my-3">
                <button className="btn btn-info" onClick={() => addColumn()} >파라미터 추가</button>
                <button className="btn btn-info mx-2" onClick={() => addRow()} >테스트케이스 추가</button>
            </div>

            <table className="io-table">
                <tbody>
                    <tr className="param-tr"><th>return</th></tr>
                </tbody>
                <tfoot>
                    <tr className="remove-column-tr hidden"></tr>
                </tfoot>
            </table>
        </div>
    );

    function addColumn() {
        let root = document.querySelector(`#${props.id}`);
        let new_th = createElementWithElement('th', createTextInput('파라미터명'));
        let param_tr = root.querySelector('table .param-tr');
        let last_th = param_tr.querySelector('th:last-child');
        last_th.insertAdjacentElement('beforebegin', new_th);
        let trs = root.querySelectorAll('table > tbody > tr')
        trs.forEach((tr, idx) => {
            if (tr !== param_tr) {
                let new_td = createElementWithElement('td', createTextInput('입력/결과 값'), 'input-td');
                let last_td = tr.querySelector('td:last-child');
                last_td.insertAdjacentElement('beforebegin', new_td);
            }
        });
        updateColumnRemoveButtons();

    }

    function addRow() {
        let root = document.querySelector('#' + props.id);
        let tbody = root.querySelector('table > tbody');
        let new_tr = document.createElement('tr');

        for (let idx = 0; idx < getParamCount() + 1; idx++) {
            new_tr.append(createElementWithElement('td', createTextInput('입력/결과 값'), 'input-td'));
        }

        new_tr.append(createElementWithElement('td', createRowRemoveButton()));
        tbody.append(new_tr);
        hideOrShowRemoveColumnTr();
    }

    function updateColumnRemoveButtons() {
        let root = document.querySelector('#' + props.id);
        let remove_column_tr = root.querySelector('.remove-column-tr')
        remove_column_tr.innerHTML = '';
        for (let idx = 0; idx < getParamCount(); idx++) {
            let column_remove_btn = createColumnRemoveButton()
            remove_column_tr.append(createElementWithElement('td', column_remove_btn));
        }
    }

    function hideOrShowRemoveColumnTr() {
        let root = document.querySelector('#' + props.id);
        let remove_column_tr = root.querySelector('.remove-column-tr')
        let tbody = root.querySelector('table > tbody');
        if (tbody.childElementCount < 2) {
            addClassName(remove_column_tr, "hidden")
        } else {
            removeClassName(remove_column_tr, "hidden");
        }
    }
    function getParamCount() {
        return document.querySelector('#' + props.id)
            .querySelector('table > tbody > tr:first-child')
            .childElementCount - 1;
    }

    function getTestcaseCount() {
        return document.querySelector('#' + props.id)
            .querySelector('table > tbody')
            .childElementCount - 1;
    }

    function createRowRemoveButton() {
        let btn = createElementWithText('button', '-', 'btn btn-outline-danger');
        btn.addEventListener('click', e => {
            if (getTestcaseCount() > 1) {
                e.target.parentElement.parentElement.remove();
                hideOrShowRemoveColumnTr();
            } else {
                alert('최소 한 개의 테스트케이스가 필요합니다.');
            }
        });
        return btn;
    }

    function createColumnRemoveButton() {
        let btn = createElementWithText('button', '-', 'btn btn-outline-danger');
        btn.addEventListener('click', e => {
            if (getParamCount() > 1) {
                let btn_td = btn.parentElement;
                let columnIdx = Array.from(btn_td.parentElement.children).indexOf(btn_td);

                let root = document.querySelector(`#${props.id}`);
                let trs = root.querySelectorAll('table tr');
                trs.forEach(tr => {
                    let th_td = tr.querySelector(`:nth-child(${columnIdx + 1})`);
                    if (th_td) {
                        th_td.remove();
                    }
                });
            } else {
                alert('최소 한 개의 파라미터가 필요합니다.')
            }
        });
        return btn;
    }


}

export default InputOutputTable;