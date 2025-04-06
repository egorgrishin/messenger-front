<script setup lang="ts">
import { ref } from "vue";
import AppInput from "components/AppInput.vue";
import SidebarChatList from "components/SidebarChatList.vue";
import { Chat } from "interfaces/chat.ts";
import SidebarSearch from "components/SidebarSearch.vue";
import AppIconClose from "components/icons/AppIconClose.vue";

const search = ref<string>('');
const emit = defineEmits<{
  (e: 'openChat', chat: Chat): void
}>();

const openChat = async (chat: Chat): Promise<void> => {
  emit('openChat', chat);
};

defineExpose({
  openChat,
});
</script>

<template>
  <div class="sidebar__search">
    <AppInput
      v-model:model="search"
      type="text"
      placeholder="Поиск..."
      margin="0 1rem"
    />
    <AppIconClose
      v-if="search"
      size="1.25rem"
      @click="search = ''"
    />
  </div>
  <KeepAlive>
    <SidebarSearch v-if="search" :search="search" />
    <SidebarChatList v-else @openChat="openChat" />
  </KeepAlive>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.sidebar__chats {
  overflow-y: auto;
}

.sidebar__search {
  display: flex;
  align-items: center;
  flex-direction: row;
  position: relative;

  input {
    flex-grow: 1;
    padding: 0.625rem 2rem 0.625rem 1rem;
  }

  svg {
    position: absolute;
    right: 1.5rem
  }
}

hr {
  margin: 0;
  border: none;
  height: 1px;
  color: #e8e9ed;
  background-color: #e8e9ed;
  flex-shrink: 0;

  &.mb {
    margin-bottom: 0.75rem;
  }
}
</style>