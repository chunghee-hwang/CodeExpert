import languages from "constants/Languages";
export const getOthersSolutions = ({ problem_id, language_id, page }) => {
    let response;
    if (page === 1) {
        response = {
            max_page_number: 3,
            problem: {
                id: problem_id,
                title: '오름차순으로 정렬하기'
            },
            solutions:
                [{
                    id: 2,
                    user: {
                        id: 2,
                        nickname: '사용자2'
                    },
                    code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{50, 10}\n}",
                    language: {
                        id: 1,
                        name: 'java'
                    },
                    likes: {
                        like_count: 24,
                        is_like_pressed: false
                    },
                    comments: []
                }]
        }
    }
    else {
        response = {
            max_page_number: 3,
            problem: {
                id: problem_id,
                title: '오름차순으로 정렬하기'
            },
            solutions:
                [{
                    id: 1,
                    user: {
                        id: 1,
                        nickname: '사용자1'
                    },
                    code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{1, 2};\n}",
                    language: {
                        id: 1,
                        name: 'java'
                    },
                    likes: {
                        like_count: 24,
                        is_like_pressed: false
                    },
                    comments: [
                        {
                            id: 1,
                            user: {
                                id: 1,
                                nickname: '사용자2',
                            },
                            timestamp: new Date(),
                            content: '정말 간단하네요!'
                        },
                        {
                            id: 2,
                            user: {
                                id: 2,
                                nickname: '사용자3',
                            },
                            timestamp: new Date(),
                            content: 'map 함수가 뭔지 찾아봐야겠네요.'
                        },
                        {
                            id: 3,
                            user: {
                                id: 3,
                                nickname: '사용자3',
                            },
                            timestamp: new Date(),
                            content: 'sort와 sorted 함수의 차이가 뭔가요?'
                        }]
                },
                {
                    id: 2,
                    user: {
                        id: 2,
                        nickname: '사용자2'
                    },
                    code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{50, 10}\n}",
                    language: {
                        id: 1,
                        name: 'java'
                    },
                    likes: {
                        like_count: 24,
                        is_like_pressed: false
                    },
                    comments: []
                }]
        };
    }

    addLanguageDetailToSolutions(response.solutions);
    return response;
}
export const registerComment = ({ comment_content, solution_id }) => {

    return {
        solution_id,
        comment: {
            id: 3,
            user: {
                id: 1,
                nickname: '사용자5',
            },
            timestamp: new Date(),
            content: comment_content
        }
    }
}
export const updateComment = ({ comment_id, comment_content }) => {
    return {
        solution_id: 2,
        comment: {
            id: comment_id,
            user: {
                id: 1,
                nickname: '사용자5',
            },
            timestamp: new Date(),
            content: comment_content
        }
    }
}
export const deleteComment = ({ comment_id }) => {
    return {
        solution_id: 2,
        comment: {
            id: comment_id,
        }
    }
}
export const likeOrCancelLike = ({ solution_id }) => {
    return {
        solution_id: solution_id,
        likes: {
            like_count: 100,
            is_like_pressed: true
        },
    }
}

const addLanguageDetailToSolutions = (solutions) => {
    solutions.forEach(solution => {
        let corresponding_language = languages[solution.language.name]
        solution.language.ace_name = corresponding_language.ace_name;
        solution.language.file_extension = corresponding_language.file_extension;
    });
}