export const id_regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
export const password_regex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/; //특수문자 / 문자 / 숫자 포함 형태의 8~15자리 이내의 암호 정규식
export const nickname_regex = /^[a-zA-Z가-힣0-9|\s]{2,15}$/

// 자료형 정규식
export const data_type_regexs = {
    integer: /^\d+$/,
    integer_array: /^\[([+-]?\d+(,)?(\s)?)*\]$/,
    integer_2d_array: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    long: /^\d+$/,
    long_array: /^\[([+-]?\d+(,)?(\s)?)*\]$/,
    long_2d_array: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    double: /^[+-]?\d+(.)?(\d+)?$/,
    double_array: /^\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\]$/,
    double_2d_array: /^\[(\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    boolean: /^(true|false)$/,
    boolean_array: /^\[((true|false)(,)?(\s)?)*\]$/,
    string: /^"[^"]*"$/,
    string_array: /^\[("[^"]*"(,)?(\s)?)*\]$/,
}