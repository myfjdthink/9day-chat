import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Chat from '../views/Chat.vue'
import Analysis from '../views/Analysis.vue'
import Calendar from '@/views/Calendar.vue'
import ZodiacFortune from '@/views/ZodiacFortune.vue'
import Evaluation from '@/views/Evaluation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/evaluation',
      name: 'evaluation',
      component: Evaluation
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: Analysis
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar
    },
    {
      path: '/zodiac-fortune',
      name: 'ZodiacFortune',
      component: ZodiacFortune
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/admin/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/admin/Register.vue')
    },
    {
      path: '/password-reset',
      name: 'PasswordReset',
      component: () => import('@/views/admin/PasswordReset.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/admin/Profile.vue')
    },
    {
      path: '/admin',
      name: 'AdminPanel',
      component: () => import('@/views/admin/AdminPanel.vue')
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/admin/ForgotPassword.vue')
    }
  ]
})

export default router