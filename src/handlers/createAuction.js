'use strict';
import crypto from 'crypto';
import ddbDocClient from '../libs/ddbDocClient.js';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import commonMiddleware from '../libs/commonMiddleware.js';
import createError from 'http-errors';

const createAuction = async (event, context) => {
  const body = event.body;

  const auction = {
    id: crypto.randomUUID(),
    title: body.title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
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
    body: JSON.stringify(result),
  };
};

export const handler = commonMiddleware(createAuction);
