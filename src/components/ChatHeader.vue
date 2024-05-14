<script setup lang="ts">
import AppSvgBack from "components/AppSvgBack.vue";

const props = defineProps<{
  title?: string,
}>();
</script>

<template>
  <div class="chat__header">
    <RouterLink :to="{ name: 'chat.list' }">
      <AppSvgBack size="1.1rem" fill="#212121" />
    </RouterLink>
    <span class="chat__header-title">
      {{ props.title }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.chat__header {
  height: $chat-header-height;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
</style>