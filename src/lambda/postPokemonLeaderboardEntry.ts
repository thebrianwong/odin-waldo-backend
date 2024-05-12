import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { Handler } from "aws-lambda";
import LeaderboardEntry from "../types/leaderboardEntry.type";

export const postPokemonLeaderboardEntry: Handler = async (event) => {
  const payload: LeaderboardEntry = event.body;

  const client = new DynamoDBClient();
  const input: PutItemCommandInput = {
    TableName: "pokemon-waldo",
    Item: {
      id: {
        S: crypto.randomUUID(),
      },
      favoritePokemon: {
        S: payload.favoritePokemon,
      },
      gameVersion: {
        S: payload.gameVersion,
      },
      name: {
        S: payload.name,
      },
      score: {
        N: String(payload.score),
      },
      timeStamp: {
        N: String(Date.now()),
      },
      type: {
        S: "leaderboard",
      },
    },
  };

  const command = new PutItemCommand(input);
  const response = await client.send(command);

  return response;
};
