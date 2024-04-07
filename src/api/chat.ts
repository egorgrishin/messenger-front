import { request } from "../axios.config.ts";
import { AxiosResponse } from "axios";
import { Chat, GetChatMessagesResponse, GetUserChatsResponse } from "../interfaces/chat.ts";

async function findChat(chatId: number): Promise<AxiosResponse<Chat>> {
  return await request
    .get(`/api/v1/chats/${chatId}`)
    .then((response: AxiosResponse<Chat>) => response)
    .catch(error => error.response);
}

async function getUserChats(userId: number, startMessageId: number | null): Promise<AxiosResponse<GetUserChatsResponse>> {
  return await request
    .get(`/api/v1/users/${userId}/chats`, {
      params: { startMessageId },
    })
    .then((response: AxiosResponse<GetUserChatsResponse>) => response)
    .catch(error => error.response);
}

async function getChatMessages(chatId: number, startMessageId: number | null): Promise<AxiosResponse<GetChatMessagesResponse>> {
  return await request
    .get(`/api/v1/chats/${chatId}/messages`, {
      params: { startMessageId },
    })
    .then((response: AxiosResponse<GetChatMessagesResponse>) => response)
    .catch(error => error.response);
}

export {
  findChat,
  getUserChats,
  getChatMessages,
}