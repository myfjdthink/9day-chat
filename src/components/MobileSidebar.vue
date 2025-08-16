<template>
  <div class="fixed w-full h-16 bottom-0 left-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
    <div class="flex h-full items-center justify-around px-2">
      <button
        v-for="item in mobileMenuItems"
        :key="item.id"
        class="flex flex-col items-center justify-center py-1 px-3 relative"
        :class="[
          isActiveTab(item.path) ? 'text-[#0b3289]' : 'text-gray-500',
          'transition-colors duration-200'
        ]"
        @click="item.handler"
      >
        <!-- 选中状态的背景效果 -->
        <div 
          v-if="isActiveTab(item.path)"
          class="absolute inset-0 bg-[#0b3289]/5 rounded-lg"
          aria-hidden="true"
        />
        
        <!-- 图标 -->
        <component 
          :is="item.icon" 
          class="w-5 h-5 mb-1 transition-colors duration-200"
          :class="isActiveTab(item.path) ? 'text-[#0b3289]' : 'text-gray-500'"
        />
        
        <!-- 文字 -->
        <span 
          class="text-xs transition-colors duration-200"
          :class="isActiveTab(item.path) ? 'font-medium' : 'font-normal'"
        >
          {{ item.label }}
        </span>
        
        <!-- 选中状态的指示器 -->
        <div
          v-if="isActiveTab(item.path)"
          class="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#0b3289] rounded-full"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { MessageCircle, Home, User, Database, Star } from 'lucide-vue-next'
import { useSidebar } from '@/composables/useSidebar'
import { useRoute } from 'vue-router'

interface MobileSidebarProps {
  activeTab: string
}

const props = defineProps<MobileSidebarProps>()
const emit = defineEmits<{
  'set-active-tab': [tab: string]
  'select-chat': [id: string]
  'delete-chat': [id: string]
  'select-analysis': [id: string]
  'delete-analysis': [id: string]
}>()

const route = useRoute()

const {
  handleGoHome,
  handleGoAIChat,
  handleGoAnalysis,
  handleGoCalendar,
  handleGoProfile,
  initialize
} = useSidebar(emit)

// 移动端底部导航项配置
const mobileMenuItems = computed(() => [
  {
    id: 'home',
    label: '首页',
    icon: Home,
    handler: handleGoHome,
    path: '/'
  },
  {
    id: 'ai-chat',
    label: '问答',
    icon: MessageCircle,
    handler: handleGoAIChat,
    path: '/chat'
  },
  {
    id: 'analysis',
    label: '分析',
    icon: Star,
    handler: handleGoAnalysis,
    path: '/analysis'
  },
  {
    id: 'calendar',
    label: '运历',
    icon: Database,
    handler: handleGoCalendar,
    path: '/calendar'
  },
  {
    id: 'profile',
    label: '我的',
    icon: User,
    handler: handleGoProfile,
    path: '/profile'
  }
])

// 判断当前路径是否匹配导航项
const isActiveTab = (itemPath: string) => {
  // 处理首页特殊情况
  if (itemPath === '/' && route.path !== '/') {
    return false
  }
  // 其他情况使用前缀匹配
  return route.path.startsWith(itemPath)
}

// 根据当前路由路径设置激活的标签
const setActiveTabFromRoute = () => {
  const matchedItem = mobileMenuItems.value.find(item => isActiveTab(item.path))
  if (matchedItem) {
    emit('set-active-tab', matchedItem.id)
  }
}

// 监听路由变化
watch(
  () => route.path,
  () => setActiveTabFromRoute(),
  { immediate: true }
)

onMounted(() => {
  initialize()
  setActiveTabFromRoute()
})
</script>

<style scoped>
/* 移动端导航按钮的基础样式 */
button {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  outline: none;
}

/* 点击反馈效果 */
button:active {
  transform: scale(0.95);
}

/* 平滑过渡效果 */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>