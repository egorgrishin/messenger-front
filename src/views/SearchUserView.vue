<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppSvgSearch from "components/AppIconSearch.vue";
import AppInput from "components/AppInput.vue";
import { useList } from "composables/list";
import { Chat } from "interfaces/chat";
import { User } from "interfaces/user";
import { createChat } from "services/chatService.ts";
import { getUsers } from "services/userService.ts";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoading } from "composables/loading.ts";

// ID текущего пользователя
const userId: number = +(localStorage.getItem('userId') || 0);
const router = useRouter();
const route = useRoute();
const nick = ref<string>(route.query.q?.toString() ?? '');
const { unique } = useLoading();

// Завершился ли API запрос на получеение пользователей
const isLoaded = ref<boolean>(false);

// Подключаем функционал динамически подгружаемого списка пользователей
const {
  itemsList, // HTML элемент - список пользователей
  items,     // Список пользователей
  loadItems, // Функция загрузки пользователей
  reset,     // Функция сброса состояния списка
} = useList<User>({
  itemsGetter: (lastId: number | null): Promise<User[] | null> => getUsers(nick.value, lastId),
  lastIdGetter: (items: User[]) => items[items.length - 1].id,
});

// Ищет пользователей по нику
const onSearch = (event: Event): void => {
  event.preventDefault();

  // Блокируем параллельное выполнение кода
  unique(async () => {
    reset();
    isLoaded.value = false;
    await loadItems();
    isLoaded.value = true;
    await router.replace({ query: { q: nick.value } });
  }, undefined)
}

// Создает чат с выбранным пользователем и открывает его
const onClick = (user: User): void => {
  // Блокируем параллельное выполнение кода
  unique(async () => {
    const chat: Chat | null = await createChat([userId, user.id]);
    if (!chat) return;

    await router.push({
      name: 'chat.show',
      params: {
        chatId: +(chat.id),
      },
    });
  }, undefined);
}
</script>

<template>
  <div ref="itemsList" class="search">
    <h2 class="search__header">Поиск пользователей</h2>

    <form class="search__form" @submit="onSearch">
      <AppInput
        v-model:model="nick"
        type="text"
        placeholder="Имя пользователя"
      />
      <AppButton bg="#212121" padding="0 0.75rem">
        <AppSvgSearch fill="#fff" />
      </AppButton>
    </form>

    <div class="list">
      <h3
        v-if="isLoaded && !items.length"
        class="list__header_empty"
      >
        Пользователи не найдены
      </h3>
      <div
        class="list__user"
        v-for="user in items"
        :key="user.id"
        @click="() => onClick(user)"
      >
        <div class="user__avatar">
          {{ user.nick[0].toUpperCase() }}
        </div>
        <span>{{ user.nick }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.search {
  overflow-y: auto;
  height: 100%;
  margin-top: -0.5rem;

  &__header {
    margin: 0 0 0.5rem;
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
  &__header_empty {
    font-weight: 500;
    margin-top: 0.75rem;
  }

  &__user {
    display: flex;
    align-items: center;
    padding-bottom: 0.5rem;
  }
}

.user {
  &__avatar {
    width: 3rem;
    height: 3rem;
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