import GameVersion from "./gameVersion.type";

type LeaderboardEntry = {
  name: string;
  favoritePokemon: string;
  score: number;
  gameVersion: GameVersion;
  timeStamp: number;
  type: "leaderboard";
  id: string;
};

export default LeaderboardEntry;
