import languages from "constants/Languages";
import { graphQLFetch } from "utils/GraphQLFetchManager";
export const getOthersSolutions = ({ problemId, languageId, page }) => {
    return graphQLFetch(
        `{
            othersSolutions(problemId:${problemId}, languageId:${languageId}, page:${page})
            {
                maxPageNumber, 
                problem{id,title}, 
                solutions{
                    id, 
                    user{
                      id, nickname
                    },
                    code, 
                    language{
                      id,name
                    }, 
                    likes{
                      isLikePressed,likeCount
                    }, 
                    comments{
                      id, content, createdDate,modifiedDate,
                      user{id, nickname}
                    }
                }
            }
          }`
    ).then(res => {
        let othersSolutions = res.othersSolutions;
        addLanguageDetailToSolutions(othersSolutions.solutions);
        return othersSolutions;
    });
}
export const registerComment = ({ commentContent, solutionId }) => {
    return graphQLFetch(
        `mutation{
            registerComment(commentContent:"${commentContent}", solutionId:${solutionId})
        }`
    ).then(res => {
        return res.registerComment;
    });
}
export const updateComment = ({ commentId, commentContent }) => {
    return graphQLFetch(
        `mutation{
            updateComment(commentId:${commentId}, commentContent:"${commentContent}")
        }`
    ).then(res => {
        return res.updateComment;
    });
}
export const deleteComment = ({ commentId }) => {
    return graphQLFetch(
        `mutation{
            deleteComment(commentId:${commentId})
        }`
    ).then(res=>{
        return res.deleteComment;
    });
}
export const likeOrCancelLike = ({ solutionId }) => {
    return graphQLFetch(
        `mutation{
            likeOrCancelLike(solutionId:${solutionId})
        }`
    ).then(res=>{
        return res.likeOrCancelLike;
    });
}

const addLanguageDetailToSolutions = (solutions) => {
    solutions.forEach(solution => {
        let correspondingLanguage = languages[solution.language.name]
        solution.language.aceName = correspondingLanguage.aceName;
        solution.language.fileExtension = correspondingLanguage.fileExtension;
    });
}