import dotenv from "dotenv";
import { get } from "lodash";
dotenv.config();

export default {
  env: get(process.env, "NODE_ENV", "development"),

  port: get(process.env, "PORT", 3003),

  mongodb: {
    uri: get(process.env, "MONGODB_URI", "mongodb://localhost:27017/rest-api"),
  },

  redis: {
    username: get(process.env, "REDIS_USERNAME", "default"),
    password: get(process.env, "REDIS_PASSWORD", "1"),
    uri: get(process.env, "REDIS_URI", "redis://localhost:6379"),
  },

  rabbitmq: {
    uri: get(process.env, "RABBITMQ_URI", "amqp://guest:guest@localhost:5672"),
  },

  saltWorkFactor: 42,

  accessTokenTtl: "7d",
  refreshTokenTtl: "1m",

  accessTokenPrivateKey: `accessTokenPrivateKey`,
  accessTokenPublicKey: `accessTokenPublicKey`,
  refreshTokenPrivateKey: `refreshTokenPrivateKey`,
  refreshTokenPublicKey: `refreshTokenPublicKey`,
};
