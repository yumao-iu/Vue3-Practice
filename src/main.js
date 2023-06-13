import { createApp } from "vue";
import { createPinia } from "pinia";
import App from './App.vue'
import './assets/css/public.css'
import './assets/css/iconfont.css'
import 'element-plus/dist/index.css'
import Router from '@/router'

let app = createApp(App)
let Pinia = createPinia()
app.use(Pinia)
app.use(Router)
app.mount('#app')