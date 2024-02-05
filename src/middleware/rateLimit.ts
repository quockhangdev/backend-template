import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../utils/connect";

const slowDownLimiter = slowDown({
  windowMs: 2 * 60 * 1000,
  delayAfter: 5,
  delayMs: (hits) => hits * 10,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient!.sendCommand(args),
  }),
});

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient!.sendCommand(args),
  }),
});
