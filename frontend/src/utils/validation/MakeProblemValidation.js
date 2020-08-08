import { inputNames } from 'constants/FormInputNames';
import { dataTypeRegexs } from './Regexes';
export function validateMakeProblem(form, answerTableInfo, exampleTableInfo) {
    
    const problemExplainEditor = form.querySelector('#problem-explain-editor');
    const values = {
        [inputNames.problemTitle]: form[inputNames.problemTitle].value.trim(),
        [inputNames.problemTypeId]: form[inputNames.problemTypeId].value.trim(),
        [inputNames.problemExplain]: problemExplainEditor.innerHTML.trim(),
        [inputNames.problemTypeId]: form[inputNames.problemTypeId].value.trim(),
        [inputNames.limitExplain]: form[inputNames.limitExplain].value.trim(),
        [inputNames.timeLimit]: form[inputNames.timeLimit].value.trim(),
        [inputNames.memoryLimit]: form[inputNames.memoryLimit].value.trim(),
        [inputNames.problemLevelId]: form[inputNames.problemLevelId].value.trim(),
        [inputNames.answerTable]: answerTableInfo,
        [inputNames.exampleTable]: exampleTableInfo,
    };
    console.log(values);
    let validation = {
        isValid: false,
        failCause: null,
        failedElement: null,
        values
    }

    const validationAnswerTable = validateIoTable(answerTableInfo);
    const validationExampleTable = validateIoTable(exampleTableInfo);
    if (!values[inputNames.problemTitle]) {
        validation.failCause = '문제 제목을 입력해주세요.';
        validation.failedElement = form[inputNames.problemTitle];
    }
    else if (values[inputNames.problemTitle].length > 100) {
        validation.failCause = '문제 제목은 100자 이하로 입력해주세요.';
        validation.failedElement = form[inputNames.problemTitle];
    }
    else if (!values[inputNames.problemTypeId]) {
        validation.failCause = '문제 유형을 입력해주세요.';
        validation.failedElement = form[inputNames.problemTypeId];
    }
    else if (!values[inputNames.problemExplain]) {
        validation.failCause = '문제 설명을 입력해주세요.';
        validation.failedElement = problemExplainEditor;
    }
    else if (values[inputNames.problemExplain].length > 1000) {
        validation.failCause = '문제 설명은 1000자 이하로 입력해주세요.';
        validation.failedElement = problemExplainEditor;
    }
    else if (!values[inputNames.limitExplain]) {
        validation.failCause = '제한 사항을 입력해주세요.';
        validation.failedElement = form[inputNames.limitExplain];
    }
    else if (values[inputNames.limitExplain].length > 200) {
        validation.failCause = '제한 사항은 200자 이하로 입력해주세요.';
        validation.failedElement = form[inputNames.limitExplain];
    }
    else if (!values[inputNames.timeLimit]) {
        validation.failCause = '제한 시간을 입력해주세요';
        validation.failedElement = form[inputNames.timeLimit];
    }
    else if (values[inputNames.timeLimit].length > 5) {
        validation.failCause = '제한 시간은 5자 이하로 입력해주세요';
        validation.failedElement = form[inputNames.timeLimit];
    }
    else if (!/^\d+$/.test(values[inputNames.timeLimit].trim())) {
        validation.failCause = '제한 시간은 양의 정수로 입력해주세요';
        validation.failedElement = form[inputNames.timeLimit];
    }
    else if (!values[inputNames.memoryLimit]) {
        validation.failCause = '메모리 제한을 입력해주세요';
        validation.failedElement = form[inputNames.memoryLimit];
    }
    else if (values[inputNames.memoryLimit].length > 3) {
        validation.failCause = '메모리 제한은 3자 이하로 입력해주세요';
        validation.failedElement = form[inputNames.memoryLimit];
    }
    else if (!/^\d+$/.test(values[inputNames.memoryLimit].trim())) {
        validation.failCause = '메모리 제한은 양의 정수로 입력해주세요';
        validation.failedElement = form[inputNames.memoryLimit];
    }
    else if (!values[inputNames.problemLevelId]) {
        validation.failCause = '난이도를 입력해주세요';
        validation.failedElement = form[inputNames.problemLevelId];
    }
    else if (!validationAnswerTable.isValid) {
        validation.failCause = '테스트 케이스 테이블: ' + validationAnswerTable.failCause;
        validation.failedElement = document.getElementById('testcase-set-table');
    }
    else if (!validationExampleTable.isValid) {
        validation.failCause = '예시 테이블: ' + validationExampleTable.failCause;
        validation.failedElement = document.getElementById('io-ex-set-table');
    }
    else {
        validation.isValid = true;
    }
    return validation;
}

