import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/iconfont/import_file/iconfont.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

if (typeof global === 'undefined') {
  window.global = window
}

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(Antd)
app.use(createPinia())
app.mount('#app')
