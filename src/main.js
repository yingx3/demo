import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import router from './router'
// import BaseData from './views/BaseData.vue'
// import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)
// const app = createApp({
//   template: '<router-view></router-view>', // 使用 router-view 替代 App
// })

// 使用插件
// app.use(router).mount('#app')
app.use(ElementPlus)

// 挂载应用
app.mount('#app')
