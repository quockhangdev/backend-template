import mongoose from "mongoose";
import config from "config";
import logger from "./logger";
import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>;

class DatabaseConnection {
  redisClient: RedisClient | null;

  constructor() {
    this.redisClient = null;
  }

  async mongo() {
    try {
      await mongoose.connect(config.get<string>("mongodb.uri"));
      logger.info("MongoDB connected");
    } catch (e) {
      logger.error("Could not connect to MongoDB", e);
      process.exit(1);
    }
  }

  async redis() {
    try {
      this.redisClient = createClient({
        username: config.get<string>("redis.username"),
        password: config.get<string>("redis.password"),
        url: config.get<string>("redis.uri"),
      });

      await this.redisClient.connect();
    } catch (e) {
      logger.error("Could not connect to Redis", e);
      process.exit(1);
    }
  }
}

async function onShutdown() {
  await mongoose.disconnect();
  if (db.redisClient) {
    db.redisClient.disconnect();
  }
}

process.on("SIGINT", onShutdown);
process.on("SIGTERM", onShutdown);

const db = new DatabaseConnection();
export const redisClient = db.redisClient;

async function connect() {
  await db.mongo();
  // await db.redis();
}

export default connect;
