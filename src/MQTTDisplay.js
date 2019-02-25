import React, { useState, useEffect } from 'react';
import Amplify, { PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import * as deepmerge from 'deepmerge';
import awsmobile from './aws-exports';
import AWSIoTData from 'aws-iot-device-sdk';
import AWSConfiguration from './aws-iot-configuration.js';

Amplify.configure(awsmobile);


//######################################################################################
function MQTTDisplay(props) {

  const [isConnected, setIsConnected]           = useState(false);
  const [desiredTopic, setDesiredTopic]         = useState("#");
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [mqttClient, setMqttClient]             = useState();

  useEffect(() => {
    // call function to connect to AWS IoT
    connectToAwsIot();
  },[]); // the "[]" causes this to execute just once

  async function connectToAwsIot() {

    // mqtt clients require a unique clientId; we generate one below
    var clientId = 'mqtt-explorer-' + (Math.floor((Math.random() * 100000) + 1));

    // get credentials and, from them, extract key, secret key, and session token
    // Amplify's auth functionality makes this easy for us...
    var currentCredentials = await Auth.currentCredentials();
    var essentialCredentials = Auth.essentialCredentials(currentCredentials);
    
    // Create an MQTT client
    var newMqttClient = AWSIoTData.device({
      region: AWSConfiguration.region,
      host:AWSConfiguration.host,
      clientId: clientId,
      protocol: 'wss',
      maximumReconnectTimeMs: 8000,
      debug: true,
      accessKeyId:  essentialCredentials.accessKeyId,
      secretKey:    essentialCredentials.secretAccessKey,
      sessionToken: essentialCredentials.sessionToken
     });

    // On connect, update status
    newMqttClient.on('connect', function() {
      setIsConnected(true);
      console.log('Connected to AWS IoT!');
      newMqttClient.subscribe('test1/#');
      newMqttClient.subscribe('test1');
      console.log('Subscribed to "test1" and "test1/#"');
    
    });

    // add event handler for received messages
    newMqttClient.on('message', function(topic, payload) {
      var myDate = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
      console.log(`message at ${myDate}`, topic, payload.toString());
    });

    // update state to track mqtt client
    setMqttClient(newMqttClient);

  }

    async function handleSubscriptionRequest(e) {
      
      // stop submit button from refreshing entire page
      e.preventDefault();

      if (isConnected) {
        if (subscribedTopics.includes(desiredTopic)) {
          console.log(`You are already subscribed to topic '${desiredTopic}'!`);
        }
        else {
          mqttClient.subscribe(desiredTopic);
          setSubscribedTopics(prevTopics => [...prevTopics, desiredTopic]);
          console.log(`Subscribed to topic '${desiredTopic}'!`);
        }
      }
      else {
        alert('Cannot subscribe to topic because you are not connected to AWS IoT.');
      }
    }

    return (
      <div className="MQTTDisplay">

        <b>AWS IoT Core Connection Status:</b>
        <br/>
        {isConnected ? "Connected" : "Not Connected"} 
        <br/><br/>

        <form onSubmit={handleSubscriptionRequest} 
        >
          <b>IoT Topic:</b>
          <br/>
          <input
            value={desiredTopic}
            onChange={e => setDesiredTopic(e.target.value)}
            placeholder="IoT Topic"
            type="text"
            name="desiredTopic"
            required
          />
  
          <button type="submit">Subscribe</button>
          
          <br/><br/>
        </form>
  
        <b>Subscriptions:</b> <br/>
        {subscribedTopics.map(topic => {
          return (
            <div key={topic}>
              {topic}
            </div>
          )
        })}
      </div>
    );
  }

export default MQTTDisplay;