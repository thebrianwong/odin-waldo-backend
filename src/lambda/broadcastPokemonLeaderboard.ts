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
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const broadcastPokemonLeaderboard: Handler = async (event) => {
  // call lambda to get leaderboard
  // query dynamodb to get all ws connection ids
  // send leadrboard to each ws connection
  const lambdaClient = new LambdaClient();
  const lambdaInput: InvokeCommandInputType = {
    FunctionName: "getPokemonLeaderboard",
  };
  const lambdaCommand = new InvokeCommand(lambdaInput);
  const rawLambdaResponse = await lambdaClient.send(lambdaCommand);
  const leaderboardData = JSON.parse(
    rawLambdaResponse.Payload?.transformToString()!
  );

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

  dynamoResponse.Items?.forEach((rawData) => {
    const parsedData = unmarshall(rawData);
    const wsId = parsedData.id;
  });

  return dynamoResponse;
};
