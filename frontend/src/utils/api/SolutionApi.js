import languages from "constants/Languages";
export const getOthersSolutions = ({ problemId, languageId, page }) => {
    let response;
    if (page === 1) {
        response = {
            maxPageNumber: 3,
            problem: {
                id: problemId,
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
                        likeCount: 24,
                        isLikePressed: false
                    },
                    comments: []
                }]
        }
    }
    else {
        response = {
            maxPageNumber: 3,
            problem: {
                id: problemId,
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
                        likeCount: 24,
                        isLikePressed: false
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
                        likeCount: 24,
                        isLikePressed: false
                    },
                    comments: []
                }]
        };
    }

    addLanguageDetailToSolutions(response.solutions);
    return response;
}
export const registerComment = ({ commentContent, solutionId }) => {

    return {
        solutionId,
        comment: {
            id: 3,
            user: {
                id: 1,
                nickname: '사용자5',
            },
            timestamp: new Date(),
            content: commentContent
        }
    }
}
export const updateComment = ({ commentId, commentContent }) => {
    return {
        solutionId: 2,
        comment: {
            id: commentId,
            user: {
                id: 1,
                nickname: '사용자5',
            },
            timestamp: new Date(),
            content: commentContent
        }
    }
}
export const deleteComment = ({ commentId }) => {
    return {
        solutionId: 2,
        comment: {
            id: commentId,
        }
    }
}
export const likeOrCancelLike = ({ solutionId }) => {
    return {
        solutionId: solutionId,
        likes: {
            likeCount: 100,
            isLikePressed: true
        },
    }
}

const addLanguageDetailToSolutions = (solutions) => {
    solutions.forEach(solution => {
        let correspondingLanguage = languages[solution.language.name]
        solution.language.aceName = correspondingLanguage.aceName;
        solution.language.fileExtension = correspondingLanguage.fileExtension;
    });
}