import { findChat, getUserChats, getChatMessages } from "../api/chat.ts";
import { AxiosResponse } from "axios";
import { Chat, GetChatMessagesResponse, GetUserChatsResponse, Message } from "../interfaces/chat.ts";

export default class ChatService {
  async findChat(chatId: number): Promise<Chat | null> {
    const response: AxiosResponse<Chat> = await findChat(chatId);
    if (response.status === 200) {
      return response.data;
    }

    console.log(response);
    return null;
  }

  async getUserChats(userId: number, startMessageId: number | null = null): Promise<Chat[] | null> {
    const response: AxiosResponse<GetUserChatsResponse> = await getUserChats(userId, startMessageId);
    if (response.status === 200) {
      return response.data.data;
    }

    console.log(response);
    return null;
  }

  async getChatMessages(chatId: number, startMessageId: number | null = null): Promise<Message[] | null> {
    const response: AxiosResponse<GetChatMessagesResponse> = await getChatMessages(chatId, startMessageId);
    if (response.status === 200) {
      return response.data.data;
    }

    console.log(response);
    return null;
  }
}