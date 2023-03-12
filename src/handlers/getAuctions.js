'use strict';
import ddbDocClient from '../libs/ddbDocClient.js';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import commonMiddleware from '../libs/commonMiddleware.js';
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

export const handler = commonMiddleware(getAuctions);
