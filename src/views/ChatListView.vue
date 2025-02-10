<script setup lang="ts">
import { getEcho } from "@/helper";
import Sound from "assets/new-message.mp3";
import { useList } from "composables/list";
import { Chat } from "interfaces/chat";
import { getUserChats } from "services/chatService.ts";
import { onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import ChatListItem from "components/ChatListItem.vue";

// ID текущего пользователя
const userId: number = +(localStorage.getItem('userId') || 0);
const router = useRouter();
// Завершился ли API запрос на получеение чатов
const isLoaded = ref<boolean>(false);

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
loadItems().then(() => isLoaded.value = true);

// Направляет на страницу чатов
const openChat = async (chat: Chat): Promise<void> => {
  await router.push({
    name: 'chat.show',
    params: {
      chatId: +(chat.id),
    },
  });
};

const channel: string = `users.${userId}.chats`;
getEcho()
  .private(channel)
  .listen('.chat.updated', async (updatedChat: Chat) => {
    items.value = items.value.filter((chat: Chat) => chat.id != updatedChat.id);
    items.value.unshift(updatedChat);
    if (document.visibilityState === 'hidden') {
      await new Audio(Sound).play();
    }
  });
onUnmounted(() => getEcho().leave(channel));
</script>

<template>
  <div class="list" ref="itemsList">
    <h2 class="list__header">Чаты</h2>
    <div class="list__chats-list">
      <h3
        v-if="isLoaded && !items.length"
        class="chats-list__header_empty"
      >
        Список чатов пуст
      </h3>

      <ChatListItem
        v-for="chat in items"
        :key="chat.id"
        :chat="chat"
        @click="() => openChat(chat)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.list {
  overflow-y: auto;
  padding-right: 0.5rem;
  height: 100%;

  &__header {
    margin: -0.5rem 0 0.75rem;
  }
}

.chats-list {
  &__header_empty {
    font-weight: 500;
  }
}
</style>