import LeaderboardParsedData from "./leaderboardParsedData.type";
import LeaderboardPayload from "./leaderboardPayload.type";

type LeaderboardRawData = LeaderboardParsedData &
  LeaderboardPayload & {
    type: "leaderboard";
    id: string;
  };

export default LeaderboardRawData;
