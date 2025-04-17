import { AuthRepository } from "@/repository/auth/index.js";
import { SignUpSchema, SignUpSchemaType } from "@/http/schemas/auth.js";
import { ServiceResult } from "@/http/types/service.js";
import { EncryptionUtils } from "@/utils/encryption.js";

export const signUp = async (
  body: SignUpSchemaType
): Promise<ServiceResult> => {
  const parsed = await SignUpSchema.safeParseAsync(body);

  if (!parsed.success) {
    return {
      success: false,
      code: 400,
      data: parsed.error.errors,
    };
  }

  const { name, email, password } = parsed.data;

  const userExists = await AuthRepository.checkIfUserEmailExists(email);

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
      name,
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
