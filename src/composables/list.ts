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

abstract class Scroller<T> {
  public itemsList: Ref<Element | null> = ref(null);
  public items: Ref<T[]> = ref([]);
  public hasError: Ref<boolean> = ref(false);
  protected isEnded: boolean = false;
  protected inLoad: boolean = false;

  protected id: number;
  protected lastItemId: number | null = null;
  protected itemsGetter: (id: number, lastMessageId: number | null) => Promise<T[] | null>;
  protected lastIdGetter: (items: T[]) => number;

  constructor(
    id: number,
    itemsGetter: (id: number, lastMessageId: number | null) => Promise<T[] | null>,
    lastIdGetter: (items: T[]) => number
  ) {
    this.id = id;
    this.itemsGetter = itemsGetter;
    this.lastIdGetter = lastIdGetter;
  }

  abstract addItems(loaded: T[]): void;

  abstract scrollList(): (event: Event) => void;

  abstract setScroll(prevHeight: number, min: number): void;

  public async loadItems(force: boolean = false): Promise<void> {
    if (this.inLoad || this.isEnded || this.hasError.value && !force) {
      return;
    }

    this.inLoad = true;
    const loaded: T[] | null = await this.itemsGetter(this.id, this.lastItemId);
    this.hasError.value = loaded === null;

    if (loaded !== null) {
      if (loaded.length === 0) {
        this.isEnded = true;
      } else {
        this.lastItemId = this.lastIdGetter(loaded);
        this.addItems(loaded)
      }
    }
    this.inLoad = false;
  }
}

class UpScroller<T> extends Scroller<T> {
  public addItems(loaded: T[]): void {
    this.items.value.unshift(...loaded);
  }

  public scrollList(): (event: Event) => void {
    return (event: Event): void => {
      const list: Element = event.target as Element;
      const min: number = list.clientHeight * 0.2;
      if (list.scrollTop <= min) {
        const prevHeight: number = list.scrollHeight;
        this.loadItems().then(() => this.setScroll(prevHeight, min));
      }
    }
  }

  public setScroll(prevHeight: number, min: number): void {
    const list: Element | null = this.itemsList.value;
    if (this.isEnded || !list) {
      return;
    }
    list.scroll({ top: list.scrollHeight - prevHeight + min });
  }
}

class DownScroller<T> extends Scroller<T> {
  public addItems(loaded: T[]): void {
    this.items.value.push(...loaded);
  }

  public scrollList() {
    return (event: Event) => {
      const list: Element = event.target as Element;
      const min: number = list.scrollHeight * 0.9;
      const scrolled: number = list.scrollTop + list.clientHeight;
      if (scrolled >= min) {
        // noinspection JSIgnoredPromiseFromCall
        this.loadItems();
      }
    }
  }

  public setScroll(): void {
    return;
  }
}

export default function useList<T = Chat | Message>({
  id,
  direction,
  getItems,
  getLastId,
}: Params<T>): Scroller<T> {
  return direction === Direction.Up
    ? new UpScroller(id, getItems, getLastId)
    : new DownScroller(id, getItems, getLastId);
}