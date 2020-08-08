import languages from 'constants/Languages';
import axios from 'axios';
import {graphQLFetch} from 'utils/GraphQLFetchManager';
/**
 * 문제 유형, 레벨 목록 가져오기
 */
export const getProblemMetaData = () => {
    return graphQLFetch(`
    {
        problemMetaData{
          problemTypes{id, name},
          problemLevels{id, name},
          dataTypes{id, name},
          languages{id, name}
        }
      }`, 
      "get").then(response=>{
            let problemMetaData = response.problemMetaData;
            addLanguageDetailToMetaData(problemMetaData);
            return problemMetaData;
      })
}

const addLanguageDetailToMetaData = (response) => {
    response.languages.forEach(language => {
        let correspondingLanguage = languages[language.name]
        language.aceName = correspondingLanguage.aceName;
        language.fileExtension = correspondingLanguage.fileExtension;
    });

}

/**
 * 문제 정보 가져오기(테스트케이스 정보 포함)
 */
export const getProblemData = ({ problemId }) => {
    let response =
    {
        id: 1,
        title: "오름차순으로 정렬하기",
        type: {
            id: 3,
            name: "탐욕법"
        },
        explain: '파라미터로 int형 배열이 넘어오면,<div>오름차순으로 정렬 후, 문자열의 형태로 출력하는 프로그램을 작성하세요.</div><div><img src="https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg" class="attached-pic"><br></div><div>결과는 위 사진처럼 나오면 됩니다.</div>',
        limitExplain: "array의 원소 x: 1<=x<=<1000 인 자연수",
        timeLimit: 500,
        memoryLimit: 256,
        level: {
            id: 1,
            name: "1"
        },
        // 테스트케이스 
        answerTable: { // exampleTable
            params: [
                { name: 'array', dataType: { id: 2, name: "integerArray" }, },
            ],
            returns: {
                dataType: { id: 12, name: "string" },
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
        exampleTable: { //exampleTable
            params: [
                { name: 'array', dataType: { id: 2, name: "integerArray" }, },
            ],
            returns: {
                dataType: { id: 12, name: "string" },
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
 * 문제 정보와 최종 제출한 코드(또는 초기 코드) 정보가져오기 (정답 테이블 미포함)
 */
export const getProblemDataAndCode = ({ problemId }) => {
    let response = {
        problem: {
            id: 1,
            title: "오름차순으로 정렬하기",
            type: {
                id: 1,
                name: "정렬"
            },
            explain: '파라미터로 int형 배열이 넘어오면,<div>오름차순으로 정렬 후, 문자열의 형태로 출력하는 프로그램을 작성하세요.</div><div><img src="https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg" class="attached-pic"><br></div><div>결과는 위 사진처럼 나오면 됩니다.</div>',
            limitExplain: "array의 원소 x: 1<=x<=<1000 인 자연수",
            timeLimit: 500,
            memoryLimit: 256,
            level: {
                id: 1,
                name: "1"
            },
            exampleTable: {
                params: [
                    { name: 'array', dataType: { id: 2, name: "integerArray" }, },
                ],
                returns: {
                    dataType: { id: 12, name: "string" },
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
                initCode: "String solution(int[] array)\n{\n\treturn \"\";\n}",
            },
            {
                language: {
                    id: 2,
                    name: 'python3'
                },
                initCode: "def solution(array):\n\treturn ''",
                prevCode: "def solution(array):\n\treturn '-'.join(map(str, sorted(array)))"

            },
            {
                language: {
                    id: 3,
                    name: 'cpp'
                },
                initCode: "#include <vector>\n#include <string>\nusing namespace std;\nstring solution(vector<int> array)\n{\n\treturn \"\";\n}"
            }
        ]
    };
    addLanguageDetailToCodes(response.codes);
    return response;

}

const addLanguageDetailToCodes = (codes) => {
    codes.forEach(code => {
        let correspondingLanguage = languages[code.language.name]
        code.language.aceName = correspondingLanguage.aceName;
        code.language.fileExtension = correspondingLanguage.fileExtension;
    });
}

/**
 * 만든 문제 등록
 */
export const registerProblem = (data) => {
    console.log(data);
    /*
    [inputNames.problemTitle],
    [inputNames.problemType],
    [inputNames.problemExplain],
    [inputNames.problemType],
    [inputNames.limitExplain],
    [inputNames.timeLimit],
    [inputNames.memoryLimit],
    [inputNames.level],
    [inputNames.answerTable],
    [inputNames.exampleTable],
    */
    return axios.post("/registerProblem", data);

}

/**
 * 만든 문제 수정
 */
export const updateProblem = (data) => {
    /*
    [inputNames.problemId],
    [inputNames.problemTitle],
    [inputNames.problemType],
    [inputNames.problemExplain],
    [inputNames.problemType],
    [inputNames.limitExplain],
    [inputNames.timeLimit],
    [inputNames.memoryLimit],
    [inputNames.level],
    [inputNames.answerTable],
    [inputNames.exampleTable],
    */

    return {
        updateSuccess: true
    }

}

/**
 * 
 * 만든 문제 삭제 
 */
export const deleteProblem = ({ problemId }) => {
    return {
        deleteSuccess: true
    }
}


/**
 * 코드 제출(채점)
 */
export const submitProblemCode = ({ problemId, submittedCode, languageId }) => {
    return [
        {
            success: true,
            intervalTime: 5.75,
            usedMemory: 50.9
        },
        {
            success: true,
            intervalTime: 31.20,
            usedMemory: 100.5
        },
        {
            success: true,
            intervalTime: 1.57,
            usedMemory: 12.9
        },
    ];
}

/**
 * 코드 리셋
 */
export const resetProblemCode = ({ problemId, languageId }) => {
    return {
        clearCodeSuccess: true
    }

}

/**
 * 문제 목록 가져오기
 */
export const getProblemList = ({ typeIds, levelIds, page }) => {

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
                resolveCount: 51891,
                createdByMe: true,
                resolved: true,
            },
            {
                id: 2, title: "미니 계산기",
                type:
                {
                    id: 2, name: "스택"
                },
                level: { id: 3, name: "3" },
                resolveCount: 424,
                createdByMe: false,
                resolved: true,
            },
            {
                id: 3, title: "동전 교환기",
                type:
                {
                    id: 4, name: "탐욕법"
                },
                level: { id: 2, name: "2" },
                resolveCount: 7901,
                createdByMe: false,
                resolved: false,
            },
            {
                id: 4, title: "짝 맞추기",
                type:
                {
                    id: 7, name: "해시"
                },
                level: { id: 1, name: "1" },
                resolveCount: 14791,
                createdByMe: false,
                resolved: false,
            },
            {
                id: 5, title: "공정 거래",
                type:
                {
                    id: 5, name: "완전 탐색"
                },
                level: { id: 4, name: "4" },
                resolveCount: 11,
                createdByMe: false,
                resolved: false,
            },
            {
                id: 6, title: "출력 대기열",
                type:
                {
                    id: 6, name: "힙"
                },
                level: { id: 3, name: "3" },
                resolveCount: 5464,
                createdByMe: false,
                resolved: true,
            },
        ],
        maxPage: 10

    }
}

export const getUserResolvedProblemCount=()=>{
    return graphQLFetch("{ userResolvedProblemCount }", "POST");
}