<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import { deleteAvatar, resetPassword, sendEmailCode, updateAvatar, updateUser } from "services/userService.ts";
import { ref } from "vue";
import AppInput from "components/AppInput.vue";
import Notify from "composables/notify.ts";
import { useLoading } from "composables/loading.ts";

const { unique } = useLoading();

const userId: number = +(localStorage.getItem('userId') || 0);
const nick = ref<string>(localStorage.getItem('userNick')!);
const code = ref<string>('');
const password = ref<string>('');
const passwordConfirmation = ref<string>('');

const hasAvatar = ref<boolean>(!!localStorage.getItem('userAvatarUrl'));
window.addEventListener('auth', (event: any): void => {
  hasAvatar.value = !!event.detail.avatarUrl;
});

const retry = ref<number>(0);
setInterval(() => retry.value > 0 ? retry.value-- : true, 1000);

const onSelectAvatar = (): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  input.accept = 'image/*';
  input.onchange = onSaveAvatar;
  input.click();
};

const onSaveAvatar = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.item(0);
  if (!file) {
    return;
  }
  updateAvatar(userId, file);
};

const onSaveUser = () => {
  updateUser(userId, nick.value);
};

const onDeleteAvatar = (): void => {
  deleteAvatar(userId);
};

const sendCode = async (): Promise<void> => {
  const [retryDelay, passed] = await sendEmailCode();
  if (typeof retryDelay === 'undefined') {
    return;
  }
  retry.value = Math.max(0, retryDelay - (passed || 0));
}

const onChangePassword = (event: Event): void => {
  event.preventDefault();

  unique(async (): Promise<void> => {
    if (await resetPassword(null, code.value, password.value, passwordConfirmation.value)) {
      Notify.sendGreen('Пароль сохранен');
      code.value = '';
      password.value = '';
      passwordConfirmation.value = '';
    }
  }, undefined);
}
</script>

<template>
  <div class="sidebar__settings">
    <span class="settings_subtitle">Изменение аватара</span>
    <div class="settings__avatar">
      <AppButton
        bg="#fff"
        border="1px solid #e8e9ed"
        color="#212121"
        @click="onSelectAvatar"
      >
        Выбрать аватар
      </AppButton>
      <AppButton
        v-if="hasAvatar"
        bg="#D0342C"
        border="1px solid #e8e9ed"
        color="#fff"
        @click="onDeleteAvatar"
      >
        Удалить аватар
      </AppButton>
    </div>

    <hr />

    <span class="settings_subtitle">Изменение данных</span>
    <div class="settings_item">
      <label for="nick">Имя</label>
      <AppInput
        v-model:model="nick"
        id="nick"
        type="text"
        placeholder="Имя"
        :minlength="3"
        :maxlength="32"
      />
    </div>

    <AppButton
      bg="#7663fd"
      border="1px solid #7663fd"
      color="#fff"
      :fontWeight="600"
      :disabled="!nick"
      @click="onSaveUser"
    >
      Сохранить
    </AppButton>

    <hr />

    <span class="settings_subtitle">Изменение пароля</span>
    <AppInput
      v-model:model="password"
      type="password"
      placeholder="Пароль"
    />
    <AppInput
      v-model:model="passwordConfirmation"
      type="password"
      placeholder="Повторите пароль"
    />

    <AppInput
      v-model:model="code"
      type="text"
      placeholder="Код подтверждения"
    />
    <AppButton
      bg="#fff"
      border="1px solid #e8e9ed"
      color="#212121"
      @click="sendCode"
      type="button"
      :disabled="retry > 0"
    >
      <span v-if="retry > 0">Отправить через {{ retry }}</span>
      <span v-else>Отправить код</span>
    </AppButton>

    <AppButton
      bg="#7663fd"
      border="1px solid #7663fd"
      color="#fff"
      :fontWeight="600"
      :disabled="!code || !password || !passwordConfirmation"
      @click="onChangePassword"
    >
      Сохранить пароль
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
.sidebar__settings {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  gap: 0.75rem;
}

.settings_subtitle {
  font-weight: 500;
}

.settings__avatar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings_item {
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.25rem;
  }
}

// TODO global style
hr {
  margin: 0.25rem 0;
  border: none;
  height: 1px;
  color: #e8e9ed;
  background-color: #e8e9ed;
  flex-shrink: 0;
}
</style>