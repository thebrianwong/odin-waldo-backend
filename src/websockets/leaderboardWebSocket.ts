import { server } from "../index";
import WebSocket, { WebSocketServer } from "ws";
import Leaderboard from "../models/leaderboard.model";
import { transformLeaderboardData } from "../controllers/leaderboardController";

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  wss.on("updateLeaderboard", (data) => {
    try {
      console.log("Listened to emitted event - received leaderboard entries.");
      const stringJSON = JSON.stringify(data);
      ws.send(stringJSON);
    } catch (err: any) {
      throw new Error(err);
    }
  });

  Leaderboard.watch().on("change", async () => {
    try {
      console.log("Leaderboard change - querying entries - emitting event.");
      const leaderboardData = await transformLeaderboardData();
      wss.emit("updateLeaderboard", leaderboardData);
    } catch (err: any) {
      throw new Error(err);
    }
  });
});

export default wss;
