/**
* 코딩 문제에 쓰일 자료형들
* - key: data_types[integer.key] === data_types.integer
* - name: select 태그의 option에 사용될 자료형 이름
* - regex: 코딩 문제 등록 시, 자료형이 맞는지 확인하기 위한 정규표현식
*/
export const data_types =
{
    integer: {
        key: 'integer',
        name: 'int',
        regex: /^\d+$/ // 범위 문제는 try parseInt catch로 잡는다.
    },
    integer_array: {
        key: 'integer_array',
        name: 'int[]',
        regex: /^\[([+-]?\d+(,)?(\s)?)*\]$/
    },
    integer_2d_array: {
        key: 'integer_2d_array',
        name: 'int[][]',
        regex: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/
    },
    long: {
        key: 'long',
        name: 'long',
        regex: /^\d+$/ // 범위 문제는 	–2,147,483,648 ~ 2,147,483,647 체크한다.

    },
    long_array: {
        key: 'long_array',
        name: 'long[]',
        regex: /^\[([+-]?\d+(,)?(\s)?)*\]$/
    },
    long_2d_array: {
        key: 'long_2d_array',
        name: "long[][]",
        regex: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/
    },
    double: {
        key: 'double',
        name: 'double',
        regex: /^[+-]?\d+(.)?(\d+)?$/
    },
    double_array: {
        key: 'double_array',
        name: 'double[]',
        regex: /^\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\]$/
    },
    double_2d_array: {
        key: 'double_2d_array',
        name: "double[][]",
        regex: /^\[(\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\](,)?(\s)?)*\]$/
    },
    string: {
        key: 'string',
        name: 'string',
        regex: /^"[^"]*"$/
    },
    string_array: {
        key: 'string_array',
        name: 'string[]',
        regex: /^\[("[^"]*"(,)?(\s)?)*\]$/
    }
}