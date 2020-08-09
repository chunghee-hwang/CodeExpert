export const idRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
export const passwordRegex = /^.*(?=^.{8,30}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/; //특수문자 / 문자 / 숫자 포함 형태의 8~30자리 이내의 암호 정규식
export const nicknameRegex = /^[a-zA-Z가-힣0-9|\s]{2,15}$/

// 자료형 정규식
export const dataTypeRegexs = {
    integer: /^[+-]?\d+$/,
    integerArray: /^\[([+-]?\d+(,)?(\s)?)*\]$/,
    integer2dArray: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    long: /^\d+$/,
    longArray: /^\[([+-]?\d+(,)?(\s)?)*\]$/,
    long2dArray: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    double: /^[+-]?\d+(.)?(\d+)?$/,
    doubleArray: /^\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\]$/,
    double2dArray: /^\[(\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    boolean: /^(true|false)$/,
    booleanArray: /^\[((true|false)(,)?(\s)?)*\]$/,
    string: /^"[^"]*"$/,
    stringArray: /^\[("[^"]*"(,)?(\s)?)*\]$/,
}

// URL regex
export const integerParamRegex = /^\d+$/;