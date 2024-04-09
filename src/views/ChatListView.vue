<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { Chat } from "../interfaces/chat";
import ChatService from "../services/ChatService";
import useList, { Direction } from "../composables/list";
import router from "../router.config";

const userId: number = +(localStorage.getItem('userId') ?? 0);
const chatList: Ref<Element | null> = ref(null);

const {
  items,
  hasError,
  loadItems,
  scrollList,
} = useList<Chat>({
  id: userId,
  direction: Direction.Down,
  getItems: new ChatService().getUserChats,
  getLastId: (items: Chat[]): number => items[items.length - 1].last_message_id ?? 0,
});

onMounted(() => {
  chatList.value?.addEventListener('scroll', scrollList);
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
</script>

<template>
  <div ref="chatList" class="messenger__chat-list">
    <ul>
      <li
        @click="() => openChat(chat)"
        v-for="chat in items"
        :key="chat.id"
      >
        <span>{{ chat.id }}. {{ chat.users ? chat.users[0].nick : 'No name' }}</span>
        <br>
        <span>{{ chat.last_message?.text }}</span>
      </li>
    </ul>
    <button v-if="hasError" @click="() => loadItems(true)">
      Reload
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.messenger__chat-list {
  overflow-y: auto;
  height: calc(100vh - $header-height - $footer-height);
}
</style>