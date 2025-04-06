import {
  apiFindChat,
  apiCreateChat,
  apiGetUserChats,
  apiCreateMessage,
  apiGetChatMessages, apiDeleteMessage, apiUpdateMessage,
} from "api/chat";
import {
  AxiosCreateChat,
  AxiosCreateMessage,
  AxiosFindChat,
  AxiosGetChatMessages,
  AxiosGetUserChats,
  Chat,
  Message
} from "interfaces/chat";
import Notify from "composables/notify.ts";
import { AxiosResponse } from "axios";

/**
 * Возвращает чат по ID
 */
async function findChat(chatId: number): Promise<Chat | null> {
  const response: AxiosFindChat = await apiFindChat(chatId);
  return response.status === 200
    ? response.data.data
    : null;
}

/**
 * Создает новый чат
 */
async function createChat(recipientId: number): Promise<{ isCreated: boolean, chat: Chat } | null> {
  const response: AxiosCreateChat = await apiCreateChat(recipientId);
  if ([200, 201].includes(response.status)) {
    return response.data.data;
  }
  Notify.send('Ошибка создания чата');
  return null;
}

/**
 * Загружает список сообщений чата с ID сообщения меньше указанного
 */
async function getUserChats(userId: number, startMessageId: number | null = null): Promise<Chat[] | null> {
  const response: AxiosGetUserChats = await apiGetUserChats(userId, startMessageId);
  if (response.status === 200) {
    return response.data.data;
  }
  Notify.send('Не удалось загрузить список чатов');
  return null;
}

/**
 * Отправляет сообщение
 */
async function createMessage(
  chatId: number,
  text: string | null,
  fileUuids: string[] | null = null,
): Promise<Message | null> {
  const response: AxiosCreateMessage = await apiCreateMessage(chatId, text, fileUuids);
  if (response.status === 201) {
    return response.data.data;
  }
  Notify.send('Не удалось отправить ссообщение')
  return null;
}

/**
 * Удаляет сообщение
 */
async function updateMessage(
  messageId: number,
  text: string | null,
  fileUuids: string[] | null = null,
): Promise<Message | null> {
  const response: AxiosResponse = await apiUpdateMessage(messageId, text, fileUuids);
  if (response.status === 200) {
    return response.data.data;
  }
  Notify.send('Не удалось обновить ссообщение')
  return null;
}

/**
 * Удаляет сообщение
 */
async function deleteMessage(messageId: number): Promise<boolean> {
  const response: AxiosResponse = await apiDeleteMessage(messageId);
  if (response.status === 204) {
    return true;
  }
  Notify.send('Не удалось удалить ссообщение')
  return false;
}

/**
 * Загружает список сообщений чата с ID сообщения меньше указанного
 */
async function getChatMessages(chatId: number, startId: number | null = null): Promise<Message[] | null> {
  const response: AxiosGetChatMessages = await apiGetChatMessages(chatId, startId);
  if (response.status === 200) {
    return response.data.data;
  }
  Notify.send('Не удалось загрузить список сообщений');
  return null;
}

export {
  findChat,
  createChat,
  getUserChats,
  createMessage,
  updateMessage,
  deleteMessage,
  getChatMessages,
};
