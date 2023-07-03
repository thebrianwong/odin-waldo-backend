import { WebSocketServer } from "ws";
import Leaderboard from "../models/leaderboard.model";
import { transformLeaderboardData } from "../controllers/leaderboardController";
import { Server } from "http";

const createWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", () => {
    console.log("New websocket client connection.");
  });
  wss.on("updateLeaderboard", (data) => {
    console.log("Listened to emitted event - sending leaderboard entries.");
    wss.clients.forEach((client) => {
      try {
        client.send(data);
      } catch (err: unknown) {
        if (typeof err === "string") {
          throw new Error(err);
        } else if (err instanceof Error) {
          throw new Error(err.message);
        } else {
          console.error(
            "Something went horribly wrong! Please refresh the page or try again later."
          );
        }
      }
    });
  });

  Leaderboard.watch().on("change", async () => {
    try {
      console.log("Leaderboard change - querying entries - emitting event.");
      const leaderboardData = await transformLeaderboardData();
      wss.emit("updateLeaderboard", JSON.stringify(leaderboardData));
    } catch (err: unknown) {
      if (typeof err === "string") {
        throw new Error(err);
      } else if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        console.error(
          "Something went horribly wrong! Please refresh the page or try again later."
        );
      }
    }
  });
};

export default createWebSocketServer;
