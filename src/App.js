import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
//mport Amplify, {Auth, PubSub} from 'aws-amplify';
import Amplify, {Auth} from 'aws-amplify';
//import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
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
/*
  var AWSIotConfiguration = require('./aws-iot-configuration.js');

  var endpoint = `wss://${AWSIotConfiguration.endpoint}/mqstt`;

  Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: AWSIotConfiguration.region,
    aws_pubsub_endpoint: `wss://${AWSIotConfiguration.endpoint}/mqtt`,
  }));

  useEffect(() => {
    
    PubSub.subscribe('myTopic').subscribe({
      next:  data => console.log('Message received', data),
      error: error => console.error(error),
      close: () => console.log('Done'),
    });
    
  });
*/
  return (
    <div className="AuthDisplay">
      MQTT
    </div>
  );
}

function AuthDisplay(props) {

  const [cognitoIdentityId, setCognitoIdentityId] = useState("");

  useEffect(() => {
    Auth.currentCredentials().then((info) => {
      setCognitoIdentityId(info._identityId);
    });
  });

  return (
    <div className="AuthDisplay">
      Auth state: {props.authState} <br/> <br/>
    
      Auth identity ID: {cognitoIdentityId} <br/><br/>

      Auth data:<br/>
      <div className="AuthData">
        <JSONTree data={props.authData} theme={"tomorrow"} invertTheme={true} />
      </div>
    </div>
  );
}

export default withAuthenticator(App, true);
