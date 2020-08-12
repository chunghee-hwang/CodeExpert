import { integerParamRegex } from 'utils/validation/CodeValidation';

/**
 * 다른 페이지로 이동하는 메소드
 * @param {*} history react-router-dom > BrowserRouter의 props.history
 * @param {string} url 요청 URL
 */
export const moveToPage = (history, url) => {
    history.push(url);
}

/**
 * /url?param=aa 처럼 URL에서 ?를 사용하는 파라미터를 가져오는 메소드
 * @param {string} paramName 파라미터 이름
 */
export const getQueryParameter = (paramName) => {
    return new URLSearchParams(window.location.search).get(paramName);
}

/**
 * getOptionalParameter와 같지만 파라미터가 정수형일 때만 가져오는 메소드
 * @param {string} paramName 
 * @returns 정수형 파라미터
 */
export const getIntegerQueryParameter = (paramName) => {
    const parameter = getQueryParameter(paramName);
    if (parameter && integerParamRegex.test(parameter)) return parameter;
    else return null;
}

/**
 * /url/aa 처럼 URL에서 /를 사용하는 파라미터를 가져오는 메소드
 * @param {Function} useParamsFunction react-router-dom > BrowserRouter > useParams 메소드
 * @param {string} paramName 파라미터 이름
 */
export const getIntegerPathParameter = (parameter) => {
    if (parameter && integerParamRegex.test(parameter)) return parameter;
    else return null;
}