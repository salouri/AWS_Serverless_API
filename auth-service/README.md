# Cars Auction API: Authorizer Service (serverless)

- A Lambda Authorizer for integration with Serverless Framework and Auth0

- Based on the [serverless/examples/aws-node-auth0-custom-authorizers-api](https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api) example.
</p>

## Important Notes:

### Create `secret.pem` file

This file will contain your Auth0 public certificate, used to verify tokens.

Create a `secret.pem` file in the root folder of this project. Simply paste your public certificate in there.

### Deploy the stack

We need to deploy the stack to AWS Lambda. This will create a new Lambda function and an API Gateway endpoint.

```sh
sls deploy -v
```

Once deployed and integrated; all incoming requests to your Lambda will first be authorized. You can find the JWT claims at `event.requestContext.authorizer`.
