import { request } from "@/axios.config";
import {
  AxiosCreateChat,
  AxiosCreateMessage,
  AxiosFindChat,
  AxiosGetChatMessages,
  AxiosGetUserChats,
} from "interfaces/chat";

/**
 * Отправляет GET запрос на получение чата по ID
 */
export async function apiFindChat(chatId: number): Promise<AxiosFindChat> {
  return await request
    .get(`/api/v1/chats/${chatId}`)
    .then((response: AxiosFindChat) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет POST запрос на создание нового чата
 */
export async function apiCreateChat(users: number[]): Promise<AxiosCreateChat> {
  return await request
    .post(`/api/v1/chats`, {
      isDialog: true,
      users,
    })
    .then((response: AxiosCreateChat) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет GET запрос на получение списка чатов пользователя с ID последнего сообщения меньше указанного
 */
export async function apiGetUserChats(userId: number, startMessageId: number | null): Promise<AxiosGetUserChats> {
  return await request
    .get(`/api/v1/users/${userId}/chats`, {
      params: { startMessageId },
    })
    .then((response: AxiosGetUserChats) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет POST запрос на создание нового сообщения
 */
export async function apiCreateMessage(chatId: number, text: string): Promise<AxiosCreateMessage> {
  return await request
    .post(`/api/v1/messages`, { chatId, text })
    .then((response: AxiosCreateMessage) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет GET запрос на получение списка сообщений чата с ID сообщения меньше указанного
 */
export async function apiGetChatMessages(chatId: number, startId: number | null): Promise<AxiosGetChatMessages> {
  return await request
    .get(`/api/v1/chats/${chatId}/messages`, {
      params: { startId },
    })
    .then((response: AxiosGetChatMessages) => response)
    .catch((error: any) => error.response);
}
