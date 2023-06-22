import express from "express";
import { getLeaderboardEntries } from "../controllers/leaderboardController";

const router = express.Router();

/* GET users listing. */
router.get("/", getLeaderboardEntries);

export default router;
