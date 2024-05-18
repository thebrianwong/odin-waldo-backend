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
} from "@aws-sdk/client-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  PostToConnectionCommandInput,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const broadcastPokemonLeaderboard: Handler = async () => {
  try {
    const lambdaClient = new LambdaClient();
    const lambdaInput: InvokeCommandInputType = {
      FunctionName: "getPokemonLeaderboard",
    };
    const lambdaCommand = new InvokeCommand(lambdaInput);
    const rawLambdaResponse = await lambdaClient.send(lambdaCommand);
    const leaderboardData = rawLambdaResponse.Payload;

    const dynamoClient = new DynamoDBClient();
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

    const apiGWClient = new ApiGatewayManagementApiClient({
      endpoint: process.env.API_GATEWAY_WS_URL,
    });
    dynamoResponse.Items?.forEach(async (rawData) => {
      const parsedData = unmarshall(rawData);
      const wsId = parsedData.id;
      const apiGWInput: PostToConnectionCommandInput = {
        ConnectionId: wsId,
        Data: leaderboardData!,
      };
      const apiGWCommand = new PostToConnectionCommand(apiGWInput);
      await apiGWClient.send(apiGWCommand);
    });

    return dynamoResponse;
  } catch (error) {
    throw Error(error as string);
  }
};
