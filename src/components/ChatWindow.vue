<script setup lang="ts">
import { Chat } from "../interfaces/chat";
import ChatHeader from "./ChatHeader.vue";
import { ModelRef } from "vue/dist/vue";
import ChatMessageList from "./ChatMessageList.vue";

const chat: ModelRef<Chat | null> = defineModel<Chat | null>('chat');
</script>

<template>
  <div class="chat__messages-view">
    <ChatHeader v-model:chat="chat" />
    <ChatMessageList v-model:chat="chat" />
  </div>
</template>

<style scoped lang="scss">
@import "../assets/main";

.chat__messages-view {
  height: calc(100vh - $header-height - $footer-height);
}
</style>