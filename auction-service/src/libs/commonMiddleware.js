import middy from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';

export default (fn) =>
  middy(fn)
    .use(httpHeaderNormalizer())
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
