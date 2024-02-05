import { Connection } from "rabbitmq-client";
import config from "config";
import log from "../utils/logger";

const rabbit = new Connection(config.get("rabbitmq.uri"));

rabbit.on("error", (err) => {
  console.log("RabbitMQ connection error", err);
});
rabbit.on("connection", () => {
  console.log("Connection successfully (re)established");
});

async function onShutdown() {
  await rabbit.close();
}

process.on("SIGINT", onShutdown);
process.on("SIGTERM", onShutdown);
