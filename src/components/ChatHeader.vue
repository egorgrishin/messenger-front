<script setup lang="ts">
const props = defineProps<{
  title?: string,
}>();
</script>

<template>
  <div class="chat__header">
    <RouterLink :to="{ name: 'chat.list' }">Back</RouterLink>
    <span class="chat__header-title">
      {{ props.title }}
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
  flex-shrink: 0;
}
</style>