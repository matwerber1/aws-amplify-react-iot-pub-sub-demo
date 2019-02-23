import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
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
      <MQTTDisplay {...props} />
      <br/>
      <AuthDisplay {...props} />
    </div>
  );

}

function MQTTDisplay(props) {
  return (
    <div className="AuthDisplay">
      MQTT
  </div>
);
}

function AuthDisplay(props) {
    return (
      <div className="AuthDisplay">
        Auth state: {props.authState} <br/> <br/>
      
        Auth data:<br/>
        <div className="AuthData">
          <JSONTree data={props.authData} theme={"tomorrow"} invertTheme={true} />
        </div>
    </div>
  );
}

export default withAuthenticator(App, true);
