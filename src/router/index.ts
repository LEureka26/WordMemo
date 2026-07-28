import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'learn',
    component: () => import('@/views/LearnView.vue'),
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('@/views/QuizView.vue'),
  },
  {
    path: '/wordbook',
    name: 'wordbook',
    component: () => import('@/views/WordbookView.vue'),
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/views/StatsView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.onError((error) => {
  console.warn('路由跳转失败:', error)
  alert('页面跳转失败，请检查链接或刷新后重试')
})

export default router
