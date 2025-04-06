<script setup lang="ts">
import ChatListItem from "components/ChatListItem.vue";
import { useList } from "composables/list.ts";
import { Chat } from "interfaces/chat.ts";
import { getUserChats } from "services/chatService.ts";
import { getEcho } from "@/helper/socket.ts";
import Sound from "assets/new-message.mp3";
import { onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userId: number = +(localStorage.getItem('userId') || 0);
const isLoaded = ref<boolean>(false);
const selectedChatId = ref<number | null>(+route.params.chatId || null);

watch(() => route.params.chatId, (value) => {
  selectedChatId.value = +value || null;
});

const emit = defineEmits<{
  (e: 'openChat', chat: Chat): void
}>();

const {
  itemsList, // HTML элемент - список чатов
  items,     // Список чатов
  loadItems, // Функция загрузки чатов
} = useList<Chat>({
  itemsGetter: (lastId: number | null): Promise<Chat[] | null> => getUserChats(userId, lastId),
  lastIdGetter: (items: Chat[]) => items[items.length - 1].lastMessageId ?? 0,
});

loadItems().then(() => isLoaded.value = true);

const chatUpdated = async (updatedChat: Chat): void => {
  items.value = items.value.filter((chat: Chat) => chat.id != updatedChat.id);
  let i;
  for (i = 0; i < items.value.length; i++) {
    if ((items.value[i].lastMessageId || 0) <= (updatedChat.lastMessageId || 0)) {
      break;
    }
  }
  items.value.splice(i, 0, updatedChat);

  if (document.visibilityState === 'hidden') {
    await new Audio(Sound).play();
  }
}

const channel: string = `users.${userId}.chats`;
getEcho()
  .private(channel)
  .listen('.chat.updated', chatUpdated);

onUnmounted(() => getEcho().leave(channel));

const openChat = (chat: Chat) => {
  router.push({
    name: 'app',
    query: {
      chatId: chat.id
    },
  });
}

defineExpose({
  openChat,
});
</script>

<template>
  <div class="list" ref="itemsList">
    <div class="list__chats-list">
      <span
        v-if="isLoaded && !items.length"
        class="chats-list__header_empty"
      >
        Список чатов пуст
      </span>

      <ChatListItem
        v-for="chat in items"
        :key="chat.id"
        :chat="chat"
        :is-selected="selectedChatId === chat.id"
        @click="() => openChat(chat)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.list {
  height: auto;
  position: relative;
  margin-top: 0.75rem;
  overflow-y: auto;
  flex-grow: 1;

  &__header {
    margin: -0.5rem 0 0.75rem;
  }
}

.chats-list {
  &__header_empty {
    padding: 0.5rem 1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>