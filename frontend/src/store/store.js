import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import modules, { rootSaga } from './modules';
const sagaMiddleware = createSagaMiddleware();
const store = createStore(modules, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
export default store;