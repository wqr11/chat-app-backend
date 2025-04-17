import { AuthRepository } from "@/repository/auth/index.js";
import { LoginSchema, LoginSchemaType } from "@/http/schemas/auth.js";
import { LoginServiceResult } from "@/http/types/service.js";
import { EncryptionUtils } from "@/utils/encryption.js";
import { JWTUtils } from "@/utils/jwt.js";
import { RedisUtils } from "@/utils/redis.js";

export const login = async (
  body: LoginSchemaType
): Promise<LoginServiceResult> => {
  const parsed = await LoginSchema.safeParseAsync(body);

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
    const accessToken = JWTUtils.signAccessToken({ userId: foundUser.id });
    const refreshToken = JWTUtils.signRefreshToken({
      userId: foundUser.id,
      password,
    });

    await RedisUtils.setUserIdToken({
      userId: foundUser.id,
      token: accessToken,
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
