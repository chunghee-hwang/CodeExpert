import { inputNames } from 'constants/FormInputNames';
export function validateMakeProblem(form, testcase_table_info, io_table_info) {
    const problem_explain_editor = form.querySelector('#problem-explain-editor');
    const values = {
        [inputNames.problem_title]: form[inputNames.problem_title].value,
        [inputNames.problem_type]: form[inputNames.problem_type].value,
        [inputNames.problem_explain]: problem_explain_editor.innerHTML,
        [inputNames.problem_type]: form[inputNames.problem_type].value,
        [inputNames.limit_explain]: form[inputNames.limit_explain].value,
        [inputNames.time_limit]: form[inputNames.time_limit].value,
        [inputNames.memory_limit]: form[inputNames.memory_limit].value,
        [inputNames.level]: form[inputNames.level].value,
        [inputNames.testcase_table]: testcase_table_info,
        [inputNames.input_output_table]: io_table_info,
    };
    let validation = {
        valid: false,
        fail_cause: null,
        failed_element: null,
        values
    }

    const validation_testcase_table = validateIoTable(testcase_table_info);
    const validation_io_table = validateIoTable(io_table_info);

    if (!values[inputNames.problem_title]) {
        validation.fail_cause = '문제 제목을 입력해주세요.';
        validation.failed_element = form[inputNames.problem_title];
    }
    else if (values[inputNames.problem_title].length > 100) {
        validation.fail_cause = '문제 제목은 100자 이하로 입력해주세요.';
        validation.failed_element = form[inputNames.problem_title];
    }
    else if (!values[inputNames.problem_type]) {
        validation.fail_cause = '문제 유형을 입력해주세요.';
        validation.failed_element = form[inputNames.problem_type];
    }
    else if (!values[inputNames.problem_explain]) {
        validation.fail_cause = '문제 설명을 입력해주세요.';
        validation.failed_element = problem_explain_editor;
    }
    else if (values[inputNames.problem_explain].length > 1000) {
        validation.fail_cause = '문제 설명은 1000자 이하로 입력해주세요.';
        validation.failed_element = problem_explain_editor;
    }
    else if (!values[inputNames.limit_explain]) {
        validation.fail_cause = '제한 사항을 입력해주세요.';
        validation.failed_element = form[inputNames.limit_explain];
    }
    else if (values[inputNames.limit_explain].length > 200) {
        validation.fail_cause = '제한 사항은 200자 이하로 입력해주세요.';
        validation.failed_element = form[inputNames.limit_explain];
    }
    else if (!values[inputNames.time_limit]) {
        validation.fail_cause = '제한 시간을 입력해주세요';
        validation.failed_element = form[inputNames.time_limit];
    }
    else if (values[inputNames.time_limit].length > 5) {
        validation.fail_cause = '제한 시간은 5자 이하로 입력해주세요';
        validation.failed_element = form[inputNames.time_limit];
    }
    else if (!/^\d+$/.test(values[inputNames.time_limit].trim())) {
        validation.fail_cause = '제한 시간은 양의 정수로 입력해주세요';
        validation.failed_element = form[inputNames.time_limit];
    }
    else if (!values[inputNames.memory_limit]) {
        validation.fail_cause = '메모리 제한을 입력해주세요';
        validation.failed_element = form[inputNames.memory_limit];
    }
    else if (values[inputNames.memory_limit].length > 3) {
        validation.fail_cause = '메모리 제한은 3자 이하로 입력해주세요';
        validation.failed_element = form[inputNames.memory_limit];
    }
    else if (!/^\d+$/.test(values[inputNames.memory_limit].trim())) {
        validation.fail_cause = '메모리 제한은 양의 정수로 입력해주세요';
        validation.failed_element = form[inputNames.memory_limit];
    }
    else if (!values[inputNames.level]) {
        validation.fail_cause = '난이도를 입력해주세요';
        validation.failed_element = form[inputNames.level];
    }
    else if (!validation_testcase_table.valid) {
        validation.fail_cause = '테스트 케이스 테이블: ' + validation_testcase_table.fail_cause;
        validation.failed_element = document.getElementById('testcase-set-table');
    }
    else if (!validation_io_table.valid) {
        validation.fail_cause = '입출력 예시 테이블: ' + validation_io_table.fail_cause;
        validation.failed_element = document.getElementById('io-ex-set-table');
    }
    else {
        validation.valid = true;
    }
    return validation;
}



function validateIoTable(table_info) {

    let validation = {
        fail_cause: null,
        valid: false
    }

    // 자료형 정규식
    const data_type_regexs = {
        integer: /^\d+$/,
        integer_array: /^\[([+-]?\d+(,)?(\s)?)*\]$/,
        integer_2d_array: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/,
        long: /^\d+$/,
        long_array: /^\[([+-]?\d+(,)?(\s)?)*\]$/,
        long_2d_array: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/,
        double: /^[+-]?\d+(.)?(\d+)?$/,
        double_array: /^\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\]$/,
        double_2d_array: /^\[(\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\](,)?(\s)?)*\]$/,
        boolean: /^(true|false)$/,
        boolean_array: /^\[((true|false)(,)?(\s)?)*\]$/,
        string: /^"[^"]*"$/,
        string_array: /^\[("[^"]*"(,)?(\s)?)*\]$/,
    }
    // 파라미터 이름 정규식 (변수 명명 규칙)
    const value_name_regex = /^[^0-9][\w]*$/

    let params = table_info.params;
    let returns = table_info.return;
    let testcases = table_info.testcases;
    let param_names = null;
    param_names = params.reduce((ac, param) => { ac.push(param.name); return ac; }, []);
    // 파라미터 이름들 누락 확인
    if (!param_names.every(param_name => param_name)) {
        validation.fail_cause = "파라미터명을 입력해주세요."
    }
    // 파라미터의 자료형 누락 확인
    else if (!params.every(param => (param.data_type && param.data_type.key))) {
        validation.fail_cause = "파라미터의 자료형을 입력해주세요."
    }
    // 결과값의 자료형 누락 확인
    else if (!(returns.data_type && returns.data_type.key)) {
        validation.fail_cause = "결과값의 자료형을 입력해주세요."
    }
    // 입력값, 결과값 누락 확인
    else if (!testcases.every(testcase => (testcase.params.every(param => param) && testcase.return))) {
        validation.fail_cause = "입력값 또는 결과값을 입력해주세요."
    }
    // 파라미터 이름 중복 확인
    else if (param_names.length !== new Set(param_names).size) {
        validation.fail_cause = "파라미터명은 서로 다르게 지어주세요."
    }
    // 파라미터 이름 형식 확인
    else if (!param_names.every(param_name => value_name_regex.test(param_name))) {
        validation.fail_cause = "파라미터명은 변수 명명 규칙을 따라주세요."
    }
    // 입력값 형식 확인
    else if (!testcases.every(testcase => testcase.params.every((value, idx) => data_type_regexs[params[idx].data_type.key].test(value)))) {
        validation.fail_cause = "입력값의 자료형이 일치하지 않습니다.\n표 옆의 ? 버튼 눌러서 입력 형식을 확인하세요."
    }
    // 결과값 형식 확인
    else if (!testcases.every(testcase => data_type_regexs[returns.data_type.key].test(testcase.return))) {
        validation.fail_cause = "결과값의 자료형이 일치하지 않습니다.\n표 옆의 ? 버튼 눌러서 입력 형식을 확인하세요."
    }
    else {
        validation.valid = true;
    }

    return validation;
}