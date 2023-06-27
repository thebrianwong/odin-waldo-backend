import createError from "http-errors";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";

import ErrorResponse from "./types/errorResponse.type";

import pokemonLocationRouter from "./routes/pokemonLocation";
import leaderboardRouter from "./routes/leaderboard";

dotenv.config();

export const app = express();

import initializeMongoServer from "./mongo/mongoTestConfig";
import connectToRealDb from "./mongo/mongoConfig";

if (process.env.TEST) {
  initializeMongoServer();
} else {
  connectToRealDb();
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/pokemonLocation", pokemonLocationRouter);
app.use("/api/leaderboard", leaderboardRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use(
  (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({ message: "Invalid URL." });
  }
);
