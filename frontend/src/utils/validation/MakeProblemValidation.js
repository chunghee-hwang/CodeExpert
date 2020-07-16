import { input_names } from 'constants/FormInputNames';
import { data_type_regexs } from './Regexes';
export function validateMakeProblem(new_problem_id, form, testcase_table_info, io_table_info) {
    const problem_explain_editor = form.querySelector('#problem-explain-editor');
    const values = {
        [input_names.problem_id]: new_problem_id,
        [input_names.problem_title]: form[input_names.problem_title].value.trim(),
        [input_names.problem_type_id]: form[input_names.problem_type_id].value.trim(),
        [input_names.problem_explain]: problem_explain_editor.innerHTML.trim(),
        [input_names.problem_type_id]: form[input_names.problem_type_id].value.trim(),
        [input_names.limit_explain]: form[input_names.limit_explain].value.trim(),
        [input_names.time_limit]: form[input_names.time_limit].value.trim(),
        [input_names.memory_limit]: form[input_names.memory_limit].value.trim(),
        [input_names.problem_level_id]: form[input_names.problem_level_id].value.trim(),
        [input_names.answer_table]: testcase_table_info,
        [input_names.example_table]: io_table_info,
    };
    let validation = {
        is_valid: false,
        fail_cause: null,
        failed_element: null,
        values
    }

    const validation_testcase_table = validateIoTable(testcase_table_info);
    const validation_io_table = validateIoTable(io_table_info);
    if (!values[input_names.problem_id]) {
        validation.fail_cause = '문제 정보가 유효하지 않습니다.';
    }
    else if (!values[input_names.problem_title]) {
        validation.fail_cause = '문제 제목을 입력해주세요.';
        validation.failed_element = form[input_names.problem_title];
    }
    else if (values[input_names.problem_title].length > 100) {
        validation.fail_cause = '문제 제목은 100자 이하로 입력해주세요.';
        validation.failed_element = form[input_names.problem_title];
    }
    else if (!values[input_names.problem_type_id]) {
        validation.fail_cause = '문제 유형을 입력해주세요.';
        validation.failed_element = form[input_names.problem_type_id];
    }
    else if (!values[input_names.problem_explain]) {
        validation.fail_cause = '문제 설명을 입력해주세요.';
        validation.failed_element = problem_explain_editor;
    }
    else if (values[input_names.problem_explain].length > 1000) {
        validation.fail_cause = '문제 설명은 1000자 이하로 입력해주세요.';
        validation.failed_element = problem_explain_editor;
    }
    else if (!values[input_names.limit_explain]) {
        validation.fail_cause = '제한 사항을 입력해주세요.';
        validation.failed_element = form[input_names.limit_explain];
    }
    else if (values[input_names.limit_explain].length > 200) {
        validation.fail_cause = '제한 사항은 200자 이하로 입력해주세요.';
        validation.failed_element = form[input_names.limit_explain];
    }
    else if (!values[input_names.time_limit]) {
        validation.fail_cause = '제한 시간을 입력해주세요';
        validation.failed_element = form[input_names.time_limit];
    }
    else if (values[input_names.time_limit].length > 5) {
        validation.fail_cause = '제한 시간은 5자 이하로 입력해주세요';
        validation.failed_element = form[input_names.time_limit];
    }
    else if (!/^\d+$/.test(values[input_names.time_limit].trim())) {
        validation.fail_cause = '제한 시간은 양의 정수로 입력해주세요';
        validation.failed_element = form[input_names.time_limit];
    }
    else if (!values[input_names.memory_limit]) {
        validation.fail_cause = '메모리 제한을 입력해주세요';
        validation.failed_element = form[input_names.memory_limit];
    }
    else if (values[input_names.memory_limit].length > 3) {
        validation.fail_cause = '메모리 제한은 3자 이하로 입력해주세요';
        validation.failed_element = form[input_names.memory_limit];
    }
    else if (!/^\d+$/.test(values[input_names.memory_limit].trim())) {
        validation.fail_cause = '메모리 제한은 양의 정수로 입력해주세요';
        validation.failed_element = form[input_names.memory_limit];
    }
    else if (!values[input_names.problem_level_id]) {
        validation.fail_cause = '난이도를 입력해주세요';
        validation.failed_element = form[input_names.problem_level_id];
    }
    else if (!validation_testcase_table.is_valid) {
        validation.fail_cause = '테스트 케이스 테이블: ' + validation_testcase_table.fail_cause;
        validation.failed_element = document.getElementById('testcase-set-table');
    }
    else if (!validation_io_table.is_valid) {
        validation.fail_cause = '입출력 예시 테이블: ' + validation_io_table.fail_cause;
        validation.failed_element = document.getElementById('io-ex-set-table');
    }
    else {
        validation.is_valid = true;
    }
    return validation;
}

