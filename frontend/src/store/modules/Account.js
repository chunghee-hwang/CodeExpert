import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as AccountApi from 'utils/api/AccountApi';
import {USER_NAME_SESSION_ATTRIBUTE_NAME} from 'utils/AuthenticateManager';
import { getErrorMessageFromResponse } from 'utils/ErrorHandler';
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

const SIGNUP = 'SIGNUP';
const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

const CLEAR_WHICH = "CLEAR_WHICH";

export const changeNickname = createAction(CHANGE_NICKNAME, data => data);
export const changePassword = createAction(CHANGE_PASSWORD, data => data);
export const deleteAccount = createAction(DELETE_ACCOUNT, data => data);
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
export const signup = createAction(SIGNUP);
export const clearWhich = createAction(CLEAR_WHICH);

function* changeNicknameSaga(action) {
    yield
    try {
        const response = yield call(AccountApi.changeNickname, action.payload);
        yield call(saveUserDataToSessionStorage, response.data);
        yield put({ type: CHANGE_NICKNAME_SUCCESS, payload: response.data });
    }
    catch (e) {
        yield put({ type: CHANGE_NICKNAME_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* changePasswordSaga(action) {
    yield
    try {
        const response = yield call(AccountApi.changePassword, action.payload);
        yield put({ type: CHANGE_PASSWORD_SUCCESS, payload: response.data });
    } catch (e) {
        yield put({ type: CHANGE_PASSWORD_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* deleteAccountSaga(action) {
    try {
        const response = yield call(AccountApi.deleteAccount, action.payload);
        yield call(removeUserDataFromSessionStorage);
        yield put({ type: DELETE_ACCOUNT_SUCCESS, payload: response.data });
    } catch (e) {
        yield put({ type: DELETE_ACCOUNT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* loginSaga(action) {
    yield
    try {
        const response = yield call(AccountApi.login, action.payload);
        yield call(saveUserDataToSessionStorage, response.data);
        yield put({ type: LOGIN_SUCCESS, payload: response.data });
    } catch (e) {
        yield put({ type: LOGIN_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* logoutSaga(action) {
    yield
    try {
        const response = yield call(AccountApi.logout, action.payload);
        yield put({ type: LOGOUT_SUCCESS, payload: response.data });
    } catch (e) {
        yield put({ type: LOGOUT_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

function* signupSaga(action) {
    yield
    try {
        const response = yield call(AccountApi.signUp, action.payload);
        yield put({ type: SIGNUP_SUCCESS, payload: response.data });
    } catch (e) {
        yield put({ type: SIGNUP_FAILURE, payload: getErrorMessageFromResponse(e) });
    }
}

export function* accountSaga() {
    yield takeEvery(CHANGE_NICKNAME, changeNicknameSaga);
    yield takeEvery(CHANGE_PASSWORD, changePasswordSaga);
    yield takeEvery(DELETE_ACCOUNT, deleteAccountSaga);
    yield takeEvery(LOGIN, loginSaga);
    yield takeEvery(LOGOUT, logoutSaga);
    yield takeEvery(SIGNUP, signupSaga);
}

const saveUserDataToSessionStorage = user => {
    sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, JSON.stringify(user));
}
const removeUserDataFromSessionStorage = () => {
    sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
}
const getUserDataFromSessionStorage = ()=>{
    return sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
}

// 새로 고침하면 유저 데이터가 store에서 날아가는 거 방지. 세션 스토리지기 때문에 서버의 세션이 만료되면 같이 만료됨.
let user_in_storage = getUserDataFromSessionStorage();
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
            ...state,
            which: 'nickname',
            is_progressing: false,
            is_success: true,
            data: null,
            user: action.payload
        };
    },
    [CHANGE_NICKNAME_FAILURE]: (state, action) => {
        return {
            ...state,
            which: 'nickname',
            is_progressing: false,
            is_success: false,
            data: action.payload,
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
            data: action.payload,
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
            data: action.payload,
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
            user: action.payload
        };
    },
    [LOGIN_FAILURE]: (state, action) => {
        return {
            which: 'login',
            is_progressing: false,
            is_success: false,
            data: action.payload,
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
            data: action.payload,
        };
    },
    [SIGNUP]: (state, action) => {
        return {
            ...state,
            which: 'signup',
            is_progressing: true,
            is_success: false,
            data: null,
        };
    },
    [SIGNUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            which: 'signup',
            is_progressing: false,
            is_success: true,
            data: action.payload,
        };
    },
    [SIGNUP_FAILURE]: (state, action) => {
        return {
            ...state,
            which: 'signup',
            is_progressing: false,
            is_success: false,
            data: action.payload,
        };
    },
    [CLEAR_WHICH]: (state, action) => {
        return {
            ...state,
            which: null
        }
    }
}, initial_state);