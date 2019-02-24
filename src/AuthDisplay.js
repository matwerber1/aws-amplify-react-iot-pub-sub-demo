import React, { useState, useEffect } from 'react';
import {Auth} from 'aws-amplify';
import JSONTree from 'react-json-tree';

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

export default AuthDisplay; 