import { WebSocketServer } from "ws";
import Leaderboard from "../models/leaderboard.model";
import { transformLeaderboardData } from "../controllers/leaderboardController";
import { Server } from "http";

const createWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });
  console.log("connecting to ws");
  wss.on("connection", (ws) => {
    console.log("the thing!");
    wss.on("updateLeaderboard", (data) => {
      console.log("llpl");
      try {
        console.log(
          "Listened to emitted event - received leaderboard entries."
        );
        const stringJSON = JSON.stringify(data);
        ws.send(stringJSON);
      } catch (err: any) {
        throw new Error(err);
      }
    });

    Leaderboard.watch().on("change", async () => {
      console.log("TRIGGERED");
      try {
        console.log("Leaderboard change - querying entries - emitting event.");
        const leaderboardData = await transformLeaderboardData();
        wss.emit("updateLeaderboard", leaderboardData);
      } catch (err: any) {
        throw new Error(err);
      }
    });
  });
};

export default createWebSocketServer;