export function validateUpdateProblem(user, problem, form, testcase_table_info, io_table_info) {
    const problem_explain_editor = form.querySelector('#problem-explain-editor');
    const values = {
        [input_names.problem_id]: problem.id,
        [input_names.problem_title]: form[input_names.problem_title].value.trim(),
        [input_names.problem_type_id]: form[input_names.problem_type_id].value.trim(),
        [input_names.problem_explain]: problem_explain_editor.innerHTML.trim(),
        [input_names.problem_type_id]: form[input_names.problem_type_id].value.trim(),
        [input_names.limit_explain]: form[input_names.limit_explain].value.trim(),
        [input_names.time_limit]: form[input_names.time_limit].value.trim(),
        [input_names.memory_limit]: form[input_names.memory_limit].value.trim(),
        [input_names.problem_level_id]: form[input_names.problem_level_id].value.trim(),
        [input_names.answer_table]: testcase_table_info,
        [input_names.example_table]: io_table_info,
    };
    let validation = {
        is_valid: false,
        fail_cause: null,
        failed_element: null,
        values
    }

    const validation_testcase_table = validateIoTable(testcase_table_info);
    const validation_io_table = validateIoTable(io_table_info);
    if (!values[input_names.problem_id]) {
        validation.fail_cause = '문제 정보가 유효하지 않습니다.';
    } else if (!user || user.id !== problem.creator.id) {
        validation.fail_cause = '사용자님은 문제 제작자가 아닙니다.';
    }
    else if (!values[input_names.problem_title]) {
        validation.fail_cause = '문제 제목을 입력해주세요.';
        validation.failed_element = form[input_names.problem_title];
    }
    else if (values[input_names.problem_title].length > 100) {
        validation.fail_cause = '문제 제목은 100자 이하로 입력해주세요.';
        validation.failed_element = form[input_names.problem_title];
    }
    else if (!values[input_names.problem_type_id]) {
        validation.fail_cause = '문제 유형을 입력해주세요.';
        validation.failed_element = form[input_names.problem_type_id];
    }
    else if (!values[input_names.problem_explain]) {
        validation.fail_cause = '문제 설명을 입력해주세요.';
        validation.failed_element = problem_explain_editor;
    }
    else if (values[input_names.problem_explain].length > 1000) {
        validation.fail_cause = '문제 설명은 1000자 이하로 입력해주세요.';
        validation.failed_element = problem_explain_editor;
    }
    else if (!values[input_names.limit_explain]) {
        validation.fail_cause = '제한 사항을 입력해주세요.';
        validation.failed_element = form[input_names.limit_explain];
    }
    else if (values[input_names.limit_explain].length > 200) {
        validation.fail_cause = '제한 사항은 200자 이하로 입력해주세요.';
        validation.failed_element = form[input_names.limit_explain];
    }
    else if (!values[input_names.time_limit]) {
        validation.fail_cause = '제한 시간을 입력해주세요';
        validation.failed_element = form[input_names.time_limit];
    }
    else if (values[input_names.time_limit].length > 5) {
        validation.fail_cause = '제한 시간은 5자 이하로 입력해주세요';
        validation.failed_element = form[input_names.time_limit];
    }
    else if (!/^\d+$/.test(values[input_names.time_limit].trim())) {
        validation.fail_cause = '제한 시간은 양의 정수로 입력해주세요';
        validation.failed_element = form[input_names.time_limit];
    }
    else if (!values[input_names.memory_limit]) {
        validation.fail_cause = '메모리 제한을 입력해주세요';
        validation.failed_element = form[input_names.memory_limit];
    }
    else if (values[input_names.memory_limit].length > 3) {
        validation.fail_cause = '메모리 제한은 3자 이하로 입력해주세요';
        validation.failed_element = form[input_names.memory_limit];
    }
    else if (!/^\d+$/.test(values[input_names.memory_limit].trim())) {
        validation.fail_cause = '메모리 제한은 양의 정수로 입력해주세요';
        validation.failed_element = form[input_names.memory_limit];
    }
    else if (!values[input_names.problem_level_id]) {
        validation.fail_cause = '난이도를 입력해주세요';
        validation.failed_element = form[input_names.problem_level_id];
    }
    else if (!validation_testcase_table.is_valid) {
        validation.fail_cause = '테스트 케이스 테이블: ' + validation_testcase_table.fail_cause;
        validation.failed_element = document.getElementById('testcase-set-table');
    }
    else if (!validation_io_table.is_valid) {
        validation.fail_cause = '입출력 예시 테이블: ' + validation_io_table.fail_cause;
        validation.failed_element = document.getElementById('io-ex-set-table');
    }
    else {
        validation.is_valid = true;
    }
    return validation;
}

