import { Schema, model } from "mongoose";

const gameVersions = ["version1", "version2", "version3"];

const LeaderboardSchema = new Schema({
  name: String,
  favoritePokemon: String,
  score: Number,
  timeStamp: Date,
  gameVersion: { type: String, enum: gameVersions },
});

const Leaderboard = model("leaderboard-entry", LeaderboardSchema);

export default Leaderboard;
