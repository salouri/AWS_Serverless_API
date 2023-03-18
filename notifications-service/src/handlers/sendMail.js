import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from '../libs/sesClient.js';

const createSendEmailCommand = (
  fromAddress,
  toAddress,
  messageSubject,
  messageText
) => {
  const params = {
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Text: {
          Charset: 'UTF-8',
          Data: messageText,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: messageSubject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  };
  return new SendEmailCommand(params);
};

async function sendMail(event, context) {
  console.log(`event: ${JSON.stringify(event, null, 2)}`);
  const sendEmailCommand = createSendEmailCommand(
    'salouri@gmail.com',
    'salouri@gmail.com',
    'Test Email',
    'Hello from Cars Auctions System'
  );
  try {
    const result = await sesClient.send(sendEmailCommand);
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({ message: 'Hello from Cars Auctions System' }),
  // };
}

export const handler = sendMail;
