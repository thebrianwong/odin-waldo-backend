import { Handler } from "aws-lambda";
import {
  LambdaClient,
  InvokeCommand,
  InvokeCommandInputType,
} from "@aws-sdk/client-lambda";

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

  return leaderboardData;
};
