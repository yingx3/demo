import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import Pinia
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import { Buffer } from 'buffer'

// import router from './router'
// import BaseData from './views/BaseData.vue'
// import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)
// const app = createApp({
//   template: '<router-view></router-view>', // 使用 router-view 替代 App
// })

// // 配置路由
// const routes = [
//   {
//     path: '/',
//     redirect: '/BaseData', // 重定向到 /BaseData
//   },
//   {
//     path: '/BaseData',
//     component: BaseData,
//   },
// ]

// const router = createRouter({
//   history: createWebHistory('/CS/'), // 配置 history 模式和 base 路径
//   routes,
// })
// 全局注入Buffer
if (typeof global === 'undefined') {
  window.global = window // 将浏览器环境的全局对象指向 window
}
// 使用插件
// app.use(router).mount('#app')
app.use(ElementPlus)

app.use(createPinia()) // Add Pinia to the app
// 挂载应用
app.mount('#app')
