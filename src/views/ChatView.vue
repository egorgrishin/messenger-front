<script setup lang="ts">
import ChatService from "../services/ChatService.ts";
import { Ref, ref } from "vue";
import { Chat } from "../interfaces/chat.ts";
import ChatHeader from "../components/ChatHeader.vue";
import ChatMessageList from "../components/ChatMessageList.vue";

const userId: number = +(localStorage.getItem('userId') ?? 0);
const props = defineProps<{
  chatId: number,
}>();

const chat: Ref<Chat | null> = ref(null);
const loadChat: () => void = async () => {
  chat.value = await new ChatService().findChat(props.chatId)
};
loadChat();
</script>

<template>
  <ChatHeader
    v-if="chat"
    :userId="userId"
    :chat="chat"
  />
  <ChatMessageList
    v-if="chat"
    :chat-id="chat.id"
    :userId="userId"
  />
</template>

<style scoped lang="scss">

</style>