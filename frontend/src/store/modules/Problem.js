import { put, takeEvery, call } from 'redux-saga/effects';
import { handleActions, createAction } from 'redux-actions';
import * as ProblemApi from 'utils/api/ProblemApi';
import { getErrorMessageFromResponse } from 'utils/ErrorHandler';
const GET_PROBLEM_META_DATA = "GET_PROBLEM_META_DATA"; // 문제 유형, 레벨 목록 가져오기
const GET_PROBLEM_META_DATA_SUCCESS = "GET_PROBLEM_META_DATA_SUCCESS";
const GET_PROBLEM_META_DATA_FAILURE = "GET_PROBLEM_META_DATA_FAILURE";

const GET_PROBLEM_DATA = "GET_PROBLEM_DATA"; // 문제 정보 가져오기
const GET_PROBLEM_DATA_SUCCESS = "GET_PROBLEM_DATA_SUCCESS";
const GET_PROBLEM_DATA_FAILURE = "GET_PROBLEM_DATA_FAILURE";

const GET_PROBLEM_DATA_AND_CODE = "GET_PROBLEM_DATA_AND_CODE"; // 문제 정보와 최종 제출한 코드(또는 초기 코드) 정보가져오기
const GET_PROBLEM_DATA_AND_CODE_SUCCESS = "GET_PROBLEM_DATA_AND_CODE_SUCCESS";
const GET_PROBLEM_DATA_AND_CODE_FAILURE = "GET_PROBLEM_DATA_AND_CODE_FAILURE";

const REGISTER_PROBLEM = "REGISTER_PROBLEM"; // 만든 문제 등록
const REGISTER_PROBLEM_SUCCESS = "REGISTER_PROBLEM_SUCCESS";
const REGISTER_PROBLEM_FAILURE = "REGISTER_PROBLEM_FAILURE";

const UPDATE_PROBLEM = "UPDATE_PROBLEM"; // 만든 문제 수정
const UPDATE_PROBLEM_SUCCESS = "UPDATE_PROBLEM_SUCCESS";
const UPDATE_PROBLEM_FAILURE = "UPDATE_PROBLEM_FAILURE";

const DELETE_PROBLEM = "DELETE_PROBLEM"; // 만든 문제 삭제
const DELETE_PROBLEM_SUCCESS = "DELETE_PROBLEM_SUCCESS";
const DELETE_PROBLEM_FAILURE = "DELETE_PROBLEM_FAILURE";

const SUBMIT_PROBLEM_CODE = "SUBMIT_PROBLEM_CODE"; // 코드 제출(채점)
const SUBMIT_PROBLEM_CODE_SUCCESS = "SUBMIT_PROBLEM_CODE_SUCCESS";
const SUBMIT_PROBLEM_CODE_FAILURE = "SUBMIT_PROBLEM_CODE_FAILURE";

const CLEAR_SUBMIT_RESULTS = "CLEAR_SUBMIT_RESULTS"; // 채점 데이터 지우기

const RESET_PROBLEM_CODE = "RESET_PROBLEM_CODE"; // 문제 코드 초기화
const RESET_PROBLEM_CODE_SUCCESS = "RESET_PROBLEM_CODE_SUCCESS";
const RESET_PROBLEM_CODE_FAILURE = "RESET_PROBLEM_CODE_FAILURE";

const GET_PROBLEM_LIST = "GET_PROBLEM_LIST"; //문제 목록 가져오기
const GET_PROBLEM_LIST_SUCCESS = "GET_PROBLEM_LIST_SUCCESS";
const GET_PROBLEM_LIST_FAILURE = "GET_PROBLEM_LIST_FAILURE";

const GET_USER_RESOLVED_PROBLEM_COUNT = "GET_USER_RESOLVED_PROBLEM_COUNT"; //사용자가 푼 문제 수 가져오기
const GET_USER_RESOLVED_PROBLEM_COUNT_SUCCESS = "GET_USER_RESOLVED_PROBLEM_COUNT_SUCCESS";
const GET_USER_RESOLVED_PROBLEM_COUNT_FAILURE = "GET_USER_RESOLVED_PROBLEM_COUNT_FAILURE";

