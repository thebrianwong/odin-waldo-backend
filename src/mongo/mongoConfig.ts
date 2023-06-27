import mongoose from "mongoose";

const connectToRealDb = async () => {
  await mongoose.connect(process.env.MONGODB_URL!);
  console.log("Connected to MongoDB.");
};

export default connectToRealDb;
