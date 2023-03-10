'use strict';
import crypto from 'crypto';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'eu-west-1' });

async function createAuction(event, context) {
  const body = JSON.parse(event.body);

  const auction = {
    id: crypto.randomUUID(),
    title: body.title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };

  const input = {
    TableName: 'AuctionsTable',
    Item: auction,
  };

  const command = new PutItemCommand(input);
  const result = await client.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
}

export const handler = createAuction;
