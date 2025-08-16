<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO组件 -->
    <SEO />
    
    <!-- 右上角暗黑模式切换按钮 -->
    <Button
      variant="ghost"
      size="icon"
      class="fixed top-4 right-6 z-50"
      @click="toggleDark"
      aria-label="切换暗黑模式"
    >
      <template v-if="!isDark">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
      </template>
      <template v-else>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      </template>
    </Button>
    <Sidebar 
      :active-tab="activeTab" 
      :selected-chat-id="selectedChatId"
      :selected-analysis-id="selectedAnalysisId"
      @set-active-tab="setActiveTab"
      @select-chat="handleSelectChat"
      @delete-chat="handleDeleteChat"
      @select-analysis="handleSelectAnalysis"
      @delete-analysis="handleDeleteAnalysis"
    >
      <template #logo>
        <div class="flex items-center justify-center p-4">
          <img src="@/assets/logo.png" alt="Logo" class="h-8 w-auto object-contain" />
        </div>
      </template>
    </Sidebar>
    <main class="flex-1 sm:ml-64">
      <div class="pb-16 sm:pb-0"> <!-- 移动端底部导航栏间距 -->
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Chat from '@/views/Chat.vue'
import Analysis from '@/views/Analysis.vue'
import { useChatStore } from '@/stores/chat'
import { useBaziStore } from '@/stores/bazi'
import SEO from './components/SEO.vue'

const router = useRouter()
const route = useRoute()
const activeTab = ref('home')
const chatStore = useChatStore()
const baziStore = useBaziStore()

// 全局唯一聚焦状态
const selectedChatId = ref<string | null>(null)
const selectedAnalysisId = ref<string | null>(null)

// 暗黑模式状态
const isDark = ref(false)

// 暗黑模式切换
const toggleDark = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  // 初始化暗黑模式
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})

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

// 历史记录事件处理
const handleSelectChat = (id: string) => {
  selectedChatId.value = id
  selectedAnalysisId.value = null
  // 切换到 chat 页面
  if (route.path !== '/chat') router.push('/chat')
}

const handleDeleteChat = (id: string) => {
  // 删除对话已在Sidebar中处理
  console.log('App: 删除对话历史:', id)
}

// 切换分析历史
const handleSelectAnalysis = (id: string) => {
  selectedAnalysisId.value = id
  selectedChatId.value = null
  // 切换到 analysis 页面
  if (route.path !== '/analysis') router.push('/analysis')
}

const handleDeleteAnalysis = (id: string) => {
  // 删除分析已在Sidebar中处理
  console.log('App: 删除分析历史:', id)
}
</script>