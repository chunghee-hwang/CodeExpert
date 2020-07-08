import { integer_param_regex } from 'utils/validation/Regexes';

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
 * @param {string} param_name 파라미터 이름
 */
export const getQueryParameter = (param_name) => {
    return new URLSearchParams(window.location.search).get(param_name);
}

/**
 * getOptionalParameter와 같지만 파라미터가 정수형일 때만 가져오는 메소드
 * @param {string} param_name 
 * @returns 정수형 파라미터
 */
export const getIntegerQueryParameter = (param_name) => {
    const parameter = getQueryParameter(param_name);
    if (parameter && integer_param_regex.test(parameter)) return parameter;
    else return null;
}

/**
 * /url/aa 처럼 URL에서 /를 사용하는 파라미터를 가져오는 메소드
 * @param {Function} use_params_function react-router-dom > BrowserRouter > useParams 메소드
 * @param {string} param_name 파라미터 이름
 */
export const getIntegerPathParameter = (use_params_function, param_name) => {
    if (!use_params_function) return null;
    const parameter = use_params_function()[param_name];
    if (parameter && integer_param_regex.test(parameter)) return parameter;
    else return null;
}