import { transpileSchema } from '@middy/validator/transpile';

export default createAuctionSchema = transpileSchema({
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
