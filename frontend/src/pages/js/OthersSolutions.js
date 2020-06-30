import React from 'react';
function OthersSolution() {

    /**
     * fetch others_solutions
     */
    let problem = {
        title: '오름차순으로 정렬하기'
    }
    let solutions = [
        {
            user: {
                id: 1,
                name: '사용자1'
            },
            code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{1, 2};\n}",
            like: 100,
            comments: [
                {
                    user: {
                        id: 2,
                        name: '사용자2',
                    },
                    date: new Date(),
                    content: '정말 간단하네요!'
                },
                {
                    user: {
                        id: 3,
                        name: '사용자3',
                    },
                    date: new Date(),
                    content: 'map 함수가 뭔지 찾아봐야겠네요.'
                },
                {
                    user: {
                        id: 3,
                        name: '사용자3',
                    },
                    date: new Date(),
                    content: 'sort와 sorted 함수의 차이가 뭔가요?'
                },
            ]
        },
        {
            user: {
                id: 2,
                name: '사용자2'
            },
            code: "def solution(param1, param2):\n\treturn [1, 2]",
            like: 50,
            comments: [
                {
                    user: {
                        id: 1,
                        name: '사용자1',
                    },
                    date: new Date(),
                    content: '코드 잘 보고 갑니다!'
                }
            ]
        },

    ]


    return (
        <div>
            <h3>다른 사람의 풀이</h3>
            <h5>{problem.title}</h5>
        </div>
    );
}

export default OthersSolution;