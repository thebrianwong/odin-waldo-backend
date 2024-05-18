import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { Handler } from "aws-lambda";
import LeaderboardPayload from "../types/leaderboardPayload.type";

export const postPokemonLeaderboardEntry: Handler = async (event) => {
  try {
    const payload: LeaderboardPayload = event;

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
    await client.send(command);

    return {
      message: "New leaderboard entry successfully inserted into DynamoDB.",
    };
  } catch (error) {
    throw Error(error as string);
  }
};
