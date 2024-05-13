<script setup lang="ts">
import { onMounted } from "vue";
import { Chat } from "../interfaces/chat";
import ChatService from "../services/ChatService";
import useList, { Direction } from "../composables/list";
import router from "../router.config";

const userId: number = +(localStorage.getItem('userId') ?? 0);
const {
  itemsList,
  items,
  lastItemId,
  loadItems,
  scrollList,
} = useList<Chat>({
  direction: Direction.Down,
  itemsGetter: (): Promise<Chat[] | null> => new ChatService().getUserChats({
    userId,
    startMessageId: lastItemId.value,
  }),
  lastIdGetter: (items: Chat[]) => items[items.length - 1].lastMessageId ?? 0,
});

onMounted(() => {
  itemsList.value?.addEventListener('scroll', scrollList);
});
loadItems();

const openChat: (chat: Chat) => void = (chat: Chat): void => {
  router.push({
    name: 'message.list',
    params: {
      chatId: +(chat.id),
    },
  });
}

window.Echo
  .private(`users.${userId}.chats`)
  .listen('.chat.updated', async ({ chatId }: { chatId: number }) => {
    const updatedChat: Chat | null = await new ChatService().findChat({ chatId });
    if (!updatedChat) {
      return;
    }

    items.value = items.value.filter((chat: Chat) => chat.id != updatedChat.id);
    items.value.unshift(updatedChat);
  });

const getChatName: (chat: Chat) => string = (chat: Chat): string => {
  return chat.users ? chat.users[0].nick : 'No name';
}

const getFirstLetter: (nick: string) => string = (nick: string): string => {
  return nick[0];
}

</script>

<template>
  <div ref="itemsList" class="messenger__chat-list">
    <div
      class="messenger__chat-item"
      @click="() => openChat(chat)"
      v-for="chat in items"
      :key="chat.id"
    >
      <div class="messenger__chat-avatar">
        {{ getFirstLetter(getChatName(chat)).toUpperCase() }}
      </div>
      <div class="messenger__chat-data">
        <span class="messenger__chat-title">
          {{ chat.id }}. {{ getChatName(chat) }}
        </span>
        <span class="messenger__chat-msg">
          <span v-if="chat.lastMessage?.userId === userId">Вы: </span>
          {{ chat.lastMessage?.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/vars";

.messenger__chat-list {
  overflow-y: auto;
  height: calc(100vh - $header-height - 2rem);

  .messenger__chat-item {
    display: flex;
    align-items: center;
    padding-bottom: 0.75rem;

    &:last-child {
      padding-bottom: 0;
    }

    .messenger__chat-avatar {
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

    .messenger__chat-data {
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .messenger__chat-title {
        padding-bottom: 0.25rem;
        font-weight: 500;
      }

      .messenger__chat-msg {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>