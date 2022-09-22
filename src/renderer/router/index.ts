import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // base: process.env.BASE_URL,
  history: createWebHistory(), //createWebHashHistory(''),
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '可视化平台',
      },
      component: () => import('@/views/Index.vue'),
    },
  ],
})

// 路由拦截
router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to, from, failure) => {
  window.scrollTo(0, 0)
})

export default router
