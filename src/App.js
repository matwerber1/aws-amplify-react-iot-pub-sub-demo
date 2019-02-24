import React from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import logo from './logo.svg';
import './App.css';

import AuthDisplay from './AuthDisplay';
import MQTTDisplay from './MQTTDisplay'

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

export default withAuthenticator(App, true);
