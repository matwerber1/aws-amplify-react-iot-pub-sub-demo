import React, { useState, useEffect } from 'react';
import {Auth} from 'aws-amplify';
import JSONTree from 'react-json-tree';

function AuthDisplay(props) {

    const [cognitoIdentityId, setCognitoIdentityId] = useState({});
    useEffect(() => {
      console.log('useEffect for cognitoIdentityId triggered.');
      Auth.currentCredentials().then((info) => {
        setCognitoIdentityId(info._identityId);
      });
    },[]);
  
    const [essentialCredentials, setEssentialCredentials] = useState({});
    useEffect(() => {
      console.log('useEffect for essentialCredentials triggered.');
      Auth.currentCredentials()
        .then(credentials => {
          setEssentialCredentials(Auth.essentialCredentials(credentials));
          });
    },[]);
  
    return (
      <div className="AuthDisplay">
        Auth state: {props.authState}
        <br/><br/>
      
        Auth identity ID: {cognitoIdentityId.toString()} 
        <br/><br/>
  
        Auth data:<br/>
        <div className="AuthData">
          <JSONTree data={props.authData} theme={"tomorrow"} invertTheme={true} />
        </div>
        <br/><br/>

        Essential Credentials:<br/>
        <div className="AuthData">
          <JSONTree data={essentialCredentials} theme={"tomorrow"} invertTheme={true} />
        </div>
        <br/><br/>

      </div>
    );
  }

export default AuthDisplay; 