export function validateUpdateProblem(user, problem, form, answerTableInfo, exampleTableInfo) {
    const problemExplainEditor = form.querySelector('#problem-explain-editor');
    const values = {
        [inputNames.problemId]: problem.id,
        [inputNames.problemTitle]: form[inputNames.problemTitle].value.trim(),
        [inputNames.problemTypeId]: form[inputNames.problemTypeId].value.trim(),
        [inputNames.problemExplain]: problemExplainEditor.innerHTML.trim(),
        [inputNames.problemTypeId]: form[inputNames.problemTypeId].value.trim(),
        [inputNames.limitExplain]: form[inputNames.limitExplain].value.trim(),
        [inputNames.timeLimit]: form[inputNames.timeLimit].value.trim(),
        [inputNames.memoryLimit]: form[inputNames.memoryLimit].value.trim(),
        [inputNames.problemLevelId]: form[inputNames.problemLevelId].value.trim(),
        [inputNames.answerTable]: answerTableInfo,
        [inputNames.exampleTable]: exampleTableInfo,
    };
    let validation = {
        isValid: false,
        failCause: null,
        failedElement: null,
        values
    }

    const validationAnswerTable = validateIoTable(answerTableInfo);
    const validationExampleTable = validateIoTable(exampleTableInfo);
    if (!values[inputNames.problemId]) {
        validation.failCause = '문제 정보가 유효하지 않습니다.';
    } else if (!user || user.id !== problem.creator.id) {
        validation.failCause = '사용자님은 문제 제작자가 아닙니다.';
    }
    else if (!values[inputNames.problemTitle]) {
        validation.failCause = '문제 제목을 입력해주세요.';
        validation.failedElement = form[inputNames.problemTitle];
    }
    else if (values[inputNames.problemTitle].length > 100) {
        validation.failCause = '문제 제목은 100자 이하로 입력해주세요.';
        validation.failedElement = form[inputNames.problemTitle];
    }
    else if (!values[inputNames.problemTypeId]) {
        validation.failCause = '문제 유형을 입력해주세요.';
        validation.failedElement = form[inputNames.problemTypeId];
    }
    else if (!values[inputNames.problemExplain]) {
        validation.failCause = '문제 설명을 입력해주세요.';
        validation.failedElement = problemExplainEditor;
    }
    else if (values[inputNames.problemExplain].length > 1000) {
        validation.failCause = '문제 설명은 1000자 이하로 입력해주세요.';
        validation.failedElement = problemExplainEditor;
    }
    else if (!values[inputNames.limitExplain]) {
        validation.failCause = '제한 사항을 입력해주세요.';
        validation.failedElement = form[inputNames.limitExplain];
    }
    else if (values[inputNames.limitExplain].length > 200) {
        validation.failCause = '제한 사항은 200자 이하로 입력해주세요.';
        validation.failedElement = form[inputNames.limitExplain];
    }
    else if (!values[inputNames.timeLimit]) {
        validation.failCause = '제한 시간을 입력해주세요';
        validation.failedElement = form[inputNames.timeLimit];
    }
    else if (values[inputNames.timeLimit].length > 5) {
        validation.failCause = '제한 시간은 5자 이하로 입력해주세요';
        validation.failedElement = form[inputNames.timeLimit];
    }
    else if (!/^\d+$/.test(values[inputNames.timeLimit].trim())) {
        validation.failCause = '제한 시간은 양의 정수로 입력해주세요';
        validation.failedElement = form[inputNames.timeLimit];
    }
    else if (!values[inputNames.memoryLimit]) {
        validation.failCause = '메모리 제한을 입력해주세요';
        validation.failedElement = form[inputNames.memoryLimit];
    }
    else if (values[inputNames.memoryLimit].length > 3) {
        validation.failCause = '메모리 제한은 3자 이하로 입력해주세요';
        validation.failedElement = form[inputNames.memoryLimit];
    }
    else if (!/^\d+$/.test(values[inputNames.memoryLimit].trim())) {
        validation.failCause = '메모리 제한은 양의 정수로 입력해주세요';
        validation.failedElement = form[inputNames.memoryLimit];
    }
    else if (!values[inputNames.problemLevelId]) {
        validation.failCause = '난이도를 입력해주세요';
        validation.failedElement = form[inputNames.problemLevelId];
    }
    else if (!validationAnswerTable.isValid) {
        validation.failCause = '테스트 케이스 테이블: ' + validationAnswerTable.failCause;
        validation.failedElement = document.getElementById('testcase-set-table');
    }
    else if (!validationExampleTable.isValid) {
        validation.failCause = '예시 테이블: ' + validationExampleTable.failCause;
        validation.failedElement = document.getElementById('io-ex-set-table');
    }
    else {
        validation.isValid = true;
    }
    return validation;
}

