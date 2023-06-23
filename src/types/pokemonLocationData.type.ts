import GameVersion from "./gameVersion.type";

type DatabasePokemonLocationData = {
  gameVersion: GameVersion;
  data: {
    [key: string]: {
      maximumX: number;
      maximumY: number;
      minimumX: number;
      minimumY: number;
    };
  };
};

type APIPokemonLocationData = {
  [key: string]: {
    [key: string]: {
      maximumX: number;
      maximumY: number;
      minimumX: number;
      minimumY: number;
    };
  };
};

export { DatabasePokemonLocationData, APIPokemonLocationData };
