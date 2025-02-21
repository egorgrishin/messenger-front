<script setup lang="ts">
import { FileModel, InputFile } from 'interfaces/file';
import AppIconDoc from 'components/icons/AppIconDoc.vue';
import AppIconVideo from 'components/icons/AppIconVideo.vue';
import AppIconImage from 'components/icons/AppIconImage.vue';
import AppIconClose from 'components/icons/AppIconClose.vue';
import { UUID } from 'uuidjs';
import { createFile } from 'services/fileService.ts';
import { startFancybox, Types } from '@/helper/file.ts';
import { userSlideType } from '@fancyapps/ui/types/Carousel/types';

// Открытые файлы
const inputFiles = defineModel<Map<string, InputFile>>('files', {
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

  for (const file of list) {
    const uuid = UUID.generate();
    inputFiles.value.set(uuid, {
      uuid: uuid,
      model: null,
      original: file,
    });

    createFile(uuid, file)
      .then((file: FileModel) => {
        const inputFile = inputFiles.value.get(file.uuid);
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
    if (file.model && Types.isMediaByModel(file.model)) {
      slides.push({
        src: file.model.url,
        thumbSrc: file.model.videoPreviewUrl ?? undefined,
      });
    }
  }

  startFancybox(slides, startIndex);
};

const getBackgroundUrl = (file: FileModel) => {
  return (Types.isImageByModel(file) ? file.url : file.videoPreviewUrl) || undefined;
};

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
          'chat__files-item-loaded': !!inputFile.model,
        }"
    >
      <div
        @click.stop="() => deleteFile(inputFile.uuid)"
        class="chat__files-item-close"
      >
        <AppIconClose size="1.25rem" fill="#fff" />
      </div>

      <img
        v-if="inputFile.model && Types.isMedia(inputFile)"
        :src="getBackgroundUrl(inputFile.model)"
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