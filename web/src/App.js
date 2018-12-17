import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Routes from './routes';

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <Routes />
      </div>
    );
  }
}

export default hot(module)(withRouter(App));
