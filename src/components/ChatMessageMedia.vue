<script setup lang="ts">
import { FileModel } from 'interfaces/file.ts';
import AppIconPlay from 'components/icons/AppIconPlay.vue';
import { startFancybox, Types } from "@/helper/file.ts";

const props = defineProps<{
  mediaFiles: FileModel[],
}>();

const MAX_MEDIA_FILES = 4;
const INDEX_LAST_FILE = MAX_MEDIA_FILES - 1;

const lastIndex = props.mediaFiles.length > MAX_MEDIA_FILES ? INDEX_LAST_FILE : MAX_MEDIA_FILES;
const info: {
  count: number,
  slicedFiles: FileModel[],
  darkenedFile: FileModel | null,
} = {
  count: props.mediaFiles.length,
  slicedFiles: props.mediaFiles.slice(0, lastIndex),
  darkenedFile: props.mediaFiles[INDEX_LAST_FILE] ?? null,
};

const showGallery = (startIndex: number): void => {
  const slides = props.mediaFiles.map(file => {
    return {
      src: file.url,
      thumbSrc: file.videoPreviewUrl ?? '',
    };
  });

  startFancybox(slides, startIndex ?? INDEX_LAST_FILE);
};
</script>

<template>
  <div class="message__media-list">
    <div
      v-for="(file, index) in info.slicedFiles"
      :key="file.uuid"
      class="message__media-item"
    >
      <img
        v-if="Types.isImageByModel(file)"
        @click="showGallery(index)"
        :src="file.url"
      />
      <div
        v-else
        @click="showGallery(index)"
        class="media__video"
      >
        <img :src="file.videoPreviewUrl ?? 'not-found'" />
        <AppIconPlay class="media__video-play" size="4rem" fill="#fff" />
      </div>
    </div>
    <div
      class="message__media-item media__show-more"
      v-if="mediaFiles.length > MAX_MEDIA_FILES"
    >
      <img
        v-if="info.darkenedFile && Types.isImageByModel(info.darkenedFile)"
        :src="info.darkenedFile.url"
        @click="showGallery(INDEX_LAST_FILE)"
      />
      <img
        v-else
        :src="info.darkenedFile?.videoPreviewUrl ?? 'not-found'"
        @click="showGallery(INDEX_LAST_FILE)"
      />
      <span>+{{ info.count - INDEX_LAST_FILE }}</span>
    </div>
  </div>

</template>

<style scoped lang="scss">
.message__media-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;

  &:has(.message__media-item:nth-child(1):nth-last-child(1)) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  &:has(.message__media-item:nth-child(1):nth-last-child(2)) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
}

.message__media-item {
  color: #666666;
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  box-sizing: border-box;

  img, .media__show-more {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    object-fit: cover;

    position: absolute;
    top: 0;
    left: 0;
  }
}

.media__video img, .media__show-more img {
  filter: brightness(50%);
}

.media__video-play, .media__show-more span {
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>