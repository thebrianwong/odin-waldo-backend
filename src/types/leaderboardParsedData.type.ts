import LeaderboardBase from "./leaderboardBase.type";
import LeaderboardPayload from "./leaderboardPayload.type";

type LeaderboardParsedData = LeaderboardBase & {
  timeStamp: number;
};

export default LeaderboardParsedData;
