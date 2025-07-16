import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Chat from '../views/Chat.vue'
import Analysis from '../views/Analysis.vue'
import Calendar from '@/views/Calendar.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
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
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/password-reset',
      name: 'PasswordReset',
      component: () => import('@/views/PasswordReset.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue')
    },
    {
      path: '/admin',
      name: 'AdminPanel',
      component: () => import('@/views/AdminPanel.vue')
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/ForgotPassword.vue')
    }
  ]
})

export default router