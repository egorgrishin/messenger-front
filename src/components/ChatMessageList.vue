<script setup lang="ts">
import { Direction, useList } from "composables/list";
import { Chat, Message } from "interfaces/chat";
import { getChatMessages } from "services/chatService.ts";
import { nextTick, ref, watch } from "vue";

const props = defineProps<{
  userId: number,
  chat: Chat,
  inputHeight: number,
}>();

// Завершился ли API запрос на получеение сообщений
const isLoaded = ref<boolean>(false);

const {
  itemsList, // HTML элемент - список сообщений
  items,     // Список сообщений
  loadItems, // Функция загрузки сообщений
  setScroll, // Функция для скролла списка сообщений
} = useList<Message>({
  direction: Direction.Up,
  itemsGetter: (lastId: number | null): Promise<Message[] | null> => {
    return getChatMessages(props.chat.id, lastId)
      .then((messages: Message[] | null) => messages?.reverse() ?? null)
  },
  lastIdGetter: (items: Message[]) => items[0].id,
});

// Загружаем список сообщений
loadItems().then(() => isLoaded.value = true);

// Наблюдатель за размером текстового поля
watch(() => props.inputHeight, (value: number, oldValue: number) => {
  const diff: number = value - oldValue;
  const list: HTMLDivElement = itemsList.value as HTMLDivElement;

  // Положение пользователь в списке: сколько проскролил + высота списка
  const scrolled: number = list.scrollTop + list.clientHeight;

  // Если пользователь был внизу списка, то прокручиваем его до нижней точки,
  // Чтобы пользователь был "приклеен" к низу списка
  if (diff > 0 && list.scrollHeight <= scrolled + diff) {
    list.scroll({ top: list.scrollHeight });
    return;
  }
});

/**
 * Добавляет новое сообщения в чат
 * @param message Добавляемое сообщени
 */
const addMessage = (message: Message): void => {
  const list: HTMLElement = itemsList.value as HTMLElement;
  const scrolled: number = list.clientHeight + list.scrollTop;
  items.value.push(message);

  // Если пользователь находился внизу списка
  if (scrolled === list.scrollHeight) {
    // То ожидаем тик, чтобы проскролить до нового сообщения
    nextTick().then(() => setScroll(0));
  }
}

defineExpose({
  addMessage,
});
</script>

<template>
  <div ref="itemsList" class="chat__messages-list">
    <h3
      v-if="isLoaded && !items.length"
      class="messages-list__header_empty"
    >
      Сообщений нет
    </h3>
    <div class="messages-list__empty-block" />

    <div
      v-for="message in items"
      :key="message.id"
      :class="{
        left: message.userId !== userId,
        right: message.userId === userId,
      }"
    >
      <span>{{ message.text }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "assets/vars";

.chat__messages-list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;

  div:not(.messages-list__empty-block) {
    white-space: pre-wrap;
    text-align: left;
    max-width: 70%;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.messages-list {
  &__empty-block {
    flex-grow: 1;
  }

  &__header_empty {
    font-weight: 500;
    margin-top: 0.5rem;
  }
}

.left {
  text-align: left;
  align-self: flex-start;
}

.right {
  text-align: right;
  align-self: flex-end;
}
</style>