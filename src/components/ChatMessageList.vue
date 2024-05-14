<script setup lang="ts">
import { Chat, Message } from "../interfaces/chat";
import ChatService from "../services/ChatService";
import { nextTick, onMounted, watch } from "vue";
import useList, { Direction } from "../composables/list";

const props = defineProps<{
  userId: number,
  chat: Chat,
  inputHeight: number,
}>();

const {
  itemsList,
  items,
  lastItemId,
  loadItems,
  scrollList,
  setScroll,
} = useList<Message>({
  direction: Direction.Up,
  itemsGetter: (): Promise<Message[] | null> => new ChatService().getChatMessages({
    chatId: props.chat.id,
    startId: lastItemId.value,
  }).then((messages: Message[] | null) => messages?.reverse() ?? null),
  lastIdGetter: (items: Message[]) => items[0].id,
});

onMounted(() => {
  const list: Element = itemsList.value as Element;
  const before = list.scrollHeight ?? 0;
  list.addEventListener('scroll', scrollList);
  loadItems().then(() => {
    nextTick().then(() => setScroll(before, 0));
  });
});

watch(() => props.inputHeight, (value: number, oldValue: number) => {
  const diff: number = value - oldValue;
  if (diff < 0) {
    return;
  }
  const list: HTMLElement = itemsList.value as HTMLElement;
  const scrollHeight: number = Math.floor(diff + list.scrollTop + list.clientHeight)
  if (scrollHeight === list.scrollHeight) {
    itemsList.value?.scroll({ top: itemsList.value?.scrollTop + diff });
  }
});

const addMessage: (message: Message) => void = (message: Message): void => {
  items.value.push(message);
  const list: HTMLElement = itemsList.value as HTMLElement;
  const scrollHeight: number = list.clientHeight + list.scrollTop;
  if (scrollHeight === list.scrollHeight) {
    nextTick().then(() => setScroll(0, 0));
  }
}

defineExpose({
  addMessage,
});
</script>

<template>
  <div ref="itemsList" class="messenger__message-list">
    <div
      v-for="message in items"
      :key="message.id"
      :class="{
        left: message.userId !== userId,
        right: message.userId === userId,
      }"
    >
      <span>{{ message.text }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.messenger__message-list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  //justify-content: flex-end;
  overflow-y: auto;

  div {
    white-space: pre-wrap;
    text-align: left;
    max-width: 70%;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.left {
  text-align: left;
  align-self: flex-start;
}

.right {
  text-align: right;
  align-self: flex-end;
}
</style>