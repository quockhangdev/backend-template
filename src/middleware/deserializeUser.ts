import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import jwtUtils from "../utils/jwt.utils";
import sessionService from "../service/session.service";
import log from "../utils/logger";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get<Request, string>(req, "headers.x-refresh");

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = jwtUtils.verify(
    accessToken,
    "accessTokenPublicKey"
  );

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await sessionService.reIssueAccessToken({
      refreshToken,
    });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const result = jwtUtils.verify(
      newAccessToken as string,
      "accessTokenPublicKey"
    );

    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
