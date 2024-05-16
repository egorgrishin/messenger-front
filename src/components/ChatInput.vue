<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppSvgSend from "components/AppIconSend.vue";
import { Message } from "interfaces/chat";
import { createMessage } from "services/ChatService";
import { nextTick, onMounted, ref } from "vue";

// Высота textarea
const height = defineModel<number>('height', {
  required: true,
});
const props = defineProps<{
  chatId: number,
}>();
const emit = defineEmits<{
  (e: 'addMessage', message: Message): void
}>();

const textarea = ref<HTMLTextAreaElement | null>(null);
const text = ref<string>('');

// Толщина границы textarea
const border: number = 1;
const borderStyle: string = border + 'px';

/**
 * Изменяет высоту textarea в записимости от текста
 */
const onInput = () => {
  if (!textarea.value) {
    return;
  }
  textarea.value.style.height = 'auto';
  const heightPx = textarea.value.scrollHeight + border * 2;
  textarea.value.style.height = `${heightPx}px`;
  height.value = textarea.value.offsetHeight;
}
onMounted(onInput);

/**
 * Отвправляет сообщение
 */
const onSubmit = () => {
  const message = text.value.trim();
  if (!message) {
    return;
  }

  // Вызываем функцию onInput, чтобы сбросить размер textarea до исходного
  text.value = '';
  nextTick(onInput);
  createMessage(props.chatId, message).then((message: Message | null) => {
    if (message) {
      emit('addMessage', message);
    }
  });
}
</script>

<template>
  <div class="chat__input">
    <textarea
      ref="textarea"
      v-model="text"
      @input="onInput"
      @keydown.enter.exact.prevent
      @keyup.enter.exact="onSubmit"
      rows="1"
    ></textarea>

    <AppButton @click="onSubmit" padding="0 0.6rem" bg="#212121">
      <AppSvgSend size="1.35rem" fill="#fff" />
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
.chat__input {
  padding-top: 0.5rem;
  display: flex;
  gap: 1rem;
  border-top: 1px solid #ddd;

  textarea {
    width: 100%;
    max-height: 6rem;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    border: v-bind(borderStyle) solid #ddd;
    border-radius: 0.5rem;
    overflow-y: auto;
    background: #fff;
    color: inherit;
    line-height: inherit;
    outline: none;
    transition: 0.1s;
  }

  textarea:hover {
    border: v-bind(borderStyle) solid #e9e9e9;
  }
}
</style>