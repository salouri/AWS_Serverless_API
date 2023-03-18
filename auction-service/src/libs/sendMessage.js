// Import required AWS SDK clients and commands for Node.js
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from './sqsClient.js';

// Set the parameters

export const sendMessage = async (title, messageBody, author = '') => {
  const params = {
    DelaySeconds: 10,
    MessageAttributes: {
      Title: {
        DataType: 'String',
        StringValue: title,
      },
      Author: {
        DataType: 'String',
        StringValue: author,
      },
      WeeksOn: {
        DataType: 'Number',
        StringValue: '6',
      },
    },
    MessageBody: messageBody,
    // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    // MessageGroupId: "Group1",  // Required for FIFO queues
    QueueUrl: process.env.MAIL_QUEUE_URL, //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log('Success, message sent. MessageID:', data.MessageId);
    return data; // For unit tests.
  } catch (err) {
    console.log('Error', err);
  }
};
