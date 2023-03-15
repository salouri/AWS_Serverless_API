'use strict';
import ddbDocClient from '../libs/ddbDocClient.js';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import commonMiddleware from '../libs/commonMiddleware.js';
import getAuctionById from '../libs/getAuctionById.js';

import createError from 'http-errors';

const placeBid = async (event, context) => {
  let updatedAuction;
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const auction = await getAuctionById(id);
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}!`
    );
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
    updatedAuction = data?.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }
  if (!updatedAuction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);
  }
  return {
    statusCode: 203,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = commonMiddleware(placeBid);
