import mongoose from "mongoose";
import config from "./config";
import { logger } from "../logging";

// database connection.
const initializeDbConnection = async () => {
  return mongoose
    .connect(config.db.mongodb.MONGO_URL)
    .then(() => logger.info("Database connection established."))
    .catch((error) => {
      console.log("error occured");
      throw new Error(error);
    });
};

export { initializeDbConnection, mongoose };
