'use strict';
import ddbDocClient from '../libs/ddbDocClient.js';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';

const now = new Date().toISOString();
export const getEndedAuctions = async (endByTime = now) => {
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :byTime',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':byTime': endByTime,
    },
    ExpressionAttributeNames: {
      // this is needed because 'status' is a reserved word (replaces #status with 'status')
      '#status': 'status',
    },
  };
  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    auctions = data?.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }

  return auctions;
};
