import { MONGO_URL, NODE_ENV } from "@/config/env";
import mongoose from "mongoose";

const connectionToDatabase = async (): Promise<void> => {
  try {
    if (!MONGO_URL) {
      throw new Error("Database URL is not defined in environment variables");
    }

    await mongoose.connect(MONGO_URL);

    if (NODE_ENV === "development") {
      console.log("Connected to database successfully");
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Database connection failed: ${error.message}`);

      if (NODE_ENV === "development") {
        console.error(error.stack);
      }
    } else {
      console.error("Unknown database connection error occurred");
    }
    process.exit(1);
  }
};

export default connectionToDatabase;