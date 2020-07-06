import { combineReducers } from 'redux'
import account, { accountSaga } from './Account';
import { all } from 'redux-saga/effects';

// 루트 사가
export function* rootSaga() {
    yield all([accountSaga()]);
}

export default combineReducers({
    account
});