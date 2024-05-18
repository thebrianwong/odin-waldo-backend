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
  const lambdaClient = new LambdaClient();
  const lambdaInput: InvokeCommandInputType = {
    FunctionName: "getPokemonLeaderboard",
  };
  const lambdaCommand = new InvokeCommand(lambdaInput);
  try {
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
    try {
      const dynamoResponse = await dynamoClient.send(dynamoCommand);
      const apiGWClient = new ApiGatewayManagementApiClient({
        endpoint: process.env.API_GATEWAY_WS_URL,
      });
      try {
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
            return {
              statusCode: 500,
              error,
              message: `There was an error while broadcasting to active WebSocket client with a connection ID of ${wsId}.`,
            };
          }
        });
        return {
          statusCode: 200,
          message: "Successfully broadcasted to all active WebSocket clients.",
        };
      } catch (error) {
        return {
          statusCode: 500,
          error,
          message:
            "There was an error while broadcasting to all active WebSocket clients.",
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        error,
        message:
          "There was an error while querying DynamoDB for active WebSocket client IDs.",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      error,
      message:
        "There was an error while invoking the Lambda function to get leaderboard entries.",
    };
  }
};
