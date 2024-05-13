<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import ChatService from "../services/ChatService";
import { Message } from "../interfaces/chat";

const textarea: Ref<HTMLElement | null> = ref(null);
const text: Ref<string> = ref('');
const borderSize: number = 1;
const borders: number = borderSize * 2;
const height = defineModel('height', {
  required: true,
});
const props = defineProps<{
  chatId: number,
}>()
const emit = defineEmits<{
  (e: 'addMessage', message: Message): void
}>()

const onInput = () => {
  if (!textarea.value) {
    return;
  }
  textarea.value.style.height = 'auto';
  const heightPx = textarea.value.scrollHeight + borders;
  textarea.value.style.height = `${heightPx}px`;
  height.value = heightPx;
}
onMounted(onInput);

const onSubmit = async () => {
  const message = text.value.trim();
  if (!message) {
    return
  }
  new ChatService().createMessage({
    chatId: props.chatId,
    text: message,
  }).then((message: Message | null) => {
    if (!message) {
      alert("Not send");
      return;
    }
    emit('addMessage', message)
  });
  text.value = '';
}
</script>

<template>
  <div>
    <textarea
      ref="textarea"
      v-model="text"
      @input="onInput"
      @keydown.enter.exact.prevent
      @keyup.enter.exact="onSubmit"
      rows="1"
    ></textarea>
  </div>
</template>

<style scoped lang="scss">
textarea {
  width: 100%;
  max-height: 6rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  overflow-y: auto;
  box-sizing: border-box;
  line-height: inherit;
  color: inherit;
  outline: none;
}
</style>