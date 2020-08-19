import { inputNames } from "constants/FormInputNames";

const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
const passwordRegex = /^.*(?=^.{8,30}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/; //특수문자 / 문자 / 숫자 포함 형태의 8~30자리 이내의 암호 정규식
const nicknameRegex = /^[a-zA-Z가-힣0-9]{2,15}$/

export function validateNewNickname(form, prevNickname) {
    const values = {
        [inputNames.newNickname]: form[inputNames.newNickname].value.trim(),
    }
    let validation = {
        isValid: false,
        failCause: null,
        failedElement: null,
        values
    }
    validation.failedElement = form[inputNames.newNickname];
    // if (!values[inputNames.newNickname]) {
    //     validation.failCause = "닉네임을 입력해주세요";
    // }
    // else if (decodeURI(prevNickname) === values[inputNames.newNickname]) {
    //     validation.failCause = "이전 닉네임과 새 닉네임이 일치합니다.";
    // }
    // else if (!nicknameRegex.test(values[inputNames.newNickname])) {
    //     validation.failCause = "닉네임은 2자 이상 15자 이내로, 영어, 자음 모음 합쳐진 한글, 숫자만 입력 가능합니다.";
    // }
    // else
     {
        validation.isValid = true;
    }

    validation.values[inputNames.newNickname] = encodeURI(values[inputNames.newNickname]);
    return validation;
}

export function validateNewPassword(form) {
    const values = {
        [inputNames.password]: form[inputNames.password].value.trim(),
        [inputNames.newPassword]: form[inputNames.newPassword].value.trim(),
        [inputNames.newPasswordCheck]: form[inputNames.newPasswordCheck].value.trim()
    }
    let validation = {
        isValid: false,
        failCause: null,
        failedElement: null,
        values
    }

    if (!values[inputNames.password] || !values[inputNames.newPassword] || !values[inputNames.newPasswordCheck]) {
        validation.failCause = "비밀번호, 새로운 비밀번호, 비밀번호 확인은 필수 항목입니다.";
        validation.failedElement = form[inputNames.password];
    }
    else if (!passwordRegex.test(values[inputNames.newPassword])) {
        validation.failCause = "비밀번호는 특수문자, 문자, 숫자를 포함하여 8~15자리 이내로 입력해주세요."
        validation.failedElement = form[inputNames.newPassword];
    }
    else if (values[inputNames.newPassword] !== values[inputNames.newPasswordCheck]) {
        validation.failCause = "새로운 비밀번호와 비밀번호 확인 입력값이 일치하지 않습니다."
        validation.failedElement = form[inputNames.newPasswordCheck];
    }
    else 
    {
        validation.isValid = true;
    }
    return validation;
}

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
    } else if (!emailRegex.test(values[inputNames.email])) {
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
    else if (!emailRegex.test(values[inputNames.email])) {
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
    else 
    {
        validation.isValid = true;
    }
    validation.values[inputNames.nickname] = encodeURI(values[inputNames.nickname]);
    return validation;
}