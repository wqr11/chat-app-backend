import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EX,
  JWT_REFRESH_EX,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} from "@/config/index.js";

export class JWTUtils {
  static signAccessToken(data: { userId: string }) {
    const token = jwt.sign(data, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EX,
    }) as string;
    return token;
  }

  static verifyAccessToken(token: string) {
    const data = jwt.verify(token, JWT_ACCESS_SECRET) as {
      userId: string;
    };
    return data;
  }

  static signRefreshToken(data: { userId: string; password: string }) {
    const token = jwt.sign(data, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EX,
    }) as string;
    return token;
  }

  static verifyRefreshToken(token: string) {
    const data = jwt.verify(token, JWT_REFRESH_SECRET) as {
      userId: string;
      password: string;
    };

    return data;
  }
}
