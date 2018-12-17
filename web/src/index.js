import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import 'normalize.css';
import { HashRouter } from 'react-router-dom';

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
