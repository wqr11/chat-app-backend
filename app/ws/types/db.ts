import { Chat, Message, User } from "@/generated/prisma/index.js";

export type IUser = Omit<User, "password">;

export type IChat = Chat & { author: IUser };

export type IMessage = Omit<Message, "authorId"> & { author: IUser };
