<script setup lang="ts">
import AppButton from 'components/AppButton.vue';
import AppSvgSend from 'components/icons/AppIconSend.vue';
import { Message } from 'interfaces/chat';
import { createMessage, deleteMessage, updateMessage } from 'services/chatService';
import { nextTick, onMounted, ref } from 'vue';
import { useLoading } from 'composables/loading';
import { FileModel, InputFile } from 'interfaces/file';
import AppIconPlus from 'components/icons/AppIconPlus.vue';
import ChatInputFiles from 'components/ChatInputFiles.vue';
import { Types } from '@/helper/file.ts';
import AppIconClose from "components/icons/AppIconClose.vue";
import AppIconDelete from "components/icons/AppIconDelete.vue";
import AppIconAccept from "components/icons/AppIconAccept.vue";
import Notify from "composables/notify.ts";

// Высота textarea
const height = defineModel<number>('height', {
  required: true,
});

const props = defineProps<{
  chatId: number,
}>();

const { unique } = useLoading();
const textarea = ref<HTMLTextAreaElement | null>(null);
const text = ref<string>('');
const files = ref<Map<string, InputFile | FileModel>>(new Map());
const inputFiles = ref<InstanceType<typeof ChatInputFiles> | null>(null);
const marginVertical = ref<string>('1rem');
const editedMessage = ref<Message | null>(null);

// Толщина границы textarea
const border: number = 0;

let tempText: string = '';
let tempFiles: Map<string, InputFile | FileModel> = new Map();
const onEditMessage = (message: Message): void => {
  if (editedMessage.value === null) {
    tempText = text.value;
    tempFiles = files.value;
  }

  editedMessage.value = message;

  text.value = message.text;
  files.value.clear();
  for (const file of message.files) {
    files.value.set(file.uuid, file);
  }

  nextTick(onInput).then();
}

const cancelEdit = () => {
  text.value = tempText;
  files.value = tempFiles;

  editedMessage.value = null;
  tempText = '';
  tempFiles.clear();

  nextTick(onInput).then();
}

const onDeleteMessage = async () => {
  if (!editedMessage.value) {
    return;
  }
  if (await deleteMessage(editedMessage.value.id)) {
    cancelEdit();
  }
}

/**
 * Изменяет высоту textarea в записимости от текста
 */
const onInput = (): void => {
  if (!textarea.value) {
    return;
  }
  textarea.value.style.height = 'auto';
  const heightPx = textarea.value.scrollHeight + border * 2;
  const lineHeight = +getComputedStyle(textarea.value).lineHeight.slice(0, -2);
  const linesCount = textarea.value.scrollHeight / lineHeight;

  textarea.value.style.height = `${heightPx}px`;
  height.value = textarea.value.offsetHeight;
  marginVertical.value = linesCount > 1 ? '0.5rem' : '1rem';
};
onMounted(onInput);

const addMessage = async (message: string | null, fileUuids: string[] | null = null): Promise<void> => {
  await createMessage(props.chatId, message, fileUuids);
}

const editMessage = async (messageId: number, message: string | null, fileUuids: string[] | null = null): Promise<void> => {
  await updateMessage(messageId, message, fileUuids);
}

/**
 * Обработчик нажатия кнопки enter
 */
const onSubmit = (): void => {
  editedMessage.value ? onSave() : onSend();
};

const onSend = () => {
  let message: string = text.value.trim();
  if (message.length > 5000) {
    Notify.sendRed('Длина сообщения не должна превышать 5000 символов');
    return;
  }
  if (!message && files.value.size === 0) {
    return;
  }

  const inputFiles = Array.from(files.value.values());
  const unloadedFiles = inputFiles.filter(file => !('model' in file) || !file.model);
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
}

const onSave = () => {
  if (!editedMessage.value) {
    cancelEdit();
    return;
  }

  const editedMessageId = editedMessage.value.id;
  let message: string | null = text.value.trim();
  if (message === editedMessage.value.text && !hasNewFiles()) {
    cancelEdit();
    return;
  }

  const allFiles: (InputFile | FileModel)[] = Array.from(files.value.values());
  if (allFiles.length > Types.MAX_IN_MESSAGE) {
    Notify.send('Прикреплено слишком много файлов');
    return;
  }

  const newFiles: InputFile[] = allFiles.filter(file => 'original' in file) as InputFile[];
  if (newFiles.filter(file => !file.model).length > 0) {
    return;
  }

  const fileUuids = allFiles.map(file => file.uuid);

  unique(async (): Promise<void> => {
    // Вызываем функцию onInput, чтобы сбросить размер textarea до исходного
    text.value = '';
    textarea.value?.focus();
    nextTick(onInput).then();

    files.value.clear();
    editMessage(editedMessageId, message, fileUuids).then();
  }, undefined);
  cancelEdit();
}

