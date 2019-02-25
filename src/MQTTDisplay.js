import React, { useState, useEffect } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import AWSIoTData from 'aws-iot-device-sdk';
import AWSConfiguration from './aws-iot-configuration.js';
Amplify.configure(awsmobile);

/*
    Note - I attempted to use Amplify PubSub for IoT message handling but found that
    it lacked adequate functionality to handle multiple subscriptions easily. Therefore, 
    I opted to use aws-iot-devide-sdk which proved much easier to use. 
*/

//######################################################################################
function arrayRemove(arr, value) {
  // REMOVE SPECIFIC ITEM BY VALUE FROM AN ARRAY
  //https://love2dev.com/blog/javascript-remove-from-array/
  return arr.filter(function(ele){
      return ele !== value;
  });

}
//######################################################################################

function MQTTDisplay(props) {
  // ALLOW USER TO SUBSCRIBE TO MQTT TOPICS

  const [desiredTopic, setDesiredTopic]         = useState("#");
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  function removeSubscription(topic) {
    // This function is passed to child components
    setSubscribedTopics(arrayRemove(subscribedTopics,topic));
  }

  function handleSubscriptionRequest(e) {
    // stop submit button from refreshing entire page
    e.preventDefault();

    if (subscribedTopics.includes(desiredTopic)) {
      console.log(`You are already subscribed to topic '${desiredTopic}'!`);
    }
    else {
      setSubscribedTopics(prevTopics => [...prevTopics, desiredTopic]);
      console.log(`Subscribed to topic '${desiredTopic}'!`);
    }

  }

    return (
      <div className="MQTTDisplay">
        <form onSubmit={handleSubscriptionRequest}>
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
          return (<MQTTSubscription key={topic} topic={topic} removeSubscription={removeSubscription}/>)
        })}
      </div>
    );
  }

//######################################################################################
function MQTTSubscription(props) {

  const [isConnected, setIsConnected] = useState(false);
  const [mqttClient, setMqttClient]   = useState();
  const [messages, setMessages]       = useState([]);

  useEffect(() => {

    connectToAwsIot();

    return () => {
      // this gets called when component is destroyed...
      //https://github.com/mqttjs/MQTT.js/blob/master/README.md#end    
      console.log(`Ended subscription to '${props.topic}'...`);
    };

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
      newMqttClient.subscribe(props.topic);
      console.log('Connected to AWS IoT!');
      console.log(`Subscribed to ${props.topic}`);
    
    });

    // add event handler for received messages
    newMqttClient.on('message', function(topic, payload) {
      var myDate =      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
      var newMessage =  `${myDate} - topic '${props.topic}' - ${payload.toString()}`;
      setMessages(prevMessages => [...prevMessages, newMessage]);
      console.log(newMessage);
    });

    // update state to track mqtt client
    setMqttClient(newMqttClient);

  }

  function handleUnsubscribe(e) {
    // stop submit button from refreshing entire page
    e.preventDefault();

    // end subscription; I think this could be added to the return() of the useEffect(), as an "onUnmount" handler,
    // but I received an erropr when I tried it. I might be doing something wrong but for now, it works with the commands
    // below... 
    mqttClient.end(false); 
    setIsConnected(false);

    // remove subscription from parent component, thus killing this component...
    props.removeSubscription(props.topic);
  }

  return (
    <div className="MQTTSubscription">
      Topic = "{props.topic}" ({isConnected ? "connected" : "not connected"})
      <form onSubmit={handleUnsubscribe}>
        <button type="submit">Unsubscribe</button>
      </form>
      <br/><br/>

      {messages.map((message,index) => {
        return (
          <li key={index} className="markdown">
            {message}
          </li>
        );
      })}
    </div>
  );

}

export default MQTTDisplay;