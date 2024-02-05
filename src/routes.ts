import { Express } from "express";
import healthcheckRoute from "./routes/healthcheck.route";
import userRoute from "./routes/user.route";
import sessionRoute from "./routes/session.route";

function routes(app: Express) {
  app.use("/healthcheck", healthcheckRoute);
  app.use("/api/users", userRoute);
  app.use("/api/sessions", sessionRoute);
}

export default routes;
