import { input_names } from "constants/FormInputNames";
import { id_regex, password_regex } from './Regexes';
export function validateLogin(form) {
    const values = {
        [input_names.email]: form[input_names.email].value.trim(),
        [input_names.password]: form[input_names.password].value.trim()
    }
    let validation = {
        is_valid: false,
        fail_cause: null,
        failed_element: null,
        values
    }
    if (!values[input_names.email] || !values[input_names.password]) {
        validation.fail_cause = "아이디 또는 비밀번호를 입력해주세요.";
        validation.failed_element = form[input_names.email];
    } else if (!id_regex.test(values[input_names.email])) {
        validation.fail_cause = "아이디는 이메일 형식으로 입력해주세요.";
    }
    else if (!password_regex.test(values[input_names.password])) {
        validation.fail_cause = "아이디 또는 비밀번호를 확인해주세요."
    }
    else {
        validation.is_valid = true;
    }

    return validation;
}