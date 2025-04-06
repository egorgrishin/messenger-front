import { User } from "interfaces/user";
import { AxiosResponse } from "axios";
import { FileModel } from 'interfaces/file.ts';

export interface Message {
  id: number,
  chatId: number,
  userId: number,
  text: string,
  createdAt: string
  files: FileModel[],
  filesCount: number | null,
}

export interface Chat {
  id: number,
  lastMessageId?: number,
  lastMessage?: Message,
  users?: User[],
}

export type AxiosFindChat = AxiosResponse<{ data: Chat }>;
export type AxiosCreateChat = AxiosResponse<{
  data: {
    isCreated: boolean,
    chat: Chat,
  },
}>;
export type AxiosGetUserChats = AxiosResponse<{ data: Chat[] }>;
export type AxiosCreateMessage = AxiosResponse<{ data: Message }>;
export type AxiosGetChatMessages = AxiosResponse<{ data: Message[] }>;
