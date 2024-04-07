<script setup lang="ts">
import ChatService from "../services/ChatService.ts";
import { onMounted, Ref, ref } from "vue";
import { Chat, Message } from "../interfaces/chat.ts";
import useList from "../composables/list.ts";

const props = defineProps<{
  chatId: number,
}>();

const chat: Ref<Chat | null> = ref(null);
const loadChat: () => void = async () => {
  chat.value = await new ChatService().findChat(props.chatId)
};
loadChat();

const messageList: Ref<Element | null> = ref(null);
const {
  items,
  error,
  loadItems,
  scrollList,
} = useList<Message>(
  props.chatId,
  new ChatService().getChatMessages,
  (items: Message[]): number => items[items.length - 1].id,
);

onMounted(() => {
  messageList.value?.addEventListener('scroll', scrollList);
});
loadItems();
</script>


<template>
  <RouterLink :to="{ name: 'chat.list' }">Back</RouterLink>
  <div ref="messageList" class="messenger__message-list">
    <ul>
      <li
        v-for="message in items"
        :key="message.id"
      >
        <span>{{ message.id }}. {{ message.user_id }}</span>
        <br>
        <span>{{ message.text }}</span>
      </li>
    </ul>
    <button v-if="error" @click="() => loadItems(true)">
      Reload
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/main";

.messenger__message-list {
  overflow-y: auto;
  height: calc(100vh - $header-height - $footer-height);
}
</style>