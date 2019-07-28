# aws-amplify-react-template

## Overview

This is a very basic AWS Amplify + AWS IoT Javascript SDK + React project that combines basic authentication via Amazon Cognito with AWS IoT Core pubsub via the aws-iot-device-sdk to (1) authenticate via Cognito, (2) subscribe to one or more topics and (3) publish messages to a user-specified topic. 

The functionality is similar to (though simpler, less pretty) version of the "Test" tab in the AWS IoT console:

## Demo

View the live demo here: [https://master.d3lu5yrdzirdad.amplifyapp.com/](https://master.d3lu5yrdzirdad.amplifyapp.com/)

![alt text](./images/demo1.png)
![alt text](./images/demo2.png)

## Deployment

1. Navigate to the [Amplify Console Home Page](https://console.aws.amazon.com/amplify/home)

2. Choose "Connect App" and link to the [https://github.com/matwerber1/aws-amplify-react-template](https://github.com/matwerber1/aws-amplify-react-template) GitHub repo. 

3. Deploy the app from the Amplify Console

4. Once app completes, navigate to app endpoint (as shown in Amplify console), and create yourself a new user.

5. Log in to the endpoint (as shown in Amplify Console) with your newly-created user. 

6. Make note of the "Auth Identity ID".

7. Per instructions in [manual-steps.md](./manual-steps.md), create a new IoT policy named "ReactIotPolicy".

8. Per instructions in [manual-steps.md](./manual-steps.md), issue CLI command to grant your user's auth identity ID (Step 6) access to the new IoT policy (Step 7). 

9. Per instructions in [manual-steps.md](./manual-steps.md), edit your authorized users' IAM role to have permission to connect/publish/subscribe to AWS IoT. 

10. That *should* be it!