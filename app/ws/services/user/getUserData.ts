import { UserRepository } from "@/repository/user/index.js";
import { WsServiceResult } from "@/ws/types/service.js";

export const getUserData = async ({
  userId,
}: {
  userId: string;
}): Promise<WsServiceResult> => {
  try {
    const userData = await UserRepository.getUserData({
      userId,
    });
    return {
      success: true,
      data: userData,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
