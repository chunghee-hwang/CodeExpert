import { createElementWithElement, createElementWithText, createTextInput, removeClassName, addClassName } from 'utils/DomControl'
import { table_mode } from 'constants/InputOutputTableMode';
/**
 * 테이블에서 파라미터들만 json으로 반환하는 메소드
 */
export function getParams(table_props) {
    let root = document.querySelector(`#${table_props.id}`);
    let table = root.querySelector("table");
    let param_inputs = table.querySelectorAll('.param-tr input');
    let data = {
        param_names: null
    };
    data.param_names = Array.from(param_inputs).reduce((accumulator, param_input) => {
        accumulator.push(param_input.value);
        return accumulator;
    }, []);
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
        let result_input = io_tr.querySelector('.result-td > input');
        let testcase = Array.from(input_tds).reduce((accumulator, input_td) => {
            let input_value = input_td.querySelector('input').value;
            accumulator.params.push(input_value);
            return accumulator;
        }, { params: [] });
        testcase.return = result_input.value;
        data.testcases.push(testcase);
    })
    return data;
}

/**
 * 표를 초기 파라미터와 테스트케이스들로 채우는 메소드
 * 
 * ex)props.init_value = {param_names: ['name1', 'name2'], testcases: [{ params: [13, 15], return: 28 }]};
 */
export function fillWithParametersAndTestcases(table_props) {
    if (table_props.init_value) {

        //파라미터 채우기
        const root = document.querySelector(`#${table_props.id}`);
        let param_tr = root.querySelector('table .param-tr');
        if (table_props.init_value.param_names) {
            const init_param_count = table_props.init_value.param_names.length;
            param_tr.innerHTML = '<th>return</th>';
            for (let idx = 0; idx < init_param_count; idx++) {
                addParam(table_props, table_props.init_value.param_names[idx]);
            }
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

/**
  * 빈 파라미터를 맨 끝에 추가하는 메소드
  * @param paramName 파라미터 이름
  */
export function addParam(table_props, paramName = null) {
    let root = document.querySelector(`#${table_props.id}`);
    let param_text_input = createTextInput('파라미터명', paramName, 'font-weight-bold');
    if (table_props.table_mode !== table_mode.write.param_and_testcase) param_text_input.setAttribute('disabled', true);
    param_text_input.addEventListener('keyup', () => updateInputExampleTable(table_props));
    let new_th = createElementWithElement('th', param_text_input);
    let param_tr = root.querySelector('table .param-tr');
    let last_th = param_tr.querySelector('th:last-child');
    last_th.insertAdjacentElement('beforebegin', new_th);
    let trs = root.querySelectorAll('table > tbody > .io-tr')
    trs.forEach((tr) => {
        let new_td = createElementWithElement('td', createTextInput('입력 값'), 'input-td');
        let last_td = tr.querySelector('td:last-child');
        last_td.previousElementSibling.insertAdjacentElement('beforebegin', new_td);
    });
    if (table_props.table_mode === table_mode.write.param_and_testcase)
        updateColumnRemoveButtons(table_props);
    updateInputExampleTable(table_props);
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
        new_tr.append(createElementWithElement('td', createTextInput('입력 값', is_init_params_valid ? testcase.params[idx] : ''), 'input-td'));
    }
    new_tr.append(createElementWithElement('td', createTextInput('결과 값', is_init_params_valid ? testcase.return : ''), 'result-td'));
    if (table_props.table_mode !== table_mode.read) {
        new_tr.append(createElementWithElement('td', createTestcaseRemoveButton(table_props)));
    }
    tbody.append(new_tr);

    hideOrShowRemoveColumnTr(table_props);
}

/**
 * 테스트케이스 개수를 반환하는 메소드
 */
function getTestcaseCount(table_props) {
    return document.querySelector(`#${table_props.id}`)
        .querySelector('table > tbody')
        .childElementCount - 1;
}

function updateColumnRemoveButtons(table_props) {
    let root = document.querySelector(`#${table_props.id}`);
    let remove_column_tr = root.querySelector('.remove-column-tr')
    remove_column_tr.innerHTML = '';
    for (let idx = 0; idx < getParamsCount(table_props); idx++) {
        let column_remove_btn = createParamRemoveButton(table_props)
        remove_column_tr.append(createElementWithElement('td', column_remove_btn));
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
            trs.forEach(tr => {
                let th_td = tr.querySelector(`:nth-child(${columnIdx + 1})`);
                if (th_td) {
                    th_td.remove();
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