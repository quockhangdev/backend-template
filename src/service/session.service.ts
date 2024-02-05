import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import jwtUtils from "../utils/jwt.utils";
import userService from "./user.service";

class SessionService {
  async create(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent });

    return session.toJSON();
  }

  async find(query: FilterQuery<SessionDocument>) {
    return SessionModel.find(query).lean();
  }

  async update(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
  ) {
    return SessionModel.updateOne(query, update);
  }

  async reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = jwtUtils.verify(refreshToken, "refreshTokenPublicKey");

    if (!decoded || !get(decoded, "session")) return false;

    const session = await SessionModel.findById(get(decoded, "session"));

    if (!session || !session.valid) return false;

    const user = await userService.find({ _id: session.user });

    if (!user) return false;

    const accessToken = jwtUtils.sign(
      { ...user, session: session._id },
      "accessTokenPrivateKey",
      { expiresIn: config.get("accessTokenTtl") } // 15 minutes
    );

    return accessToken;
  }
}

export default new SessionService();
