import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { path, resolve } from 'path'
import importToCDN from 'vite-plugin-cdn-import'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [vue(),
  importToCDN({
    modules: [
      {
        name: 'Vue',
        var: 'Vue',
        path: 'https://cdn.bootcdn.net/ajax/libs/vue/3.2.45/vue.global.min.js',
      },
      {
        name: 'VueRouter',
        var: 'VueRouter',
        path: 'https://cdn.bootcdn.net/ajax/libs/vue-router/4.1.6/vue-router.global.min.js',
      },
      {
        name: "Axios",
        var: 'Axios',
        path: "https://cdn.bootcdn.net/ajax/libs/axios/1.2.2/axios.min.js",
      }
    ]
  }),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
  ],
  server: {
    host: '127.0.0.1',
    port: 8000,
    open: true,
    https: false,
    proxy: {
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
