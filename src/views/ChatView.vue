<script setup lang="ts">
import { getEcho } from "@/helper";
import Sound from "assets/new-message.mp3";
import { findChat } from "services/chatService.ts";
import { computed, onUnmounted, ref } from "vue";
import { Chat, Message } from "interfaces/chat";
import ChatHeader from "components/ChatHeader.vue";
import ChatMessageList from "components/ChatMessageList.vue";
import ChatInput from "components/ChatInput.vue";
import { User } from "interfaces/user";

const props = defineProps<{ chatId: string }>();
const userId: number = +(localStorage.getItem('userId') || 0);
const chatId: number = +props.chatId;

const messageList = ref<InstanceType<typeof ChatMessageList> | null>(null);
const inputHeight = ref<number>(0);
const chat = ref<Chat | null>(null);

// Собеседник
const interlocutor = computed<User | null>(() => {
  return chat.value
    ?.users
    ?.filter((user: User) => user.id !== userId)[0] ?? null;
})

// Название чата
// Если это диалог, то название - имя собеседника, иначе - chat.title
const title = computed<string | undefined>(() => {
  return chat.value?.isDialog
    ? interlocutor.value?.nick
    : chat.value?.title ?? undefined;
})

// Загружает чат
const loadChat = async () => {
  chat.value = await findChat(chatId)
};
loadChat();

// Добавляет сообщение в чат
const addMessage = (message: Message): void => {
  messageList.value?.addMessage(message);
}

const channel: string = `chats.${chatId}`;
getEcho()
  .private(channel)
  .listen('.message.new', (message: Message) => {
    // Добавляем сообщение в чат, если оно пришло от собеседника
    if (message.userId !== userId) {
      if (document.visibilityState === 'hidden') {
        new Audio(Sound).play();
      }
      addMessage(message);
    }
  });
onUnmounted(() => getEcho().leave(channel));
</script>

<template>
  <div class="chat">
    <ChatHeader :title="title" />
    <ChatMessageList
      v-if="chat"
      ref="messageList"
      :chat="chat"
      :userId="userId"
      :inputHeight="inputHeight"
    />
    <div class="chat__messages-list" v-else />
    <ChatInput
      v-model:height="inputHeight"
      :chatId="chatId"
      @add-message="addMessage"
    />
  </div>
</template>

<style scoped lang="scss">
@import "assets/vars";

.chat {
  height: calc(100% + 1rem);
  margin-top: -1rem;
  display: flex;
  flex-direction: column;

  &__messages-list {
    flex-grow: 1;
  }
}
</style>