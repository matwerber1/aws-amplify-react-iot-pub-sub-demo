import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import ReactJson from 'react-json-view';
Amplify.configure(awsmobile);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <AuthDataDisplay {...this.props} />
      </div>
    );
  }
}

class AuthDataDisplay extends Component {

  render() {

    var keysToCollapse = ['client','refreshToken'];

    return (
      <div className="AuthDataDisplay">
          <p>
          Auth state is {this.props.authState}
          </p>
          Auth data is <br/>
          <ReactJson 
            src={this.props.authData} 
            theme={"hopscotch"}
            displayObjectSize={false} 
            displayDataTypes={false} 
            collapseStringsAfterLength={50} 
            name={false}
            shouldCollapse={(field)=>{
              if (keysToCollapse.includes(field.name)) {
                return true;
              } else {
                return false;
              }
            }}
          />
      </div>
    );
  }
}

export default withAuthenticator(App, true);
