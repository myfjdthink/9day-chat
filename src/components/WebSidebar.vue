<template>
  <div class="w-64 max-w-xs min-h-screen bg-[#f4f2fa] dark:bg-[#181a22] border-r border-gray-200 dark:border-gray-700 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 object-contain" />
        <span class="font-medium text-gray-900 dark:text-gray-100">北斗九号日历</span>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <div class="p-4 flex flex-col gap-3">
        <!-- 新建对话 主按钮 薰衣草色 -->
        <Button
          class="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-[#b67fda] text-white text-base shadow-sm hover:bg-[#a06cc7] focus:outline-none focus:ring-2 focus:ring-[#b67fda]/40 transition-all dark:bg-[#b67fda] dark:text-white dark:hover:bg-[#a06cc7]"
          @click="handleNewChat"
        >
          <Plus class="w-5 h-5 opacity-80 text-white" />
          新建对话
        </Button>
        <!-- 新建分析 次按钮 薰衣草色线框 -->
        <Button
          class="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-[#b67fda] text-[#b67fda] bg-white hover:bg-[#ecd8f6] hover:border-[#a06cc7] focus:outline-none focus:ring-2 focus:ring-[#b67fda]/30 text-base transition-all dark:border-[#b67fda] dark:text-[#b67fda] dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:border-[#a06cc7]"
          @click="handleNewAnalysis"
        >
          <Star class="w-5 h-5 opacity-80 text-[#b67fda]" />
          新建分析
        </Button>
      </div>

      <!-- 功能菜单 -->
      <div class="px-4 py-2 mt-2 flex flex-col gap-2">
        <div class="text-xs text-gray-500 dark:text-gray-300 mb-2">功能菜单</div>
        <!-- 两列并排按钮布局 -->
        <nav class="grid grid-cols-2 gap-2">
          <Button
            v-for="item in menuItems"
            :key="item.id"
            class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
            :class="activeTab === item.id
              ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
              : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
            @click="item.handler"
          >
            <component 
              :is="item.icon" 
              :class="['w-5 h-5 opacity-80', activeTab === item.id ? 'text-white' : 'text-[#0b3289]']" 
            />
            {{ item.label }}
          </Button>
        </nav>
      </div>

      <!-- History Panel -->
      <HistoryPanel 
        :selected-chat-id="selectedChatId"
        :selected-analysis-id="selectedAnalysisId"
        @select-chat="handleSelectChat"
        @delete-chat="handleDeleteChat"
        @select-analysis="handleSelectAnalysis"
        @delete-analysis="handleDeleteAnalysis"
      />

      <!-- 底部用户信息 -->
      <div class="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-start gap-3">
          <template v-if="userStore.user">
            <div class="relative flex items-center gap-2">
              <img :src="defaultAvatar" class="w-9 h-9 rounded-full border object-cover bg-gray-200 dark:bg-gray-700 cursor-pointer" alt="avatar" @click="showDropdown = !showDropdown" />
              <span class="ml-2 text-base text-gray-900 dark:text-gray-100 font-medium truncate max-w-[120px]">{{ userStore.user.username || userStore.user.email }}</span>
              <transition name="fade">
                <div v-if="showDropdown" class="absolute left-0 bottom-12 z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2">
                  <button
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="handleGoProfile"
                  >
                    个人信息管理
                  </button>
                  <button
                    v-if="userStore.user && (userStore.user.role === 'admin' || userStore.user.role === 'superadmin')"
                    class="w-full text-left px-4 py-2 text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-700"
                    @click="handleGoAdmin"
                  >
                    管理员菜单
                  </button>
                  <div class="border-t my-1 border-gray-100 dark:border-gray-700"></div>
                  <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" @click="handleLogout(); showDropdown = false">退出登录</button>
                </div>
              </transition>
            </div>
          </template>
          <template v-else>
            <Button variant="ghost" size="icon" class="w-9 h-9" @click="router.push('/login')">
              <User class="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </Button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MessageCircle, Home, User, Database, Plus, Star } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import HistoryPanel from './HistoryPanel.vue'
import { useRouter } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'

interface WebSidebarProps {
  activeTab: string
  selectedChatId?: string | null
  selectedAnalysisId?: string | null
}

const props = defineProps<WebSidebarProps>()
const emit = defineEmits<{
  'set-active-tab': [tab: string]
  'select-chat': [id: string]
  'delete-chat': [id: string]
  'select-analysis': [id: string]
  'delete-analysis': [id: string]
}>()

const router = useRouter()
const {
  userStore,
  defaultAvatar,
  showDropdown,
  handleNewChat,
  handleNewAnalysis,
  handleGoHome,
  handleGoAIChat,
  handleGoAnalysis,
  handleGoCalendar,
  handleGoZodiacFortune,
  handleSelectChat,
  handleDeleteChat,
  handleSelectAnalysis,
  handleDeleteAnalysis,
  handleLogout,
  handleGoProfile,
  handleGoAdmin,
  initialize
} = useSidebar(emit)

// 菜单项配置
const menuItems = computed(() => [
  {
    id: 'home',
    label: '首页',
    icon: Home,
    handler: handleGoHome
  },
  {
    id: 'calendar',
    label: '个人运历',
    icon: Database,
    handler: handleGoCalendar
  },
  {
    id: 'ai-chat',
    label: '命理问答',
    icon: MessageCircle,
    handler: handleGoAIChat
  },
  {
    id: 'analysis',
    label: '八字分析',
    icon: Star,
    handler: handleGoAnalysis
  },
  {
    id: 'zodiac-fortune',
    label: '生肖运势',
    icon: Star,
    handler: handleGoZodiacFortune
  }
])

initialize()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>