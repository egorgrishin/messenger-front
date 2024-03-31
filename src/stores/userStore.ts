import {defineStore} from 'pinia'
import {Ref, ref} from "vue";

interface User {
  id: number
  nick: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  const $reset = () => {
    user.value = null;
  }

  return {
    user: user as Ref<User|null>,
    $reset: $reset as Function
  }
});
