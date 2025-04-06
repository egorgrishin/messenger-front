<script setup lang="ts">
import { ref } from "vue";

const nick = ref<string | null>(localStorage.getItem('userNick'));
const avatarUrl = ref<string | null>(localStorage.getItem('userAvatarUrl'));
const firstLetter = ref<string>(nick.value ? nick.value[0] : '');

window.addEventListener('auth', (event: any): void => {
  nick.value = event.detail.nick;
  avatarUrl.value = event.detail.avatarUrl;
  firstLetter.value = nick.value ? nick.value[0] : '';
});
</script>

<template>
  <header class="sidebar__header">
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      class="avatar"
    />
    <div v-else class="header__avatar">
      {{ firstLetter.toUpperCase() }}
    </div>

    <div class="header__nick">
      {{ nick }}
    </div>
  </header>
</template>

<style scoped lang="scss">
.sidebar__header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
}

.avatar {
  height: 2.5rem;
  width: 2.5rem;
  margin-right: 0.75rem;
  border-radius: 4rem;
}

.header__avatar {
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 2.5rem;
  background: #79f87c;
  font-weight: 500;
}

.header__nick {
  font-weight: 600;
}
</style>