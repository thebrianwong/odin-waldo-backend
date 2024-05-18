import {
  DynamoDBClient,
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { Handler } from "aws-lambda";

export const deleteWebSocketConnectionID: Handler = async (event) => {
  try {
    const connectionID = event.requestContext.connectionId;

    const client = new DynamoDBClient();
    const input: DeleteItemCommandInput = {
      TableName: "pokemon-waldo",
      Key: {
        id: {
          S: connectionID,
        },
      },
    };

    const command = new DeleteItemCommand(input);
    await client.send(command);

    return { statusCode: 204 };
  } catch (error) {
    throw Error(error as string);
  }
};
