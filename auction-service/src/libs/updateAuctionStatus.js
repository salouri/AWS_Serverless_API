'use strict';
import ddbDocClient from './ddbDocClient.js';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

import createError from 'http-errors';

export const updateAuctionStatus = async (id, status) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ReturnValues: 'ALL_NEW',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };
  let updatedAuction;
  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    updatedAuction = data?.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
  return updatedAuction;
};