const hasNewFiles = (): boolean => {
  const originFileUuids = (editedMessage.value as Message).files.map(file => file.uuid);
  const newFileUuids = Array.from(files.value.keys());

  if (originFileUuids.length !== newFileUuids.length) {
    return true;
  }

  const count: { [key: string]: number } = {};

  // Подсчитываем элементы первого массива
  for (let i = 0; i < originFileUuids.length; i++) {
    const item = originFileUuids[i];
    count[item] = (count[item] || 0) + 1;
  }

  // Проверяем элементы второго массива
  for (let i = 0; i < newFileUuids.length; i++) {
    const item = newFileUuids[i];
    if (!count[item]) {
      return true;
    }
    count[item]--;
  }

  return false;
};

defineExpose({
  onEditMessage,
})
</script>

<template>
  <div class="chat__input">
    <div
      v-if="editedMessage"
      class="chat__input-edited-message"
    >
      <span>{{ editedMessage.text }}</span>
      <button @click="onDeleteMessage">
        <AppIconDelete size="1.25rem" fill="#fff" />
      </button>
      <button @click="cancelEdit">
        <AppIconClose size="1.25rem" />
      </button>
    </div>
    <ChatInputFiles
      ref="inputFiles"
      v-model:files="files"
      @contextmenu.prevent
    />
    <div class="chat__input-area">
      <AppButton @click="inputFiles?.onSelectFile" padding="0 0.625rem" bg="#fff" border-radius="0.75rem">
        <AppIconPlus size="2rem" fill="#fff" />
      </AppButton>

      <textarea
        ref="textarea"
        v-model="text"
        @input="onInput"
        @keydown.enter.exact.prevent
        @keyup.enter.exact="onSubmit"
        rows="1"
      ></textarea>

      <AppButton v-if="editedMessage" @click="onSave" padding="0 0.625rem" bg="#fff" border-radius="0.75rem">
        <AppIconAccept size="2rem" fill="#fff" />
      </AppButton>

      <AppButton v-else @click="onSubmit" padding="0 0.625rem" bg="#fff" border-radius="0.75rem">
        <AppSvgSend size="1.75rem" fill="#fff" />
      </AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat__input {
  z-index: 1;
  background: #f5f9f8;

  &-edited-message {
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding: 0.5rem 0;
    border-top: 1px solid #ddd;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex-grow: 1;
    }

    button {
      flex-shrink: 0;

      &:nth-child(2) {
        box-shadow: #c9cccc 0 0 0.5rem 0;
        border: 1px solid #df271c;
        background: #f2362b;
        padding: 0.5rem;
        border-radius: 0.75rem;
      }

      &:nth-child(3) {
        box-shadow: #e0ebe9 0 0 0.5rem 0;
        background: #fbfdfc;
        border: 1px solid #e8e9ed;
        padding: 0.5rem;
        border-radius: 0.75rem;
        margin-left: 0.5rem;
      }
    }
  }
}

.chat__input-area {
  min-height: 3.375rem;
  //padding-top: 0.5rem;
  display: flex;
  align-items: center;
  //gap: 1rem;
  //border-top: 1px solid #ddd;
  border-radius: 0.75rem;
  box-shadow: rgb(224, 235, 233) 0 0 0.5rem 0;
  background: rgb(251, 253, 252);
  border: 1px solid rgb(232, 233, 237);

  textarea {
    width: 100%;
    max-height: 7rem;
    padding: 0 0.75rem;
    margin: v-bind(marginVertical) 0;
    box-sizing: border-box;
    border: none;
    //border: v-bind(borderStyle) solid #ddd;
    //border-radius: 0.5rem;
    overflow-y: auto;
    background: #fff;
    color: inherit;
    line-height: inherit;
    outline: none;
  }
}
</style>