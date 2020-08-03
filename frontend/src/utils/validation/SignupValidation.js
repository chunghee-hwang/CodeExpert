import { input_names } from "constants/FormInputNames";
import { id_regex, password_regex, nickname_regex } from './Regexes';
export function validateSignup(form) {
    const values = {
        [input_names.email]: form[input_names.email].value.trim(),
        [input_names.nickname]: form[input_names.nickname].value.trim(),
        [input_names.password]: form[input_names.password].value.trim(),
        [input_names.password_check]: form[input_names.password_check].value.trim()
    }
    let validation = {
        is_valid: false,
        fail_cause: null,
        failed_element: null,
        values
    }

    if (!values[input_names.email]) {
        validation.fail_cause = "아이디를 입력해주세요";
        validation.failed_element = form[input_names.email];
    }
    else if (!values[input_names.nickname]) {
        validation.fail_cause = "닉네임을 입력해주세요";
        validation.failed_element = form[input_names.nickname];
    }
    else if (!values[input_names.password] || !values[input_names.password_check]) {
        validation.fail_cause = "비밀번호와 비밀번호 확인을 입력해주세요";
        validation.failed_element = form[input_names.password];
    }
    else if (!nickname_regex.test(values[input_names.nickname])) {
        validation.fail_cause = "닉네임은 2자 이상 15자 이내로, 영어, 자음 모음 합쳐진 한글, 숫자만 입력 가능합니다.";
        validation.failed_element = form[input_names.nickname];
    }
    else if (!id_regex.test(values[input_names.email])) {
        validation.fail_cause = "아이디는 이메일 형식으로 입력해주세요.";
        validation.failed_element = form[input_names.email];
    }
    else if (!password_regex.test(values[input_names.password])) {
        validation.fail_cause = "비밀번호는 특수문자, 문자, 숫자를 포함하여 8~15자리 이내로 입력해주세요."
        validation.failed_element = form[input_names.password];
    }
    else if (values[input_names.password] !== values[input_names.password_check]) {
        validation.fail_cause = "비밀번호와 비밀번호 확인 입력값이 일치하지 않습니다."
        validation.failed_element = form[input_names.password];
    }
    else {
        validation.is_valid = true;
    }
    validation.values[input_names.nickname] = escape(values[input_names.nickname]);
    return validation;
}