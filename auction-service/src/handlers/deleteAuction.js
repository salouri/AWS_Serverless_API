'use strict';
import ddbDocClient from '../libs/ddbDocClient.js';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import commonMiddleware from '../libs/commonMiddleware.js';
import getAuctionById from '../libs/getAuctionById.js';
import createError from 'http-errors';

const deleteAuction = async (event, context) => {
  const { id } = event.pathParameters;
  const deletedAuction = await getAuctionById(id);
  if (!deletedAuction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);
  }
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    ConditionExpression: 'attribute_exists(id)',
  };
  try {
    await ddbDocClient.send(new DeleteCommand(params));
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }
  return {
    statusCode: 204,
  };
};

export const handler = commonMiddleware(deleteAuction);
