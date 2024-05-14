import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { Handler } from "aws-lambda";

export const addWebSocketConnectionID: Handler = async (event) => {
  const client = new DynamoDBClient();
  const input: PutItemCommandInput = {
    TableName: "pokemon-waldo",
    Item: {
      id: {
        S: event.requestContext.connectionId,
      },
      type: {
        S: "websocketID",
      },
    },
  };

  const command = new PutItemCommand(input);
  await client.send(command);

  return { statusCode: 201 };
};
