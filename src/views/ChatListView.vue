<script setup lang="ts">
import { onMounted } from "vue";
import { Chat } from "../interfaces/chat";
import ChatService from "../services/ChatService";
import useList, { Direction } from "../composables/list";
import router from "../router.config";

const userId: number = +(localStorage.getItem('userId') ?? 0);
const scroller = useList<Chat>({
  id: userId,
  direction: Direction.Down,
  getItems: new ChatService().getUserChats,
  getLastId: (items: Chat[]): number => items[items.length - 1].last_message_id ?? 0,
});

onMounted(() => {
  console.log(333, scroller);
  scroller.itemsList.value?.addEventListener('scroll', scroller.scrollList());
});
scroller.loadItems();

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
  <div :ref="scroller.itemsList" class="messenger__chat-list">
    <ul>
      <li
        @click="() => openChat(chat)"
        v-for="chat in scroller.items.value"
        :key="chat.id"
      >
        <span>{{ chat.id }}. {{ chat.users ? chat.users[0].nick : 'No name' }}</span>
        <br>
        <span>{{ chat.last_message?.text }}</span>
      </li>
    </ul>
    <button v-if="scroller.hasError.value" @click="() => scroller.loadItems(true)">
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