<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO组件 -->
    <SEO />
    
    <ResponsiveSidebar :active-tab="activeTab" @set-active-tab="setActiveTab" />
    <main class="flex-1 pt-16 md:pt-16 pb-16 md:pb-0">
      <router-view />
    </main>
    <LoginModal />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ResponsiveSidebar from './components/ResponsiveSidebar.vue'
import SEO from './components/SEO.vue'
import LoginModal from '@/components/LoginModal.vue'

const router = useRouter()
const route = useRoute()
const activeTab = ref('home')

// 根据路由更新activeTab
watch(() => route.name, (newRoute) => {
  if (newRoute) {
    activeTab.value = newRoute as string
  }
}, { immediate: true })

const setActiveTab = (tab: string) => {
  activeTab.value = tab
  
  // 路由映射
  const routeMap: Record<string, string> = {
    'home': '/',
    'ai-chat': '/chat',
    'analysis': '/analysis',
    'calendar': '/calendar',
    'zodiac-fortune': '/zodiac-fortune'
  }
  
  const targetRoute = routeMap[tab] || '/'
  if (route.path !== targetRoute) {
    router.push(targetRoute)
  }
}
</script>

<style>
#app {
  height: 100vh;
}
</style>