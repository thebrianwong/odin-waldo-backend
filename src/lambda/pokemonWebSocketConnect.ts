import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { Handler } from "aws-lambda";

export const addWebSocketConnectionID: Handler = async (event) => {
  try {
    const connectionID = event.requestContext.connectionId;

    const client = new DynamoDBClient();
    const input: PutItemCommandInput = {
      TableName: "pokemon-waldo",
      Item: {
        id: {
          S: connectionID,
        },
        type: {
          S: "websocketID",
        },
      },
    };

    const command = new PutItemCommand(input);
    await client.send(command);

    return { statusCode: 201 };
  } catch (error) {
    throw Error(error as string);
  }
};
