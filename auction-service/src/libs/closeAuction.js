import createError from 'http-errors';
import { updateAuctionStatus } from '../libs/updateAuctionStatus.js';
import { sendMessage } from '../libs/sendMessage.js';

export const closeAuction = async (auction) => {
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
      await sendMessage(messageTitle, noSaleMsgBody, 'Saeed Badran');
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
      console.log('sending messages...');
      const sendingMessagesResults = await Promise.allSettled([
        sendMessage(messageTitle, sellerMsgBody, 'Saeed Badran'),
        sendMessage(messageTitle, bidderMsgBody, 'Saeed Badran'),
      ]);
      console.log('sendingMessagesResults: ', sendingMessagesResults);
    }
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
};
