<script setup lang="ts">
import router from "@/router.config";
import { useList } from "composables/list";
import { Chat } from "interfaces/chat";
import { User } from "interfaces/user.ts";
import { getUserChats } from "services/ChatService";

// ID текущего пользователя
const userId: number = +(localStorage.getItem('userId') || 0);

// Подключаем функционал динамически подгружаемого списка чатов
const {
  itemsList, // HTML элемент - список чатов
  items,     // Список чатов
  loadItems, // Функция загрузки чатов
} = useList<Chat>({
  itemsGetter: (lastId: number | null): Promise<Chat[] | null> => getUserChats(userId, lastId),
  lastIdGetter: (items: Chat[]) => items[items.length - 1].lastMessageId ?? 0,
});

// Загружаем список чатов
loadItems();

// Направляет на страницу чатов
const openChat = (chat: Chat): void => {
  router.push({
    name: 'message.list',
    params: {
      chatId: +(chat.id),
    },
  });
};

// Возвращает название чата
const getChatName = (chat: Chat): string => {
  return chat
    .users
    ?.filter((user: User) => user.id !== userId)[0]
    .nick || 'No name';
};

// Возвращает первую букву названия чата
const getFirstLetter = (nick: string): string => nick[0];

// Возвращает дату и время последнего сообщения
const getFormattedDate: (datetime: string) => string = (datetime: string): string => {
  const parse = (x: number): string => x < 10 ? '0' + x : x.toString();
  const date = new Date(datetime);

  const month: string = parse(date.getMonth() + 1);
  const day: string = parse(date.getDate());
  const hours: string = parse(date.getHours());
  const minutes: string = parse(date.getMinutes());
  return `${day}.${month} ${hours}:${minutes}`;
};

window.Echo
  .private(`users.${userId}.chats`)
  .listen('.chat.updated', async (updatedChat: Chat) => {
    items.value = items.value.filter((chat: Chat) => chat.id != updatedChat.id);
    items.value.unshift(updatedChat);
  });
</script>

<template>
  <div class="block">
    <h2>Чаты</h2>
    <div ref="itemsList" class="messenger__chat-list">
      <div
        class="messenger__chat-item"
        @click="() => openChat(chat)"
        v-for="chat in items"
        :key="chat.id"
      >
        <div class="messenger__chat-avatar">
          {{ getFirstLetter(getChatName(chat)).toUpperCase() }}
        </div>
        <div class="messenger__chat-data">
          <div class="messenger__chat-header">
          <span class="messenger__chat-title">
            {{ getChatName(chat) }}
          </span>
            <span class="messenger__chat-msg-date" v-if="chat.lastMessage">
            {{ getFormattedDate(chat.lastMessage.createdAt) }}
          </span>
          </div>
          <span class="messenger__chat-msg">
          <span
            class="messenger__chat-msg-author"
            v-if="chat.lastMessage?.userId === userId">Вы: </span>
          {{ chat.lastMessage?.text || 'Сообщений нет' }}
        </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.block {
  height: calc(100vh - $header-height - 2rem);
  overflow-y: auto;
  padding-right: 0.5rem;

  h2 {
    margin: -0.5rem 0 0.75rem;
  }

  .messenger__chat-list {
    .messenger__chat-item {
      display: flex;
      align-items: center;
      padding-bottom: 0.75rem;
      cursor: pointer;

      &:last-child {
        padding-bottom: 0;
      }

      .messenger__chat-avatar {
        width: 4rem;
        height: 4rem;
        margin-right: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: 4rem;
        background: bisque;
        font-size: 1.5rem;
        font-weight: 500;
      }

      .messenger__chat-data {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding-bottom: 0.25rem;
        flex-grow: 1;

        .messenger__chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .messenger__chat-title {
            font-weight: 500;
          }

          .messenger__chat-msg-date {
            color: #999999;
            font-size: 0.85rem;
          }
        }

        .messenger__chat-msg {
          color: #999999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          .messenger__chat-msg-author {
            color: #666;
          }
        }
      }
    }
  }
}
</style>