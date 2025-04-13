import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "@/config/index.js";

export class EncryptionUtils {
  static async getHash(data: string) {
    return await bcrypt.hash(data, BCRYPT_SALT_ROUNDS);
  }

  static async compareHash({
    plain,
    encrypted,
  }: {
    plain: string;
    encrypted: string;
  }) {
    return await bcrypt.compare(plain, encrypted);
  }
}
