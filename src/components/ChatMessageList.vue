<script setup lang="ts">
import { ModelRef, onMounted, Ref, ref, watch } from "vue";
import { Chat, Message } from "../interfaces/chat";
import ChatService from "../services/ChatService";
import useList from "../composables/list.ts";

const chat: ModelRef<Chat | null> = defineModel<Chat | null>('chat');
const messageList: Ref<Element | null> = ref(null);

const {
  items: messages,
  error,
  loadItems,
  setId,
  scrollList,
} = useList<Message>(
  chat.value?.id,
  new ChatService().getChatMessages,
  (items: Message[]): number => items[items.length - 1].id,
);

onMounted(() => {
  messageList.value?.addEventListener('scroll', scrollList);
});
watch(chat, (newChat) => {
  messages.value = [];
  error.value = false;
  setId(newChat.id);
  loadItems();
})
</script>