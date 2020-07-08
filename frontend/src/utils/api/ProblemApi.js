import { data_types } from 'constants/DataTypes';
import languages from 'constants/Languages';
/**
 * 문제 유형, 레벨 목록 가져오기
 */
export const getProblemMetaData = () => {
    return {
        problem_types: [
            { id: 1, name: "정렬" },
            { id: 2, name: "스택/큐" },
            { id: 3, name: "동적 계획법" },
            { id: 4, name: "탐욕법" },
            { id: 5, name: "완전 탐색" },
            { id: 6, name: "힙" },
            { id: 7, name: "해시" },
            { id: 8, name: "기타" }],
        levels: [1, 2, 3, 4],
    }
}

/**
 * 문제 정보 가져오기
 */
export const getProblemData = ({ problem_id }) => {
    let response = {
        problem: {
            id: 1,
            title: "오름차순으로 정렬하기",
            type: {
                id: 1,
                name: "정렬"
            },
            explain: '파라미터로 int형 배열이 넘어오면,<div>오름차순으로 정렬 후, 문자열의 형태로 출력하는 프로그램을 작성하세요.</div><div><img src="https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg" class="attached_pic"><br></div><div>결과는 위 사진처럼 나오면 됩니다.</div>',
            limit_explain: "array의 원소 x: 1<=x<=<1000 인 자연수",
            time_limit: 500,
            memory_limit: 256,
            level: 1,
            input_output: {
                params: [
                    { name: 'array', data_type: 'integer_array' },
                ],
                return: {
                    data_type: 'string'
                },
                testcases: [
                    {
                        params: ['[1, 9, 7, 6]'],
                        return: '"1-6-7-9"'
                    },
                    {
                        params: ['[2, 6, 3, 7]'],
                        return: '"2-3-6-7"'
                    }
                ]
            }
        }
    }

    addDateTypeDetailToInputOutput(response.problem);

    return response;
}

/**
 * 문제 정보와 최종 제출한 코드(또는 초기 코드) 정보가져오기
 */
export const getProblemDataAndCode = ({ problem_id }) => {
    let response = {
        problem: {
            id: 1,
            title: "오름차순으로 정렬하기",
            type: {
                id: 1,
                name: "정렬"
            },
            explain: '파라미터로 int형 배열이 넘어오면,<div>오름차순으로 정렬 후, 문자열의 형태로 출력하는 프로그램을 작성하세요.</div><div><img src="https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg" class="attached_pic"><br></div><div>결과는 위 사진처럼 나오면 됩니다.</div>',
            limit_explain: "array의 원소 x: 1<=x<=<1000 인 자연수",
            time_limit: 500,
            memory_limit: 256,
            level: 1,
            input_output: {
                params: [
                    { name: 'array', data_type: 'integer_array' },
                ],
                return: {
                    data_type: 'string'
                },
                testcases: [
                    {
                        params: ['[1, 9, 7, 6]'],
                        return: '"1-6-7-9"'
                    },
                    {
                        params: ['[2, 6, 3, 7]'],
                        return: '"2-3-6-7"'
                    }
                ]
            }
        },
        codes: [
            {
                language: 'java',
                init_code: "String solution(int[] array)\n{\n\treturn \"\";\n}",
            },
            {
                language: 'python3',
                init_code: "def solution(array):\n\treturn ''",
                prev_code: "def solution(array):\n\treturn '-'.join(map(str, sorted(array)))"

            },
            {
                language: 'cpp',
                init_code: "#include <vector>\n#include <string>\nusing namespace std;\nstring solution(vector<int> array)\n{\n\treturn \"\";\n}"
            }
        ]
    };
    addDateTypeDetailToInputOutput(response.problem.input_output);
    addLanguageDetailToCodes(response.codes);
    return response;

}

const addDateTypeDetailToInputOutput = (input_output) => {
    input_output.params.forEach(param => {
        param.data_type = data_types[param.data_type];
    });
    input_output.return.data_type = data_types[input_output.return.data_type];
}

const addLanguageDetailToCodes = (codes) => {
    codes.forEach(code => {
        code.language = languages[code.language];
    });
}

/**
 * 만든 문제 등록
 */
export const registerProblem = (data) => {
    /*
    [input_names.problem_title],
    [input_names.problem_type],
    [input_names.problem_explain],
    [input_names.problem_type],
    [input_names.limit_explain],
    [input_names.time_limit],
    [input_names.memory_limit],
    [input_names.level],
    [input_names.testcase_table],
    [input_names.input_output_table],
    */

    return {
        register_success: true
    }

}

/**
 * 코드 제출(채점)
 */
export const submitProblemCode = ({ problem_id, submitted_code, language_id }) => {
    return [
        {
            success: true,
            interval_time: 5.75,
            used_memory: 50.9
        },
        {
            success: true,
            interval_time: 31.20,
            used_memory: 100.5
        },
        {
            success: true,
            interval_time: 1.57,
            used_memory: 12.9
        },
    ];
}

/**
 * 코드 리셋
 */
export const resetProblemCode = ({ problem_id }) => {
    return {
        clear_code_success: true
    }
}

/**
 * 문제 목록 가져오기
 */
export const getProblemList = ({ type, level, page }) => {
    return {
        //page가 0일때(지정되지 않았을 때) 데이터
        problems: [
            {
                id: 1, title: "오름차순으로 정렬하기",
                type:
                {
                    id: 1, name: "정렬"
                },
                level: 1,
                resolve_count: 51891,
                created_by_me: true,
                resolved: true,
            },
            {
                id: 2, title: "미니 계산기",
                type:
                {
                    id: 2, name: "스택"
                },
                level: 3,
                resolve_count: 424,
                created_by_me: false,
                resolved: true,
            },
            {
                id: 3, title: "동전 교환기",
                type:
                {
                    id: 4, name: "탐욕법"
                },
                level: 2,
                resolve_count: 7901,
                created_by_me: false,
                resolved: false,
            },
            {
                id: 4, title: "짝 맞추기",
                type:
                {
                    id: 7, name: "해시"
                },
                level: 1,
                resolve_count: 14791,
                created_by_me: false,
                resolved: false,
            },
            {
                id: 5, title: "공정 거래",
                type:
                {
                    id: 5, name: "완전 탐색"
                },
                level: 4,
                resolve_count: 11,
                created_by_me: false,
                resolved: false,
            },
            {
                id: 6, title: "출력 대기열",
                type:
                {
                    id: 6, name: "힙"
                },
                level: 3,
                resolve_count: 5464,
                created_by_me: false,
                resolved: true,
            },

        ],
        max_page: 3
    }
}