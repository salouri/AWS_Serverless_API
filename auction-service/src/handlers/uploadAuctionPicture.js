'use strict';
import ddbDocClient from '../libs/ddbDocClient.js';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import commonMiddleware from '../libs/commonMiddleware.js';
import getAuctionById from '../libs/getAuctionById.js';
import createError from 'http-errors';
import responseSchema from '../libs/schemas/httpLambdaResponseSchema.js';

const uploadAuctionPicture = async (event, context) => {
  return {
    statusCode: 201,
    body: JSON.stringify({ message: 'Auction picture uploaded' }),
  };
};

export const handler = commonMiddleware(uploadAuctionPicture).use(
  validatorMiddleware({
    responseSchema,
  })
);
