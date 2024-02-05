import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import userService from "../service/user.service";
import logger from "../utils/logger";

class UserController {
  async createUserHandler(
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response
  ) {
    try {
      const user = await userService.create(req.body);
      return res.send(user);
    } catch (e: any) {
      logger.error(e);
      return res.status(409).send(e.message);
    }
  }
}

export default new UserController();
