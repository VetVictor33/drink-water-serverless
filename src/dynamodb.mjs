import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { IS_OFFLINE } from "./constants.mjs";

const client = new DynamoDBClient(
  IS_OFFLINE
    ? {
        region: "sa-east-1",
        endpoint: "http://dynamodb:8000",
        credentials: {
          accessKeyId: "local",
          secretAccessKey: "local",
        },
      }
    : {
        region: process.env.AWS_REGION || "sa-east-1",
      },
);

export const dynamo = DynamoDBDocumentClient.from(client);
