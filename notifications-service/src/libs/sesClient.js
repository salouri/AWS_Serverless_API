import { SESClient } from '@aws-sdk/client-ses';
// Set the AWS Region.
const REGION = 'us-east-1';
// Create SES service object.
const sesClient = new SESClient({ region: process.env.AWS_REGION });
export { sesClient };
