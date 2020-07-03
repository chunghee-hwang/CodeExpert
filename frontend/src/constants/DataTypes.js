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
    },
    integer_array: {
        key: 'integer_array',
        name: 'int[]',
    },
    integer_2d_array: {
        key: 'integer_2d_array',
        name: 'int[][]',
    },
    long: {
        key: 'long',
        name: 'long',
    },
    long_array: {
        key: 'long_array',
        name: 'long[]',
    },
    long_2d_array: {
        key: 'long_2d_array',
        name: "long[][]",
    },
    double: {
        key: 'double',
        name: 'double',
    },
    double_array: {
        key: 'double_array',
        name: 'double[]',
    },
    double_2d_array: {
        key: 'double_2d_array',
        name: "double[][]",
    },
    boolean: {
        key: 'boolean',
        name: 'boolean'
    },
    boolean_array: {
        key: 'boolean_array',
        name: 'boolean[]'
    },
    string: {
        key: 'string',
        name: 'string',
    },
    string_array: {
        key: 'string_array',
        name: 'string[]',
    },
}