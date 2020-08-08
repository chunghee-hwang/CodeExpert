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
 * 문제 정보 가져오기(테스트케이스 정보 포함)
 */
export const getProblemData = ({ problemId }) => {
    return graphQLFetch(`{problemDetail(problemId:${problemId})}`).then(res=>{
        return res.problemDetail.problem;
    });
}

/**
 * 문제 정보와 최종 제출한 코드(또는 초기 코드) 정보가져오기 (정답 테이블 미포함)
 */
export const getProblemDataAndCode = ({ problemId }) => {
    return graphQLFetch(`{problemDetail(problemId:${problemId}), problemCodes(problemId:${problemId})}`).then(res=>{
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
   
    return graphQLFetch(
    `mutation{
        registerOrUpdateProblem(isUpdate:false, request:${objectToGraphQLObject(data)}){id}
    }`);

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
    return graphQLFetch(`{problemList(typeIds:${JSON.stringify(typeIds)}, levelIds:${JSON.stringify(levelIds)}, page:${page})}`).then(response=>{
        return response.problemList;
  });
}

export const getUserResolvedProblemCount=()=>{
    return graphQLFetch("{ userResolvedProblemCount }");
}