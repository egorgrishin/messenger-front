<script setup lang="ts">
import { onMounted } from "vue";
import { Chat } from "../interfaces/chat";
import ChatService from "../services/ChatService";
import useList, { Direction } from "../composables/list";
import router from "../router.config";

const userId: number = +(localStorage.getItem('userId') ?? 0);
const {
  itemsList,
  items,
  lastItemId,
  loadItems,
  scrollList,
} = useList<Chat>({
  direction: Direction.Down,
  itemsGetter: (): Promise<Chat[] | null> => new ChatService().getUserChats({
    userId,
    startMessageId: lastItemId.value,
  }),
  lastIdGetter: (items: Chat[]) => items[items.length - 1].lastMessageId ?? 0,
});

onMounted(() => {
  itemsList.value?.addEventListener('scroll', scrollList);
});
loadItems();

const openChat: (chat: Chat) => void = (chat: Chat): void => {
  router.push({
    name: 'message.list',
    params: {
      chatId: +(chat.id),
    },
  });
}

window.Echo
  .private(`users.${userId}.chats`)
  .listen('.chat.updated', async ({ chatId }: { chatId: number }) => {
    const updatedChat: Chat | null = await new ChatService().findChat({ chatId });
    if (!updatedChat) {
      return;
    }

    items.value = items.value.filter((chat: Chat) => chat.id != updatedChat.id);
    items.value.unshift(updatedChat);
  })

</script>

<template>
  <div ref="itemsList" class="messenger__chat-list">
    <ul>
      <li
        @click="() => openChat(chat)"
        v-for="chat in items"
        :key="chat.id"
      >
        <span>{{ chat.id }}. {{ chat.users ? chat.users[0].nick : 'No name' }}</span>
        <br>
        <span>{{ chat.lastMessage?.text }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.messenger__chat-list {
  overflow-y: auto;
  height: calc(100vh - $header-height - $footer-height);
}
</style>