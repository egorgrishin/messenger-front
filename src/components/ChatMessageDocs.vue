<script setup lang="ts">
import { FileModel } from 'interfaces/file.ts';
import AppIconDoc from 'components/icons/AppIconDoc.vue';
import { Types } from "@/helper/file.ts";

const props = defineProps<{
  files: FileModel[],
}>();

const getDocName = (filename: string) => {
  const i = filename.lastIndexOf('.');
  return i !== -1 ? filename.substring(0, i) : filename;
};

const getDocExtension = (filename: string) => {
  const i = filename.lastIndexOf('.');
  return i !== -1 ? filename.substring(i) : '';
};
</script>

<template>
  <div>
    <div
      v-for="file in Types.getDocsFiles(props.files)"
      :key="file.uuid"
      class="doc"
    >
      <a
        :href="file.url"
        class="doc__item"
        target="_blank"
        download
      >
        <AppIconDoc size="1.5rem" style="flex-shrink: 0; margin-right: 0.5rem" />
        <span class="doc__item-name">{{ getDocName(file.filename) }}</span>
        <span class="doc__item-ext">{{ getDocExtension(file.filename) }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.doc {
  display: flex;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  &__item {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    &-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-ext {
      color: #000;
    }
  }
}
</style>