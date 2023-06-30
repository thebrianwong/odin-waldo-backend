import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

const initializeMongoServer = async () => {
  const mongoServer = await MongoMemoryReplSet.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri);

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri);
    }
    console.log(e);
  });

  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
};

export default initializeMongoServer;
