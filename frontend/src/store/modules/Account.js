import { put, takeEvery, call } from 'redux-saga/effects';
import { handleActions, createAction } from 'redux-actions';
import * as AccountApi from 'utils/api/AccountApi';
const CHANGE_NICKNAME = 'CHANGE_NICKNAME';
const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

// const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
// const CHANGE_PASSWORD_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
// const CHANGE_PASSWORD_FAILURE = 'CHANGE_NICKNAME_FAILURE';

// const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
// const DELETE_ACCOUNT_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
// const DELETE_ACCOUNT_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const changeNickname = createAction(CHANGE_NICKNAME, nickname => nickname)

function* changeNicknameSaga(action) {
    try {
        const response = yield call(AccountApi.changeNickname, action.payload);
        yield put({ type: CHANGE_NICKNAME_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: CHANGE_NICKNAME_FAILURE, payload: e });
    }
}

export function* accountSaga() {
    yield takeEvery(CHANGE_NICKNAME, changeNicknameSaga);
}

const initial_state = {
    nickname: {
        is_changing: false,
        is_change_success: false,
        msg: null
    },
};

export default handleActions({

    [CHANGE_NICKNAME]: (state, action) => {
        return {
            nickname: {
                is_changing: true,
                is_change_success: false,
            }
        };
    },
    [CHANGE_NICKNAME_SUCCESS]: (state, action) => {
        return {
            nickname: {
                is_changing: false,
                is_change_success: true,
            }
        };
    },
    [CHANGE_NICKNAME_FAILURE]: (state, action) => {
        return {
            nickname: {
                is_changing: false,
                is_change_success: false,
                msg: action.payload.message
            }
        };
    }
}, initial_state);