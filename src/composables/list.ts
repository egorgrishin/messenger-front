import { Chat, Message } from "../interfaces/chat";
import { ref, Ref } from "vue";
import { User } from "../interfaces/user.ts";

export enum Direction {
  Up = 0,
  Down = 1,
}

interface Params<T> {
  direction: Direction,
  itemsGetter: () => Promise<T[] | null>,
  lastIdGetter: (items: T[]) => number,
}

interface Return<T> {
  itemsList: Ref<HTMLElement | null>,
  items: Ref<T[]>,
  lastItemId: Ref<number | null>,
  loadItems: (force?: boolean) => Promise<void>,
  scrollList: (event: Event) => void,
  setScroll: (prevHeight: number, min: number) => void,
  reset: () => void,
}

export default function useList<T = Chat | Message | User>({
  direction,
  itemsGetter,
  lastIdGetter,
}: Params<T>): Return<T> {
  const isUpDirection: boolean = direction === Direction.Up;
  const itemsList: Ref<HTMLElement | null> = ref(null);
  const items: Ref<T[]> = ref([]);
  const lastItemId: Ref<number | null> = ref(null);
  let isEnded: boolean = false;
  let inLoad: boolean = false;

  const addItems: (loaded: T[]) => void = (loaded: T[]): void => {
    isUpDirection
      ? items.value.unshift(...loaded)
      : items.value.push(...loaded);
  }

  const setScroll: (prevHeight: number, min: number) => void = (prevHeight: number, min: number): void => {
    const list: Element | null = itemsList.value;
    if (!isUpDirection || isEnded || !list) {
      return;
    }
    list.scroll({ top: list.scrollHeight - prevHeight + min });
  }

  const loadItems: () => Promise<void> = async (): Promise<void> => {
    if (inLoad || isEnded) {
      return;
    }

    inLoad = true;
    const loaded: T[] | null = await itemsGetter();
    if (loaded !== null) {
      if (loaded.length === 0) {
        isEnded = true;
      } else {
        lastItemId.value = lastIdGetter(loaded);
        addItems(loaded)
      }
    } else {
      alert('Error');
    }
    inLoad = false;
  }

  const scrollList: (event: Event) => void = (event: Event): void => {
    const list: Element = event.target as Element;
    if (isUpDirection) {
      const list: Element = event.target as Element;
      const min: number = list.clientHeight * 0.2;
      if (list.scrollTop <= min) {
        const prevHeight: number = list.scrollHeight;
        loadItems().then(() => setScroll(prevHeight, min));
      }
      return;
    }

    const min: number = list.scrollHeight * 0.9;
    const scrolled: number = list.scrollTop + list.clientHeight;
    if (scrolled >= min) {
      // noinspection JSIgnoredPromiseFromCall
      loadItems();
    }
  };

  const reset: () => void = (): void => {
    items.value = [];
    lastItemId.value = null;
    isEnded = false;
    inLoad = false;
  }

  return {
    itemsList,
    items,
    lastItemId,
    loadItems,
    scrollList,
    setScroll,
    reset,
  }
}