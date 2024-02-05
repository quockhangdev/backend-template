import express from "express";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import sessionController from "../controller/session.controller";
import { createSessionSchema } from "../schema/session.schema";

const router = express.Router();

router.post(
  "/",
  validateResource(createSessionSchema),
  sessionController.createUserSessionHandler
);

router.get("/", requireUser, sessionController.getUserSessionsHandler);

router.delete("/", requireUser, sessionController.deleteSessionHandler);

export default router;
