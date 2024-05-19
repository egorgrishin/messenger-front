import '@/style.scss'
import App from '@/App.vue'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import router from "@/router.config";
import { createApp } from 'vue'

const host: string = import.meta.env.VITE_HOST ?? 'http://127.0.0.1'
window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  authEndpoint: host + '/broadcasting/auth',
  enabledTransports: ['ws', 'wss'],
});

createApp(App)
  .use(router)
  .mount('#app');
