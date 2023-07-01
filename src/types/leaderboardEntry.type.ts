import GameVersion from "./gameVersion.type";

type LeaderboardEntry = {
  name: string;
  favoritePokemon: string;
  score: number;
  gameVersion?: GameVersion;
};

type RawLeaderboardEntry = LeaderboardEntry & {
  timeStamp: Date;
};

type ParsedLeaderboardEntry = LeaderboardEntry & {
  timeStamp: string;
};

export { RawLeaderboardEntry, ParsedLeaderboardEntry };
