'use strict';
import ddbDocClient from '../libs/ddbDocClient.js';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';
import commonMiddleware from '../libs/commonMiddleware.js';
import validatorMiddleware from '@middy/validator';
import getAuctionsSchema, {
  responseSchema,
} from '../libs/schemas/getAuctionsSchema.js';

const getAuctions = async (event, context) => {
  let auctions;
  const { status } = event.queryStringParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      // ':status': status || 'OPEN', // this is used when no validator used
      ':status': status,
    },
    ExpressionAttributeNames: {
      // this is needed because 'status' is a reserved word (replaces #status with 'status')
      '#status': 'status',
    },
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
    auctions = data.count ? data?.Items : null; // without validator, this is needed
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }

  return {
    statusCode: auctions ? 200 : 401,
    body: JSON.stringify(auctions || 'No auctions found'),
  };
};

export const handler = commonMiddleware(getAuctions).use(
  validatorMiddleware({
    responseSchema,
    eventSchema: getAuctionsSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
