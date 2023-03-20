'use strict';

import createError from 'http-errors';
import middy from '@middy/core';
import validatorMiddleware from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import getAuctionById from '../libs/getAuctionById.js';
import responseSchema from '../libs/schemas/httpLambdaResponseSchema.js';
import { uploadPictureToS3 } from '../libs/uploadPictureToS3.js';
import { updateAuctionImage } from '../libs/updateAuctionImage.js';
import uploadAuctionPictureSchema from '../libs/schemas/uploadAuctionPictureSchema.js';

const uploadAuctionPicture = async (event, context) => {
  console.log(`event: ${JSON.stringify(event, null, 2)}`);

  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;

  const auction = await getAuctionById(id);

  if (auction.seller !== email) {
    throw new createError.Forbidden('You are not the seller of this auction!');
  }
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  let imageUrl;
  try {
    imageUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
    console.log(`imageUrl: ${JSON.stringify(imageUrl, null, 2)}`);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  try {
    const updatedAuction = updateAuctionImage(id, imageUrl);
    console.log(`updatedAuction: ${JSON.stringify(updatedAuction, null, 2)}`);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(
      'Updating image url to Auction failed!'
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Auction picture uploaded to: ${imageUrl}` }),
  };
};

export const handler = middy(uploadAuctionPicture)
  .use(
    validatorMiddleware({
      responseSchema,
      eventSchema: uploadAuctionPictureSchema,
      ajvOptions: {
        useDefaults: false,
        strict: false,
      },
    })
  )
  .use(httpErrorHandler())
  .use(cors());
