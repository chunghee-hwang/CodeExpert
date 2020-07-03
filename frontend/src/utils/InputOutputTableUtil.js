import { createElementWithElement, createElementWithText, createTextInput, removeClassName, addClassName } from 'utils/DomControl'
import { table_mode } from 'constants/InputOutputTableMode';
import { data_types } from 'constants/DataTypes';
/**
 * 테이블에서 파라미터들만 json으로 반환하는 메소드
 */
export function getParams(table_props) {
    let root = document.querySelector(`#${table_props.id}`);
    let table = root.querySelector("table");
    let param_divs = table.querySelectorAll('.param-div');
    let data = {
        params: null,
        return: null,
    };
    data.params = Array.from(param_divs).reduce((accumulator, param_div) => {
        let param_input = param_div.querySelector('.param-input');

        let param_data_type_key;
        if (table_props.table_mode === table_mode.write.param_and_testcase) {
            param_data_type_key = param_div.querySelector('.data-type-input').value;
        }
        else {
            param_data_type_key = param_div.querySelector('.param-data-type-span').dataset.data_type_key;
        }
        accumulator.push({
            name: param_input.value,
            data_type: data_types[param_data_type_key]
        });
        return accumulator;
    }, []);
    let return_data_type_key;
    if (table_props.table_mode === table_mode.write.param_and_testcase) {
        return_data_type_key = table.querySelector('.return-div .data-type-input').value;
    } else {
        return_data_type_key = table.querySelector('.return-div .return-data-type-span').dataset.data_type_key;
    }
    data.return = { data_type: data_types[return_data_type_key] };
    return data;
}
/**
 * 테이블에서 파라미터, 테스트케이스를 json으로 반환하는 메소드
 */
export function getParamsAndTestcases(table_props) {

    let root = document.querySelector(`#${table_props.id}`);
    let table = root.querySelector("table");

    let data = {
        ...getParams(table_props),
        testcases: []
    };
    table.querySelectorAll('.io-tr').forEach(io_tr => {
        let input_tds = io_tr.querySelectorAll('.input-td');
        let return_input = io_tr.querySelector('.return-td > input');
        let testcase = Array.from(input_tds).reduce((accumulator, input_td) => {
            let input_value = input_td.querySelector('input').value;
            accumulator.params.push(input_value);
            return accumulator;
        }, { params: [] });
        testcase.return = return_input.value;
        data.testcases.push(testcase);
    });
    return data;
}

/**
 * 표를 초기 파라미터와 테스트케이스들로 채우는 메소드
 * 
 * ex)props.init_value = {params: [{name: 'number1', data_type: 'int'}, {name: 'number2', data_type:'int'}], return_data_type: 'int', testcases: [{ params: [13, 15], return: 28 }]};
 */
export function fillWithParametersAndTestcases(table_props) {

    if (table_props.init_value) {
        //파라미터 채우기
        const root = document.querySelector(`#${table_props.id}`);
        const param_tr = root.querySelector('table .param-tr');
        let param_ths = root.querySelectorAll('table .param-th');
        if (param_ths) {
            param_ths.forEach(param_th => {
                param_th.remove();
            });
        }
        if (table_props.init_value.params) {
            const init_param_count = table_props.init_value.params.length;
            for (let idx = 0; idx < init_param_count; idx++) {
                addParam(table_props, table_props.init_value.params[idx]);
            }
        }

        // 리턴 채우기
        if (table_props.init_value.return) {
            createReturnDiv(table_props, table_props.init_value.return.data_type);
        }

        //테스트케이스 채우기

        let tbody = root.querySelector('table > tbody');
        tbody.innerHTML = '';
        tbody.append(param_tr);
        if (table_props.init_value.testcases) {
            const init_testcase_count = table_props.init_value.testcases.length;
            for (let idx = 0; idx < init_testcase_count; idx++) {
                addTestcase(table_props, table_props.init_value.testcases[idx]);
            }
        } else {
            // 사용자가 테스트케이스 입력할 수 있도록 한 행 추가하기
            addTestcase(table_props);
        }

    }
}

