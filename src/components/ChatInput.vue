<script setup lang="ts">
import AppButton from 'components/AppButton.vue';
import AppSvgSend from 'components/AppIconSend.vue';
import { Message } from 'interfaces/chat';
import { createMessage } from 'services/chatService';
import { nextTick, onMounted, ref } from 'vue';
import { useLoading } from 'composables/loading';
import { InputFile } from 'interfaces/file';
import AppIconPlus from 'components/AppIconPlus.vue';
import ChatInputFiles from 'components/ChatInputFiles.vue';
import { Types } from '@/helper/file.ts';

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
const files = ref<Map<string, InputFile>>(new Map());
const inputFiles = ref<InstanceType<typeof ChatInputFiles> | null>(null);

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
};
onMounted(onInput);

const addMessage = async (message: string | null, fileUuids: string[] | null = null): Promise<void> => {
  const createdMessage = await createMessage(props.chatId, message, fileUuids);
  if (createdMessage) {
    emit('addMessage', createdMessage);
  }
}

/**
 * Отвправляет сообщение
 */
const onSubmit = (): void => {
  let message: string | null = text.value.trim();
  if (!message && files.value.size === 0) {
    return;
  }

  const inputFiles = Array.from(files.value.values());
  const unloadedFiles = inputFiles.filter(file => !file.model);
  if (unloadedFiles.length > 0) {
    return;
  }

  // Блокируем параллельное выполнение кода
  unique(async (): Promise<void> => {
    // Вызываем функцию onInput, чтобы сбросить размер textarea до исходного
    text.value = '';
    textarea.value?.focus();
    nextTick(onInput).then();

    const fileUuids = inputFiles.map(file => file.uuid);
    files.value.clear();

    for (let i = 0; i < fileUuids.length; i += Types.MAX_IN_MESSAGE) {
      let batchUuids = inputFiles.slice(i, i + Types.MAX_IN_MESSAGE).map(file => file.uuid);
      await addMessage(message, batchUuids);
      message = null;
    }

    if (message !== null) {
      await addMessage(message);
    }
  }, undefined);
};
</script>

<template>
  <div class="chat__input">
    <ChatInputFiles
      ref="inputFiles"
      v-model:files="files"
    />
    <div class="chat__input-area">
      <AppButton @click="inputFiles?.onSelectFile" padding="0 0.6rem" bg="#212121">
        <AppIconPlus size="1.35rem" fill="#fff" />
      </AppButton>

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
  </div>
</template>

<style scoped lang="scss">
.chat__input-area {
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