export function validateDeleteProblem(user, problem) {
    const values = {
        [input_names.problem_id]: problem.id,
    };
    let validation = {
        is_valid: false,
        fail_cause: null,
        values
    }

    if (!values[input_names.problem_id]) {
        validation.fail_cause = '문제 정보가 유효하지 않습니다.';
    } else if (!user || user.id !== problem.creator.id) {
        validation.fail_cause = '사용자님은 문제 제작자가 아닙니다.';
    } else {
        validation.is_valid = true;
    }
    return validation;
}



function validateIoTable(table_info) {

    let validation = {
        fail_cause: null,
        is_valid: false
    }

    // 파라미터 이름 정규식 (변수명 규칙)
    const value_name_regex = /^[^0-9][\w]+$/
    let params = table_info.params;
    let returns = table_info.returns;
    let testcases = table_info.testcases;
    let param_names = null;
    param_names = params.reduce((ac, param) => { ac.push(param.name); return ac; }, []);
    // 파라미터 이름들 누락 확인
    if (!param_names.every(param_name => param_name && param_name.length > 1)) {
        validation.fail_cause = "파라미터명은 두 글자 이상으로 입력해주세요."
    }
    // 파라미터의 자료형 누락 확인
    else if (!params.every(param => (param.data_type && param.data_type.id))) {
        validation.fail_cause = "파라미터의 자료형을 입력해주세요."
    }
    // 결과값의 자료형 누락 확인
    else if (!(returns.data_type && returns.data_type.id)) {
        validation.fail_cause = "결과값의 자료형을 입력해주세요."
    }
    // 입력값, 결과값 누락 확인
    else if (!testcases.every(testcase => (testcase.params.every(param => param) && testcase.returns))) {
        validation.fail_cause = "입력값 또는 결과값을 입력해주세요."
    }
    // 파라미터 이름 중복 확인
    else if (param_names.length !== new Set(param_names).size) {
        validation.fail_cause = "파라미터명은 서로 다르게 지어주세요."
    }
    // 파라미터 이름 형식 확인
    else if (!param_names.every(param_name => value_name_regex.test(param_name))) {
        validation.fail_cause = "파라미터명은 변수명 규칙을 따라주세요."
    }
    // 입력값 형식 확인
    else if (!testcases.every(testcase => testcase.params.every((value, idx) => data_type_regexs[params[idx].data_type.name].test(value)))) {
        validation.fail_cause = "입력값의 자료형이 일치하지 않습니다.\n표 옆의 ? 버튼 눌러서 입력 형식을 확인하세요."
    }
    // 결과값 형식 확인
    else if (!testcases.every(testcase => data_type_regexs[returns.data_type.name].test(testcase.returns))) {
        validation.fail_cause = "결과값의 자료형이 일치하지 않습니다.\n표 옆의 ? 버튼 눌러서 입력 형식을 확인하세요."
    }
    else {
        validation.is_valid = true;
    }

    return validation;
}