export function validateDeleteProblem(user, problem) {
    const values = {
        [inputNames.problemId]: problem.id,
    };
    let validation = {
        isValid: false,
        failCause: null,
        values
    }

    if (!values[inputNames.problemId]) {
        validation.failCause = '문제 정보가 유효하지 않습니다.';
    } else if (!user || user.id !== problem.creator.id) {
        validation.failCause = '사용자님은 문제 제작자가 아닙니다.';
    } else {
        validation.isValid = true;
    }
    return validation;
}



function validateIoTable(tableInfo) {

    let validation = {
        failCause: null,
        isValid: false
    }

    // 파라미터 이름 정규식 (변수명 규칙)
    const valueNameRegex = /^[^0-9][\w]+$/
    let params = tableInfo.params;
    let returns = tableInfo.returns;
    let testcases = tableInfo.testcases;
    let paramNames = null;
    paramNames = params.reduce((ac, param) => { ac.push(param.name); return ac; }, []);
    // 파라미터 이름들 누락 확인
    if (!paramNames.every(paramName => paramName && paramName.length > 1)) {
        validation.failCause = "파라미터명은 두 글자 이상으로 입력해주세요."
    }
    // 파라미터의 자료형 누락 확인
    else if (!params.every(param => (param.dataType && param.dataType.id))) {
        validation.failCause = "파라미터의 자료형을 입력해주세요."
    }
    // 결과값의 자료형 누락 확인
    else if (!(returns.dataType && returns.dataType.id)) {
        validation.failCause = "결과값의 자료형을 입력해주세요."
    }
    // 입력값, 결과값 누락 확인
    else if (!testcases.every(testcase => (testcase.params.every(param => param) && testcase.returns))) {
        validation.failCause = "입력값 또는 결과값을 입력해주세요."
    }
    // 파라미터 이름 중복 확인
    else if (paramNames.length !== new Set(paramNames).size) {
        validation.failCause = "파라미터명은 서로 다르게 지어주세요."
    }
    // 파라미터 이름 형식 확인
    else if (!paramNames.every(paramName => valueNameRegex.test(paramName))) {
        validation.failCause = "파라미터명은 변수명 규칙을 따라주세요."
    }
    // 입력값 형식 확인
    else if (!testcases.every(testcase => testcase.params.every((value, idx) => dataTypeRegexs[params[idx].dataType.name].test(value)))) {
        validation.failCause = "입력값의 자료형이 일치하지 않습니다.\n표 옆의 ? 버튼 눌러서 입력 형식을 확인하세요."
    }
    // 결과값 형식 확인
    else if (!testcases.every(testcase => dataTypeRegexs[returns.dataType.name].test(testcase.returns))) {
        validation.failCause = "결과값의 자료형이 일치하지 않습니다.\n표 옆의 ? 버튼 눌러서 입력 형식을 확인하세요."
    }
    else {
        validation.isValid = true;
    }

    return validation;
}