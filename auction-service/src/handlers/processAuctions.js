'use strict';
import createError from 'http-errors';
import { getEndedAuctions } from '../libs/getEndedAuctions.js';
import { updateAuctionStatus } from '../libs/updateAuctionStatus.js';

const processAuctions = async () => {
  try {
    const endedAuctions = await getEndedAuctions();
    const closedAuctions = [];
    endedAuctions.forEach(async (auction) => {
      try {
        const updatedAuction = await updateAuctionStatus(auction.id, 'CLOSED');
        closedAuctions.push(updatedAuction);
      } catch (error) {
        throw new createError.InternalServerError(error);
      }
    });
    console.log(`Updated Auctions: ${JSON.stringify(closedAuctions, null, 2)}`);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }
};

export const handler = processAuctions; // not an http handler, so no need for commonMiddleware
