import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, {Auth, PubSub} from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import JSONTree from 'react-json-tree';
//import AWS from 'aws-sdk';
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
  
  const [desiredTopic, setDesiredTopic] = useState("#");
  const [subscribedTopic, setSubscribedTopic] = useState();
  const [iotMessages, setIotMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState();
  const [subscriptions] = useState([]);

  async function connectToAwsIot() {

    const AWSIotConfiguration = require('./aws-iot-configuration.js');

    Amplify.addPluggable(new AWSIoTProvider({
      aws_pubsub_region: AWSIotConfiguration.region,
      aws_pubsub_endpoint: AWSIotConfiguration.endpoint,
    }));  

    // At this time, addPluggable() above does not emit error if connection fails, so
    // technically code below is misleading because we might not actually have valid connection details. 
    setIsConnected(true);
    console.log(`Connected to ${AWSIotConfiguration.endpoint} in ${AWSIotConfiguration.region}`);

  }

  async function subscribeToTopic(topic) {

    if (!isConnected) {
      await connectToAwsIot();        
    }
  
    if (subscription !== undefined) {
      subscription.unsubscribe();
      console.log(`Unsubscribed from ${subscribedTopic}`);
    }

    const newSubscription = await PubSub.subscribe(desiredTopic).subscribe({
      next:  data => {
        const message = `${subscribedTopic} - ${JSON.stringify(data.value,null,2)}`; 
        setIotMessages(previousIotMessages => ([...previousIotMessages, message]));
        console.log('Message received', data);      
      },
      error: error => {
        setIsSubscribed(false);
        setSubscribedTopic();
        console.error('Subscription error: ' + error)
      },
      close: () => {
        setIsSubscribed(false);
        setSubscribedTopic();
        console.log('Subscription closed.')
      },
    });    

    // Note - the error handler in PubSub.subscribe() above does not seem to trigger of the 
    // cunderlying connection was not successful. Instead, browser throws an uncaught error in 
    // a promise. So in truth the code below would log messages that imply the subscription was
    // successful when in reality it failed. Need to figure out if there's a better way to do this. 
    setIsSubscribed(true);
    setSubscribedTopic(topic);
    setSubscription(newSubscription);

    console.log(`Sufbscribed to topic '${topic}'`);  

  }

  useEffect(() => {

    if (desiredTopic !== subscribedTopic) {
      subscribeToTopic(desiredTopic);
    }

  },[desiredTopic])

  function renderIotMessages() {

    if (iotMessages.length === 0) {
      return ("...");
    }
    else {
      return(
        <ul>
          {
            iotMessages.map((message, index) => {
              return (<li className="IotMessage" key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()} - {message}</li>);
            })
          }
        </ul>
      );
    }
  }

  return (
    <div className="MQTTDisplay">
      IoT Topic: <br/> 
      <input
        value={desiredTopic}
        onChange={e => setDesiredTopic(e.target.value)}
        placeholder="IoT Topic"
        type="text"
        name="desiredTopic"
        required
      />
      <br/><br/>
      Iot Messages ({iotMessages.length} received): <br/>
      {renderIotMessages()}
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
