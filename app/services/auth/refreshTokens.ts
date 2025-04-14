import { JWTUtils } from "@/utils/jwt.js";
import { EncryptionUtils } from "@/utils/encryption.js";

import { AuthRepository } from "@/repository/auth/index.js";

import { RefreshTokensResult } from "@/types/index.js";
import { AuthenticationError } from "@/types/errors.js";

export const refreshTokens = async ({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<RefreshTokensResult> => {
  let refreshData: { email: string; password: string };

  try {
    refreshData = JWTUtils.verifyRefreshToken(refreshToken);
  } catch {
    return {
      success: false,
      error: new AuthenticationError("Invalid refresh token"),
    };
  }

  const user = await AuthRepository.findUserByEmail(refreshData.email);

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
    email: refreshData.email,
  });
  const newRefreshToken = JWTUtils.signRefreshToken({
    email: refreshData.email,
    password: refreshData.password,
  });

  return {
    success: true,
    data: {
      email: user.email,
      access: newAccessToken,
      refresh: newRefreshToken,
    },
  };
};
