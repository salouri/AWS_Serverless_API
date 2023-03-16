'use strict';

import commonMiddleware from '../libs/commonMiddleware.js';
import createError from 'http-errors';
import getAuctionById from '../libs/getAuctionById.js';

const getAuction = async (event, context) => {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);
  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(getAuction);
