// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MapLayout from '../views/MapLayout.vue'
import MapHome from '../views/MapHome.vue'
import MeasureView from '../views/MeasureView.vue'
import DisasterView from '../views/DisasterView.vue'

const routes = [
  {
    path: '/',
    component: MapLayout,
    children: [
      {
        path: '',
        name: 'MapHome',
        component: MapHome,
        meta: { title: '综合监测' },
      },
      {
        path: 'measure',
        name: 'Measure',
        component: MeasureView,
        meta: { title: '测量' },
      },
      {
        path: 'disaster',
        name: 'Disaster',
        component: DisasterView,
        meta: { title: '灾害属性' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 综合监测`
  }
  next()
})

export default router
