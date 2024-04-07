import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from "./router.config.ts";

console.log("Main");

createApp(App)
  .use(router)
  .mount('#app')
