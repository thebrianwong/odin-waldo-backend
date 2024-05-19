import { Handler } from "aws-lambda";
import {
  LambdaClient,
  InvokeCommand,
  InvokeCommandInputType,
} from "@aws-sdk/client-lambda";
import {
  DynamoDBClient,
  ScanCommand,
  ScanInput,
  DeleteItemCommand,
  DeleteItemInput,
} from "@aws-sdk/client-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  PostToConnectionCommandInput,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const lambdaClient = new LambdaClient();
const dynamoClient = new DynamoDBClient();
const apiGWClient = new ApiGatewayManagementApiClient({
  endpoint: process.env.API_GATEWAY_WS_URL,
});

export const broadcastPokemonLeaderboard: Handler = async () => {
  try {
    const lambdaInput: InvokeCommandInputType = {
      FunctionName: "getPokemonLeaderboard",
    };
    const lambdaCommand = new InvokeCommand(lambdaInput);
    const rawLambdaResponse = await lambdaClient.send(lambdaCommand);
    const leaderboardData = rawLambdaResponse.Payload;

    const dynamoInput: ScanInput = {
      TableName: "pokemon-waldo",
      ExpressionAttributeNames: {
        "#T": "type",
      },
      ExpressionAttributeValues: {
        ":type": {
          S: "websocketID",
        },
      },
      FilterExpression: "#T = :type",
    };
    const dynamoCommand = new ScanCommand(dynamoInput);
    const dynamoResponse = await dynamoClient.send(dynamoCommand);

    dynamoResponse.Items?.forEach(async (rawData) => {
      const parsedData = unmarshall(rawData);
      const wsId = parsedData.id;
      const apiGWInput: PostToConnectionCommandInput = {
        ConnectionId: wsId,
        Data: leaderboardData!,
      };
      const apiGWCommand = new PostToConnectionCommand(apiGWInput);
      try {
        await apiGWClient.send(apiGWCommand);
      } catch (error) {
        console.log(
          `Connection ID ${wsId} is inactive and was not properly deleted. Deleting now.`
        );

        const deleteItemInput: DeleteItemInput = {
          TableName: "pokemon-waldo",
          Key: {
            id: {
              S: wsId,
            },
          },
        };
        const deleteCommand = new DeleteItemCommand(deleteItemInput);
        await dynamoClient.send(deleteCommand);
      }
    });
    return {
      message: "Successfully broadcasted to all active WebSocket clients.",
    };
  } catch (error) {
    throw Error(error as string);
  }
};
