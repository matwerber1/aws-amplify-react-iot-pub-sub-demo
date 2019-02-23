import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import JSONTree from 'react-json-tree';
Amplify.configure(awsmobile);

function App(props) {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <br/>
      <AuthDisplay {...props} />
    </div>
  );

}

function AuthDisplay(props) {

  const [authState, setAuthState] = useState(props.authState);
  const [authData, setAuthData] = useState(props.authData);

    return (
      <div className="AuthDisplay">
        Auth state: {authState} <br/> <br/>
      
        Auth data:<br/>
        <div className="AuthData">
          <JSONTree data={authData} theme={"tomorrow"} invertTheme={true} />
        </div>
    </div>
  );

}

export default withAuthenticator(App, true);
