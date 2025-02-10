<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppSvgSend from "components/AppIconSend.vue";
import { Message } from "interfaces/chat";
import { createMessage } from "services/chatService.ts";
import { nextTick, onMounted, ref } from "vue";
import { useLoading } from "composables/loading.ts";

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

const { unique } = useLoading();
const textarea = ref<HTMLTextAreaElement | null>(null);
const text = ref<string>('');
const isOpened = ref<boolean>(false);
const openedFiles = ref<File[]>([]);

// Толщина границы textarea
const border: number = 1;
const borderStyle: string = border + 'px';

/**
 * Изменяет высоту textarea в записимости от текста
 */
const onInput = (): void => {
  if (!textarea.value) {
    return;
  }
  textarea.value.style.height = 'auto';
  const heightPx = textarea.value.scrollHeight + border * 2;
  textarea.value.style.height = `${heightPx}px`;
  height.value = textarea.value.offsetHeight;
}
onMounted(onInput);

const onSelectFile = (type: string): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = type;

  input.onchange = () => {
    const list: FileList | null = input.files;
    if (!list) {
      return;
    }

    openedFiles.value.push(...list)
    console.log(openedFiles.value)
  };

  input.click();
  // close();
};

const open = (): void => {
  isOpened.value = true;
}

const close = (): void => {
  isOpened.value = false;
}

/**
 * Отвправляет сообщение
 */
const onSubmit = (): void => {
  const message = text.value.trim();
  if (!message) {
    return;
  }

  // Блокируем параллельное выполнение кода
  unique(async (): Promise<void> => {
    // Вызываем функцию onInput, чтобы сбросить размер textarea до исходного
    text.value = '';
    textarea.value?.focus();

    nextTick(onInput).then();
    const createdMessage = await createMessage(props.chatId, message);
    if (createdMessage) {
      emit('addMessage', createdMessage);
    }
  }, undefined)
}
</script>

<template>
  <div class="chat__input">
    <div
      @mouseover="open"
      @mouseout="close"
    >
      <AppButton padding="0 0.6rem" bg="#212121">
        <span>F</span>
        <div
          class="select-main"
          :class="{
            opened: isOpened,
            closed: !isOpened,
          }"
        >
          <div class="select-block">
            <button @click="() => onSelectFile('image/*')">Image</button>
            <button @click="() => onSelectFile('video/*')">Video</button>
            <button @click="() => onSelectFile('*/*')">File</button>
          </div>
        </div>
      </AppButton>
    </div>

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
.select-main {

}

.popup-block {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  justify-content: center;
  align-items: center;
  background: #00000078;
}

.opened {
  display: flex;
}

.closed {
  display: none;
}

.popup-main {
  padding: 1rem;
  background: #fff;
}

.file-types {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

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