'use strict';
import ddbDocClient from '../libs/ddbDocClient.js';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import middy from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import createError from 'http-errors';

const getAuction = async (event, context) => {
  let auction;
  const { id } = event.pathParameters;
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
  };

  try {
    const result = await ddbDocClient.send(new GetCommand(params));
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
    auction = result?.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }
  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const handler = middy(getAuction)
  .use(httpHeaderNormalizer())
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
