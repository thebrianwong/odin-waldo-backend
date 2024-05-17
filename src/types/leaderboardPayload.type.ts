import GameVersion from "./gameVersion.type";
import LeaderboardBase from "./leaderboardBase.type";

type LeaderboardPayload = LeaderboardBase & {
  gameVersion: GameVersion;
};

export default LeaderboardPayload;
