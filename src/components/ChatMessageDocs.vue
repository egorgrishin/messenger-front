<script setup lang="ts">
import { FileModel } from 'interfaces/file.ts';
import AppIconDoc from 'components/icons/AppIconDoc.vue';
import { Types } from "@/helper/file.ts";

const props = defineProps<{
  files: FileModel[],
  isRight: boolean,
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
      <AppIconDoc
        size="1.5rem" :fill="isRight ? '#fff' : 'currentColor'" style="flex-shrink: 0; margin-right: 0.5rem"
      />
      <span class="doc__item-name">{{ getDocName(file.filename) }}</span>
      <span class="doc__item-ext">{{ getDocExtension(file.filename) }}</span>
    </a>
  </div>
</template>

<style scoped lang="scss">
.doc {
  display: flex;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;

  &:last-child {
    //margin-bottom: 0;
  }

  &:first-child {
    margin-top: 0.5rem;
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

.doc:first-child {
  color: red;
}

.right .doc__item-name,
.right .doc__item-ext {
  color: #fff;
}
</style>