const CLEAR_PROBLEM_LIST = "CLEAR_PROBLEM_LIST"; // 문제 목록 초기화
const CLEAR_WHICH = "CLEAR_WHICH";
const UPDATE_CODE_FROM_PROBLEM_DATA="UPDATE_CODE_FROM_PROBLEM_DATA"; // 코드 채점 전에 스토어에 있는 코드 정보 수정
const UPDATE_CODE_FROM_PROBLEM_DATA_SUCCESS="UPDATE_CODE_FROM_PROBLEM_DATA_SUCCESS";
const UPDATE_CODE_FROM_PROBLEM_DATA_FAILURE="UPDATE_CODE_FROM_PROBLEM_DATA_FAILURE";
export const getProblemMetaData = createAction(GET_PROBLEM_META_DATA);
export const getProblemData = createAction(GET_PROBLEM_DATA, data => data);
export const getProblemDataAndCode = createAction(GET_PROBLEM_DATA_AND_CODE, data => data);
export const registerProblem = createAction(REGISTER_PROBLEM, data => data);
export const updateProblem = createAction(UPDATE_PROBLEM, data => data);
export const deleteProblem = createAction(DELETE_PROBLEM, data => data);
export const submitProblemCode = createAction(SUBMIT_PROBLEM_CODE, data => data);
export const resetProblemCode = createAction(RESET_PROBLEM_CODE, data => data);
export const getProblemList = createAction(GET_PROBLEM_LIST, data => data);
export const getUserResolvedProblemCount = createAction(GET_USER_RESOLVED_PROBLEM_COUNT);
export const clearProblemList = createAction(CLEAR_PROBLEM_LIST);
export const clearSubmitResults = createAction(CLEAR_SUBMIT_RESULTS);
export const clearWhich = createAction(CLEAR_WHICH);
export const updateCodeFromProblemData = createAction(UPDATE_CODE_FROM_PROBLEM_DATA, data=>data);
function* getProblemMetaDataSaga(action) {
    try {
        const response = yield call(ProblemApi.getProblemMetaData);
        yield put({ type: GET_PROBLEM_META_DATA_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_PROBLEM_META_DATA_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}
function* getProblemDataSaga(action) {
    try {
        const response = yield call(ProblemApi.getProblemData, action.payload);
        yield put({ type: GET_PROBLEM_DATA_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_PROBLEM_DATA_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* getProblemDataAndCodeSaga(action) {
    try {
        const response = yield call(ProblemApi.getProblemDataAndCode, action.payload);
        yield put({ type: GET_PROBLEM_DATA_AND_CODE_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_PROBLEM_DATA_AND_CODE_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* registerProblemSaga(action) {
    try {
        const response = yield call(ProblemApi.registerProblem, action.payload);
        yield put({ type: REGISTER_PROBLEM_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: REGISTER_PROBLEM_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* updateProblemSaga(action) {
    try {
        const response = yield call(ProblemApi.updateProblem, action.payload);
        yield put({ type: UPDATE_PROBLEM_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: UPDATE_PROBLEM_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* deleteProblemSaga(action) {
    try {
        const response = yield call(ProblemApi.deleteProblem, action.payload);
        yield put({ type: DELETE_PROBLEM_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: DELETE_PROBLEM_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* submitProblemCodeSaga(action) {
    try {
        const response = yield call(ProblemApi.submitProblemCode, action.payload);
        yield put({ type: SUBMIT_PROBLEM_CODE_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: SUBMIT_PROBLEM_CODE_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* resetProblemCodeSaga(action) {
    try {
        const response = yield call(ProblemApi.resetProblemCode, action.payload);
        yield put({ type: RESET_PROBLEM_CODE_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: RESET_PROBLEM_CODE_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* getProblemListSaga(action) {
    try {
        const response = yield call(ProblemApi.getProblemList, action.payload);
        yield put({ type: GET_PROBLEM_LIST_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_PROBLEM_LIST_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}
function* getUserResolvedProblemCountSaga(action){
    try{
        const response = yield call(ProblemApi.getUserResolvedProblemCount);
        yield put({ type: GET_USER_RESOLVED_PROBLEM_COUNT_SUCCESS, payload: response });
    }catch(e){
        yield put({ type: GET_USER_RESOLVED_PROBLEM_COUNT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}
function* updateCodeFromProblemDataSaga(action){
    try{
        yield put({ type: UPDATE_CODE_FROM_PROBLEM_DATA_SUCCESS, payload: action.payload });
    }catch(e){
        yield put({ type: UPDATE_CODE_FROM_PROBLEM_DATA_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

export function* problemSaga() {
    yield takeEvery(GET_PROBLEM_META_DATA, getProblemMetaDataSaga);
    yield takeEvery(GET_PROBLEM_DATA, getProblemDataSaga);
    yield takeEvery(GET_PROBLEM_DATA_AND_CODE, getProblemDataAndCodeSaga);
    yield takeEvery(REGISTER_PROBLEM, registerProblemSaga);
    yield takeEvery(UPDATE_PROBLEM, updateProblemSaga);
    yield takeEvery(DELETE_PROBLEM, deleteProblemSaga);
    yield takeEvery(SUBMIT_PROBLEM_CODE, submitProblemCodeSaga);
    yield takeEvery(RESET_PROBLEM_CODE, resetProblemCodeSaga);
    yield takeEvery(GET_PROBLEM_LIST, getProblemListSaga);
    yield takeEvery(GET_USER_RESOLVED_PROBLEM_COUNT, getUserResolvedProblemCountSaga);
    yield takeEvery(UPDATE_CODE_FROM_PROBLEM_DATA, updateCodeFromProblemDataSaga);
}

const initialState = {
    isProgressing: false,
    isSuccess: false,
    data: {},
    which: null
};

export default handleActions({
    [GET_PROBLEM_META_DATA]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'problemMetaData'
        }
    },
    [GET_PROBLEM_META_DATA_SUCCESS]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                problemMetaData: action.payload
            },
            which: 'problemMetaData'
        };
    },
    [GET_PROBLEM_META_DATA_FAILURE]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: false,
            which: 'problemMetaData',
            data:{
                ...state.data,
                failCause: action.payload
            }
        };
    },

    [GET_PROBLEM_DATA]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'problemData',

        }
    },
    [GET_PROBLEM_DATA_SUCCESS]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                problemData: action.payload
            },
            which: 'problemData'
        };
    },
    [GET_PROBLEM_DATA_FAILURE]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: false,
            which: 'problemData',
            data:{
                ...state.data,
                failCause: action.payload
            }
        };
    },

    [GET_PROBLEM_DATA_AND_CODE]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which:"problemDataAndCode",
        }
    },
    [GET_PROBLEM_DATA_AND_CODE_SUCCESS]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                problemDataAndCode: action.payload
            },
            which:"problemDataAndCode",
            
        };
    },
    [GET_PROBLEM_DATA_AND_CODE_FAILURE]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: false,
            data:{
                ...state.data,
                failCause: action.payload
            },
            which:"problemDataAndCode",
        };
    },

    [REGISTER_PROBLEM]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'registerProblem'
        }
    },
    [REGISTER_PROBLEM_SUCCESS]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: true,
            which: 'registerProblem'
        };
    },
    [REGISTER_PROBLEM_FAILURE]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: false,
            which: 'registerProblem',
            data: {
                ...state.data,
                failCause: action.payload
            },
        };
    },

    [UPDATE_PROBLEM]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'updateProblem'
        }
    },
    [UPDATE_PROBLEM_SUCCESS]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: true,
            which: 'updateProblem'
        };
    },
    [UPDATE_PROBLEM_FAILURE]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: false,
            which: 'updateProblem',
            data: {
                ...state.data,
                failCause: action.payload
            },
        };
    },

    [DELETE_PROBLEM]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'deleteProblem'
        }
    },
    [DELETE_PROBLEM_SUCCESS]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: true,
            which: 'deleteProblem'
        };
    },
    [DELETE_PROBLEM_FAILURE]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: false,
            which: 'deleteProblem',
            data: {
                ...state.data,
                failCause: action.payload
            },
        };
    },
    [SUBMIT_PROBLEM_CODE]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            data: {
                ...state.data,
                submitResults: null
            },
            which: 'submitProblemCode'
        }
    },
    [SUBMIT_PROBLEM_CODE_SUCCESS]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                submitResults: action.payload
            },
            which: 'submitProblemCode'
        };
    },
    [SUBMIT_PROBLEM_CODE_FAILURE]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: false,
            which: 'submitProblemCode'
        };
    },

    [RESET_PROBLEM_CODE]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'resetProblemCode'
        }
    },
    [RESET_PROBLEM_CODE_SUCCESS]: (state, action) => {
        let newData = {...state.data, submitResults: null};
        const code = action.payload;
        if(code){
            const languageId = code.language.id;
            const matchedIndex = newData.problemDataAndCode.codes.findIndex(code=>code.language.id === languageId);
            if(matchedIndex !== -1){
                newData.problemDataAndCode.codes.splice(matchedIndex, 1);
            }
        }
        return {
            isProgressing: false,
            isSuccess: true,
            data: newData,
            which: 'resetProblemCode'
        };
    },
    [RESET_PROBLEM_CODE_FAILURE]: (state, action) => {
        debugger;
        return {
            ...state,
            isProgressing: false,
            isSuccess: false,
            which: 'resetProblemCode'
        };
    },

    [GET_PROBLEM_LIST]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which:"problemList",
            data: {
                ...state.data,
                filters: action.payload
            }
        }
    },
    [GET_PROBLEM_LIST_SUCCESS]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: true,
            which:"problemList",
            data: {
                ...state.data,
                problemsAndMaxPage: action.payload
            }
        };
    },
    [GET_PROBLEM_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: false,
            which:"problemList",
        };
    },
    [GET_USER_RESOLVED_PROBLEM_COUNT]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which:"userResolvedProblemCount",
            data: {
                ...state.data,
            }
        }
    },
    [GET_USER_RESOLVED_PROBLEM_COUNT_SUCCESS]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: true,
            which:"userResolvedProblemCount",
            data: {
                ...state.data,
                userResolvedProblemCount: action.payload.userResolvedProblemCount
            }
        };
    },
    [GET_USER_RESOLVED_PROBLEM_COUNT_FAILURE]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: false,
            which:"userResolvedProblemCount",
        };
    },
    [CLEAR_PROBLEM_LIST]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                problemsAndMaxPage: null

            }
        }
    },
    [CLEAR_SUBMIT_RESULTS]: (state, action) => {
        return {
            ...state,
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                submitResults: null
            }
        }
    },
    [CLEAR_WHICH]:(state, action)=>{
        return {
            ...state,
            which:null
        }
    },
    [UPDATE_CODE_FROM_PROBLEM_DATA]: (state, action) => {
        return {
            ...state,
        }
    },
    [UPDATE_CODE_FROM_PROBLEM_DATA_SUCCESS]: (state, action) => {
        let newData = {...state.data};
        const {submittedCode, languageId} = action.payload;
        if(newData.problemDataAndCode){
            let foundCode = newData.problemDataAndCode.codes.find(code=>code.language.id === languageId);
            if(foundCode){
                foundCode.prevCode = submittedCode;
            }
        }
        return {
            ...state,
            data: newData
        };
    },
    [UPDATE_CODE_FROM_PROBLEM_DATA_FAILURE]: (state, action) => {
        return {
            ...state,
        };
    },

}, initialState);