import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from "./router.config.ts";
import {createPinia} from "pinia";

const pinia = createPinia();

console.log("Main");

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
