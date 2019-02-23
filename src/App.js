import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

import JSONTree from 'react-json-tree';

Amplify.configure(awsmobile);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <br/>
        <AuthDisplay {...this.props} />
      </div>
    );
  }
}

class AuthDisplay extends Component {

  render() {

    var keysToCollapse = ['client','refreshToken'];

    return (
      <div className="AuthDisplay">
          Auth state: {this.props.authState} <br/> <br/>
          
          Auth data:<br/>
          <div className="AuthData">
            <JSONTree data={this.props.authData} theme={"tomorrow"} invertTheme={true} />
          </div>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
