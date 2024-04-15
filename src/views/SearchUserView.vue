<script setup lang="ts">
import useList, { Direction } from "../composables/list";
import UserService from "../services/UserService";
import { ref, Ref, onMounted } from "vue";
import { User } from "../interfaces/user";
import AppInput from "../components/AppInput.vue";
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router";
import { Chat } from "../interfaces/chat";
import ChatService from "../services/ChatService";

const userId: number = +(localStorage.getItem('userId') ?? 0);
const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const nick: Ref<string> = ref(route.query.q?.toString() ?? '');
const searchedNick: Ref<string> = ref('');
const {
  itemsList,
  items,
  lastItemId,
  loadItems,
  scrollList,
  reset,
} = useList<User>({
  direction: Direction.Down,
  itemsGetter: (): Promise<User[] | null> => new UserService().getUsers(nick.value, lastItemId.value),
  lastIdGetter: (items: User[]) => items[items.length - 1].id,
});

onMounted(() => {
  itemsList.value?.addEventListener('scroll', scrollList);
});

const onSearch: (event: Event) => void = (event: Event): void => {
  event.preventDefault();
  reset();
  searchedNick.value = nick.value;
  loadItems();
  router.replace({ query: { q: nick.value } });
}

const onClick: (user: User) => void = async (user: User): Promise<void> => {
  const chat: Chat | null = await new ChatService().createChat({
    isDialog: true,
    users: [userId, user.id],
  });
  if (!chat) {
    console.log("Error");
    return;
  }

  await router.push({
    name: 'message.list',
    params: {
      chatId: +(chat.id),
    },
  });
}
</script>

<template>
  <div class="user__block" ref="itemsList">
    <form @submit="onSearch">
      <AppInput v-model:model="nick" type="text" placeholder="Nick" />
      <button :disabled="!nick || nick === searchedNick">Search</button>
    </form>

    <div>
      <ul>
        <li
          v-for="user in items"
          :key="user.id"
          @click="() => onClick(user)"
        >
          <span>{{ user.id }}. {{ user.nick }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.user__block {
  overflow-y: auto;
  height: calc(100vh - $header-height - $footer-height);
}
</style>