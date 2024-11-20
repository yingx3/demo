import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
// import BaseData from './views/BaseData.vue'
// import { createRouter, createWebHistory } from 'vue-router'

// const app = createApp(App)
const app = createApp({
  template: '<router-view></router-view>', // 使用 router-view 替代 App
})

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

// 使用插件
app.use(router).mount('#app')
app.use(ElementPlus)

// 挂载应用
// app.mount('#app')
