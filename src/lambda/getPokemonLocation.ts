import {
  DynamoDBClient,
  ScanCommand,
  ScanInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import PokemonLocationData from "../types/pokemonLocationData.type";

const client = new DynamoDBClient();

export const getPokemonLocation = async () => {
  try {
    const input: ScanInput = {
      TableName: "pokemon-waldo",
      ExpressionAttributeNames: {
        "#T": "type",
      },
      ExpressionAttributeValues: {
        ":type": {
          S: "location",
        },
      },
      FilterExpression: "#T = :type",
    };
    const command = new ScanCommand(input);
    const response = await client.send(command);

    const locationData = {
      version1: {},
      version2: {},
      version3: {},
    };

    response.Items?.forEach((item) => {
      const parsedItem = unmarshall(item) as PokemonLocationData;
      locationData[parsedItem.gameVersion] = parsedItem.data;
    });

    return locationData;
  } catch (error) {
    throw Error(error as string);
  }
};
