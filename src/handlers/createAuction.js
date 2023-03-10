'use strict';

async function createAuction(event, context) {
  const body = JSON.parse(event.body);
  const auction = {
    title: body.title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
