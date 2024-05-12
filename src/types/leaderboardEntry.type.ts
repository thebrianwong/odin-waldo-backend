import LeaderboardPayload from "./leaderboardPayload";

type LeaderboardEntry = LeaderboardPayload & {
  timeStamp: number;
  type: "leaderboard";
  id: string;
};

export default LeaderboardEntry;
