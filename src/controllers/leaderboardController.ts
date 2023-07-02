import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";
import Leaderboard from "../models/leaderboard.model";
import {
  RawLeaderboardEntry,
  ParsedLeaderboardEntry,
} from "../types/leaderboardEntry.type";

const transformLeaderboardData = async () => {
  try {
    const leaderboardEntries: { [key: string]: Array<ParsedLeaderboardEntry> } =
      {
        version1: [],
        version2: [],
        version3: [],
      };
    const rawEntryData: Array<RawLeaderboardEntry> = await Leaderboard.find(
      {},
      { _id: 0, __v: 0 }
    )
      .sort({
        score: "asc",
      })
      .lean();
    rawEntryData.forEach((rawEntry) => {
      const parsedEntry: ParsedLeaderboardEntry = {
        ...rawEntry,
        timeStamp: rawEntry.timeStamp.toDateString(),
        gameVersion: undefined,
      };
      leaderboardEntries[rawEntry.gameVersion!].push(parsedEntry);
    });
    return leaderboardEntries;
  } catch (err) {
    throw new Error(`Error retrieving leaderboard data: ${err}`);
  }
};

const getLeaderboardEntries: RequestHandler = async (req, res, next) => {
  try {
    const leaderboardEntries: {
      [key: string]: Array<ParsedLeaderboardEntry>;
    } = await transformLeaderboardData();
    res.send(leaderboardEntries);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
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
    const errorMessages: Array<string> = [];
    errors.array({ onlyFirstError: true }).map((error) => {
      errorMessages.push(error.msg);
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
      res
        .status(500)
        .send({ success: false, message: `Error saving score: ${err}` });
    }
  }
};

export {
  transformLeaderboardData,
  getLeaderboardEntries,
  validateEntryDetails,
  saveEntryToLeaderboard,
};
