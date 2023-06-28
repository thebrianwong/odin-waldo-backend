import { server } from "../index";
import WebSocket, { WebSocketServer } from "ws";
import Leaderboard from "../models/leaderboard.model";
import { transformLeaderboardData } from "../controllers/leaderboardController";

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  wss.on("updateLeaderboard", (data) => {
    console.log("Listened to emitted event - received leaderboard entries.");
    const stringJSON = JSON.stringify(data);
    ws.send(stringJSON);
  });

  Leaderboard.watch().on("change", async () => {
    console.log("Leaderboard change - querying entries - emitting event.");
    const leaderboardData = await transformLeaderboardData();
    wss.emit("updateLeaderboard", leaderboardData);
  });
});

export default wss;
