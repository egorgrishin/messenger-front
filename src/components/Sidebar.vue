<script setup lang="ts">
import { shallowRef, watch } from "vue";
import SidebarHeader from "components/SidebarHeader.vue";
import { Chat } from "interfaces/chat.ts";
import { useRoute } from "vue-router";
import SidebarChats from "components/SidebarChats.vue";
import SidebarSettings from "components/SidebarSettings.vue";
import { useScreen } from "composables/screen.ts";
import SidebarTabBar from "components/SidebarTabBar.vue";

const route = useRoute();
const getTab = () => {
  const routeTab = String(route.query.tab) as Tab;
  return !(routeTab in availableTabs)
    ? availableTabs[defaultTab]
    : availableTabs[routeTab];
};

const availableTabs = {
  chats: SidebarChats,
  settings: SidebarSettings,
} as const;
type Tab = keyof typeof availableTabs;

const defaultTab: Tab = 'chats';
const tab = shallowRef(getTab());

watch(() => route.query.tab, () => tab.value = getTab());

const { isMobile } = useScreen();

const emit = defineEmits<{
  (e: 'openChat', chat: Chat): void
}>();

const openChat = async (chat: Chat): Promise<void> => {
  emit('openChat', chat);
};

defineExpose({
  openChat,
});
</script>

<template>
  <div
    :class="{
    sidebar: true,
    sidebar__mobile: isMobile
    }"
  >
    <SidebarHeader />

    <hr class="mb" />

    <KeepAlive>
        <component :is="tab" />
    </KeepAlive>

    <hr />

    <SidebarTabBar />
  </div>
</template>

<style scoped lang="scss">
@use "assets/vars" as *;

.sidebar {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 0.75rem;
  box-shadow: 0 0 1rem 0 #e9eeed;
  background: #fbfdfc;
  height: calc(100vh - 0.75rem * 2);
  width: 23rem;
  flex-shrink: 0;
}

.sidebar__search {
  display: flex;
  align-items: center;
  flex-direction: row;
  position: relative;

  input {
    flex-grow: 1;
    padding: 0.625rem 2rem 0.625rem 1rem;
  }

  svg {
    position: absolute;
    right: 1.5rem
  }
}

hr {
  margin: 0;
  border: none;
  height: 1px;
  color: #e8e9ed;
  background-color: #e8e9ed;
  flex-shrink: 0;

  &.mb {
    margin-bottom: 0.75rem;
  }
}
</style>