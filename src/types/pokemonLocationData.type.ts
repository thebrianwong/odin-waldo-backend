import GameVersion from "./gameVersion.type";

type PokemonLocationData = {
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

export default PokemonLocationData;
