import { User } from "./user";

interface Message {
  id: number,
  chatId: number,
  userId: number,
  text: string,
  createdAt: string
}

interface Chat {
  id: number,
  title?: string,
  isDialog: boolean,
  lastMessageId?: number,
  lastMessage?: Message,
  users?: User[],
}

// API
interface FindChatParams {
  chatId: number,
}

interface CreateChatParams {
  title?: string,
  isDialog: boolean,
  users?: number[],
}

interface GetUserChatsParams {
  userId: number,
  startMessageId?: number | null,
}

interface CreateMessageParams {
  chatId: number,
  text: string,
}

interface GetChatMessagesParams {
  chatId: number,
  startId?: number | null,
}

interface FindChatResponse {
  data: Chat,
}

interface CreateChatResponse {
  data: Chat,
}

interface GetUserChatsResponse {
  data: Chat[],
}

interface CreateMessageResponse {
  data: Message,
}

interface GetChatMessagesResponse {
  data: Message[],
}

export type {
  Message,
  Chat,
  FindChatParams,
  CreateChatParams,
  GetUserChatsParams,
  CreateMessageParams,
  GetChatMessagesParams,
  FindChatResponse,
  CreateChatResponse,
  GetUserChatsResponse,
  CreateMessageResponse,
  GetChatMessagesResponse,
};