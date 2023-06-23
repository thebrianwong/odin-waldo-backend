import { RequestHandler } from "express";
import Leaderboard from "../models/leaderboard.model";
import LeaderboardEntry from "../types/leaderboardEntry.type";

const getLeaderboardEntries: RequestHandler = async (req, res, next) => {
  const leaderboardEntries: { [key: string]: Array<LeaderboardEntry> } = {
    version1: [],
    version2: [],
    version3: [],
  };
  const rawEntryData = (await Leaderboard.find({}, { _id: 0, __v: 0 }).sort({
    score: "asc",
  })) as Array<LeaderboardEntry>;
  rawEntryData.forEach((entry) => {
    leaderboardEntries[entry.gameVersion!].push(entry);
    entry.gameVersion = undefined;
  });
  res.send(leaderboardEntries);
};

export { getLeaderboardEntries };
