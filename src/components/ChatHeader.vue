<script setup lang="ts">
import { Chat } from "../interfaces/chat";
import { User } from "../interfaces/user";

const props = defineProps<{
  userId: number,
  chat: Chat,
}>();

const title: string | undefined = props.chat.is_dialog
  ? props.chat.users?.filter((user: User) => user.id !== props.userId)[0].nick
  : props.chat.title ?? undefined;
</script>

<template>
  <div class="chat__header">
    <RouterLink :to="{ name: 'chat.list' }">Back</RouterLink>
    <span class="chat__header-title">
      {{ title }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.chat__header {
  height: $chat-header-height;
  background: #000;
  display: flex;
  align-items: center;
}
</style>