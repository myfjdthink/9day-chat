import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { initAnalytics, trackPageView } from './lib/analytics'

const app = createApp(App)
const pinia = createPinia()

// 初始化：写入 first/latest touch & user_properties
initAnalytics()

// SPA 必做：每次路由切换都发送一次 page_view
router.afterEach((to) => {
  trackPageView(to.fullPath)
})

app.use(pinia)
app.use(router)
app.mount('#app')