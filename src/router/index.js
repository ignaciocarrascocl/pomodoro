import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QueEsPomodoroView from '../views/QueEsPomodoroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView, // Asegúrate de que esta ruta apunte a HomeView.vue
    },
    {
      path: '/que-es-pomodoro',
      name: 'que-es-pomodoro',
      component: QueEsPomodoroView,
    },
  ],
})

export default router