/**
* 파라미터 개수를 반환하는 메소드
*/
export function getParamsCount(table_props) {
    let root = document.querySelector(`#${table_props.id}`);
    let param_tr = root.querySelector('table .param-tr');
    return param_tr.childElementCount - 1;
}

// 데이터 타입 선택 select 만드는 메소드
function createDataTypeSelect(table_props) {
    let data_type_input = document.createElement('select');
    data_type_input.setAttribute('class', 'data-type-input custom-select');
    data_type_input.addEventListener('change', e => { updateInputExampleTable(table_props) })
    for (const property in data_types) {
        let option = createElementWithText('option', data_types[property].name, 'data-type-option')
        option.setAttribute('value', data_types[property].key);
        data_type_input.appendChild(option);
    }

    return data_type_input;
}

// 파라미터명 입력 input 만드는 메소드
function createParamInput(param_name, table_props) {
    let param_input = createTextInput('파라미터명', param_name, 'param-input font-weight-bold');
    if (table_props.table_mode !== table_mode.write.param_and_testcase) {
        param_input.disabled = true;
        addClassName(param_input, 'disabled');
    } else {
        param_input.addEventListener('keyup', () => updateInputExampleTable(table_props));
    }
    return param_input;
}

/* 파라미터명 input과 데이터 타입 선택 input을 담고 있는 div 만드는 메소드
* @param param 파라미터 객체. ex) {name='param1', data_type='int'}
*/
function createParamDiv(param = null, table_props) {
    let div = document.createElement('div');
    let param_name = param ? param.name : '';
    div.setAttribute('class', 'param-div');
    div.append(createParamInput(param_name, table_props));
    if (table_props.table_mode === table_mode.write.param_and_testcase) {
        div.append(createDataTypeSelect(table_props));
    } else {

        let text;
        let data_type_key;
        if (param.data_type) {
            text = param.data_type.name;
            data_type_key = param.data_type.key;
        } else {
            text = data_types.integer.name;
            data_type_key = data_types.integer.key;
        }
        let param_data_type_span = createElementWithText('span', `${text}`, 'param-data-type-span ml-2');
        param_data_type_span.setAttribute('data-data_type_key', data_type_key);
        div.append(param_data_type_span);
    }


    return div;
}

/**
  * 빈 파라미터를 맨 끝에 추가하는 메소드
  * @param param 파라미터 객체. ex) {name='param1', data_type='int'}
  */
export function addParam(table_props, param = null) {
    let root = document.querySelector(`#${table_props.id}`);
    let param_div = createParamDiv(param, table_props);
    let new_th = createElementWithElement('th', param_div, 'param-th');
    let param_tr = root.querySelector('table .param-tr');
    let last_th = param_tr.querySelector('th:last-child');
    last_th.insertAdjacentElement('beforebegin', new_th);
    let trs = root.querySelectorAll('table > tbody > .io-tr')

    trs.forEach((tr) => {
        let new_td = createElementWithElement('td', createTextInput('입력 값', '', 'put-input'), 'input-td');
        let last_td = tr.querySelector('td:last-child');
        last_td.previousElementSibling.insertAdjacentElement('beforebegin', new_td);
    });
    if (table_props.table_mode === table_mode.write.param_and_testcase)
        updateParamRemoveButtons(table_props);
    updateInputExampleTable(table_props);
}


// 결과 값 input과 데이터 타입 선택 input을 담고 있는 div 만드는 메소드
export function createReturnDiv(table_props, return_data_type = data_types.integer) {

    let div = document.createElement('div');
    div.setAttribute('class', 'return-div');
    let return_span = createElementWithText('span', 'Return', 'text-weight-bold');
    div.append(return_span);
    if (table_props.table_mode === table_mode.write.param_and_testcase) {
        div.append(createDataTypeSelect(table_props));
    }
    else {
        let return_data_type_span = createElementWithText('span', return_data_type.name, 'return-data-type-span ml-2');
        return_data_type_span.setAttribute('data-data_type_key', return_data_type.key);
        div.append(return_data_type_span);
    }
    let return_th = document.querySelector(`#${table_props.id} table .return-th`);
    let prev_return_div = return_th.querySelector('.return-div');
    if (prev_return_div) prev_return_div.remove();
    return_th.append(div);
}

