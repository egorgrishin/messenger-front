<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { Chat } from "../interfaces/chat";
import ChatService from "../services/ChatService";
import useList from "../composables/list";
import router from "../router.config";

const userId: number = +(localStorage.getItem('userId') ?? 0);
const chatList: Ref<Element | null> = ref(null);

const {
  items,
  error,
  loadItems,
  scrollList,
} = useList<Chat>(
  userId,
  new ChatService().getUserChats,
  (items: Chat[]): number => items[items.length - 1].last_message_id,
);

onMounted(() => {
  chatList.value?.addEventListener('scroll', scrollList);
});
loadItems();

const openChat: (chat: Chat) => void = (chat: Chat): void => {
  console.log(chat.id, typeof chat.id);
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
        <span>{{ chat.id }}. {{ chat.users[0].nick }}</span>
        <br>
        <span>{{ chat.last_message.text }}</span>
      </li>
    </ul>
    <button v-if="error" @click="() => loadItems(true)">
      Reload
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/main";

.messenger__chat-list {
  overflow-y: auto;
  height: calc(100vh - $header-height - $footer-height);
}
</style>