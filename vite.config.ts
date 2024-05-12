import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "api": '/src/api',
      "assets": '/src/assets',
      "components": '/src/components',
      "composables": '/src/composables',
      "interfaces": '/src/interfaces',
      "layouts": '/src/layouts',
      "routes": '/src/routes',
      "services": '/src/services',
      "types": '/src/types',
      "views": '/src/views',
    },
  },
})
