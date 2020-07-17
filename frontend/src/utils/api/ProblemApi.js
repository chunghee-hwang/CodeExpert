import languages from 'constants/Languages';
import axios from 'axios';
/**
 * 문제 유형, 레벨 목록 가져오기
 */
export const getProblemMetaData = () => {
    let response = {
        problem_types: [
            { id: 1, name: "정렬" },
            { id: 2, name: "스택/큐" },
            { id: 3, name: "동적 계획법" },
            { id: 4, name: "탐욕법" },
            { id: 5, name: "완전 탐색" },
            { id: 6, name: "힙" },
            { id: 7, name: "해시" },
            { id: 8, name: "기타" }],
        levels: [
            { id: 1, name: "1" },
            { id: 2, name: "2" },
            { id: 3, name: "3" },
            { id: 4, name: "4" },
        ],
        data_types: [
            { id: 1, name: "integer" },
            { id: 2, name: "integer_array" },
            { id: 3, name: "integer_2d_array" },
            { id: 4, name: "long" },
            { id: 5, name: "long_array" },
            { id: 6, name: "long_2d_array" },
            { id: 7, name: "double" },
            { id: 8, name: "double_array" },
            { id: 9, name: "double_2d_array" },
            { id: 10, name: "boolean" },
            { id: 11, name: "boolean_array" },
            { id: 12, name: "string" },
            { id: 13, name: "string_array" },
        ],
        languages: [
            { id: 1, name: 'java' },
            { id: 2, name: 'python3' },
            { id: 3, name: 'cpp' }
        ]
    }
    addLanguageDetailToMetaData(response)
    return response;
}

const addLanguageDetailToMetaData = (response) => {
    response.languages.forEach(language => {
        let corresponding_language = languages[language.name]
        language.ace_name = corresponding_language.ace_name;
        language.file_extension = corresponding_language.file_extension;
    });

}

/**
 * 문제 정보 가져오기(테스트케이스 정보 포함)
 */
export const getProblemData = ({ problem_id }) => {
    let response =
    {
        id: 1,
        title: "오름차순으로 정렬하기",
        type: {
            id: 3,
            name: "탐욕법"
        },
        explain: '파라미터로 int형 배열이 넘어오면,<div>오름차순으로 정렬 후, 문자열의 형태로 출력하는 프로그램을 작성하세요.</div><div><img src="https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg" class="attached_pic"><br></div><div>결과는 위 사진처럼 나오면 됩니다.</div>',
        limit_explain: "array의 원소 x: 1<=x<=<1000 인 자연수",
        time_limit: 500,
        memory_limit: 256,
        level: {
            id: 1,
            name: "1"
        },
        // 테스트케이스 
        testcase_table: { // answer_table
            params: [
                { name: 'array', data_type: { id: 2, name: "integer_array" }, },
            ],
            returns: {
                data_type: { id: 12, name: "string" },
            },
            testcases: [
                {
                    params: ['[1, 9, 7, 6]'],
                    returns: '"1-6-7-9"'
                },
                {
                    params: ['[2, 6, 3, 7]'],
                    returns: '"2-3-6-7"'
                }
            ]
        },
        input_output_table: { //example_table
            params: [
                { name: 'array', data_type: { id: 2, name: "integer_array" }, },
            ],
            returns: {
                data_type: { id: 12, name: "string" },
            },
            testcases: [
                {
                    params: ['[1, 9, 7, 6]'],
                    returns: '"1-6-7-9"'
                },
                {
                    params: ['[2, 6, 3, 7]'],
                    returns: '"2-3-6-7"'
                }
            ]
        },
        // 만든 사람
        creator: {
            id: 1,
            nickname: 'Hwaaaaa',
        }
    }


    return response;
}

/**
 * 문제 새로 등록 시, 새 문제 아이디 가져오기
 */
export const getNewProblemId = () => {
    return {
        problem_id: 2
    }
}

/**
 * 문제 이미지 업로드 요청
 */
export const uploadProblemImage = ({ problem_id, files }) => {
    return {
        images: [
            {
                problem_id: 2, // 이미지가 속한 문제의 아이디
                id: 13, // 이미지 아이디
                url: 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg'
            },
            {
                problem_id: 2,
                id: 14,
                url: 'https://www.codingfactory.net/wp-content/uploads/abc.jpg'
            }
        ]
    }
}

/**
 * 문제 정보와 최종 제출한 코드(또는 초기 코드) 정보가져오기 (테스트케이스 테이블 미포함)
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
            level: {
                id: 1,
                name: "1"
            },
            input_output_table: {
                params: [
                    { name: 'array', data_type: { id: 2, name: "integer_array" }, },
                ],
                returns: {
                    data_type: { id: 12, name: "string" },
                },
                testcases: [
                    {
                        params: ['[1, 9, 7, 6]'],
                        returns: '"1-6-7-9"'
                    },
                    {
                        params: ['[2, 6, 3, 7]'],
                        returns: '"2-3-6-7"'
                    }
                ]
            },
            // 만든 사람
            creator: {
                id: 1,
                nickname: 'hwang',
            }
        },
        codes: [
            {
                language: {
                    id: 1,
                    name: 'java'
                },
                init_code: "String solution(int[] array)\n{\n\treturn \"\";\n}",
            },
            {
                language: {
                    id: 2,
                    name: 'python3'
                },
                init_code: "def solution(array):\n\treturn ''",
                prev_code: "def solution(array):\n\treturn '-'.join(map(str, sorted(array)))"

            },
            {
                language: {
                    id: 3,
                    name: 'cpp'
                },
                init_code: "#include <vector>\n#include <string>\nusing namespace std;\nstring solution(vector<int> array)\n{\n\treturn \"\";\n}"
            }
        ]
    };
    addLanguageDetailToCodes(response.codes);
    return response;

}

const addLanguageDetailToCodes = (codes) => {
    codes.forEach(code => {
        let corresponding_language = languages[code.language.name]
        code.language.ace_name = corresponding_language.ace_name;
        code.language.file_extension = corresponding_language.file_extension;
    });
}

/**
 * 만든 문제 등록
 */
export const registerProblem = (data) => {
    console.log(data);
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
    return axios.post("/register_problem", data);

}

/**
 * 만든 문제 수정
 */
export const updateProblem = (data) => {
    /*
    [input_names.problem_id],
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
        update_success: true
    }

}

/**
 * 
 * 만든 문제 삭제 
 */
export const deleteProblem = ({ problem_id }) => {
    return {
        delete_success: true
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
                level: { id: 1, name: "1" },
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
                level: { id: 3, name: "3" },
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
                level: { id: 2, name: "2" },
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
                level: { id: 1, name: "1" },
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
                level: { id: 4, name: "4" },
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
                level: { id: 3, name: "3" },
                resolve_count: 5464,
                created_by_me: false,
                resolved: true,
            },
        ],
        max_page: 10

    }
}