/**
* 코딩 문제에 쓰일 자료형들
* - key: dataTypes[integer.key] === dataTypes.integer
* - name: select 태그의 option에 사용될 자료형 이름
* - regex: 코딩 문제 등록 시, 자료형이 맞는지 확인하기 위한 정규표현식
*/
export const dataTypes =
{
    integer: {
        key: 'integer',
        name: 'int',
    },
    integerArray: {
        key: 'integerArray',
        name: 'int[]',
    },
    integer2dArray: {
        key: 'integer2dArray',
        name: 'int[][]',
    },
    long: {
        key: 'long',
        name: 'long',
    },
    longArray: {
        key: 'longArray',
        name: 'long[]',
    },
    long2dArray: {
        key: 'long2dArray',
        name: "long[][]",
    },
    double: {
        key: 'double',
        name: 'double',
    },
    doubleArray: {
        key: 'doubleArray',
        name: 'double[]',
    },
    double2dArray: {
        key: 'double2dArray',
        name: "double[][]",
    },
    boolean: {
        key: 'boolean',
        name: 'boolean'
    },
    booleanArray: {
        key: 'booleanArray',
        name: 'boolean[]'
    },
    string: {
        key: 'string',
        name: 'string',
    },
    stringArray: {
        key: 'stringArray',
        name: 'string[]',
    },
}