<script setup lang="ts">
import { Chat } from "interfaces/chat";
import { User } from "interfaces/user";
import { num2word } from "@/helper/word.ts";
import Online from "composables/online.ts";

// ID текущего пользователя
const userId: number = +(localStorage.getItem('userId') || 0);
const props = defineProps<{
  chat: Chat,
  isSelected: boolean,
}>();

const recipient = (props.chat.users as User[]).filter((user: User) => user.id !== userId)[0];

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

const getChatText = (): string => {
  if (props.chat.lastMessage?.text) {
    return props.chat.lastMessage?.text;
  }
  if (props.chat.lastMessage?.filesCount) {
    const count = props.chat.lastMessage?.filesCount;
    const word = num2word(count, ['файл', 'файла', 'файлов']);
    return `${count} ${word}`;
  }
  return 'Сообщений нет';
}

const isOnline = Online.getIsOnline(recipient.id);
</script>

<template>
  <div
    class="chat"
    :style="{
    background: isSelected ? '#7662FE' : undefined,
    color: isSelected ? '#fff' : undefined,
    borderRadius: isSelected ? '0.75rem' : undefined,
    }"
  >
    <div class="chat__avatar">
      <img
        v-if="recipient.avatarUrl"
        :src="recipient.avatarUrl"
        class="avatar"
      />
      <span v-else>
         {{ recipient.nick[0].toUpperCase() }}
      </span>

    </div>
    <div class="chat__preview">
      <div class="preview__header">
        <div class="header__title-block">
          <span class="header__title">
            {{ recipient.nick }}
          </span>
          <div
            v-if="isOnline"
            class="header__title__online"
          ></div>
        </div>
        <span
          class="header__date"
          v-if="props.chat.lastMessage"
          :style="{
            color: isSelected ? '#ddd' : undefined,
          }"
        >
          {{ getFormattedDate(props.chat.lastMessage.createdAt) }}
        </span>
      </div>
      <span
        class="preview__message"
        :style="{
        color: isSelected ? '#ddd' : undefined,
        }"
      >
          <span
            v-if="props.chat.lastMessage?.userId === userId"
            class="preview__message-author"
            :style="{
              color: isSelected ? '#eee' : undefined,
            }"
          >Вы:</span>
          {{ getChatText() }}
        </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  height: 100%;
  width: 100%;
  border-radius: 4rem;
}

.chat {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;

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
  &__title-block {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__title {
    font-weight: 500;
  }

  &__title__online {
    width: 0.5rem;
    height: 0.5rem;
    background: #7663fd;
    border-radius: 0.5rem;
  }

  &__date {
    color: #999999;
    font-size: 0.85rem;
  }
}
</style>