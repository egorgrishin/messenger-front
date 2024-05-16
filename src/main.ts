import './style.scss'
import App from './App.vue'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import router from "./router.config";
import { createApp } from 'vue'

const accessToken: string | null = localStorage.getItem('accessToken');

window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: 'reverb',
  key: 'yp5s26tdak7lb7zeb3ic',
  wsHost: '127.0.0.1',
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  authEndpoint: 'http://127.0.0.1/broadcasting/auth',
  enabledTransports: ['ws', 'wss'],
  auth: {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
});

createApp(App)
  .use(router)
  .mount('#app');
