import { transpileSchema } from '@middy/validator/transpile';

const placeBidSchema = transpileSchema({
  type: 'object',
  required: ['body', 'pathParameters'],
  properties: {
    pathParameters: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
        },
      },
    },
    body: {
      type: 'object',
      required: ['amount'],
      properties: {
        amount: {
          type: 'number',
        },
      },
    }, // end queryStringParameters
  },
});

export default placeBidSchema;
