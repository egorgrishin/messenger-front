import {
  apiFindChat,
  apiCreateChat,
  apiGetUserChats,
  apiCreateMessage,
  apiGetChatMessages,
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

/**
 * Возвращает чат по ID
 */
async function findChat(chatId: number): Promise<Chat | null> {
  const response: AxiosFindChat = await apiFindChat(chatId);
  if (response.status === 200) {
    return response.data.data;
  }
  Notify.send('Чат не найден');
  return null;
}

/**
 * Создает новый чат
 */
async function createChat(users: number[]): Promise<Chat | null> {
  const response: AxiosCreateChat = await apiCreateChat(users);
  if (response.status === 201) {
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
async function createMessage(chatId: number, text: string): Promise<Message | null> {
  const response: AxiosCreateMessage = await apiCreateMessage(chatId, text);
  if (response.status === 201) {
    return response.data.data;
  }
  Notify.send('Не удалось отправить ссообщение')
  return null;
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
  getChatMessages,
};
