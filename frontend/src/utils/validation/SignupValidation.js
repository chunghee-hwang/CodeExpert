import { inputNames } from "constants/FormInputNames";
import { idRegex, passwordRegex, nicknameRegex } from './CodeValidation';
export function validateSignup(form) {
    const values = {
        [inputNames.email]: form[inputNames.email].value.trim(),
        [inputNames.nickname]: form[inputNames.nickname].value.trim(),
        [inputNames.password]: form[inputNames.password].value.trim(),
        [inputNames.passwordCheck]: form[inputNames.passwordCheck].value.trim()
    }
    let validation = {
        isValid: false,
        failCause: null,
        failedElement: null,
        values
    }

    if (!values[inputNames.email]) {
        validation.failCause = "아이디를 입력해주세요";
        validation.failedElement = form[inputNames.email];
    }
    else if (!values[inputNames.nickname]) {
        validation.failCause = "닉네임을 입력해주세요";
        validation.failedElement = form[inputNames.nickname];
    }
    else if (!values[inputNames.password] || !values[inputNames.passwordCheck]) {
        validation.failCause = "비밀번호와 비밀번호 확인을 입력해주세요";
        validation.failedElement = form[inputNames.password];
    }
    else if (!nicknameRegex.test(values[inputNames.nickname])) {
        validation.failCause = "닉네임은 2자 이상 15자 이내로, 영어, 자음 모음 합쳐진 한글, 숫자만 입력 가능합니다.";
        validation.failedElement = form[inputNames.nickname];
    }
    else if (!idRegex.test(values[inputNames.email])) {
        validation.failCause = "아이디는 이메일 형식으로 입력해주세요.";
        validation.failedElement = form[inputNames.email];
    }
    else if (!passwordRegex.test(values[inputNames.password])) {
        validation.failCause = "비밀번호는 특수문자, 문자, 숫자를 포함하여 8~15자리 이내로 입력해주세요."
        validation.failedElement = form[inputNames.password];
    }
    else if (values[inputNames.password] !== values[inputNames.passwordCheck]) {
        validation.failCause = "비밀번호와 비밀번호 확인 입력값이 일치하지 않습니다."
        validation.failedElement = form[inputNames.password];
    }
    else {
        validation.isValid = true;
    }
    validation.values[inputNames.nickname] = encodeURI(values[inputNames.nickname]);
    return validation;
}