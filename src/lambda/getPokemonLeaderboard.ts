import {
  DynamoDBClient,
  ScanCommand,
  ScanInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import LeaderboardRawData from "../types/leaderboardRawData.type";
import LeaderboardParsedData from "../types/leaderboardParsedData.type";

export const getPokemonLeaderboard = async () => {
  try {
    const client = new DynamoDBClient();
    const input: ScanInput = {
      TableName: "pokemon-waldo",
      ExpressionAttributeNames: {
        "#T": "type",
      },
      ExpressionAttributeValues: {
        ":type": {
          S: "leaderboard",
        },
      },
      FilterExpression: "#T = :type",
    };
    const command = new ScanCommand(input);
    const response = await client.send(command);

    const leaderboardData: { [key: string]: Array<LeaderboardParsedData> } = {
      version1: [],
      version2: [],
      version3: [],
    };

    response.Items?.forEach((item) => {
      const parsedItem = unmarshall(item) as LeaderboardRawData;
      const formattedItem = {
        favoritePokemon: parsedItem.favoritePokemon,
        name: parsedItem.name,
        score: parsedItem.score,
        timeStamp: parsedItem.timeStamp,
      };
      leaderboardData[parsedItem.gameVersion].push(formattedItem);
    });

    Object.keys(leaderboardData).forEach((version) => {
      leaderboardData[version].sort((a, b) => a.score - b.score);
    });

    return leaderboardData;
  } catch (error) {
    throw Error(error as string);
  }
};
