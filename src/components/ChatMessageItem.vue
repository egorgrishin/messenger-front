<script setup lang="ts">
import { Message } from 'interfaces/chat';
import { Types } from "@/helper/file.ts";
import ChatMessageDocs from "components/ChatMessageDocs.vue";
import ChatMessageMedia from "components/ChatMessageMedia.vue";

const props = defineProps<{
  userId: number,
  message: Message,
}>();
</script>

<template>
  <div
    :class="{
      'messages-list__message': true,
      left: message.userId !== props.userId,
      right: message.userId === props.userId,
    }"
  >
    <ChatMessageMedia
      v-if="Types.getMediaFiles(message.files).length !== 0"
      :media-files="Types.getMediaFiles(message.files)"
    />

    <span v-if="message.text">{{ message.text }}</span>

    <ChatMessageDocs
      v-if="Types.getDocsFiles(message.files).length !== 0"
      :files="message.files"
    />
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.left {
  text-align: left;
  align-self: flex-start;
}

.right {
  background: #f7f7f7;
  text-align: right;
  align-self: flex-end;
}

.messages-list__message {
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
  max-width: 70%;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

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

      img, .TTopen-more {
        width: 100%;
        height: 100%;
        border-radius: 5px;
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

.messages-list__message:has(.message__media-list) {
  width: 100%;
}

.TTmedia-video, .TTopen-more {
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
</style>