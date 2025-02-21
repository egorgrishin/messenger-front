<script setup lang="ts">
import AppSvgBack from "components/icons/AppIconBack.vue";

const props = defineProps<{
  title?: string,
}>();
</script>

<template>
  <div class="chat__header">
    <RouterLink :to="{ name: 'chat.index' }">
      <AppSvgBack size="1.1rem" fill="#212121" />
    </RouterLink>

    <span>{{ props.title }}</span>
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.chat__header {
  height: $chat-header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: #fff;
}
</style>