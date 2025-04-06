<script setup lang="ts">
import AppIconChat from "components/icons/AppIconChat.vue";
import AppIconSettings from "components/icons/AppIconSettings.vue";
import AppIconLogout from "components/icons/AppIconLogout.vue";
import { logout } from "services/authService.ts";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const onLogout = async (): Promise<void> => {
  logout();
  await router.push({ name: 'login' });
}

const onTab = async (tab: string): Promise<void> => {
  await router.push({
    name: 'app',
    query: {
      tab,
      chatId: route.query.chatId,
    },
  });
}
</script>

<template>
  <div class="test_block">
    <div class="test_block_item" @click="() => onTab('chats')">
      <AppIconChat size="2rem" fill="#fff" />
    </div>
    <div class="test_block_item" @click="() => onTab('settings')">
      <AppIconSettings size="2rem" fill="#fff" />
    </div>
    <div class="test_block_item" @click="onLogout">
      <AppIconLogout size="2rem" fill="#fff" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.test_block {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
}

.test_block_item {
  margin: -0.5rem 0;
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 0.75rem;
  font-weight: 500;
}

.test_block_item:hover {
  background: #f5f9f8;
  box-shadow: 0 0 0.25rem 0 #e2e7e6;
}
</style>