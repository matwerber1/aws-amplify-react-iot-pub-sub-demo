# Manual Steps

These manual steps need to be automated: 

1. Per instructions [here](https://aws-amplify.github.io/docs/js/pubsub), create and IoT Core policy to allow full access to all topics. Policy name is ```ReactIoTPolicy```.

The resource ARN in the link above did not work (resulted in error when subscribing). Changing the ARN to "*" worked, as per below policy:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:*",
      "Resource": "*"
    }
  ]
}
```

2. Find your Cognito Identity ID and issue command below:

    ```sh
    aws iot attach-principal-policy --policy-name 'ReactIoTPolicy' --principal '<YOUR_COGNITO_IDENTITY_ID>'
    ```

    In our case: 

    ```sh
    aws iot attach-principal-policy --policy-name 'ReactIoTPolicy' --principal 'us-east-1:de620ece-f07e-4041-803a-f0a2028129e'
    aws iot attach-principal-policy --policy-name 'ReactIoTPolicy' --principal 'us-east-1:1226dd09-0634-4b6c-a0ce-2308ceaa4443'
    ```