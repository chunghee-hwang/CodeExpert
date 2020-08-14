import { createElementWithElement, createElementWithText, createTextInput, removeClassName, addClassName } from 'utils/DomControl'
import { tableMode } from 'constants/InputOutputTableMode';
import { dataTypes } from 'constants/DataTypes';
/**
 * 테이블에서 파라미터들만 json으로 반환하는 메소드
 */
export function getParams(tableProps) {
    let root = document.querySelector(`#${tableProps.id}`);
    let table = root.querySelector("table");
    let paramDivs = table.querySelectorAll('.param-div');
    let data = {
        params: null,
        returns: null,
    };
    data.params = Array.from(paramDivs).reduce((accumulator, paramDiv) => {
        let paramInput = paramDiv.querySelector('.param-input');

        let paramDataTypeId;
        if (tableProps.tableMode === tableMode.write.paramAndTestcase) {
            paramDataTypeId = Number(paramDiv.querySelector('.data-type-input').value);
        }
        else {
            paramDataTypeId = Number(paramDiv.querySelector('.param-data-type-span').dataset.datatypeid);
        }
        accumulator.push({
            name: paramInput.value,
            dataType: tableProps.dataTypes.find(dataType => dataType.id === paramDataTypeId)
        });
        
        return accumulator;
    }, []);
    let returnDataTypeId;
    if (tableProps.tableMode === tableMode.write.paramAndTestcase) {
        returnDataTypeId = Number(table.querySelector('.return-div .data-type-input').value);
    } else {
        returnDataTypeId = Number(table.querySelector('.return-div .return-data-type-span').dataset.datatypeid);
    }
    data.returns = { dataType: tableProps.dataTypes.find(dataType => dataType.id === returnDataTypeId) };
    return data;
}
/**
 * 테이블에서 파라미터, 테스트케이스를 json으로 반환하는 메소드
 */
export function getParamsAndTestcases(tableProps) {
    let root = document.querySelector(`#${tableProps.id}`);
    let table = root.querySelector("table");

    let data = {
        ...getParams(tableProps),
        testcases: []
    };
    table.querySelectorAll('.io-tr').forEach(ioTr => {
        let inputTds = ioTr.querySelectorAll('.input-td');
        let returnInput = ioTr.querySelector('.return-td > input');
        let testcase = Array.from(inputTds).reduce((accumulator, inputTd) => {
            let inputValue = inputTd.querySelector('input').value;
            accumulator.params.push(inputValue);
            return accumulator;
        }, { params: [] });
        testcase.returns = returnInput.value;
        data.testcases.push(testcase);
    });
    return data;
}

/**
 * 표를 초기 파라미터와 테스트케이스들로 채우는 메소드
 * 
 * ex)props.initValue = {params: [{name: 'number1', dataType: 'int'}, {name: 'number2', dataType:'int'}], returnDataType: 'int', testcases: [{ params: [13, 15], returns: 28 }]};
 */
export function fillWithParametersAndTestcases(tableProps) {

    if (tableProps.initValue) {
        //파라미터 채우기
        if (tableProps.initValue.params && getParamsCount(tableProps) ===0) {
            
            const initParamCount = tableProps.initValue.params.length;
            for (let idx = 0; idx < initParamCount; idx++) {
                addParam(tableProps, tableProps.initValue.params[idx]);
            }
        }

        // 리턴 채우기
        if (tableProps.initValue.returns) {
            createReturnDiv(tableProps, tableProps.initValue.returns.dataType);
        }

        // //테스트케이스 채우기
        if (tableProps.initValue.testcases && getTestcaseCount(tableProps)===0) {
            const initTestcaseCount = tableProps.initValue.testcases.length;
            for (let idx = 0; idx < initTestcaseCount; idx++) {
                addTestcase(tableProps, tableProps.initValue.testcases[idx]);
            }
        }

    }
}

/**
* 파라미터 개수를 반환하는 메소드
*/
export function getParamsCount(tableProps) {
    let root = document.querySelector(`#${tableProps.id}`);
    let paramTr = root.querySelector('table .param-tr');
    return paramTr.childElementCount - 1;
}

// 데이터 타입 선택 select 만드는 메소드
function createDataTypeSelect(tableProps, dataTypeKey = dataTypes.integer.key) {
    let dataTypeInput = document.createElement('select');
    dataTypeInput.setAttribute('class', 'data-type-input custom-select');
    dataTypeInput.addEventListener('change', e => { updateInputExampleTable(tableProps) })
    let selectedIdx = 0;
    if (tableProps.dataTypes) {
        tableProps.dataTypes.forEach((dataType, idx) => {

            let option = createElementWithText('option', dataTypes[dataType.name].name, 'data-type-option')
            option.setAttribute('value', dataType.id);
            dataTypeInput.appendChild(option);
            if (dataType.name === dataTypeKey) {
                selectedIdx = idx;
            }
        });

        dataTypeInput.selectedIndex = selectedIdx;
    }
    return dataTypeInput;
}

