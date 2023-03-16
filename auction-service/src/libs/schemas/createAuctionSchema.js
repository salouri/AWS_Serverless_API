import { transpileSchema } from '@middy/validator/transpile';

const createAuctionSchema = transpileSchema({
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['title'],
      properties: {
        title: {
          type: 'string',
          pattern: '^[A-Za-z]+',
        },
      },
    }, // end queryStringParameters
  },
});

export default createAuctionSchema;
