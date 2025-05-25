<script setup lang="ts">
import { FileModel, InputFile } from 'interfaces/file';
import AppIconDoc from 'components/icons/AppIconDoc.vue';
import AppIconVideo from 'components/icons/AppIconVideo.vue';
import AppIconImage from 'components/icons/AppIconImage.vue';
import AppIconCloseRounded from 'components/icons/AppIconCloseRounded.vue';
import { UUID } from 'uuidjs';
import { createFile } from 'services/fileService.ts';
import { startFancybox, Types } from '@/helper/file.ts';
import { userSlideType } from '@fancyapps/ui/types/Carousel/types';
import Notify from "composables/notify.ts";

// Открытые файлы
const inputFiles = defineModel<Map<string, InputFile | FileModel>>('files', {
  required: true,
});

const deleteFile = (uuid: string) => {
  inputFiles.value.delete(uuid);
};

const uploadFiles = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const list: FileList | null = target?.files || null;
  if (!list) {
    return;
  }

  let sent = false;
  const newList: File[] = [];
  for (const file of list) {
    if (file.size <= 524_288_000) {
      newList.push(file);
      continue;
    }
    if (!sent) {
      Notify.sendRed('Файл не должен быть больше 500мб');
      sent = true;
    }
  }

  for (const file of newList) {
    const uuid = UUID.generate();
    inputFiles.value.set(uuid, {
      uuid: uuid,
      model: null,
      original: file,
    });

    createFile(uuid, file)
      .then((file: FileModel) => {
        const inputFile = inputFiles.value.get(file.uuid) as InputFile;
        if (!inputFile) {
          return;
        }
        inputFile.model = file;
        inputFiles.value.set(file.uuid, inputFile);
      })
      .catch((uuid: string) => {
        inputFiles.value.delete(uuid);
      });
  }
};

const onSelectFile = (): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.onchange = uploadFiles;
  input.click();
};

const showGallery = (selectedFileUuid: string): void => {
  const slides: userSlideType[] = [];
  let startIndex = 0;
  let isStopped = false;

  for (let file of inputFiles.value.values()) {
    if (file.uuid === selectedFileUuid && Types.isDoc(file)) {
      return;
    }
    if (file.uuid === selectedFileUuid) {
      isStopped = true;
    }
    if (!isStopped) {
      startIndex++;
    }

    let fileForShow = null;
    if ('type' in file) {
      fileForShow = file;
    } else if (file.model && Types.isMediaByModel(file.model)) {
      fileForShow = file.model;
    }

    if (fileForShow !== null) {
      slides.push({
        src: fileForShow.url,
        thumbSrc: fileForShow.videoPreviewUrl ?? undefined,
      });
    }
  }

  startFancybox(slides, startIndex);
};

const getBackgroundUrl = (file: FileModel) => {
  return (Types.isImageByModel(file) ? file.url : file.videoPreviewUrl) || undefined;
};

const isFileModel = (file: InputFile | FileModel): boolean => {
  return 'type' in file;
}

defineExpose({
  onSelectFile,
});
</script>

<template>
  <div
    v-if="inputFiles.size > 0"
    class="chat__files"
  >
    <div
      v-for="[uuid, inputFile] in inputFiles.entries()"
      @click="() => showGallery(uuid)"
      :class="{
          'chat__files-item': true,
          'chat__files-item-loaded': isFileModel(inputFile) ? true : !!(inputFile as InputFile).model,
        }"
    >
      <div
        @click.stop="() => deleteFile(inputFile.uuid)"
        class="chat__files-item-close"
      >
        <AppIconCloseRounded size="1.25rem" fill="#fff" />
      </div>

      <img
        v-if="(isFileModel(inputFile) || (inputFile as InputFile).model) && Types.isMedia(inputFile)"
        :src="getBackgroundUrl((isFileModel(inputFile) ? inputFile : (inputFile as InputFile).model) as FileModel)"
        class="chat__files-item-preview"
      >
      <div v-else>
        <AppIconImage v-if="Types.isImage(inputFile)" size="1.75rem" />
        <AppIconVideo v-else-if="Types.isVideo(inputFile)" size="1.75rem" />
        <AppIconDoc v-else size="1.75rem" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat__files {
  padding: 0.5rem 0;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  border-top: 1px solid #ddd;

  .chat__files-item {
    width: 5rem;
    height: 5rem;
    margin-right: 10px; /* Пространство между квадратами */
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    background: #ccc;

    .chat__files-item-close {
      position: absolute;
      height: 1.25rem;
      width: 1.25rem;
      right: -0.25rem;
      top: -0.25rem;
    }

    .chat__files-item-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.5rem;
    }
  }

  .chat__files-item-loaded {
    background: #eee !important;
  }
}
</style>