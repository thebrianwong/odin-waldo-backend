import GameVersion from "./gameVersion.type";

type LeaderboardPayload = {
  name: string;
  favoritePokemon: string;
  score: number;
  gameVersion: GameVersion;
};

export default LeaderboardPayload;
