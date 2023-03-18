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

async function sendEMail(event, context) {
  console.log(`event: ${JSON.stringify(event, null, 2)}`);
  const record = event.Records[0];
  const email = JSON.parse(record.Body); // refer to Auction-Service.sendMessage
  const { subject, body, recipient } = email;

  const sendEmailCommand = createSendEmailCommand(
    process.env.VERIFIED_SES_SENDER,
    recipient,
    subject,
    body
  );

  try {
    const result = await sesClient.send(sendEmailCommand);
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const handler = sendEMail;