/**
* 테스트케이스 한 줄을 표 맨 아래에 추가하는 메소드
* @param {object} testcase 테스트케이스 객체. ex) {params: [1, 2], return: "3" }
*/
export function addTestcase(table_props, testcase = null) {
    let root = document.querySelector(`#${table_props.id}`);
    let tbody = root.querySelector('table > tbody');
    let new_tr = createElementWithText('tr', '', 'io-tr');
    const param_count = getParamsCount(table_props);
    let is_init_params_valid = (testcase && (testcase.params.length === param_count));
    for (let idx = 0; idx < getParamsCount(table_props); idx++) {
        new_tr.append(createElementWithElement('td', createTextInput('입력 값', is_init_params_valid ? testcase.params[idx] : '', 'put-input'), 'input-td'));
    }
    new_tr.append(createElementWithElement('td', createTextInput('결과 값', is_init_params_valid ? testcase.return : '', 'return-input'), 'return-td'));
    if (table_props.table_mode !== table_mode.read) {
        new_tr.append(createElementWithElement('td', createTestcaseRemoveButton(table_props)));
    }
    tbody.append(new_tr);

    hideOrShowRemoveColumnTr(table_props);
}

/**
 * 테스트케이스 개수를 반환하는 메소드
 */
export function getTestcaseCount(table_props) {
    return document.querySelector(`#${table_props.id}`)
        .querySelector('table > tbody')
        .childElementCount - 1;
}

function updateParamRemoveButtons(table_props) {
    let root = document.querySelector(`#${table_props.id}`);
    let remove_column_tr = root.querySelector('.remove-column-tr')
    remove_column_tr.innerHTML = '';
    for (let idx = 0; idx < getParamsCount(table_props); idx++) {
        let column_remove_btn = createParamRemoveButton(table_props)
        remove_column_tr.append(createElementWithElement('td', column_remove_btn, 'remove-btn-td'));
    }
}

function createTestcaseRemoveButton(table_props) {
    let btn = createElementWithText('button', '-', 'btn btn-sm btn-outline-danger');
    btn.addEventListener('click', e => {
        if (getTestcaseCount(table_props) > 1) {
            e.target.parentElement.parentElement.remove();
            hideOrShowRemoveColumnTr(table_props);
        } else {
            alert('최소 한 개의 테스트케이스가 필요합니다.');
        }
    });
    return btn;
}

function hideOrShowRemoveColumnTr(table_props) {
    let root = document.querySelector(`#${table_props.id}`);
    let remove_column_tr = root.querySelector('.remove-column-tr')
    let tbody = root.querySelector('table > tbody');
    if (tbody.childElementCount < 2) {
        addClassName(remove_column_tr, "hidden")
    } else {
        removeClassName(remove_column_tr, "hidden");
    }
}

function createParamRemoveButton(table_props) {
    let btn = createElementWithText('button', '-', 'btn btn-sm btn-outline-danger');
    btn.addEventListener('click', e => {
        if (getParamsCount(table_props) > 1) {
            let btn_td = btn.parentElement;
            let columnIdx = Array.from(btn_td.parentElement.children).indexOf(btn_td);

            let root = document.querySelector(`#${table_props.id}`);
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
            updateInputExampleTable(table_props);
        } else {
            alert('최소 한 개의 파라미터가 필요합니다.')
        }
    });
    return btn;
}

function updateInputExampleTable(table_props) {
    if (table_props.onChangeParamNames) table_props.onChangeParamNames(getParams(table_props));
}