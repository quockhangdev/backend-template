import express from "express";
import userController from "../controller/user.controller";
import { createUserSchema } from "../schema/user.schema";
import validateResource from "../middleware/validateResource";

const router = express.Router();

/**
 * @openapi
 * "/api/users":
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: "#/components/schemas/CreateUserInput"
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CreateUserResponse"
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
  "/",
  validateResource(createUserSchema),
  userController.createUserHandler
);

export default router;
