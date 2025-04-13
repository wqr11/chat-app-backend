import { JWT_ACCESS_EX } from "@/config/index.js";
import { redis } from "@/db/index.js";
import { AuthRepository } from "@/repository/auth/index.js";
import {
  AuthEmailPasswordSchema,
  AuthEmailPasswordType,
} from "@/schemas/auth.js";
import { LoginServiceResult } from "@/types/index.js";
import { EncryptionUtils } from "@/utils/encryption.js";
import { JWTUtils } from "@/utils/jwt.js";

export const loginService = async (
  body: AuthEmailPasswordType
): Promise<LoginServiceResult> => {
  const parsed = await AuthEmailPasswordSchema.safeParseAsync(body);

  if (!parsed.success) {
    return {
      success: false,
      code: 400,
      error: "Invalid data",
    };
  }

  const { email, password } = parsed.data;

  const foundUser = await AuthRepository.findUserByEmail(email);

  if (!foundUser) {
    return {
      success: false,
      code: 404,
      error: "User not found",
    };
  }

  const passwordsAlign = await EncryptionUtils.compareHash({
    plain: password,
    encrypted: foundUser.password,
  });

  if (!passwordsAlign) {
    return {
      success: false,
      code: 401,
      error: "Incorrect password",
    };
  }

  try {
    const accessToken = JWTUtils.signAccessToken({ email });
    const refreshToken = JWTUtils.signRefreshToken({ email, password });

    await redis.set(email, accessToken, {
      EX: JWT_ACCESS_EX,
    });

    return {
      success: true,
      code: 200,
      data: {
        access: accessToken,
        refresh: refreshToken,
      },
    };
  } catch (err) {
    return {
      success: false,
      code: 400,
      error: err,
    };
  }
};
