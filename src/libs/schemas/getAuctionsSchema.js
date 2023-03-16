import { transpileSchema } from '@middy/validator/transpile';

const schema = transpileSchema({
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

export const responseSchema = transpileSchema({
  type: 'object',
  required: ['body', 'statusCode'],
  properties: {
    body: {
      type: 'string',
    },
    statusCode: {
      type: 'number',
    },
  },
});

export default schema;
