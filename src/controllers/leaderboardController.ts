import { RequestHandler } from "express";
import Leaderboard from "../models/leaderboard.model";
import LeaderboardEntry from "../types/leaderboardEntry.type";

const getLeaderboardEntries: RequestHandler = async (req, res, next) => {
  const leaderboardEntries: { [key: string]: Array<LeaderboardEntry> } = {
    version1: [],
    version2: [],
    version3: [],
  };
  await Promise.all(
    Object.keys(leaderboardEntries).map(async (version) => {
      const versionLeaderboardEntries: Array<LeaderboardEntry> =
        await Leaderboard.find({ gameVersion: version }, { _id: 0, __v: 0 });
      versionLeaderboardEntries.sort((a, b) => {
        return a.score - b.score;
      });
      leaderboardEntries[version] = versionLeaderboardEntries;
    })
  );
  res.send(leaderboardEntries);
};

export { getLeaderboardEntries };
