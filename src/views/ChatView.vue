<script setup lang="ts">
import ChatService from "../services/ChatService";
import { computed, ComputedRef, Ref, ref } from "vue";
import { Chat, Message } from "../interfaces/chat";
import ChatHeader from "../components/ChatHeader.vue";
import ChatMessageList from "../components/ChatMessageList.vue";
import ChatInput from "../components/ChatInput.vue";
import { User } from "../interfaces/user";

const props = defineProps<{
  chatId: number,
}>();
const messageList = ref<InstanceType<typeof ChatMessageList> | null>(null);
const inputHeight: Ref<number> = ref(0);
const chat: Ref<Chat | null> = ref(null);
const userId: number = +(localStorage.getItem('userId') ?? 0);
const interlocutor: ComputedRef<User | null> = computed(() => {
  return chat.value
    ?.users
    ?.filter((user: User) => user.id !== userId)[0] ?? null;
})

const title: ComputedRef<string | undefined> = computed(() => {
  return chat.value?.isDialog
    ? interlocutor.value?.nick
    : chat.value?.title ?? undefined;
})

const loadChat: () => void = async () => {
  chat.value = await new ChatService().findChat({ chatId: props.chatId })
};
loadChat();

const addMessage = (message: Message): void => {
  messageList.value?.addMessage(message);
}

window.Echo
  .private(`chats.${props.chatId}`)
  .listen('.message.new', (message: Message) => {
    if (message.userId !== userId) {
      messageList.value?.addMessage(message);
    }
    console.log("WS", message);
  })

</script>

<template>
  <div class="test">
    <ChatHeader
      v-if="chat"
      :title="title"
    />
    <ChatMessageList
      v-if="chat"
      ref="messageList"
      :chat="chat"
      :userId="userId"
      :inputHeight="inputHeight"
    />
    <ChatInput
      v-model:height="inputHeight"
      :chatId="props.chatId"
      :userId="userId"
      @add-message="addMessage"
    />
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.test {
  height: calc(100vh - $header-height - $footer-height);
  display: flex;
  flex-direction: column;
}
</style>