import { transpileSchema } from '@middy/validator/transpile';

const getAuctionSchema = transpileSchema({
  type: 'object',
  properties: {
    required: ['queryStringParameters'],
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['OPEN', 'CLOSED'],
          default: 'OPEN',
        },
      },
      required: ['status'],
    }, // end queryStringParameters
  },
});

export default getAuctionSchema;
