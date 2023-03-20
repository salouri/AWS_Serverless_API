import { transpileSchema } from '@middy/validator/transpile';

const uploadAuctionPictureSchema = transpileSchema({
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'string',
      pattern: '^(data:image\/jpeg;base64,)|\/|([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}=)|([0-9a-zA-Z+/]{3}))=$',
    },
  },
});

export default uploadAuctionPictureSchema;
