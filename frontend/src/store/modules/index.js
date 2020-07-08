import { combineReducers } from 'redux'
import account, { accountSaga } from './Account';
import problem, { problemSaga } from './Problem';
import { all } from 'redux-saga/effects';

// 루트 사가
export function* rootSaga() {
    yield all([accountSaga(), problemSaga()]);
}

export default combineReducers({
    account, problem
});