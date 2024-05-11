import {
  DynamoDBClient,
  ScanCommand,
  ScanInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import LeaderboardEntry from "../types/leaderboardEntry.type";

export const getPokemonLeaderboard = async (_event: any) => {
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

  const leaderboardData: { [key: string]: Array<LeaderboardEntry> } = {
    version1: [],
    version2: [],
    version3: [],
  };

  response.Items?.forEach((item) => {
    const parsedItem = unmarshall(item) as LeaderboardEntry;
    leaderboardData[parsedItem.gameVersion].push(parsedItem);
  });

  Object.keys(leaderboardData).forEach((version) => {
    leaderboardData[version].sort((a, b) => a.score - b.score);
  });

  return leaderboardData;
};
