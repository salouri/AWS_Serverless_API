'use strict';
import crypto from 'crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';
import validatorMiddleware from '@middy/validator';
import ddbDocClient from '../libs/ddbDocClient.js';
import commonMiddleware from '../libs/commonMiddleware.js';
import createAuctionSchema from '../libs/schemas/createAuctionSchema.js';
import responseSchema from '../libs/schemas/httpLambdaResponseSchema.js';

const createAuction = async (event, context) => {
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: crypto.randomUUID(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
  };
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  };
  let result;
  try {
    result = await ddbDocClient.send(new PutCommand(params));
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(createAuction).use(
  validatorMiddleware({
    responseSchema,
    eventSchema: createAuctionSchema,
    ajvOptions: {
      useDefaults: false,
      strict: false,
    },
  })
);
