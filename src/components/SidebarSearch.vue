<script setup lang="ts">
import { useList } from "composables/list.ts";
import { User } from "interfaces/user.ts";
import { createChat } from "services/chatService.ts";
import { getUsers } from "services/userService.ts";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useLoading } from "composables/loading.ts";

const router = useRouter();
const props = defineProps<{
  search: string,
}>()

const { unique } = useLoading();
const isLoaded = ref<boolean>(false);

watch(() => props.search, () => search());

const {
  itemsList, // HTML элемент - список пользователей
  items,     // Список пользователей
  loadItems, // Функция загрузки пользователей
  reset,     // Функция сброса состояния списка
} = useList<User>({
  itemsGetter: (lastId: number | null): Promise<User[] | null> => getUsers(props.search, lastId),
  lastIdGetter: (items: User[]) => items[items.length - 1].id,
});

const search = (): void => {
  unique(async () => {
    reset();
    isLoaded.value = false;
    await loadItems();
    isLoaded.value = true;
  }, undefined)
}
search();

// Создает чат с выбранным пользователем и открывает его
const onClick = (user: User): void => {
  unique(async () => {
    const result = await createChat(user.id);
    if (!result) {
      return;
    }

    const { chat } = result;
    await router.push({
      name: 'app',
      query: {
        chatId: chat.id,
      },
    });
  }, undefined);
}
</script>

<template>
  <div ref="itemsList" class="search">
    <div
      v-if="isLoaded && !items.length"
      class="search__empty"
    >
      Ничего не найдено
    </div>
    <div class="list">
      <div
        class="list__user"
        v-for="user in items"
        :key="user.id"
        @click="() => onClick(user)"
      >
        <img
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          class="avatar"
        />
        <span v-else class="user__avatar">
         {{ user.nick[0].toUpperCase() }}
        </span>
        <span>{{ user.nick }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;
.avatar {
  width: 4rem;
  height: 4rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 4rem;
  background: bisque;
  font-size: 1.5rem;
  font-weight: 500;
}

.search {
  overflow-y: auto;
  height: 100%;
  margin-top: 0.75rem;

  &__empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.75rem;
    padding: 0 1rem;
    font-weight: 500;
  }

  &__form {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;

    input {
      width: 100%;
    }
  }
}

.list {

  &__user {
    display: flex;
    align-items: center;
    padding: 0 1rem;
  }
}

.user {
  &__avatar {
    width: 4rem;
    height: 4rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 4rem;
    background: bisque;
    font-size: 1.25rem;
    font-weight: 500;
  }

  &:last-child {
    padding-bottom: 0;
  }
}
</style>