import {
  findChat,
  createChat,
  getUserChats,
  createMessage,
  getChatMessages,
} from "../api/chat.ts";
import { AxiosResponse } from "axios";
import {
  Chat,
  CreateChatParams, CreateChatResponse, CreateMessageParams, CreateMessageResponse,
  FindChatParams, FindChatResponse,
  GetChatMessagesParams,
  GetChatMessagesResponse,
  GetUserChatsParams,
  GetUserChatsResponse,
  Message
} from "../interfaces/chat.ts";

export default class ChatService {
  async findChat({ chatId }: FindChatParams): Promise<Chat | null> {
    const response: AxiosResponse<FindChatResponse> = await findChat({ chatId });
    if (response.status === 200) {
      return response.data.data;
    }

    console.log(response);
    return null;
  }

  async createChat({ title, isDialog, users }: CreateChatParams): Promise<Chat | null> {
    const response: AxiosResponse<CreateChatResponse> = await createChat({ title, isDialog, users });
    if (response.status === 201) {
      return response.data.data;
    }

    console.log(response);
    return null;
  }

  async getUserChats({ userId, startMessageId = null }: GetUserChatsParams): Promise<Chat[] | null> {
    const response: AxiosResponse<GetUserChatsResponse> = await getUserChats({ userId, startMessageId });
    if (response.status === 200) {
      return response.data.data;
    }

    console.log(response);
    return null;
  }

  async createMessage({ chatId, text }: CreateMessageParams): Promise<Message | null> {
    const response: AxiosResponse<CreateMessageResponse> = await createMessage({ chatId, text });
    if (response.status === 201) {
      return response.data.data;
    }

    console.log(response);
    return null;
  }

  async getChatMessages({ chatId, startId = null }: GetChatMessagesParams): Promise<Message[] | null> {
    const response: AxiosResponse<GetChatMessagesResponse> = await getChatMessages({ chatId, startId });
    if (response.status === 200) {
      return response.data.data;
    }

    console.log(response);
    return null;
  }
}