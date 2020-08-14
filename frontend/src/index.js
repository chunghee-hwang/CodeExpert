import "core-js";
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'polyfills/append';

import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { Provider } from 'react-redux';
ReactDOM.render(
  <Provider store={store}> {/* store 모든 컴포넌트에서 사용가능하게 함 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