// 파라미터명 입력 input 만드는 메소드
function createParamInput(paramName, tableProps) {
    let paramInput = createTextInput('파라미터명', paramName, 'param-input font-weight-bold');
    if (tableProps.tableMode !== tableMode.write.paramAndTestcase) {
        paramInput.disabled = true;
        addClassName(paramInput, 'disabled');
    } else {
        paramInput.addEventListener('keyup', () => updateInputExampleTable(tableProps));
    }
    return paramInput;
}

/* 파라미터명 input과 데이터 타입 선택 input을 담고 있는 div 만드는 메소드
* @param param 파라미터 객체. ex) {name='param1', dataType='int'}
*/
function createParamDiv(param = null, tableProps) {
    let div = document.createElement('div');
    let paramName = param ? param.name : '';
    div.setAttribute('class', 'param-div');
    div.append(createParamInput(paramName, tableProps));

    let text;
    let dataTypeKey;

    if (param && param.dataType) {
        text = dataTypes[param.dataType.name].name;
        dataTypeKey = param.dataType.name;
    } else {
        text = dataTypes.integer.name;
        dataTypeKey = dataTypes.integer.key;
    }

    if (tableProps.tableMode === tableMode.write.paramAndTestcase) {
        div.append(createDataTypeSelect(tableProps, dataTypeKey));
    } else {
        let paramDataTypeSpan = createElementWithText('span', `${text}`, 'param-data-type-span ml-2');
        paramDataTypeSpan.setAttribute('data-datatypeid', param.dataType.id);
        div.append(paramDataTypeSpan);
    }


    return div;
}

/**
  * 빈 파라미터를 맨 끝에 추가하는 메소드
  * @param param 파라미터 객체. ex) {name='param1', dataType='int'}
  */
export function addParam(tableProps, param = null) {
    let root = document.querySelector(`#${tableProps.id}`);
    let paramDiv = createParamDiv(param, tableProps);
    let newTh = createElementWithElement('th', paramDiv, 'param-th');
    let paramTr = root.querySelector('table .param-tr');
    let lastTh = paramTr.querySelector('th:last-child');
    lastTh.insertAdjacentElement('beforebegin', newTh);
    let trs = root.querySelectorAll('table > tbody > .io-tr')
    const paramsCount = getParamsCount(tableProps);
    trs.forEach((tr) => {
        const inputTdsCount = tr.querySelectorAll('.input-td').length;
        if(paramsCount > inputTdsCount){
            let newTd = createElementWithElement('td', createTextInput('입력 값', '', 'put-input'), 'input-td');
            let lastTd = tr.querySelector('td:last-child');
            lastTd.previousElementSibling.insertAdjacentElement('beforebegin', newTd);
        }else if(paramsCount < inputTdsCount){
            for(let idx = 0; idx < inputTdsCount - paramsCount; idx++){
                let lastInputTd = tr.querySelector('.input-td:last-child');
                if(lastInputTd) lastInputTd.remove();
            }
        }
       
    });
    if (tableProps.tableMode === tableMode.write.paramAndTestcase)
        updateParamRemoveButtons(tableProps);
    updateInputExampleTable(tableProps);
}


// 결과 값 input과 데이터 타입 선택 input을 담고 있는 div 만드는 메소드
export function createReturnDiv(tableProps, returnDataType = null) {
    if (!returnDataType) {
        returnDataType = tableProps.dataTypes[0];
    }
    let returnTh = document.querySelector(`#${tableProps.id} table .return-th`);
    let prevReturnDiv = returnTh.querySelector('.return-div');
    let div = document.createElement('div');
    div.setAttribute('class', 'return-div');
    let returnSpan = createElementWithText('span', 'Return', 'text-weight-bold');
    div.append(returnSpan);
    if (tableProps.tableMode === tableMode.write.paramAndTestcase) {
        div.append(createDataTypeSelect(tableProps, returnDataType.name));
    }
    else {
        let returnDataTypeSpan = createElementWithText('span', dataTypes[returnDataType.name].name, 'return-data-type-span ml-2');
        returnDataTypeSpan.setAttribute('data-datatypeid', returnDataType.id);
        div.append(returnDataTypeSpan);
    }
    
    if (prevReturnDiv) prevReturnDiv.remove();
    returnTh.append(div);
}

