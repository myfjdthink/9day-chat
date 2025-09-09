<template>
  <!-- 收起状态的缩小菜单 -->
  <div v-if="!sidebarOpen" class="collapsed-sidebar fixed left-0 top-0 z-40 w-16 min-h-screen bg-[#f4f2fa] dark:bg-[#181a22] border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 gap-3">
    <!-- 展开按钮 -->
    <button
      class="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      @click="toggleSidebar"
      aria-label="展开侧边栏"
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
    
    <!-- Logo -->
    <div class="w-10 h-10 flex items-center justify-center">
      <img src="@/assets/logo.png" alt="北斗九号日历Logo" class="w-8 h-8 object-contain" />
    </div>
    
    <!-- 新建对话和分析按钮 -->
    <div class="flex flex-col gap-2 mt-2">
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg bg-[#b67fda] text-white hover:bg-[#a06cc7] transition-colors"
        @click="handleNewChat"
        title="新建对话"
      >
        <Plus class="w-5 h-5" />
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg border border-[#b67fda] text-[#b67fda] bg-white hover:bg-[#ecd8f6] transition-colors"
        @click="handleNewAnalysis"
        title="新建分析"
      >
        <Star class="w-5 h-5" />
      </button>
    </div>
    
    <!-- 缩小的功能按钮 -->
    <div class="flex flex-col gap-2 mt-2">
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
        :class="activeTab === 'home' ? 'bg-[#0b3289] text-white' : 'text-[#0b3289] hover:bg-[#e6eaf6]'"
        @click="handleGoHome"
        title="首页"
      >
        <img :src="homeIcon" alt="首页" class="w-5 h-5" />
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
        :class="activeTab === 'calendar' ? 'bg-[#0b3289] text-white' : 'text-[#0b3289] hover:bg-[#e6eaf6]'"
        @click="handleGoCalendar"
        title="个人运历"
      >
        <img :src="calendarIcon" alt="个人运历" class="w-5 h-5" />
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
        :class="activeTab === 'ai-chat' ? 'bg-[#0b3289] text-white' : 'text-[#0b3289] hover:bg-[#e6eaf6]'"
        @click="handleGoAIChat"
        title="命理问答"
      >
        <img :src="chatIcon" alt="命理问答" class="w-5 h-5" />
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
        :class="activeTab === 'analysis' ? 'bg-[#0b3289] text-white' : 'text-[#0b3289] hover:bg-[#e6eaf6]'"
        @click="handleGoAnalysis"
        title="八字分析"
      >
        <img :src="analysisIcon" alt="八字分析" class="w-5 h-5" />
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
        :class="activeTab === 'zodiac-fortune' ? 'bg-[#0b3289] text-white' : 'text-[#0b3289] hover:bg-[#e6eaf6]'"
        @click="handleGoZodiacFortune"
        title="生肖运势"
      >
        <img :src="dragonIcon" alt="生肖运势" class="w-5 h-5" />
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-[#0b3289] hover:bg-[#e6eaf6]"
        @click="handleGoBlog"
        title="命理知识"
      >
        <img :src="blogIcon" alt="命理知识" class="w-5 h-5" />
      </button>
    </div>
    
    <!-- 用户头像 -->
    <div class="mt-auto">
      <template v-if="userStore.user">
        <img :src="defaultAvatar" class="w-8 h-8 rounded-full border object-cover bg-gray-200 dark:bg-gray-700" alt="用户头像" />
      </template>
      <template v-else>
        <button class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700" @click="router.push('/login')">
          <User class="w-4 h-4 text-gray-500 dark:text-gray-300" />
        </button>
      </template>
    </div>
  </div>
  
  <!-- 展开状态的完整侧边栏 -->
  <transition name="sidebar-slide">
    <div v-show="sidebarOpen" class="sidebar-wrapper fixed left-0 top-0 z-40 w-64 max-w-xs min-h-screen bg-[#f4f2fa] dark:bg-[#181a22] border-r border-gray-200 dark:border-gray-700 flex flex-col" @touchstart.stop @click.stop>
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="@/assets/logo.png" alt="北斗九号日历Logo - 专业AI智能命理预测服务" class="w-8 h-8 object-contain" />
            <span class="font-medium text-gray-900 dark:text-gray-100">北斗九号日历</span>
          </div>
          <!-- 折叠按钮 -->
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            @click="toggleSidebar"
            aria-label="收起侧边栏"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>
      </div>

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
        <!-- 功能菜单 Claude 风格 -->
        <div class="px-4 py-2 mt-2 flex flex-col gap-2">
          <div class="text-xs text-gray-500 dark:text-gray-300 mb-2">功能菜单</div>
          <!-- 两列并排按钮布局 -->
          <nav class="grid grid-cols-2 gap-2">
            <Button
              class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
              :class="activeTab === 'home'
                ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
                : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
              @click="handleGoHome"
            >
              <img :src="homeIcon" alt="首页" class="w-5 h-5 opacity-80" />
              首页
            </Button>
            <Button
              class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
              :class="activeTab === 'calendar'
                ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
                : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
              @click="handleGoCalendar"
            >
              <img :src="calendarIcon" alt="个人运历" class="w-5 h-5 opacity-80" />
              个人运历
            </Button>
            <Button
              class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
              :class="activeTab === 'ai-chat'
                ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
                : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
              @click="handleGoAIChat"
            >
              <img :src="chatIcon" alt="命理问答" class="w-5 h-5 opacity-80" />
              命理问答
            </Button>
            <Button
              class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
              :class="activeTab === 'analysis'
                ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
                : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
              @click="handleGoAnalysis"
            >
              <img :src="analysisIcon" alt="八字分析" class="w-5 h-5 opacity-80" />
              八字分析
            </Button>
            <Button
              class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
              :class="activeTab === 'zodiac-fortune'
                ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
                : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
              @click="handleGoZodiacFortune"
            >
              <img :src="dragonIcon" alt="生肖运势" class="w-5 h-5 opacity-80" />
              生肖运势
            </Button>
            <Button
              class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
              :class="'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
              @click="handleGoBlog"
            >
              <img :src="blogIcon" alt="命理知识" class="w-5 h-5 opacity-80" />
              命理知识
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
      </div>

      <!-- Bottom Section -->
      <div class="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-start gap-3">
          <template v-if="userStore.user">
            <div class="relative flex items-center gap-2">
              <img :src="defaultAvatar" class="w-9 h-9 rounded-full border object-cover bg-gray-200 dark:bg-gray-700 cursor-pointer" alt="用户头像 - 个人账户设置与资料管理" @click="showDropdown = !showDropdown" />
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
  </transition>
</template>

<script setup lang="ts">
import { User, Plus, Star, Settings, Moon } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import HistoryPanel from './HistoryPanel.vue'
import { useChatStore } from '@/stores/chat'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import { useSidebar } from '@/composables/useSidebar'
import { computed, onMounted, ref, nextTick } from 'vue'
import boyAvatar from '@/assets/boy.png'
import girlAvatar from '@/assets/girl.png'
import homeIcon from '@/assets/home.png'
import calendarIcon from '@/assets/calendar.png'
import chatIcon from '@/assets/chat.png'
import analysisIcon from '@/assets/analysis.png'
import dragonIcon from '@/assets/dragon.png'
import blogIcon from '@/assets/blog.png'

interface SidebarProps {
  activeTab: string
  selectedChatId?: string | null
  selectedAnalysisId?: string | null
}

defineProps<SidebarProps>()

const chatStore = useChatStore()
const router = useRouter()
const userStore = useUserStore()
const baziStore = useBaziStore()
const { sidebarOpen, toggleSidebar, initSidebar } = useSidebar()

const emit = defineEmits<{
  'set-active-tab': [tab: string]
  'select-chat': [id: string]
  'delete-chat': [id: string]
  'select-analysis': [id: string]
  'delete-analysis': [id: string]
}>()

// 新建对话处理
const handleNewChat = () => {
  chatStore.createConversation()
  emit('set-active-tab', 'ai-chat')
  router.push('/chat')
}

// 历史记录事件处理
const handleSelectChat = (id: string) => {
  chatStore.selectConversation(id)
  emit('set-active-tab', 'ai-chat')
  emit('select-chat', id)
}

const handleDeleteChat = (id: string) => {
  chatStore.removeConversation(id)
  emit('delete-chat', id)
}

const handleSelectAnalysis = (id: string) => {
  // 跳转到分析页并带上analysisId参数，只做一次跳转，避免tab和路由竞态
  router.push({ path: '/analysis', query: { analysisId: id } })
  emit('select-analysis', id)
}

const handleDeleteAnalysis = async (id: string) => {
  await baziStore.removeAnalysis(id)
  emit('delete-analysis', id)
}

// 用户显示名，优先用户名，无则邮箱
const displayName = computed(() => {
  if (userStore.user) {
    return userStore.user.username || userStore.user.email
  }
  return ''
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const isDark = ref(false)

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

const defaultAvatar = computed(() => 
  userStore.user?.gender === 'female' ? girlAvatar : boyAvatar
)
const showDropdown = ref(false)

const handleGoProfile = async () => {
  showDropdown.value = false
  await nextTick()
  if (router.currentRoute.value.path !== '/profile') {
    router.push('/profile')
  }
}
const handleGoAdmin = async () => {
  showDropdown.value = false
  await nextTick()
  if (router.currentRoute.value.path !== '/admin') {
    router.push('/admin')
  }
}

// 监听窗口变化和初始化
onMounted(() => {
  // 初始化侧边栏状态
  initSidebar()
  
  userStore.init()
  if (userStore.token) {
    userStore.fetchUser()
  }
  // 初始化暗黑模式
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
  // 新增：无论在哪个tab，侧边栏挂载时都初始化对话和分析历史，保证两个区块都能显示
  chatStore.initializeStore()
  baziStore.initializeStore()
})

const handleNewAnalysis = () => {
  emit('set-active-tab', 'analysis')
  router.push('/analysis')
}
const handleGoHome = () => {
  emit('set-active-tab', 'home')
  router.push('/')
}
const handleGoAIChat = () => {
  emit('set-active-tab', 'ai-chat')
  router.push('/chat')
}
const handleGoAnalysis = () => {
  emit('set-active-tab', 'analysis')
  router.push('/analysis')
}

const handleGoCalendar = () => {
  emit('set-active-tab', 'calendar')
  router.push('/calendar')
}

const handleGoZodiacFortune = () => {
  emit('set-active-tab', 'zodiac-fortune')
  router.push('/zodiac-fortune')
}

const handleGoBlog = () => {
  window.open('https://blog.9day.tech/', '_blank')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 侧边栏滑入动画 */
.sidebar-slide-enter-active, .sidebar-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
}
.sidebar-slide-enter-from, .sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.sidebar-slide-enter-to, .sidebar-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* 收起状态的侧边栏动画 */
.collapsed-sidebar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 按钮悬停效果 */
.collapsed-sidebar button {
  transition: all 0.2s ease-in-out;
}

.collapsed-sidebar button:hover {
  transform: scale(1.05);
}

/* 工具提示样式 */
.collapsed-sidebar button[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
}
</style>