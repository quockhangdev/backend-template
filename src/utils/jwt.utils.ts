import jwt from "jsonwebtoken";
import config from "config";
import log from "./logger";

class JWTUtils {
  sign(
    object: Object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: jwt.SignOptions | undefined
  ) {
    const signingKey = Buffer.from(
      config.get<string>(keyName),
      "base64"
    ).toString("ascii");

    return jwt.sign(object, signingKey, {
      ...(options && options),
      algorithm: "RS256",
    });
  }

  verify(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
  ) {
    const publicKey = Buffer.from(
      config.get<string>(keyName),
      "base64"
    ).toString("ascii");

    try {
      const decoded = jwt.verify(token, publicKey);
      return {
        valid: true,
        expired: false,
        decoded,
      };
    } catch (e: any) {
      log.error(e);
      return {
        valid: false,
        expired: e.message === "jwt expired",
        decoded: null,
      };
    }
  }
}

export default new JWTUtils();
