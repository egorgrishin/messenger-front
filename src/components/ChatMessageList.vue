<script setup lang="ts">
import { Direction, useList } from 'composables/list';
import { Chat, Message } from 'interfaces/chat';
import { getChatMessages } from 'services/chatService.ts';
import { nextTick, ref, watch } from 'vue';
import ChatMessageItem from 'components/ChatMessageItem.vue';

const props = defineProps<{
  userId: number,
  chat: Chat,
  inputHeight: number,
}>();

const emit = defineEmits<{
  (e: 'editMessage', message: Message): void
}>();

const isLoaded = ref<boolean>(false);

const {
  itemsList, // HTML элемент - список сообщений
  items,     // Список сообщений
  loadItems, // Функция загрузки сообщений
  setScroll, // Функция для скролла списка сообщений
  reset,
} = useList<Message>({
  direction: Direction.Up,
  itemsGetter: async (lastId: number | null): Promise<Message[] | null> => {
    console.log(props.chat.id);
    return getChatMessages(props.chat.id, lastId)
      .then((messages: Message[] | null) => messages?.reverse() ?? null);
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
 */
const addMessage = (message: Message): void => {
  const list: HTMLElement = itemsList.value as HTMLElement;
  const scrolled: number = list.clientHeight + list.scrollTop;
  const height: number = list.scrollHeight;
  items.value.push(message);

  // Если пользователь находился внизу списка
  if (scrolled + 2 > height) {
    // То ожидаем тик, чтобы проскролить до нового сообщения
    nextTick().then(() => setScroll(0));
  }
};

/**
 * Обновляет сообщение в списке
 */
const updateMessage = (updatedMessage: Message): void => {
  items.value = items.value.map(message => message.id === updatedMessage.id ? updatedMessage : message);
};

/**
 * Удаляет сообщение из чата
 */
const deleteMessage = (messageId: number): void => {
  items.value = items.value.filter(message => message.id !== messageId);
};

const editMessage = (message: Message): void => {
  const list: HTMLElement = itemsList.value as HTMLElement;
  const scrolled: number = list.clientHeight + list.scrollTop;
  const height: number = list.scrollHeight;

  emit('editMessage', message);

  // Если пользователь находился внизу списка
  if (scrolled + 2 > height) {
    // То ожидаем тик, чтобы проскролить до нового сообщения
    nextTick().then(() => setScroll(0));
  }
};

defineExpose({
  addMessage,
  updateMessage,
  deleteMessage,
});
</script>

<template>
  <div ref="itemsList" class="chat__messages-list">
    <div
      v-if="isLoaded && !items.length"
      class="messages-list__empty"
    >
      Сообщений нет
    </div>
    <div class="messages-list__empty-block" />
    <ChatMessageItem
      v-for="message in items"
      :key="message.id"
      :message="message"
      :user-id="userId"
      @edit-message="editMessage"
    />
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.chat__messages-list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  margin: -1rem;
}

.messages-list {
  &__empty-block {
    min-height: 1rem;
    flex-grow: 1;
  }

  &__empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
    font-weight: 500;
  }
}
</style>