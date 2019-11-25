import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from './src/wrapper';
import Store from './src/store/store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={Store} >
  <Wrapper />
  </Provider>,
  document.getElementById('root')
);
