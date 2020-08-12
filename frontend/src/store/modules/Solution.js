import { put, takeEvery, call } from 'redux-saga/effects';
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
    try {
        const response = yield call(SolutionApi.getOthersSolutions, action.payload);
        yield put({ type: GET_OTHERS_SOLUTIONS_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: GET_OTHERS_SOLUTIONS_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}
function* registerCommentSaga(action) {
    try {
        const response = yield call(SolutionApi.registerComment, action.payload);
        yield put({ type: REGISTER_COMMENT_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: REGISTER_COMMENT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* updateCommentSaga(action) {
    try {
        const response = yield call(SolutionApi.updateComment, action.payload);
        yield put({ type: UPDATE_COMMENT_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: UPDATE_COMMENT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* deleteCommentSaga(action) {
    try {
        const response = yield call(SolutionApi.deleteComment, action.payload);
        yield put({ type: DELETE_COMMENT_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: DELETE_COMMENT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* likeOrCancelLikeSaga(action) {
    try {
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

const initialState = {
    isProgressing: false,
    isSuccess: false,
    data: {},
    which: null,
};

export default handleActions({
    [GET_OTHERS_SOLUTIONS]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'othersSolutions'
        }
    },
    [GET_OTHERS_SOLUTIONS_SUCCESS]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                othersSolutions: action.payload
            },
            which: 'othersSolutions'
        }
    },
    [GET_OTHERS_SOLUTIONS_FAILURE]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: false,
            data: {
                ...state.data,
                failCause: action.payload
            },
            which: 'othersSolutions'
        }
    },
    [CLEAR_OTHERS_SOLUTIONS]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                othersSolutions: null
            },
            which: 'othersSolutions'
        }
    },

    [REGISTER_COMMENT]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'registerComment'
        }
    },
    [REGISTER_COMMENT_SUCCESS]: (state, action) => {
        const error = new Error('Fail to add comment');
        let registerCommentResult = action.payload;
        if (!state.data.othersSolutions) {
            throw error;
        }

        let othersSolutions = { ...state.data.othersSolutions };
        let solution = othersSolutions.solutions.find(solution => solution.id === registerCommentResult.solutionId);
        if (solution) {
            solution.comments.push(registerCommentResult.comment);
        } else {
            throw error;
        }
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                othersSolutions
            },
            which: 'registerComment'
        }
    },
    [REGISTER_COMMENT_FAILURE]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: false,
            data: {
                ...state.data,
                failCause: action.payload
            },
            which: 'registerComment'
        }
    },

    [UPDATE_COMMENT]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'updateComment'
        }
    },
    [UPDATE_COMMENT_SUCCESS]: (state, action) => {
        const error = new Error('Fail to update comment');;
        let updateCommentResult = action.payload;
        if (!state.data.othersSolutions) {
            throw error;
        }

        let othersSolutions = { ...state.data.othersSolutions };
        let solution = othersSolutions.solutions.find(solution => solution.id === updateCommentResult.solutionId);
        if (solution) {
            let commentIdx = solution.comments.findIndex(comment => comment.id === updateCommentResult.comment.id);
            if (commentIdx !== -1) {
                solution.comments[commentIdx] = updateCommentResult.comment;
            }
            else {
                throw error;
            }
        } else {
            throw error;
        }
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                othersSolutions
            },
            which: 'updateComment'
        }
    },
    [UPDATE_COMMENT_FAILURE]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: false,
            data: {
                ...state.data,
                failCause: action.payload
            },
            which: 'updateComment'
        }
    },

    [DELETE_COMMENT]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'deleteComment'
        }
    },
    [DELETE_COMMENT_SUCCESS]: (state, action) => {
        const error = new Error('Fail to delete comment');;
        let deleteCommentResult = action.payload;
        if (!state.data.othersSolutions) {
            throw error;
        }

        let othersSolutions = { ...state.data.othersSolutions };
        let solution = othersSolutions.solutions.find(solution => solution.id === deleteCommentResult.solutionId);
        if (solution) {
            let commentIdx = solution.comments.findIndex(comment => comment.id === deleteCommentResult.comment.id);
            if (commentIdx !== -1) {
                solution.comments.splice(commentIdx, 1);
            }
            else {
                throw error;
            }
        } else {
            throw error;
        }
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                othersSolutions
            },
            which: 'deleteComment'
        }
    },
    [DELETE_COMMENT_FAILURE]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: false,
            data: {
                ...state.data,
                failCause: action.payload
            },
            which: 'deleteComment'
        }
    },

    [LIKE_OR_CANCEL_LIKE]: (state, action) => {
        return {
            ...state,
            isProgressing: true,
            isSuccess: false,
            which: 'likeOrCancelLike',
        }
    },
    [LIKE_OR_CANCEL_LIKE_SUCCESS]: (state, action) => {
        const error = new Error('Fail to like comment');;
        let likeResult = action.payload;
        if (!state.data.othersSolutions) {
            throw error;
        }
        let othersSolutions = { ...state.data.othersSolutions };
        let solution = othersSolutions.solutions.find(solution => solution.id === likeResult.solutionId);
        if (solution && solution.likes) {
            solution.likes = likeResult.likes;
        } else {
            throw error;
        }
        return {
            isProgressing: false,
            isSuccess: true,
            data: {
                ...state.data,
                othersSolutions
            },
            which: 'likeOrCancelLike'
        }
    },
    [LIKE_OR_CANCEL_LIKE_FAILURE]: (state, action) => {
        return {
            isProgressing: false,
            isSuccess: false,
            data: {
                ...state.data,
                failCause: action.payload
            },
            which: 'likeOrCancelLike',
        }
    }
}, initialState);