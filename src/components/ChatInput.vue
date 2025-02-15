<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppSvgSend from "components/AppIconSend.vue";
import { Message } from "interfaces/chat";
import { createMessage } from "services/chatService.ts";
import { nextTick, onMounted, ref } from "vue";
import { useLoading } from "composables/loading.ts";
import { createFile } from "services/fileService.ts";
import { File as OFile } from "interfaces/file";

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
const openedFiles = ref<UF[]>([]);

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

interface UF {
  fileModel: OFile,
  userFile: File,
}

const onSelectFile = (type: string): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = type;

  input.onchange = async () => {
    const list: FileList | null = input.files;
    if (!list) {
      return;
    }
    for (const file of list) {
      createFile(file)
        .then((uploadedFile: OFile) => {
          openedFiles.value.push({
            fileModel: uploadedFile,
            userFile: file,
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  input.click();
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
  if (!message && openedFiles.value.length === 0) {
    return;
  }

  // Блокируем параллельное выполнение кода
  unique(async (): Promise<void> => {
    // Вызываем функцию onInput, чтобы сбросить размер textarea до исходного
    text.value = '';
    textarea.value?.focus();

    nextTick(onInput).then();
    const fileUuids = openedFiles.value.map((f: UF) => f.fileModel.uuid);
    const createdMessage = await createMessage(props.chatId, message, fileUuids);
    if (createdMessage) {
      emit('addMessage', createdMessage);
    }
  }, undefined)
}

const deleteFile = (key: string) => {
  openedFiles.value.delete(key);
}
</script>

<template>
  <div class="chat__input">
    <div class="opened-files-list">
      <div
        class="list__user"
        v-for="[key, file] in openedFiles"
        @click="() => deleteFile(key)"
      >
        {{ file.userFile.name }}
      </div>
    </div>
    <div class="chatt">
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

.opened-files-list {

}

.chatt {
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