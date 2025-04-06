<script setup lang="ts">
import { Message } from 'interfaces/chat';
import { Types } from "@/helper/file.ts";
import ChatMessageDocs from "components/ChatMessageDocs.vue";
import ChatMessageMedia from "components/ChatMessageMedia.vue";

const props = defineProps<{
  userId: number,
  message: Message,
}>();

const emit = defineEmits<{
  (e: 'editMessage', message: Message): void
}>();

const onMouseDown = (e: Event) => {
  if (!(e.currentTarget as HTMLDivElement).classList.contains('right')) {
    return;
  }

  emit('editMessage', props.message);
}
</script>

<template>
  <div
    :class="{
      'messages-list__message': true,
      left: message.userId !== userId,
      right: message.userId === userId,
    }"
    @mousedown.right="onMouseDown"
    @contextmenu.prevent
  >
    <ChatMessageMedia
      v-if="Types.getMediaFiles(message.files).length !== 0"
      :media-files="Types.getMediaFiles(message.files)"
    />

    <span
      v-if="message.text"
      class="message__text"
    >{{ message.text }}</span>

    <ChatMessageDocs
      v-if="Types.getDocsFiles(message.files).length !== 0"
      :files="message.files"
      :is-right="message.userId === userId"
    />
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.left {
  align-self: flex-start;
  box-shadow: 0 0 0.5rem #e0ebe9;
  background: #fbfdfc;
  border: 1px solid #e8e9ed;
}

.right {
  background: #7662fd;
  color: #ffffff;
  align-self: flex-end;
  box-shadow: 0 0 0.5rem #b7c0bf;
  border: 1px solid #6653ec;
}

.messages-list__message {
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: min(70%, 580px);
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  hyphens: auto;

  .message__media-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2px;

    .message__media-item {
      color: #666666;
      position: relative;
      width: 100%;
      padding-top: 100%;
      overflow: hidden;
      aspect-ratio: 1 / 1;
      box-sizing: border-box;

      img {
        width: 100%;
        height: 100%;
        border-radius: 0.75rem;
        object-fit: cover;

        position: absolute;
        top: 0;
        left: 0;
      }
    }

    &:has(.message__media-item:nth-child(1):nth-last-child(1)) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }

    &:has(.message__media-item:nth-child(1):nth-last-child(2)) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
    }
  }
}

.messages-list__message:not(:has(.message__media-list)):has(.message__text):has(.doc) .message__text {
  padding-top: 0.5rem;
}

.messages-list__message:has(.message__media-list) {
  width: 100%;
}

.TTmedia-video {
  img {
    filter: brightness(50%);
  }

  .TTmedia-video-play, .TTmedia-more-text {
    color: #fff;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.TTimage, .TTvideo {
  max-height: 80px;

  img {
    max-height: 80px;
  }
}

.messages-list {
  &__empty-block {
    flex-grow: 1;
  }

  &__header_empty {
    font-weight: 500;
    margin-top: 0.5rem;
  }
}

.message__text {
  padding: 0 0.5rem;
}

.message__text:only-child {
  padding: 0.5rem 0.75rem;
}

.message__text:last-child:not(:nth-child(1)) {
  padding-bottom: 0.5rem;
}
</style>