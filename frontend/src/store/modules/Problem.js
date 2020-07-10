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

const UPDATE_PROBLEM = "UPDATE_PROBLEM"; // 만든 문제 수정
const UPDATE_PROBLEM_SUCCESS = "UPDATE_PROBLEM_SUCCESS";
const UPDATE_PROBLEM_FAILURE = "UPDATE_PROBLEM_FAILURE";

const DELETE_PROBLEM = "DELETE_PROBLEM"; // 만든 문제 삭제
const DELETE_PROBLEM_SUCCESS = "DELETE_PROBLEM_SUCCESS";
const DELETE_PROBLEM_FAILURE = "DELETE_PROBLEM_FAILURE";

const GET_NEW_PROBLEM_ID = "GET_NEW_PROBLEM_ID" // 문제 새로 등록 시, 새 문제 아이디 가져오기
const GET_NEW_PROBLEM_ID_SUCCESS = "GET_NEW_PROBLEM_ID_SUCCESS";
const GET_NEW_PROBLEM_ID_FAILURE = "GET_NEW_PROBLEM_ID_FAILURE";

const UPLOAD_PROBLEM_IMAGE = "UPLOAD_PROBLEM_IMAGE"; // 문제 이미지 업로드
const UPLOAD_PROBLEM_IMAGE_SUCCESS = "UPLOAD_PROBLEM_IMAGE_SUCCESS";
const UPLOAD_PROBLEM_IMAGE_FAILURE = "UPLOAD_PROBLEM_IMAGE_FAILURE";
const CLEAR_PROBLEM_IMAGE_CACHE = "CLEAR_PROBLEM_IMAGE_CACHE";

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

const CLEAR_PROBLEM_LIST = "CLEAR_PROBLEM_LIST"; // 문제 목록 초기화


export const getProblemMetaData = createAction(GET_PROBLEM_META_DATA);
export const getProblemData = createAction(GET_PROBLEM_DATA, data => data);
export const getProblemDataAndCode = createAction(GET_PROBLEM_DATA_AND_CODE, data => data);
export const registerProblem = createAction(REGISTER_PROBLEM, data => data);
export const updateProblem = createAction(UPDATE_PROBLEM, data => data);
export const deleteProblem = createAction(DELETE_PROBLEM, data => data);
export const getNewProblemId = createAction(GET_NEW_PROBLEM_ID);
export const uploadProblemImage = createAction(UPLOAD_PROBLEM_IMAGE, data => data);
export const submitProblemCode = createAction(SUBMIT_PROBLEM_CODE, data => data);
export const resetProblemCode = createAction(RESET_PROBLEM_CODE, data => data);
export const getProblemList = createAction(GET_PROBLEM_LIST, data => data);
export const clearProblemImageCache = createAction(CLEAR_PROBLEM_IMAGE_CACHE);
export const clearProblemList = createAction(CLEAR_PROBLEM_LIST);
export const clearSubmitResults = createAction(CLEAR_SUBMIT_RESULTS);
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

function* updateProblemSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.updateProblem, action.payload);
        yield put({ type: UPDATE_PROBLEM_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: UPDATE_PROBLEM_FAILURE, payload: e.message });
    }
}

function* deleteProblemSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.deleteProblem, action.payload);
        yield put({ type: DELETE_PROBLEM_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: DELETE_PROBLEM_FAILURE, payload: e.message });
    }
}

function* getNewProblemIdSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.getNewProblemId, action.payload);
        yield put({ type: GET_NEW_PROBLEM_ID_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_NEW_PROBLEM_ID_FAILURE, payload: e.message });
    }
}

function* uploadProblemImageSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(ProblemApi.uploadProblemImage, action.payload);
        yield put({ type: UPLOAD_PROBLEM_IMAGE_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: UPLOAD_PROBLEM_IMAGE_FAILURE, payload: e.message });
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
    yield takeEvery(UPDATE_PROBLEM, updateProblemSaga);
    yield takeEvery(DELETE_PROBLEM, deleteProblemSaga);
    yield takeEvery(GET_NEW_PROBLEM_ID, getNewProblemIdSaga);
    yield takeEvery(UPLOAD_PROBLEM_IMAGE, uploadProblemImageSaga);
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
            which: 'problem_meta_data'
        }
    },
    [GET_PROBLEM_META_DATA_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                problem_meta_data: action.payload
            },
            which: 'problem_meta_data'
        };
    },
    [GET_PROBLEM_META_DATA_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
            which: 'problem_meta_data'
        };
    },

    [GET_PROBLEM_DATA]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'problem_data'
        }
    },
    [GET_PROBLEM_DATA_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                problem_data: action.payload
            },
            which: 'problem_data'
        };
    },
    [GET_PROBLEM_DATA_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
            which: 'problem_data'
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
            which: 'register_problem'
        }
    },
    [REGISTER_PROBLEM_SUCCESS]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: true,
            which: 'register_problem'
        };
    },
    [REGISTER_PROBLEM_FAILURE]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: false,
            which: 'register_problem',
            data: {
                ...state.data,
                fail_cause: action.payload
            },
        };
    },

    [UPDATE_PROBLEM]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'update_problem'
        }
    },
    [UPDATE_PROBLEM_SUCCESS]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: true,
            which: 'update_problem'
        };
    },
    [UPDATE_PROBLEM_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            which: 'update_problem',
            data: {
                ...state.data,
                fail_cause: action.payload
            },
        };
    },

    [DELETE_PROBLEM]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'delete_problem'
        }
    },
    [DELETE_PROBLEM_SUCCESS]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: true,
            which: 'delete_problem'
        };
    },
    [DELETE_PROBLEM_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            which: 'delete_problem',
            data: {
                ...state.data,
                fail_cause: action.payload
            },
        };
    },

    [GET_NEW_PROBLEM_ID]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'get_new_problem_id'
        }
    },
    [GET_NEW_PROBLEM_ID_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            which: 'get_new_problem_id',
            data: {
                ...state.data,
                new_problem_id: action.payload.problem_id
            }
        };
    },
    [GET_NEW_PROBLEM_ID_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            which: 'get_new_problem_id',
            data: {
                ...state.data,
                fail_cause: action.payload
            },
        };
    },

    [UPLOAD_PROBLEM_IMAGE]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'upload_problem_image'
        }
    },
    [UPLOAD_PROBLEM_IMAGE_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            which: 'upload_problem_image',
            data: {
                ...state.data,
                images: action.payload.images
            }
        };
    },
    [UPLOAD_PROBLEM_IMAGE_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            which: 'upload_problem_image',
            data: {
                ...state.data,
                fail_cause: action.payload
            },
        };
    },

    [CLEAR_PROBLEM_IMAGE_CACHE]: (state, action) => {
        return {
            ...state,
            which: 'upload_problem_image',
            data: {
                ...state.data,
                images: null
            }
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
            data: {
                ...state.data,

                filters: action.payload

            }
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
    [CLEAR_PROBLEM_LIST]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                problems_and_max_page: null

            }
        }
    },
    [CLEAR_SUBMIT_RESULTS]: (state, action) => {
        return {
            ...state,
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                submit_results: null
            }
        }
    }

}, initial_state);