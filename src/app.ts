import createError from "http-errors";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import ErrorResponse from "./types/errorResponse.type.js";

import pokemonLocationRouter from "./routes/pokemonLocation.js";
import leaderboardRouter from "./routes/leaderboard.js";

dotenv.config();

const app = express();

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URL!);
  console.log("Connected to MongoDB.");
};

main().catch((err) => console.log(err));

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
    res.render("error");
  }
);

module.exports = app;
