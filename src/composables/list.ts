import { Chat, Message } from "../interfaces/chat.ts";
import { ref, Ref } from "vue";

export enum Direction {
  Up = 0,
  Down = 1,
}

interface Params<T> {
  id: number,
  direction: Direction,
  getItems: (id: number, lastMessageId: number | null) => Promise<T[] | null>,
  getLastId: (items: T[]) => number,
}

export default function useList<T = Chat | Message>({
  id,
  direction,
  getItems,
  getLastId,
}: Params<T>): {
  itemsList: Ref<Element | null>,
  items: Ref<T[]>,
  hasError: Ref<boolean>,
  loadItems: (force?: boolean) => Promise<void>,
  scrollList: (event: Event) => void,
  scrollCallback: (prevHeight: number, min: number) => void,
} {
  const itemsList: Ref<Element | null> = ref(null);
  const items: Ref<T[]> = ref([]);
  const hasError: Ref<boolean> = ref(false);
  let isEnded: boolean = false;
  let lastMessageId: number | null = null;
  let inLoad: boolean = false;

  const loadItems = async (force: boolean = false): Promise<void> => {
    if (inLoad || isEnded || hasError.value && !force) {
      return;
    }

    inLoad = true;
    const loaded: T[] | null = await getItems(id, lastMessageId);
    hasError.value = loaded === null;

    if (loaded !== null) {
      if (loaded.length === 0) {
        isEnded = true;
      } else {
        lastMessageId = getLastId(loaded);
        addItems(loaded)
      }
    }
    inLoad = false;
  };

  const scrollList = (event: Event): void => {
    const list: Element = event.target as Element;
    if (direction === Direction.Up) {
      const min: number = list.clientHeight * 0.2;
      if (list.scrollTop <= min) {
        const prevHeight: number = list.scrollHeight;
        loadItems().then(() => scrollCallback(prevHeight, min));
      }
      return;
    }

    const min: number = list.scrollHeight * 0.9;
    const scrolled: number = list.scrollTop + list.clientHeight;
    if (scrolled >= min) {
      // noinspection JSIgnoredPromiseFromCall
      loadItems();
    }
  }

  const addItems: (loaded: T[]) => void = (loaded: T[]): void => {
    direction === Direction.Up
      ? items.value.unshift(...loaded)
      : items.value.push(...loaded);
  };

  const scrollCallback = (prevHeight: number, min: number) => {
    const list: Element | null = itemsList.value;
    if (isEnded || !list) {
      return;
    }
    list.scroll({ top: list.scrollHeight - prevHeight + min });
  }

  return {
    itemsList,
    items,
    hasError,
    loadItems,
    scrollList,
    scrollCallback,
  }
}