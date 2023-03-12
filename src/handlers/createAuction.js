'use strict';
import crypto from 'crypto';
import ddbDocClient from '../libs/ddbDocClient.js';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import middy from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
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

export const handler = middy(createAuction)
  .use(httpHeaderNormalizer())
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
