import React, { useState, useEffect } from 'react';
import Amplify, { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import * as deepmerge from 'deepmerge';
import awsmobile from './aws-exports';
Amplify.configure(awsmobile);

connectToAwsIot();

function connectToAwsIot() {

  const AWSIotConfiguration = require('./aws-iot-configuration.js');

  Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: AWSIotConfiguration.region,
    aws_pubsub_endpoint: AWSIotConfiguration.endpoint,
  }));  

  // At this time, addPluggable() above does not emit error if connection fails, so
  // technically code below is misleading because we might not actually have valid connection details. 
  console.log(`Connected to ${AWSIotConfiguration.endpoint} in ${AWSIotConfiguration.region}`);
  
}

function MQTTDisplay(props) {

    const [desiredTopic, setDesiredTopic] = useState("#");
    const [subscriptions, setSubscriptions] = useState({items: {}});
  
    function renderSubscriptions() {
      
      if (Object.keys(subscriptions.items).length === 0) {
        return "...";
      } 
      else {
       return (
        <div>
          {
            Object.keys(subscriptions.items).map(function(key, index) {
              return <MQTTSubscription key={key} topic={key} />;
              //return <TestSubscription key={key} topic={key} />
            })
          }
        </div>
      );
      
      }
    }
  
    function subcribeToTopic(topic) {

      if (!subscriptions.items.hasOwnProperty(topic)) {
        
        // this object is needed if we later want to unsubscribe
        const newSubscription = PubSub.subscribe(topic).subscribe({
          next:  data => {
            const newMessage = `${(new Date()).toLocaleDateString()} ${(new Date()).toLocaleTimeString()} - Topic '${topic}' - \n ${JSON.stringify(data.value,null,2)}`; 
            console.log(newMessage);      
          },
          error: error => {
            console.error('Subscription error: ' + error)
          },
          close: () => {
            console.log('Subscription closed.')
          },
        });    
    
        // our state tracks the subscription object itself so we can later disconnect
        // as well as the messages received thus far
        var subscriptionObject = {
          items: {
            [topic]: {
              subscription: newSubscription,
              messages: []
            }
          }
        };
        
        var newSubscriptions = deepmerge(subscriptions, subscriptionObject);
        setSubscriptions(newSubscriptions);
        console.log(`Subscribed to topic '${topic}'`);  
      }
      else {
        console.log(`Topic '${topic}' already exists in subscriptions.`);
      }
    }
  
    const handleSubmit = e => {
      e.preventDefault();
      if (!desiredTopic) return;
      subcribeToTopic(desiredTopic);
      setDesiredTopic("");
    };

    return (
      <div className="MQTTDisplay">
        <form onSubmit={handleSubmit} 
        >
          IoT Topic:
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
  
        Subscriptions: <br/>
        {renderSubscriptions()}
      </div>
    );
  }



/*#################################################################################*/
function MQTTSubscription(props) {

    const [messages, setMessages] = useState([]);
    
    //const subscription = subscribeToTopic(props.topic);
  
    function subscribeToTopic(topic) {
  
      const newSubscription = PubSub.subscribe(topic).subscribe({
        next:  data => {
          const newMessage = `${topic} - ${JSON.stringify(data.value,null,2)}`; 
          setMessages(prevMessages => ([...prevMessages, newMessage]));
          console.log('Message received', data);      
        },
        error: error => {
          console.error('Subscription error: ' + error)
        },
        close: () => {
          console.log('Subscription closed.')
        },
      });    
  
      console.log(`Subscribed to topic '${topic}'`);  
  
      return newSubscription;
    }
  
    function renderMessages() {
      
      var messages=[];
  
      if (messages.length === 0) {
        return ("...");
      }
      else {
        return(
          <ul>
            {
              messages.map((message, index) => {
                return (<li className="MQTTMessage" key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()} - {message}</li>);
              })
            }
          </ul>
        );
      }
    }
  
    return (
      <div className="MQTTSubscription">
        Subscription to '{props.topic}':
        {renderMessages()}
      </div>
    );
  }

export default MQTTDisplay;