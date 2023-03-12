'use strict';
import ddbDocClient from '../libs/ddbDocClient.js';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import commonMiddleware from '../libs/commonMiddleware.js';
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

export const handler = commonMiddleware(getAuction);
