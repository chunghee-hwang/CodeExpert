import languages from 'constants/Languages';
import {graphQLFetch, objectToGraphQLObject} from 'utils/GraphQLFetchManager';
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
      }`).then(response=>{
            let problemMetaData = response.problemMetaData;
            addLanguageDetailToMetaData(problemMetaData);
            return problemMetaData;
      });
}

const addLanguageDetailToMetaData = (response) => {
    response.languages.forEach(language => {
        let correspondingLanguage = languages[language.name]
        language.aceName = correspondingLanguage.aceName;
        language.fileExtension = correspondingLanguage.fileExtension;
    });

}

/**
 * 문제 정보 가져오기(문제 수정하기 위해 테스트케이스 정보 포함)
 */
export const getProblemData = ({ problemId }) => {
    return graphQLFetch(`{problemDetail(problemId:${problemId}, exceptAnswerTable:false, checkCreatorIsValid:true)}`).then(res=>{
        return res.problemDetail.problem;
    });
}

/**
 * 문제 정보와 최종 제출한 코드(또는 초기 코드) 정보 가져오기 (정답 테이블 미포함)
 */
export const getProblemDataAndCode = ({ problemId }) => {
    return graphQLFetch(`{problemDetail(problemId:${problemId}, exceptAnswerTable:true, checkCreatorIsValid:false), problemCodes(problemId:${problemId})}`).then(res=>{
        let reformedResponse = {};
        reformedResponse.codes = res.problemCodes.codes;
        reformedResponse.problem = res.problemDetail.problem;
        addLanguageDetailToCodes(reformedResponse.codes);
        return reformedResponse;
    });
   

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
    return graphQLFetch(
    `mutation{
        registerOrUpdateProblem(isUpdate:false, request:${objectToGraphQLObject(data)}){id}
    }`);

}

/**
 * 만든 문제 수정
 */
export const updateProblem = (data) => {
   return graphQLFetch(
    `mutation{
        registerOrUpdateProblem(isUpdate:true, request:${objectToGraphQLObject(data)}){id}
    }`,);

}

/**
 * 
 * 만든 문제 삭제 
 */
export const deleteProblem = ({ problemId }) => {
    return graphQLFetch(
        `mutation{
            deleteProblem(problemId:${problemId}){id}
        }`
    );
}


/**
 * 코드 제출(채점)
 */
export const submitProblemCode = ({ problemId, submittedCode, languageId }) => {
    submittedCode = submittedCode.replace(/\+/g, "$plus;");
    submittedCode = encodeURI(submittedCode);
    return graphQLFetch(
        `mutation{
            submitProblemCode(problemId:${problemId}, submittedCode:"${submittedCode}", languageId:${languageId})
          }`
    ).then(res=>{
        return res.submitProblemCode;
    });
}

/**
 * 코드 리셋
 */
export const resetProblemCode = ({ problemId, languageId }) => {
    return graphQLFetch(
    `mutation{
        resetCode(problemId:${problemId}, languageId:${languageId}){
            id, language{id, name}, isInitCode
        }
    }`).then(res=>{
        return res.resetCode;
    });

}

/**
 * 문제 목록 가져오기
 */
export const getProblemList = ({ typeIds, levelIds, page }) => {
    return graphQLFetch(`{problemList(typeIds:${JSON.stringify(typeIds)}, levelIds:${JSON.stringify(levelIds)}, page:${page})}`).then(response=>{
        return response.problemList;
  });
}

export const getUserResolvedProblemCount=()=>{
    return graphQLFetch("{ userResolvedProblemCount }");
}