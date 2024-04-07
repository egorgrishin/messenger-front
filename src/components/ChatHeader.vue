<script setup lang="ts">
import { Chat } from "../interfaces/chat";
import { computed, ComputedRef, ModelRef } from "vue";

const chat: ModelRef<Chat | null> = defineModel<Chat | null>('chat');
const userNick: ComputedRef<string | null> = computed(() => {
  return chat.value ? chat.value.users[0].nick : null;
});
</script>

<template>
{{ userNick }}
</template>

<style scoped lang="scss">

</style>