import GameVersion from "./gameVersion.type";

type LeaderboardEntry = {
  name: string;
  favoritePokemon: string;
  score: number;
  timeStamp: Date;
  gameVersion?: GameVersion;
};

export default LeaderboardEntry;
