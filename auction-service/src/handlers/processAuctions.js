'use strict';
import createError from 'http-errors';
import { getEndedAuctions } from '../libs/getEndedAuctions.js';
import { updateAuctionStatus } from '../libs/updateAuctionStatus.js';
import { sendMessage } from '../libs/sendMessage.js';

const processAuctions = async () => {
  try {
    const endedAuctions = await getEndedAuctions();
    console.log(
      `Ended Auctions Count: ${JSON.stringify(endedAuctions.length, null, 2)}`
    );
    endedAuctions.forEach(async (auction) => {
      try {
        const closedAuction = await updateAuctionStatus(auction.id, 'CLOSED');
        const { seller, title, highestBid } = closedAuction;
        const { amount, bidder } = highestBid;
        const messageTitle = 'Auction Closed!';
        if (amount === 0) {
          const noSaleMsgBody = JSON.stringify({
            subject: 'No bids on your auction item :(',
            recipient: seller,
            body: `Oh no! Your item "${title}" didn't get any bids. Better luck next time!`,
          });
          await sendMessage(messageTitle, noSaleMsgBody);
          return;
        } else {
          const sellerMsgBody = JSON.stringify({
            subject: 'Your car has been sold!',
            recipient: seller,
            body: `What a great deal! You got yourself a "${title}" for $${amount}.`,
          });
          const bidderMsgBody = JSON.stringify({
            subject: 'You won an auction!',
            recipient: bidder,
            body: `What a great deal! You got yourself a "${title}" for $${amount}.`,
          });
          // send both messages
          const { sellerMsgResult, bidderMsgResult } = await Promis.all(
            sendMessage(messageTitle, sellerMsgBody),
            sendMessage(messageTitle, bidderMsgBody)
          );
          console.log(
            `sellerMsgResult: ${JSON.stringify(sellerMsgResult)}`,
            `bidderMsgResult: ${JSON.stringify(bidderMsgResult)}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }
};

export const handler = processAuctions; // not an http handler, so no need for commonMiddleware
