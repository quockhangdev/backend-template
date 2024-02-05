import { Request, Response } from "express";
import config from "config";
import sessionService from "../service/session.service";
import userService from "../service/user.service";
import jwtUtils from "../utils/jwt.utils";

class SessionController {
  async createUserSessionHandler(req: Request, res: Response) {
    const user = await userService.validatePassword(req.body);

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const session = await sessionService.create(
      user._id,
      req.get("user-agent") || ""
    );

    const accessToken = jwtUtils.sign(
      { ...user, session: session._id },
      "accessTokenPrivateKey",
      { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
    );

    const refreshToken = jwtUtils.sign(
      { ...user, session: session._id },
      "refreshTokenPrivateKey",
      { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
    );

    return res.send({ accessToken, refreshToken });
  }

  async getUserSessionsHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;

    const sessions = await sessionService.find({ user: userId, valid: true });

    return res.send(sessions);
  }

  async deleteSessionHandler(req: Request, res: Response) {
    const sessionId = res.locals.user.session;

    await sessionService.update({ _id: sessionId }, { valid: false });

    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  }
}

export default new SessionController();
