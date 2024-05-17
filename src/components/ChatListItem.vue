<script setup lang="ts">
import { Chat } from "interfaces/chat";
import { User } from "interfaces/user";

// ID текущего пользователя
const userId: number = +(localStorage.getItem('userId') || 0);
const props = defineProps<{
  chat: Chat,
}>();

// Возвращает название чата
const getChatName = (chat: Chat): string => {
  return chat
    .users
    ?.filter((user: User) => user.id !== userId)[0]
    .nick || 'No name';
};

// Возвращает первую букву названия чата
const getFirstLetter = (nick: string): string => nick[0];

// Возвращает дату и время последнего сообщения
const getFormattedDate: (datetime: string) => string = (datetime: string): string => {
  const parse = (x: number): string => x < 10 ? '0' + x : x.toString();
  const date = new Date(datetime);

  const month: string = parse(date.getMonth() + 1);
  const day: string = parse(date.getDate());
  const hours: string = parse(date.getHours());
  const minutes: string = parse(date.getMinutes());
  return `${day}.${month} ${hours}:${minutes}`;
};
</script>

<template>
  <div class="chat">
    <div class="chat__avatar">
      {{ getFirstLetter(getChatName(props.chat)).toUpperCase() }}
    </div>
    <div class="chat__preview">
      <div class="preview__header">
        <span class="header__title">
          {{ getChatName(props.chat) }}
        </span>
        <span class="header__date" v-if="props.chat.lastMessage">
          {{ getFormattedDate(props.chat.lastMessage.createdAt) }}
        </span>
      </div>
      <span class="preview__message">
          <span
            v-if="props.chat.lastMessage?.userId === userId"
            class="preview__message-author"
          >Вы:</span>
          {{ props.chat.lastMessage?.text || 'Сообщений нет' }}
        </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat {
  display: flex;
  align-items: center;
  padding-bottom: 0.75rem;
  cursor: pointer;

  &:last-child {
    padding-bottom: 0;
  }

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
    font-size: 1.5rem;
    font-weight: 500;
  }

  &__preview {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: 0.15rem;
    flex-grow: 1;
  }
}

.preview {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__message {
    color: #999999;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &-author {
      color: #666;
    }
  }
}

.header {
  &__title {
    font-weight: 500;
  }

  &__date {
    color: #999999;
    font-size: 0.85rem;
  }
}
</style>