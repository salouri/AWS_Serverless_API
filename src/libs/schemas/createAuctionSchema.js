import { transpileSchema } from '@middy/validator/transpile';

const schema = transpileSchema({
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
