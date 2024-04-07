import { User } from "./user";

interface Message {
  id: number,
  chat_id: number,
  user_id: number,
  text: string,
  created_at: string
}

interface Chat {
  id: number,
  title?: string,
  is_dialog: boolean,
  last_message_id?: number,
  last_message?: Message,
  users?: User[],
}

interface GetUserChatsResponse {
  data: Chat[],
}

interface GetChatMessagesResponse {
  data: Message[],
}

export type {
  Message,
  Chat,
  GetUserChatsResponse,
  GetChatMessagesResponse,
};