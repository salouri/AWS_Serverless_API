'use strict';
import createError from 'http-errors';
import { getEndedAuctions } from '../libs/getEndedAuctions.js';

import { closeAuction } from '../libs/closeAuction.js';

const processAuctions = async () => {
  try {
    const endedAuctions = await getEndedAuctions();
    console.log(`Auctions Count: ${endedAuctions.length}`);

    const results = await Promise.allSettled(
      endedAuctions.map(async (auction) => closeAuction(auction))
    );
    console.log(`results: ${JSON.stringify(results, null, 2)}`);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }
};

export const handler = processAuctions; // not an http handler, so no need for commonMiddleware
