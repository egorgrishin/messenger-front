import { computed, ComputedRef, ref, Ref } from "vue";
import { getEcho } from "@/helper/socket.ts";
import { User } from "interfaces/user.ts";

export default class Online {
  static readonly ONLINE_CHANNEL: string = 'online-users';

  static onlineUserIds: Ref<number[]> = ref<number[]>([]);

  private static isInitiated: boolean = false;

  private static computes: Map<number, ComputedRef<boolean>> = new Map();

  static init(): void {
    if (this.isInitiated) {
      return;
    }

    getEcho()
      .join(this.ONLINE_CHANNEL)
      .here((users: User[]) => {
        this.onlineUserIds.value = users.map(user => user.id);
      })
      .joining((user: User) => {
        this.onlineUserIds.value.push(user.id);
      })
      .leaving((user: User) => {
        this.onlineUserIds.value = this.onlineUserIds.value.filter(userId => userId !== user.id);
      });
    this.isInitiated = true;
  }

  static getIsOnline(userId: number): ComputedRef<boolean> {
    if (!(userId in this.computes)) {
      this.computes.set(userId, computed(() => {
        return this.onlineUserIds.value.includes(userId)
      }));
    }
    return this.computes.get(userId)!;
  }
}