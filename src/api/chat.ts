import { request } from "../axios.config.ts";
import { AxiosResponse } from "axios";
import {
  CreateChatParams,
  CreateChatResponse,
  CreateMessageParams,
  CreateMessageResponse,
  FindChatParams,
  FindChatResponse,
  GetChatMessagesParams,
  GetChatMessagesResponse,
  GetUserChatsParams,
  GetUserChatsResponse
} from "../interfaces/chat.ts";

async function findChat({ chatId }: FindChatParams): Promise<AxiosResponse<FindChatResponse>> {
  return await request
    .get(`/api/v1/chats/${chatId}`)
    .then((response: AxiosResponse<FindChatResponse>) => response)
    .catch(error => error.response);
}

async function createChat({ title, isDialog, users }: CreateChatParams): Promise<AxiosResponse<CreateChatResponse>> {
  return await request
    .post(`/api/v1/chats`, {
      title,
      isDialog,
      users,
    })
    .then((response: AxiosResponse<CreateChatResponse>) => response)
    .catch(error => error.response);
}

async function getUserChats({
  userId,
  startMessageId
}: GetUserChatsParams): Promise<AxiosResponse<GetUserChatsResponse>> {
  return await request
    .get(`/api/v1/users/${userId}/chats`, {
      params: { startMessageId },
    })
    .then((response: AxiosResponse<GetUserChatsResponse>) => response)
    .catch(error => error.response);
}

async function createMessage({
  chatId,
  text,
}: CreateMessageParams): Promise<AxiosResponse<CreateMessageResponse>> {
  return await request
    .post(`/api/v1/messages`, { chatId, text })
    .then((response: AxiosResponse<CreateMessageResponse>) => response)
    .catch(error => error.response);
}

async function getChatMessages({
  chatId,
  startId
}: GetChatMessagesParams): Promise<AxiosResponse<GetChatMessagesResponse>> {
  return await request
    .get(`/api/v1/chats/${chatId}/messages`, {
      params: { startId },
    })
    .then((response: AxiosResponse<GetChatMessagesResponse>) => response)
    .catch(error => error.response);
}

export {
  findChat,
  createChat,
  getUserChats,
  createMessage,
  getChatMessages,
}