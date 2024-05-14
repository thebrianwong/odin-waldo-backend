import {
  DynamoDBClient,
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { Handler } from "aws-lambda";

export const deleteWebSocketConnectionID: Handler = async (event) => {
  const client = new DynamoDBClient();
  const input: DeleteItemCommandInput = {
    TableName: "pokemon-waldo",
    Key: {
      id: {
        S: event.requestContext.connectionId,
      },
    },
  };

  const command = new DeleteItemCommand(input);
  await client.send(command);

  return { statusCode: 204 };
};
