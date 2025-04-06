<script setup lang="ts">
import AppIconClose from "components/icons/AppIconClose.vue";
import { User } from "interfaces/user.ts";
import { useRoute, useRouter } from "vue-router";
import Online from "composables/online.ts";

const props = defineProps<{
  recipient: User,
}>();

const route = useRoute();
const router = useRouter();

const isOnline = Online.getIsOnline(props.recipient.id);

const onCloseChat = () => {
  router.push({
    name: 'app',
    query: {
      tab: route.query.tab,
    },
  });
  emit('closeChat');
};

const emit = defineEmits<{
  (e: 'closeChat'): void
}>();
</script>

<template>
  <div class="chat__header">
    <div class="recipient">
      <img
        v-if="recipient.avatarUrl"
        :src="recipient.avatarUrl"
        class="avatar"
      />
      <div v-else class="header__avatar">
         {{ recipient.nick[0].toUpperCase() }}
      </div>

      <span>{{ props.recipient.nick }}</span>

      <div
        v-if="isOnline"
        class="header__title__online"
      ></div>
    </div>

    <div class="header__close" @click="onCloseChat">
      <AppIconClose size="1.1rem" fill="#212121" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.chat__header {
  padding: 1rem;
  //margin-bottom: 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 0.75rem;
  box-shadow: 0 0 1rem 0 #e9eeed;
  background: #fbfdfc;
  z-index: 1;
}

.recipient {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  height: 3rem;
  width: 3rem;
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

.header__title__online {
  width: 0.5rem;
  height: 0.5rem;
  background: #7663fd;
  border-radius: 0.5rem;
  margin-left: -0.375rem;
}

.header__close {
  cursor: pointer;
}
</style>