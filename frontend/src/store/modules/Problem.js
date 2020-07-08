import { delay, put, takeEvery, call } from 'redux-saga/effects';
import { handleActions, createAction } from 'redux-actions';
import * as ProblemApi from 'utils/api/ProblemApi';
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

const SUBMIT_PROBLEM_CODE = "SUBMIT_PROBLEM_CODE"; // 코드 제출(채점)
const SUBMIT_PROBLEM_CODE_SUCCESS = "SUBMIT_PROBLEM_CODE_SUCCESS";
const SUBMIT_PROBLEM_CODE_FAILURE = "SUBMIT_PROBLEM_CODE_FAILURE";

const RESET_PROBLEM_CODE = "RESET_PROBLEM_CODE"; // 문제 코드 초기화
const RESET_PROBLEM_CODE_SUCCESS = "RESET_PROBLEM_CODE_SUCCESS";
const RESET_PROBLEM_CODE_FAILURE = "RESET_PROBLEM_CODE_FAILURE";

const GET_PROBLEM_LIST = "GET_PROBLEM_LIST"; //문제 목록 가져오기
const GET_PROBLEM_LIST_SUCCESS = "GET_PROBLEM_LIST_SUCCESS";
const GET_PROBLEM_LIST_FAILURE = "GET_PROBLEM_LIST_FAILURE";

export const getProblemMetaData = createAction(GET_PROBLEM_META_DATA);
export const getProblemData = createAction(GET_PROBLEM_DATA, data => data);
export const getProblemDataAndCode = createAction(GET_PROBLEM_DATA_AND_CODE, data => data);
export const registerProblem = createAction(REGISTER_PROBLEM, data => data);
export const submitProblemCode = createAction(SUBMIT_PROBLEM_CODE, data => data);
export const resetProblemCode = createAction(RESET_PROBLEM_CODE, data => data);
export const getProblemList = createAction(GET_PROBLEM_LIST, data => data);
function* getProblemMetaDataSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.getProblemMetaData);
        yield put({ type: GET_PROBLEM_META_DATA_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_PROBLEM_META_DATA_FAILURE, payload: e.message });
    }
}
function* getProblemDataSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.getProblemData, action.payload);
        yield put({ type: GET_PROBLEM_DATA_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_PROBLEM_DATA_FAILURE, payload: e.message });
    }
}

function* getProblemDataAndCodeSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.getProblemDataAndCode, action.payload);
        yield put({ type: GET_PROBLEM_DATA_AND_CODE_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_PROBLEM_DATA_AND_CODE_FAILURE, payload: e.message });
    }
}

function* registerProblemSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.registerProblem, action.payload);
        yield put({ type: REGISTER_PROBLEM_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: REGISTER_PROBLEM_FAILURE, payload: e.message });
    }
}

function* submitProblemCodeSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.submitProblemCode, action.payload);
        yield put({ type: SUBMIT_PROBLEM_CODE_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: SUBMIT_PROBLEM_CODE_FAILURE, payload: e.message });
    }
}

function* resetProblemCodeSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.resetProblemCode, action.payload);
        yield put({ type: RESET_PROBLEM_CODE_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: RESET_PROBLEM_CODE_FAILURE, payload: e.message });
    }
}

function* getProblemListSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.getProblemList, action.payload);
        yield put({ type: GET_PROBLEM_LIST_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_PROBLEM_LIST_FAILURE, payload: e.message });
    }
}

export function* problemSaga() {
    yield takeEvery(GET_PROBLEM_META_DATA, getProblemMetaDataSaga);
    yield takeEvery(GET_PROBLEM_DATA, getProblemDataSaga);
    yield takeEvery(GET_PROBLEM_DATA_AND_CODE, getProblemDataAndCodeSaga);
    yield takeEvery(REGISTER_PROBLEM, registerProblemSaga);
    yield takeEvery(SUBMIT_PROBLEM_CODE, submitProblemCodeSaga);
    yield takeEvery(RESET_PROBLEM_CODE, resetProblemCodeSaga);
    yield takeEvery(GET_PROBLEM_LIST, getProblemListSaga);
}

const initial_state = {
    is_progressing: false,
    is_success: false,
    data: {},
    which: null
};

export default handleActions({
    [GET_PROBLEM_META_DATA]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
        }
    },
    [GET_PROBLEM_META_DATA_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                problem_meta_data: action.payload
            }
        };
    },
    [GET_PROBLEM_META_DATA_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
        };
    },

    [GET_PROBLEM_DATA]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
        }
    },
    [GET_PROBLEM_DATA_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                problem_data: action.payload
            }
        };
    },
    [GET_PROBLEM_DATA_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
        };
    },

    [GET_PROBLEM_DATA_AND_CODE]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
        }
    },
    [GET_PROBLEM_DATA_AND_CODE_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                problem_data_and_code: action.payload
            }
        };
    },
    [GET_PROBLEM_DATA_AND_CODE_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
        };
    },

    [REGISTER_PROBLEM]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
        }
    },
    [REGISTER_PROBLEM_SUCCESS]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: true,
        };
    },
    [REGISTER_PROBLEM_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
        };
    },

    [SUBMIT_PROBLEM_CODE]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            data: {
                ...state.data,
                submit_results: null
            },
            which: 'submit_problem_code'
        }
    },
    [SUBMIT_PROBLEM_CODE_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                submit_results: action.payload
            },
            which: 'submit_problem_code'
        };
    },
    [SUBMIT_PROBLEM_CODE_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
            which: 'submit_problem_code'
        };
    },

    [RESET_PROBLEM_CODE]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'reset_problem_code'
        }
    },
    [RESET_PROBLEM_CODE_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                submit_results: null
            },
            which: 'reset_problem_code'
        };
    },
    [RESET_PROBLEM_CODE_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
            which: 'reset_problem_code'
        };
    },

    [GET_PROBLEM_LIST]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
        }
    },
    [GET_PROBLEM_LIST_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                problems_and_max_page: action.payload
            }
        };
    },
    [GET_PROBLEM_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
        };
    },
}, initial_state);