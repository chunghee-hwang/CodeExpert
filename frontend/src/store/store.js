import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import modules, { rootSaga } from './modules';
import logger from 'redux-logger';
const sagaMiddleware = createSagaMiddleware();
const store = createStore(modules, applyMiddleware(logger, sagaMiddleware));

sagaMiddleware.run(rootSaga);
export default store;