<template>
  <!-- 底部导航栏 -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
    <div class="w-full px-4 py-2">
      <div class="flex items-center justify-between">
        <!-- 导航按钮 -->
        <button
          class="flex flex-col items-center justify-center w-1/5 py-2"
          :class="activeTab === 'home' ? 'text-[#B57EDC]' : 'text-gray-500 dark:text-gray-400'"
          @click="handleGoHome"
        >
          <Home class="w-6 h-6" />
          <span class="text-xs mt-1">首页</span>
        </button>

        <button
          class="flex flex-col items-center justify-center w-1/5 py-2"
          :class="activeTab === 'Calendar' ? 'text-[#B57EDC]' : 'text-gray-500 dark:text-gray-400'"
          @click="handleGoCalendar"
        >
          <Calendar class="w-6 h-6" />
          <span class="text-xs mt-1">运历</span>
        </button>

        <button
          class="flex flex-col items-center justify-center w-1/5 py-2"
          :class="activeTab === 'chat' ? 'text-[#B57EDC]' : 'text-gray-500 dark:text-gray-400'"
          @click="handleGoAIChat"
        >
          <MessageCircle class="w-6 h-6" />
          <span class="text-xs mt-1">问答</span>
        </button>

        <button
          class="flex flex-col items-center justify-center w-1/5 py-2"
          :class="activeTab === 'analysis' ? 'text-[#B57EDC]' : 'text-gray-500 dark:text-gray-400'"
          @click="handleGoAnalysis"
        >
          <Database class="w-6 h-6" />
          <span class="text-xs mt-1">八字</span>
        </button>

        <button
          class="flex flex-col items-center justify-center w-1/5 py-2"
          :class="activeTab === 'ZodiacFortune' ? 'text-[#B57EDC]' : 'text-gray-500 dark:text-gray-400'"
          @click="handleGoZodiacFortune"
        >
          <Star class="w-6 h-6" />
          <span class="text-xs mt-1">生肖</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 顶部用户信息栏 -->
  <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
    <div class="w-full px-4">
      <div class="flex h-14 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <img src="@/assets/logo.png" alt="Logo" class="h-6 w-auto object-contain" />
          <span class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">北斗九号日历</span>
        </div>

        <!-- 右侧用户信息和暗黑模式 -->
        <div class="flex items-center gap-2">
          <template v-if="userStore.user">
            <div class="relative flex items-center gap-2">
              <img :src="defaultAvatar" class="w-8 h-8 rounded-full border object-cover bg-gray-200 dark:bg-gray-700 cursor-pointer" alt="avatar" @click="showDropdown = !showDropdown" />
              <transition name="fade">
                <div v-if="showDropdown" class="absolute right-0 top-10 z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2">
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
            <Button variant="ghost" size="icon" class="w-8 h-8" @click="router.push('/login')">
              <User class="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </Button>
          </template>
          <!-- 暗黑模式切换按钮 -->
          <Button
            variant="ghost"
            size="icon"
            class="w-8 h-8"
            @click="toggleDark"
            aria-label="切换暗黑模式"
          >
            <template v-if="!isDark">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, Home, User, Database, Calendar, Star } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import { useChatStore } from '@/stores/chat'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref, nextTick } from 'vue'
import boyAvatar from '@/assets/boy.png'
import girlAvatar from '@/assets/girl.png'

interface SidebarProps {
  activeTab: string
}

defineProps<SidebarProps>()

const chatStore = useChatStore()
const router = useRouter()
const userStore = useUserStore()

const emit = defineEmits<{
  'set-active-tab': [tab: string]
  'select-chat': [id: string]
  'delete-chat': [id: string]
  'select-analysis': [id: string]
  'delete-analysis': [id: string]
}>()

const defaultAvatar = computed(() => 
  userStore.user?.gender === 'female' ? girlAvatar : boyAvatar
)

const showDropdown = ref(false)
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

const handleGoHome = () => {
  emit('set-active-tab', 'home')
  router.push('/')
}

const handleGoAIChat = () => {
  emit('set-active-tab', 'chat')
  router.push('/chat')
}

const handleGoAnalysis = () => {
  emit('set-active-tab', 'analysis')
  router.push('/analysis')
}

const handleGoCalendar = () => {
  emit('set-active-tab', 'Calendar')
  router.push('/calendar')
}

const handleGoZodiacFortune = () => {
  emit('set-active-tab', 'ZodiacFortune')
  router.push('/zodiac-fortune')
}

onMounted(() => {
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
  // 初始化对话和分析历史
  chatStore.initializeStore()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 