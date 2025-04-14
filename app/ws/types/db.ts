import { Chat, Message, User } from "@/generated/prisma/index.js";

export type IUser = Omit<User, "password">;

export type IChat = Chat & { users: IUser[] };

export type IMessage = Omit<Message, "authorId"> & { author: IUser };
