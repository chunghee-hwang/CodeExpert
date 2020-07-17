import { delay, put, takeEvery, call } from 'redux-saga/effects';
import { handleActions, createAction } from 'redux-actions';
import * as SolutionApi from 'utils/api/SolutionApi';
import { getErrorMessageFromResponse } from 'utils/ErrorHandler';
// HTTP Requests
const GET_OTHERS_SOLUTIONS = "GET_OTHERS_SOLUTIONS";
const GET_OTHERS_SOLUTIONS_SUCCESS = "GET_OTHERS_SOLUTIONS_SUCCESS";
const GET_OTHERS_SOLUTIONS_FAILURE = "GET_OTHERS_SOLUTIONS_FAILURE";

const CLEAR_OTHERS_SOLUTIONS = "CLEAR_OTHERS_SOLUTIONS";

const REGISTER_COMMENT = "REGISTER_COMMENT";
const REGISTER_COMMENT_SUCCESS = "REGISTER_COMMENT_SUCCESS";
const REGISTER_COMMENT_FAILURE = "REGISTER_COMMENT_FAILURE";

const UPDATE_COMMENT = "UPDATE_COMMENT";
const UPDATE_COMMENT_SUCCESS = "UPDATE_COMMENT_SUCCESS";
const UPDATE_COMMENT_FAILURE = "UPDATE_COMMENT_FAILURE";

const DELETE_COMMENT = "DELETE_COMMENT";
const DELETE_COMMENT_SUCCESS = "DELETE_COMMENT_SUCCESS";
const DELETE_COMMENT_FAILURE = "DELETE_COMMENT_FAILURE";

const LIKE_OR_CANCEL_LIKE = "LIKE_OR_CANCEL_LIKE";
const LIKE_OR_CANCEL_LIKE_SUCCESS = "LIKE_OR_CANCEL_LIKE_SUCCESS";
const LIKE_OR_CANCEL_LIKE_FAILURE = "LIKE_OR_CANCEL_LIKE_FAILURE";

export const getOthersSolutions = createAction(GET_OTHERS_SOLUTIONS, data => data);
export const clearOthersSolutions = createAction(CLEAR_OTHERS_SOLUTIONS);
export const registerComment = createAction(REGISTER_COMMENT, data => data);
export const updateComment = createAction(UPDATE_COMMENT, data => data);
export const deleteComment = createAction(DELETE_COMMENT, data => data);
export const likeOrCancelLike = createAction(LIKE_OR_CANCEL_LIKE, data => data);

function* getOthersSolutionsSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(SolutionApi.getOthersSolutions, action.payload);
        yield put({ type: GET_OTHERS_SOLUTIONS_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_OTHERS_SOLUTIONS_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}
function* registerCommentSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(SolutionApi.registerComment, action.payload);
        yield put({ type: REGISTER_COMMENT_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: REGISTER_COMMENT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* updateCommentSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(SolutionApi.updateComment, action.payload);
        yield put({ type: UPDATE_COMMENT_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: UPDATE_COMMENT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* deleteCommentSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(SolutionApi.deleteComment, action.payload);
        yield put({ type: DELETE_COMMENT_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: DELETE_COMMENT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* likeOrCancelLikeSaga(action) {
    yield delay(1000);
    try {
        debugger;
        const response = yield call(SolutionApi.likeOrCancelLike, action.payload);
        yield put({ type: LIKE_OR_CANCEL_LIKE_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: LIKE_OR_CANCEL_LIKE_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

export function* solutionSaga() {
    yield takeEvery(GET_OTHERS_SOLUTIONS, getOthersSolutionsSaga);
    yield takeEvery(REGISTER_COMMENT, registerCommentSaga);
    yield takeEvery(UPDATE_COMMENT, updateCommentSaga);
    yield takeEvery(DELETE_COMMENT, deleteCommentSaga);
    yield takeEvery(LIKE_OR_CANCEL_LIKE, likeOrCancelLikeSaga);
}

const initial_state = {
    is_progressing: false,
    is_success: false,
    data: {},
    which: null,
};

export default handleActions({
    [GET_OTHERS_SOLUTIONS]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'get_others_solutions'
        }
    },
    [GET_OTHERS_SOLUTIONS_SUCCESS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                others_solutions: action.payload
            },
            which: 'get_others_solutions'
        }
    },
    [GET_OTHERS_SOLUTIONS_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            data: {
                ...state.data,
                fail_cause: action.payload
            },
            which: 'get_others_solutions'
        }
    },
    [CLEAR_OTHERS_SOLUTIONS]: (state, action) => {
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                others_solutions: null
            },
            which: 'get_others_solutions'
        }
    },

    [REGISTER_COMMENT]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'register_comment'
        }
    },
    [REGISTER_COMMENT_SUCCESS]: (state, action) => {
        const error = new Error('Fail to add comment');;
        let register_comment_result = action.payload;
        if (!state.data.others_solutions) {
            throw error;
        }

        let others_solutions = { ...state.data.others_solutions };
        let solution = others_solutions.solutions.find(solution => solution.id === register_comment_result.solution_id);
        if (solution) {
            solution.comments.push(register_comment_result.comment);
        } else {
            throw error;
        }
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                others_solutions
            },
            which: 'register_comment'
        }
    },
    [REGISTER_COMMENT_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            data: {
                ...state.data,
                fail_cause: action.payload
            },
            which: 'register_comment'
        }
    },

    [UPDATE_COMMENT]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'update_comment'
        }
    },
    [UPDATE_COMMENT_SUCCESS]: (state, action) => {
        const error = new Error('Fail to update comment');;
        let update_comment_result = action.payload;
        if (!state.data.others_solutions) {
            throw error;
        }

        let others_solutions = { ...state.data.others_solutions };
        let solution = others_solutions.solutions.find(solution => solution.id === update_comment_result.solution_id);
        if (solution) {
            let comment_idx = solution.comments.findIndex(comment => comment.id === update_comment_result.comment.id);
            if (comment_idx !== -1) {
                solution.comments[comment_idx] = update_comment_result.comment;
            }
            else {
                throw error;
            }
        } else {
            throw error;
        }
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                others_solutions
            },
            which: 'update_comment'
        }
    },
    [UPDATE_COMMENT_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            data: {
                ...state.data,
                fail_cause: action.payload
            },
            which: 'update_comment'
        }
    },

    [DELETE_COMMENT]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'delete_comment'
        }
    },
    [DELETE_COMMENT_SUCCESS]: (state, action) => {
        const error = new Error('Fail to delete comment');;
        let delete_comment_result = action.payload;
        if (!state.data.others_solutions) {
            throw error;
        }

        let others_solutions = { ...state.data.others_solutions };
        let solution = others_solutions.solutions.find(solution => solution.id === delete_comment_result.solution_id);
        if (solution) {
            let comment_idx = solution.comments.findIndex(comment => comment.id === delete_comment_result.comment.id);
            if (comment_idx !== -1) {
                solution.comments.splice(comment_idx, 1);
            }
            else {
                throw error;
            }
        } else {
            throw error;
        }
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                others_solutions
            },
            which: 'delete_comment'
        }
    },
    [DELETE_COMMENT_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            data: {
                ...state.data,
                fail_cause: action.payload
            },
            which: 'delete_comment'
        }
    },

    [LIKE_OR_CANCEL_LIKE]: (state, action) => {
        return {
            ...state,
            is_progressing: true,
            is_success: false,
            which: 'like_or_cancel_like',
        }
    },
    [LIKE_OR_CANCEL_LIKE_SUCCESS]: (state, action) => {
        const error = new Error('Fail to like comment');;
        let like_result = action.payload;
        if (!state.data.others_solutions) {
            throw error;
        }
        let others_solutions = { ...state.data.others_solutions };
        let solution = others_solutions.solutions.find(solution => solution.id === like_result.solution_id);
        if (solution && solution.likes) {
            solution.likes = like_result.likes;
        } else {
            throw error;
        }
        return {
            is_progressing: false,
            is_success: true,
            data: {
                ...state.data,
                others_solutions
            },
            which: 'like_or_cancel_like'
        }
    },
    [LIKE_OR_CANCEL_LIKE_FAILURE]: (state, action) => {
        return {
            is_progressing: false,
            is_success: false,
            data: {
                ...state.data,
                fail_cause: action.payload
            },
            which: 'like_or_cancel_like',
        }
    }
}, initial_state);