/**
* 테스트케이스 한 줄을 표 맨 아래에 추가하는 메소드
* @param {object} testcase 테스트케이스 객체. ex) {params: [1, 2], returns: "3" }
*/
export function addTestcase(tableProps, testcase = null) {
    let root = document.querySelector(`#${tableProps.id}`);
    let tbody = root.querySelector('table > tbody');
    let newTr = createElementWithText('tr', '', 'io-tr');
    const paramCount = getParamsCount(tableProps);
    let isInitParamsValid = (testcase && (testcase.params.length === paramCount));
    for (let idx = 0; idx < getParamsCount(tableProps); idx++) {
        newTr.append(createElementWithElement('td', createTextInput('입력 값', isInitParamsValid ? testcase.params[idx] : '', 'put-input'), 'input-td'));
    }
    newTr.append(createElementWithElement('td', createTextInput('결과 값', isInitParamsValid ? testcase.returns : '', 'return-input'), 'return-td'));
    if (tableProps.tableMode !== tableMode.read) {
        newTr.append(createElementWithElement('td', createTestcaseRemoveButton(tableProps)));
    }
    tbody.append(newTr);

    hideOrShowRemoveColumnTr(tableProps);
}

/**
 * 테스트케이스 개수를 반환하는 메소드
 */
export function getTestcaseCount(tableProps) {
    return document.querySelector(`#${tableProps.id}`)
        .querySelector('table > tbody')
        .childElementCount - 1;
}

export function updateParameters(tableProps, newParams){
    if(tableProps.tableMode === tableMode.write.testcase)
    {
        let root = document.querySelector(`#${tableProps.id}`);
        let params = newParams.params;
        let returns = newParams.returns;
        createReturnDiv(tableProps, returns.dataType);
        root.querySelectorAll(".param-th").forEach(paramTh=>paramTh.remove());
        params.forEach(param=>addParam(tableProps, param));
        
    }
}

function updateParamRemoveButtons(tableProps) {
    let root = document.querySelector(`#${tableProps.id}`);
    let removeColumnTr = root.querySelector('.remove-column-tr')
    removeColumnTr.innerHTML = '';
    for (let idx = 0; idx < getParamsCount(tableProps); idx++) {
        let columnRemoveBtn = createParamRemoveButton(tableProps)
        removeColumnTr.append(createElementWithElement('td', columnRemoveBtn, 'remove-btn-td'));
    }
}

function createTestcaseRemoveButton(tableProps) {
    let btn = createElementWithText('button', '-', 'btn btn-sm btn-outline-danger');
    btn.addEventListener('click', e => {
        if (getTestcaseCount(tableProps) > 1) {
            e.target.parentElement.parentElement.remove();
            hideOrShowRemoveColumnTr(tableProps);
        } else {
            alert('최소 한 개의 테스트케이스가 필요합니다.');
        }
    });
    return btn;
}

function hideOrShowRemoveColumnTr(tableProps) {
    let root = document.querySelector(`#${tableProps.id}`);
    let removeColumnTr = root.querySelector('.remove-column-tr')
    let tbody = root.querySelector('table > tbody');
    if (tbody.childElementCount < 2) {
        addClassName(removeColumnTr, "hidden")
    } else {
        removeClassName(removeColumnTr, "hidden");
    }
}

function createParamRemoveButton(tableProps) {
    let btn = createElementWithText('button', '-', 'btn btn-sm btn-outline-danger');
    btn.addEventListener('click', e => {
        if (getParamsCount(tableProps) > 1) {
            let btnTd = btn.parentElement;
            let columnIdx = Array.from(btnTd.parentElement.children).indexOf(btnTd);

            let root = document.querySelector(`#${tableProps.id}`);
            let trs = root.querySelectorAll('table tr');
            trs.forEach((tr, idx) => {
                if (idx === 0) {
                    tr.querySelectorAll('.param-th')[columnIdx].remove();
                }
                else if (idx !== trs.length - 1) {
                    tr.querySelectorAll('.input-td')[columnIdx].remove();
                }
                else {
                    tr.querySelectorAll('.remove-btn-td')[columnIdx].remove();
                }
            });
            updateInputExampleTable(tableProps);
        } else {
            alert('최소 한 개의 파라미터가 필요합니다.')
        }
    });
    return btn;
}

function updateInputExampleTable(tableProps) {
    if (tableProps.onChangeParamNames) tableProps.onChangeParamNames(getParams(tableProps));
}