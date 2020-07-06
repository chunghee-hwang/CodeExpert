import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import modules, { rootSaga } from './modules';
const sagaMiddleware = createSagaMiddleware();
const store = createStore(modules,
    composeWithDevTools(
        applyMiddleware(sagaMiddleware)
    ));

sagaMiddleware.run(rootSaga);
export default store;