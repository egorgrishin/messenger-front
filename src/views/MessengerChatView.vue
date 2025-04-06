<script setup lang="ts">
import { findChat } from "services/chatService.ts";
import { computed, onUnmounted, ref, watch } from "vue";
import { Chat, Message } from "interfaces/chat.ts";
import { User } from "interfaces/user.ts";
import ChatMessageList from "components/ChatMessageList.vue";
import ChatHeader from "components/ChatHeader.vue";
import ChatInput from "components/ChatInput.vue";
import { getEcho } from "@/helper/socket.ts";
import Sound from "assets/new-message.mp3";
import { useRoute } from "vue-router";

const route = useRoute();
const input = ref<InstanceType<typeof ChatInput> | null>(null);
const userId: number = +(localStorage.getItem('userId') || 0);
const chatId = ref<number | null>(route.query.chatId ? +route.query.chatId : null);

watch(() => route.query.chatId, async (value, oldValue) => {
  chatId.value = value ? +value : null;
  if (oldValue) {
    leaveChannel(getChannel(+oldValue));
  }
  if (chatId.value) {
    joinToChannel(getChannel(chatId.value));
  }

  await loadChat();
})

const isLoaded = ref<boolean>(false);
const isFound = ref<boolean>(false);

const messageList = ref<InstanceType<typeof ChatMessageList> | null>(null);
const inputHeight = ref<number>(0);
const chat = ref<Chat | null>(null);

const recipient = computed<User | null>(() => {
  return chat.value
    ?.users
    ?.filter((user: User) => user.id !== userId)[0] ?? null;
});

const addMessage = (message: Message): void => {
  messageList.value?.addMessage(message);
}

const updateMessage = (message: Message): void => {
  messageList.value?.updateMessage(message);
}

const deleteMessage = (messageId: number): void => {
  messageList.value?.deleteMessage(messageId);
}

const editMessage = (message: Message): void => {
  input.value?.onEditMessage(message);
}

const loadChat = async () => {
  console.log(chatId.value)
  if (!chatId.value) {
    return;
  }
  isLoaded.value = false;
  chat.value = await findChat(chatId.value);
  isFound.value = Boolean(chat.value);
  isLoaded.value = true;
};
loadChat();

const getChannel = (chatId: number) => `chats.${chatId}`;

const joinToChannel = (channel: string): void => {
  getEcho()
    .private(channel)
    .listen('.message.created', (message: Message) => {
      if (document.visibilityState === 'hidden') {
        new Audio(Sound).play();
      }
      addMessage(message);
    })
    .listen('.message.updated', (message: Message) => {
      updateMessage(message);
    })
    .listen('.message.deleted', ({ messageId }: { messageId: number, authorId: number }) => {
      deleteMessage(messageId);
    });
}
if (chatId.value) {
  joinToChannel(getChannel(chatId.value));
}

const leaveChannel = (channel: string): void => getEcho().leave(channel);

onUnmounted(() => {
  if (chatId.value) {
    leaveChannel(getChannel(chatId.value));
  }
});
</script>

<template>
  <div
    v-if="!chatId"
    class="chat__empty"
  >
    Выберите чат
  </div>
  <div
    v-else-if="!isLoaded"
    class="test_loader"
  >
    Загрузка...
  </div>

  <div
    v-else-if="!isFound"
    class="test_found"
  >
    Чат не найден
  </div>

  <div v-else class="chat" @contextmenu.prevent>
    <ChatHeader v-if="recipient" :recipient="recipient" />
    <ChatMessageList
      v-if="chat"
      ref="messageList"
      :chat="chat"
      :userId="userId"
      :inputHeight="inputHeight"
      @edit-message="editMessage"
    />
    <div class="chat__messages-list" v-else />
    <ChatInput
      ref="input"
      v-model:height="inputHeight"
      :chatId="chatId"
    />
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.chat__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.test_loader, .test_not_found {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__messages-list {
    flex-grow: 1;
  }
}
</style>