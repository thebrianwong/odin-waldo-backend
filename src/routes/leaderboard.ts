import express from "express";
import { getLeaderboardEntries } from "../controllers/leaderboardController";

const router = express.Router();

// GET leaderboard sorted by best scores
router.get("/", getLeaderboardEntries);

export default router;
