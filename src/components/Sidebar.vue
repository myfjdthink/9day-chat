<template>
  <div :class="[
    'sidebar-wrapper transition-all duration-300',
    // Web 端样式
    'sm:w-64 sm:max-w-xs sm:min-h-screen sm:bg-[#f4f2fa] sm:dark:bg-[#181a22] sm:border-r sm:border-gray-200 sm:dark:border-gray-700 sm:flex sm:flex-col',
    // 移动端样式
    'fixed sm:relative w-full h-16 sm:h-auto bottom-0 sm:bottom-auto left-0 sm:left-auto bg-white dark:bg-gray-800 border-t sm:border-t-0 border-gray-200 dark:border-gray-700 z-50'
  ]">
    <!-- Web 端 Header -->
    <div class="hidden sm:block p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 object-contain" />
        <span class="font-medium text-gray-900 dark:text-gray-100">北斗九号日历</span>
      </div>
    </div>

    <!-- Web 端主要内容区 -->
    <div class="hidden sm:flex flex-1 flex-col overflow-y-auto">
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
            <Home :class="['w-5 h-5 opacity-80', activeTab === 'home' ? 'text-white' : 'text-[#0b3289]']" />
            首页
          </Button>
          <Button
            class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
            :class="activeTab === 'calendar'
              ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
              : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
            @click="handleGoCalendar"
          >
            <Database :class="['w-5 h-5 opacity-80', activeTab === 'calendar' ? 'text-white' : 'text-[#0b3289]']" />
            个人运历
          </Button>
          <Button
            class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
            :class="activeTab === 'ai-chat'
              ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
              : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
            @click="handleGoAIChat"
          >
            <MessageCircle :class="['w-5 h-5 opacity-80', activeTab === 'ai-chat' ? 'text-white' : 'text-[#0b3289]']" />
            命理问答
          </Button>
          <Button
            class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
            :class="activeTab === 'analysis'
              ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
              : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
            @click="handleGoAnalysis"
          >
            <Star :class="['w-5 h-5 opacity-80', activeTab === 'analysis' ? 'text-white' : 'text-[#0b3289]']" />
            八字分析
          </Button>
          <Button
            class="w-full h-10 flex items-center gap-2 rounded-lg transition-all border"
            :class="activeTab === 'zodiac-fortune'
              ? 'bg-[#0b3289] text-white border-[#0b3289] shadow hover:bg-[#1746b1] ring-2 ring-[#0b3289]/40 dark:bg-[#0b3289] dark:text-white dark:border-[#0b3289] dark:hover:bg-[#1746b1]'
              : 'bg-transparent text-[#0b3289] border-[#0b3289] hover:bg-[#e6eaf6] hover:border-[#1746b1] dark:bg-transparent dark:text-[#0b3289] dark:border-[#0b3289] dark:hover:bg-gray-700 dark:hover:border-[#1746b1]'"
            @click="handleGoZodiacFortune"
          >
            <Star :class="['w-5 h-5 opacity-80', activeTab === 'zodiac-fortune' ? 'text-white' : 'text-[#0b3289]']" />
            生肖运势
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
        class="hidden sm:block"
      />

      <!-- Web 端底部用户信息 -->
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

    <!-- 移动端底部导航栏 -->
    <div class="flex sm:hidden h-full items-center justify-around px-2">
      <button
        v-for="(item, index) in mobileMenuItems"
        :key="index"
        class="flex flex-col items-center justify-center py-1 px-3"
        :class="activeTab === item.id ? 'text-[#0b3289]' : 'text-gray-500'"
        @click="item.handler"
      >
        <component 
          :is="item.icon" 
          class="w-5 h-5 mb-1"
          :class="activeTab === item.id ? 'text-[#0b3289]' : 'text-gray-500'"
        />
        <span class="text-xs">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, Home, User, Database, Plus, Star } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import HistoryPanel from './HistoryPanel.vue'
import { useChatStore } from '@/stores/chat'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import { computed, onMounted, ref, nextTick } from 'vue'
import boyAvatar from '@/assets/boy.png'
import girlAvatar from '@/assets/girl.png'

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

const emit = defineEmits<{
  'set-active-tab': [tab: string]
  'select-chat': [id: string]
  'delete-chat': [id: string]
  'select-analysis': [id: string]
  'delete-analysis': [id: string]
}>()

// 移动端底部导航项配置
const mobileMenuItems = computed(() => [
  {
    id: 'home',
    label: '首页',
    icon: Home,
    handler: handleGoHome
  },
  {
    id: 'ai-chat',
    label: '问答',
    icon: MessageCircle,
    handler: handleGoAIChat
  },
  {
    id: 'analysis',
    label: '分析',
    icon: Star,
    handler: handleGoAnalysis
  },
  {
    id: 'calendar',
    label: '运历',
    icon: Database,
    handler: handleGoCalendar
  },
  {
    id: 'profile',
    label: '我的',
    icon: User,
    handler: handleGoProfile
  }
])

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

const defaultAvatar = computed(() => 
  userStore.user?.gender === 'female' ? girlAvatar : boyAvatar
)

const showDropdown = ref(false)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

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

onMounted(() => {
  userStore.init()
  if (userStore.token) {
    userStore.fetchUser()
  }
  // 新增：无论在哪个tab，侧边栏挂载时都初始化对话和分析历史，保证两个区块都能显示
  chatStore.initializeStore()
  baziStore.initializeStore()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 侧边栏基础样式 */
.sidebar-wrapper {
  transition: all 0.3s ease-in-out;
}

/* 确保在移动端底部固定定位时不会被其他内容遮挡 */
@media (max-width: 640px) {
  .sidebar-wrapper {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
}

/* 保持 Web 端的原有样式 */
@media (min-width: 641px) {
  .sidebar-wrapper {
    box-shadow: none;
  }
}

/* 移动端底部导航按钮激活状态 */
.mobile-nav-btn.active {
  color: #0b3289;
}
.mobile-nav-btn.active svg {
  color: #0b3289;
}
</style>