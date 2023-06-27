import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";
import Leaderboard from "../models/leaderboard.model";
import LeaderboardEntry from "../types/leaderboardEntry.type";

const getLeaderboardEntries: RequestHandler = async (req, res, next) => {
  try {
    const leaderboardEntries: { [key: string]: Array<LeaderboardEntry> } = {
      version1: [],
      version2: [],
      version3: [],
    };
    const rawEntryData: Array<LeaderboardEntry> = await Leaderboard.find(
      {},
      { _id: 0, __v: 0 }
    )
      .sort({
        score: "asc",
      })
      .lean();
    rawEntryData.forEach((entry) => {
      leaderboardEntries[entry.gameVersion!].push(entry);
      entry.gameVersion = undefined;
    });
    res.send(leaderboardEntries);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: `Error retrieving leaderboard data: ${err}` });
  }
};

const validateEntryDetails = [
  body("name").trim().escape().default("Anonymous Trainer"),
  body("score", "Your submission must include a score.").isNumeric().notEmpty(),
  body("favoritePokemon").trim().escape().default("Missingno"),
  body("timeStamp", "Your submission must include a valid date.")
    .trim()
    .escape()
    .isISO8601()
    .notEmpty(),
  body("gameVersion", "Your submission must include a valid game version.")
    .trim()
    .escape()
    .notEmpty()
    .isIn(["version1", "version2", "version3"]),
];

const saveEntryToLeaderboard: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (errors.array().length) {
    const errorMessages: { [key: string]: string } = {};
    errors.array({ onlyFirstError: true }).map((error) => {
      errorMessages[(error as FieldValidationError).path] = error.msg;
    });
    res.status(400).send({
      success: false,
      message: errorMessages,
    });
  } else {
    try {
      const leaderboardEntryDetails = {
        name: req.body.name,
        score: req.body.score,
        favoritePokemon: req.body.favoritePokemon,
        timeStamp: req.body.timeStamp,
        gameVersion: req.body.gameVersion,
      };
      const leaderboardEntry = new Leaderboard(leaderboardEntryDetails);
      await leaderboardEntry.save();
      res.status(201).send({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Error saving score: ${err}` });
    }
  }
};

export { getLeaderboardEntries, validateEntryDetails, saveEntryToLeaderboard };
