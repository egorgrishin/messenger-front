import { Chat, Message } from "../interfaces/chat.ts";
import { ref, Ref } from "vue";

export default function useList<T = Chat | Message>(
  id: number,
  getItems: (id: number, lastMessageId: number | null) => Promise<T[] | null>,
  getLastId: (items: T[]) => number,
): {
  items: Ref<T[]>,
  error: Ref<boolean>,
  loadItems: (force?: boolean) => Promise<void>,
  setId: (newId: number) => void,
  scrollList: (event: Event) => void,
} {
  const items: Ref<T[]> = ref([]);
  const error: Ref<boolean> = ref(false);
  let lastMessageId: number | null = null;
  let endedMessages: boolean = false;
  let inLoad: boolean = false;

  const loadItems = async (force: boolean = false): Promise<void> => {
    if (inLoad || endedMessages || error.value && !force) {
      return;
    }

    inLoad = true;
    const loaded: T[] | null = await getItems(id, lastMessageId);
    error.value = loaded === null;

    if (loaded !== null) {
      if (loaded.length === 0) {
        endedMessages = true;
      } else {
        lastMessageId = getLastId(loaded);
        items.value.push(...loaded);
      }
    }
    inLoad = false;
  };

  const scrollList: (event: Event) => void = (event: Event): void => {
    const target: Element = event.target as Element;
    const min: number = target.scrollHeight * 0.9;
    const scrolled: number = target.scrollTop + target.clientHeight;
    if (scrolled >= min) {
      // noinspection JSIgnoredPromiseFromCall
      loadItems();
    }
  }

  const setId: (newId: number) => void = (newId: number): void => {
    id = newId
  }

  return {
    items,
    error,
    loadItems,
    setId,
    scrollList,
  }
}