import { JWTUtils } from "@/utils/jwt.js";
import { EncryptionUtils } from "@/utils/encryption.js";

import { AuthRepository } from "@/repository/auth/index.js";

import { RefreshTokensResult } from "@/http/types/service.js";
import { AuthenticationError } from "@/http/types/errors.js";

export const refreshTokens = async ({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<RefreshTokensResult> => {
  let refreshData: { userId: string; password: string };

  try {
    refreshData = JWTUtils.verifyRefreshToken(refreshToken);
  } catch {
    return {
      success: false,
      error: new AuthenticationError("Invalid refresh token"),
    };
  }

  const user = await AuthRepository.findUserById(refreshData.userId);

  if (!user) {
    return {
      success: false,
      error: new AuthenticationError("No such user"),
    };
  }

  const passwordsAlign = await EncryptionUtils.compareHash({
    plain: refreshData.password,
    encrypted: user!.password,
  });

  if (!passwordsAlign) {
    return {
      success: false,
      error: new AuthenticationError("Passwords mismatch"),
    };
  }

  const newAccessToken = JWTUtils.signAccessToken({
    userId: refreshData.userId,
  });
  const newRefreshToken = JWTUtils.signRefreshToken({
    userId: refreshData.userId,
    password: refreshData.password,
  });

  return {
    success: true,
    data: {
      userId: user.id,
      access: newAccessToken,
      refresh: newRefreshToken,
    },
  };
};
