'use strict';
import crypto from 'crypto';
import ddbDocClient from '../libs/ddbDocClient.js';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import middy from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import createError from 'http-errors';

const getAuctions = async (event, context) => {
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
  };

  try {
    const result = await ddbDocClient.send(new ScanCommand(params));
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
    auctions = result?.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

export const handler = middy(getAuctions)
  .use(httpHeaderNormalizer())
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
