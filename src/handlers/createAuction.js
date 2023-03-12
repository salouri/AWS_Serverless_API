'use strict';
import crypto from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import middy from '@middy/core';
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
  let result = {};
  let status = 201;
  try {
    const client = new DynamoDBClient({ region: 'eu-west-1' });
    const docClient = DynamoDBDocumentClient.from(client);
    result = await docClient.send(new PutCommand(params));
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    throw new createError.InternalServerError(error);
    console.log('error:', error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
};

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
