import express from "express";
import {
  getLeaderboardEntries,
  saveEntryToLeaderboard,
  validateEntryDetails,
} from "../controllers/leaderboardController";

const router = express.Router();

// GET leaderboard sorted by best scores
router.get("/", getLeaderboardEntries);

// POST new score to leaderboard
router.post("/new", validateEntryDetails, saveEntryToLeaderboard);

export default router;
