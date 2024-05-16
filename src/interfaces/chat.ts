import { User } from "./user";
import { AxiosResponse } from "axios";

export interface Message {
  id: number,
  chatId: number,
  userId: number,
  text: string,
  createdAt: string
}

export interface Chat {
  id: number,
  title?: string,
  isDialog: boolean,
  lastMessageId?: number,
  lastMessage?: Message,
  users?: User[],
}

export type AxiosFindChat = AxiosResponse<{ data: Chat }>;
export type AxiosCreateChat = AxiosResponse<{ data: Chat }>;
export type AxiosGetUserChats = AxiosResponse<{ data: Chat[] }>;
export type AxiosCreateMessage = AxiosResponse<{ data: Message }>;
export type AxiosGetChatMessages = AxiosResponse<{ data: Message[] }>;
