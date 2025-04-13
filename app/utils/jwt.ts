import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EX,
  JWT_REFRESH_EX,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} from "@/config/index.js";

export class JWTUtils {
  static signAccessToken(data: { email: string }) {
    const token = jwt.sign(data, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EX,
    }) as string;
    return token;
  }

  static verifyAccessToken(token: string) {
    const data = jwt.verify(token, JWT_ACCESS_SECRET) as {
      email: string;
    };
    return data;
  }

  static signRefreshToken(data: { email: string; password: string }) {
    const token = jwt.sign(data, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EX,
    }) as string;
    return token;
  }

  static verifyRefreshToken(token: string) {
    const data = jwt.verify(token, JWT_REFRESH_SECRET) as {
      email: string;
      password: string;
    };

    return data;
  }
}
