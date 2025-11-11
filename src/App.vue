<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO组件 -->
    <SEO />
    
    <!-- 右上角：暗黑/白天 + 语言切换 -->
    <div class="fixed top-4 right-6 z-50 flex items-center gap-2">
      <!-- 语言切换在左侧：与暗黑按钮一致的幽灵图标样式 -->
      <Button
        variant="ghost"
        size="sm"
        class="h-9 px-3 flex items-center gap-2 hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
        @click="toggleLocale"
        :aria-label="$t('locale.switch')"
        :title="$t('locale.switch')"
      >
        <!-- 地球图标 -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm7 10H5m7-8c2.5 0 4.5 3 4.5 8s-2 8-4.5 8-4.5-3-4.5-8 2-8 4.5-8z" />
        </svg>
        <!-- 当前语言文本，增强可识别性 -->
        <span class="text-sm font-medium text-gray-800 dark:text-gray-100">
          {{ currentLocale === 'zh-CN' ? $t('locale.zh') : $t('locale.en') }}
        </span>
      </Button>
      <!-- 暗黑/白天按钮在右侧，保持原样 -->
      <Button
        variant="ghost"
        size="icon"
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
    </div>
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
          <img src="@/assets/logo.png" alt="北斗九号日历 - AI智能八字运势分析平台Logo" class="h-8 w-auto object-contain" />
        </div>
      </template>
    </Sidebar>
    <main 
      class="flex-1 transition-all duration-300"
      :class="{
        'ml-64': sidebarOpen,
        'ml-16': !sidebarOpen
      }"
    >
      <router-view />
    </main>
    
    <!-- 许愿池组件 -->
    <WishPool />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Button from './components/ui/Button.vue'
import Chat from '@/views/Chat.vue'
import Analysis from '@/views/Analysis.vue'
import { useChatStore } from '@/stores/chat'
import { useBaziStore } from '@/stores/bazi'
import { useSidebar } from '@/composables/useSidebar'
import { useLocale } from '@/composables/useLocale'
import SEO from './components/SEO.vue'
import WishPool from './components/WishPool.vue'
// 已移除百度推送功能
// import { pushCurrentPageToBaidu, pushSitemapUrlsToBaidu } from '@/lib/baidu-push'

const router = useRouter()
const route = useRoute()
const activeTab = ref('home')
const chatStore = useChatStore()
const baziStore = useBaziStore()
const { sidebarOpen, initSidebar } = useSidebar()

// 全局唯一聚焦状态
const selectedChatId = ref<string | null>(null)
const selectedAnalysisId = ref<string | null>(null)

// 暗黑模式状态
const isDark = ref(false)
const { currentLocale, setLocale, initLocale } = useLocale()

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
  // 初始化侧边栏状态
  initSidebar()
  
  // 初始化语言
  initLocale()

  // 初始化暗黑模式
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }

  // 已移除百度推送功能
  // pushCurrentPageToBaidu().then(response => {
  //   console.log('百度推送结果:', response)
  // }).catch(error => {
  //   console.error('百度推送失败:', error)
  // })

  // 已移除站点地图推送功能
  // const lastPushDate = localStorage.getItem('lastSitemapPushDate')
  // const today = new Date().toDateString()
  // 
  // if (lastPushDate !== today) {
  //   pushSitemapUrlsToBaidu().then(response => {
  //     console.log('站点地图推送结果:', response)
  //     localStorage.setItem('lastSitemapPushDate', today)
  //   }).catch(error => {
  //     console.error('站点地图推送失败:', error)
  //   })
  // }
})

// 根据路由更新activeTab和推送新页面
watch(() => route.path, (newPath) => {
  // 更新activeTab
  if (route.name) {
    activeTab.value = route.name as string
  }
  
  // 已移除新页面推送功能
  // pushCurrentPageToBaidu().then(response => {
  //   console.log('新页面推送结果:', response)
  // }).catch(error => {
  //   console.error('新页面推送失败:', error)
  // })
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

// 语言切换
const toggleLocale = () => {
  setLocale(currentLocale.value === 'zh-CN' ? 'en' : 'zh-CN')
}
</script>