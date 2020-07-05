import { input_names } from "constants/FormInputNames";
import { password_regex, nickname_regex } from './Regexes';
export function validateNewNickname(form, prev_nickname) {
    const values = {
        [input_names.nickname]: form[input_names.nickname].value.trim(),
    }
    let validation = {
        is_valid: false,
        fail_cause: null,
        failed_element: null,
        values
    }
    validation.failed_element = form[input_names.nickname];
    if (!values[input_names.nickname]) {
        validation.fail_cause = "닉네임을 입력해주세요";
    }
    else if (unescape(prev_nickname) === values[input_names.nickname]) {
        validation.fail_cause = "이전 닉네임과 새 닉네임이 일치합니다.";
    }
    else if (!nickname_regex.test(values[input_names.nickname])) {
        validation.fail_cause = "닉네임은 2자 이상 15자 이내로, 영어, 자음 모음 합쳐진 한글, 숫자만 입력 가능합니다.";
    }
    else {
        validation.is_valid = true;
    }

    validation.values[input_names.nickname] = escape(values[input_names.nickname]);
    return validation;
}

export function validateNewPassword(form) {
    const values = {
        [input_names.password]: form[input_names.password].value.trim(),
        [input_names.new_password]: form[input_names.new_password].value.trim(),
        [input_names.new_password_check]: form[input_names.new_password_check].value.trim()
    }
    let validation = {
        is_valid: false,
        fail_cause: null,
        failed_element: null,
        values
    }

    if (!values[input_names.password] || !values[input_names.new_password] || !values[input_names.new_password_check]) {
        validation.fail_cause = "비밀번호, 새로운 비밀번호, 비밀번호 확인은 필수 항목입니다.";
        validation.failed_element = form[input_names.password];
    }
    else if (!password_regex.test(values[input_names.new_password])) {
        validation.fail_cause = "비밀번호는 특수문자, 문자, 숫자를 포함하여 8~15자리 이내로 입력해주세요."
        validation.failed_element = form[input_names.new_password];
    }
    else if (values[input_names.new_password] !== values[input_names.new_password_check]) {
        validation.fail_cause = "새로운 비밀번호와 비밀번호 확인 입력값이 일치하지 않습니다."
        validation.failed_element = form[input_names.new_password_check];
    }
    else {
        validation.is_valid = true;
    }
    return validation;
}