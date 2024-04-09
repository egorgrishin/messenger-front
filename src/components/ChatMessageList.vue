<script setup lang="ts">

import { Message } from "../interfaces/chat.ts";
import ChatService from "../services/ChatService.ts";
import { onMounted } from "vue";
import useList, { Direction } from "../composables/list.ts";

const props = defineProps<{
  userId: number,
  chatId: number,
}>();

const {
  itemsList,
  items,
  hasError,
  loadItems,
  scrollList,
  scrollCallback,
} = useList<Message>({
  id: props.chatId,
  direction: Direction.Up,
  getItems: new ChatService().getChatMessages,
  getLastId: (items: Message[]) => items[items.length - 1].id,
})

onMounted(() => {
  const list: Element = itemsList.value as Element;
  const before = list.scrollHeight ?? 0;
  list.addEventListener('scroll', scrollList);
  loadItems().then(() => scrollCallback(before, 0));
});
</script>

<template>
  <div ref="itemsList" class="messenger__message-list">
    <div
      v-for="message in items"
      :key="message.id"
      :class="{
          left: message.user_id !== userId,
          right: message.user_id === userId,
        }"
    >
      <span>{{ message.id }}. {{ message.user_id }}</span>
      <br>
      <span>{{ message.text }}</span>
    </div>
    <button v-if="hasError" @click="() => loadItems(true)">
      Reload
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.messenger__message-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100vh - $header-height - $footer-height - $chat-header-height);
}

.left {
  text-align: left;
  background: green;
  align-self: flex-start;
}

.right {
  text-align: right;
  background: orange;
  align-self: flex-end;
}
</style>