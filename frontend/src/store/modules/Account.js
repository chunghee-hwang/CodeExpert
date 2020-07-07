import { delay, put, takeEvery, call } from 'redux-saga/effects';
import { handleActions, createAction } from 'redux-actions';
import * as AccountApi from 'utils/api/AccountApi';
const CHANGE_NICKNAME = 'CHANGE_NICKNAME';
const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';

const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
const DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS';
const DELETE_ACCOUNT_FAILURE = 'DELETE_ACCOUNT_FAILURE';

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

const LOGOUT = 'LOGOUT';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const changeNickname = createAction(CHANGE_NICKNAME, nickname => nickname);
export const changePassword = createAction(CHANGE_PASSWORD, data => data);
export const deleteAccount = createAction(DELETE_ACCOUNT, data => data);
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);

function* changeNicknameSaga(action) {
    yield delay(1000);
    try {

        const response = yield call(AccountApi.changeNickname, action.payload);
        yield put({ type: CHANGE_NICKNAME_SUCCESS, payload: response });
    }
    catch (e) {
        yield put({ type: CHANGE_NICKNAME_FAILURE, payload: e });
    }
}

function* changePasswordSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(AccountApi.changePassword, action.payload);
        yield put({ type: CHANGE_PASSWORD_SUCCESS, payload: response });
    } catch (e) {
        yield put({ type: CHANGE_PASSWORD_FAILURE, payload: e });
    }
}

function* deleteAccountSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(AccountApi.deleteAccount, action.payload);
        yield put({ type: DELETE_ACCOUNT_SUCCESS, payload: response });
    } catch (e) {
        yield put({ type: DELETE_ACCOUNT_FAILURE, payload: e });
    }
}

function* loginSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(AccountApi.login, action.payload)
        yield sessionStorage.setItem('user', JSON.stringify(response.user));
        yield put({ type: LOGIN_SUCCESS, payload: response });
    } catch (e) {
        yield put({ type: LOGIN_FAILURE, payload: e });
    }
}

function* logoutSaga(action) {
    yield delay(1000);
    try {
        const response = yield call(AccountApi.logout, action.payload)
        yield sessionStorage.removeItem('user');
        yield put({ type: LOGOUT_SUCCESS, payload: response });
    } catch (e) {
        yield put({ type: LOGOUT_FAILURE, payload: e });
    }
}

export function* accountSaga() {
    yield takeEvery(CHANGE_NICKNAME, changeNicknameSaga);
    yield takeEvery(CHANGE_PASSWORD, changePasswordSaga);
    yield takeEvery(DELETE_ACCOUNT, deleteAccountSaga);
    yield takeEvery(LOGIN, loginSaga);
    yield takeEvery(LOGOUT, logoutSaga);
}

// 새로 고침하면 유저 데이터가 store에서 날아가는 거 방지. 세션 스토리지기 때문에 서버의 세션이 만료되면 같이 만료됨.
let user_in_storage = sessionStorage.getItem('user');
const initial_state = {
    is_progressing: false,
    is_success: false,
    data: null,
    which: null,
    user: user_in_storage ? JSON.parse(user_in_storage) : null
};

export default handleActions({

    [CHANGE_NICKNAME]: (state, action) => {

        return {
            ...state,
            which: 'nickname',
            is_progressing: true,
            is_success: false,
            data: null,
        };
    },
    [CHANGE_NICKNAME_SUCCESS]: (state, action) => {
        return {
            which: 'nickname',
            is_progressing: false,
            is_success: true,
            data: null,
            user: {
                ...state.user,
                nickname: action.payload.new_nickname
            }
        };
    },
    [CHANGE_NICKNAME_FAILURE]: (state, action) => {
        return {
            ...state,
            which: 'nickname',
            is_progressing: false,
            is_success: false,
            data: action.payload.message,
        };
    },
    [CHANGE_PASSWORD]: (state, action) => {
        return {
            ...state,
            which: 'password',
            is_progressing: true,
            is_success: false,
            data: null,
        };
    },
    [CHANGE_PASSWORD_SUCCESS]: (state, action) => {
        return {
            ...state,
            which: 'password',
            is_progressing: false,
            is_success: true,
            data: null,
        };
    },
    [CHANGE_PASSWORD_FAILURE]: (state, action) => {
        return {
            ...state,
            which: 'password',
            is_progressing: false,
            is_success: false,
            data: action.payload.message,
        };
    },
    [DELETE_ACCOUNT]: (state, action) => {
        return {
            ...state,
            which: 'account',
            is_progressing: true,
            is_success: false,
            data: null,
        };
    },
    [DELETE_ACCOUNT_SUCCESS]: (state, action) => {
        return {
            which: 'account',
            is_progressing: false,
            is_success: true,
            data: null,
            user: null
        };
    },
    [DELETE_ACCOUNT_FAILURE]: (state, action) => {
        return {
            ...state,
            which: 'account',
            is_progressing: false,
            is_success: false,
            data: action.payload.message,
        };
    },
    [LOGIN]: (state, action) => {
        return {
            ...state,
            which: 'login',
            is_progressing: true,
            is_success: false,
            data: null,
        };
    },
    [LOGIN_SUCCESS]: (state, action) => {
        return {
            which: 'login',
            is_progressing: false,
            is_success: true,
            data: null,
            user: action.payload.user
        };
    },
    [LOGIN_FAILURE]: (state, action) => {
        return {
            which: 'login',
            is_progressing: false,
            is_success: false,
            data: action.payload.message,
            user: null
        };
    },
    [LOGOUT]: (state, action) => {
        return {
            ...state,
            which: 'logout',
            is_progressing: true,
            is_success: false,
            data: null,
        };
    },
    [LOGOUT_SUCCESS]: (state, action) => {
        return {
            which: 'logout',
            is_progressing: false,
            is_success: true,
            data: null,
            user: null
        };
    },
    [LOGOUT_FAILURE]: (state, action) => {
        return {
            ...state,
            which: 'logout',
            is_progressing: false,
            is_success: false,
            data: action.payload.message,
        };
    }
}, initial_state);