import ddbDocClient from '../libs/ddbDocClient.js';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';

const getAuctionById = async (id) => {
  let auction;
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
  };

  try {
    const result = await ddbDocClient.send(new GetCommand(params));
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
    auction = result?.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError('Ops! something went wrong');
  }
  return auction;
};

export default getAuctionById;
