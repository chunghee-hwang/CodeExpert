import { inputNames } from "constants/FormInputNames";
import { idRegex, passwordRegex } from './Regexes';
export function validateLogin(form) {
    const values = {
        [inputNames.email]: form[inputNames.email].value.trim(),
        [inputNames.password]: form[inputNames.password].value.trim()
    }
    let validation = {
        isValid: false,
        failCause: null,
        failedElement: null,
        values
    }
    if (!values[inputNames.email] || !values[inputNames.password]) {
        validation.failCause = "아이디 또는 비밀번호를 입력해주세요.";
        validation.failedElement = form[inputNames.email];
    } else if (!idRegex.test(values[inputNames.email])) {
        validation.failCause = "아이디는 이메일 형식으로 입력해주세요.";
    }
    else if (!passwordRegex.test(values[inputNames.password])) {
        validation.failCause = "아이디 또는 비밀번호를 확인해주세요."
    }
    else {
        validation.isValid = true;
    }

    return validation;
}