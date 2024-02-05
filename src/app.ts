import express, { Request, Response } from "express";
import config from "config";
import responseTime from "response-time";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";
import swaggerDocs from "./utils/swagger";
import morgan from "morgan";
import dayjs from "dayjs";
import chalk from "chalk";
import websockets from "./socket/websockets";

const port = config.get<number>("port");

const app = express();

app.use(express.json());

morgan.token("timestamp", () => {
  return dayjs().format("MM/DD/YYYY HH:mm:ss");
});

morgan.format("me", (tokens: any, req: Request, res: Response) => {
  return [
    chalk.white(tokens.timestamp()),
    "🚀",
    chalk.red(tokens.method(req, res)),
    chalk.green(tokens.url(req, res)),
    chalk.yellow(tokens.status(req, res)),
    chalk.cyan(tokens["response-time"](req, res) + " ms"),
    chalk.blue(tokens["remote-addr"](req, res)),
  ].join(" ");
});

app.use(morgan("me"));

app.use(deserializeUser);

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

const server = app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);

  startMetricsServer();

  swaggerDocs(app, port);
});

// websockets(server);

app.closeServer = () => {
  server.close();
};

process.on("SIGINT", () => {
  app.closeServer();
});

process.on("SIGTERM", () => {
  app.closeServer();
});

export default app;
