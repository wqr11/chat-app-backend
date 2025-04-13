import { AuthRepository } from "@/repository/auth/index.js";
import {
  AuthEmailPasswordSchema,
  AuthEmailPasswordType,
} from "@/schemas/auth.js";
import { ServiceResult } from "@/types/index.js";
import { EncryptionUtils } from "@/utils/encryption.js";

export const signUpService = async (
  body: AuthEmailPasswordType
): Promise<ServiceResult> => {
  const parsed = await AuthEmailPasswordSchema.safeParseAsync(body);

  if (!parsed.success) {
    return {
      success: false,
      code: 400,
      data: parsed.error.errors,
    };
  }

  const { email, password } = parsed.data;

  const userExists = await AuthRepository.checkIfuserEmailExists(email);

  if (userExists) {
    return {
      success: false,
      code: 409,
      data: "User already exists",
    };
  }

  const encryptedPassword = await EncryptionUtils.getHash(password);

  try {
    const createdUser = await AuthRepository.createUser({
      email,
      password: encryptedPassword,
    });

    return {
      success: true,
      code: 201,
      data: createdUser,
    };
  } catch (err) {
    return {
      success: false,
      code: 500,
      data: err,
    };
  }
};
