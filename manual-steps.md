# Manual Steps

These manual steps need to be automated: 

1. Per instructions [here](https://aws-amplify.github.io/docs/js/pubsub), create an IoT Core policy to allow full access to all topics. Policy name is ```ReactIoTPolicy```.

The resource ARN in the link above did not work (resulted in error when subscribing). Changing the ARN to "*" worked, as per below policy:

```js
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

1. Find your Cognito Identity ID and issue command below:

    ```sh
    aws iot attach-principal-policy --policy-name 'ReactIoTPolicy' --principal '<YOUR_COGNITO_IDENTITY_ID>'
    ```

    In our case: 

    ```sh
    aws iot attach-principal-policy --policy-name 'ReactIoTPolicy' --principal 'us-east-1:511946f4-801d-4211-9e90-6b264d3aa290'
    aws iot attach-principal-policy --policy-name 'ReactIoTPolicy' --principal 'us-east-1:1226dd09-0634-4b6c-a0ce-2308ceaa4443'
    ```

1. Navigate to IAM console and find the IAM role for your Authorized users. It's name will vary based on your settings but should be something along the lines of "arn:aws:iam::999999999999:role/awsamplifyreacttempl-20190225042100-authRole"...

Grant this role "IoT Full Access" managed policy. Note!!! this is overly-permissive and only meant for quick demo/test purposes. A production policy should be more restrictive.