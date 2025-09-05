<template>
  <div v-if="shouldShowHistoryPanel" class="flex-1 overflow-y-auto">
    <!-- Chat History Section -->
    <div v-if="shouldShowChatHistory" class="px-4 py-2">
      <div class="text-xs text-gray-500 mb-2 flex items-center justify-between">
        <span>对话历史</span>
        <Button 
          variant="ghost" 
          size="sm" 
          @click="toggleChatHistory"
          class="p-1 h-auto"
        >
          <ChevronDown 
            :class="['w-3 h-3 transition-transform', showChatHistory ? 'rotate-180' : '']"
          />
        </Button>
      </div>
      
      <div v-if="showChatHistory" class="space-y-1 max-h-80 overflow-y-auto">
        <div 
          v-for="chat in chatStore.chatHistory" 
          :key="chat.id"
          class="group cursor-pointer p-2 rounded border transition-all"
          :class="chat.id === props.selectedChatId
            ? 'bg-[#f6edfb] dark:bg-[#2d1b3d] border-[#b67fda] text-[#7a3fa4] dark:text-[#b67fda] font-semibold shadow-sm'
            : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600'"
          @click="emit('select-chat', chat.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{{ chat.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(chat.date) }}</p>
            </div>
            <div class="flex items-center gap-1 ml-2">
              <!-- 登录用户显示同步状态，右侧紧凑展示 -->
              <template v-if="isLoggedIn">
                <span v-if="getSyncStatus(chat.id) === 'synced'" class="text-[10px] text-green-600 dark:text-green-400">已同步</span>
                <span v-else-if="getSyncStatus(chat.id) === 'pending'" class="text-[10px] text-yellow-600 dark:text-yellow-400">待同步</span>
                <span v-else-if="getSyncStatus(chat.id) === 'failed'" class="text-[10px] text-red-600 dark:text-red-400">同步失败</span>
              </template>
              <Button 
                variant="ghost" 
                size="sm" 
                @click.stop="emit('delete-chat', chat.id)"
                class="opacity-0 group-hover:opacity-100 p-1 h-auto"
              >
                <Trash2 class="w-3 h-3 text-red-500 dark:text-red-400" />
              </Button>
            </div>
          </div>
        </div>
        
        <div v-if="chatStore.chatHistory.length === 0" class="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
          暂无对话历史
        </div>
      </div>
    </div>

    <!-- Analysis History Section -->
    <div v-if="shouldShowAnalysisHistory" class="px-4 py-2">
      <div class="text-xs text-gray-500 mb-2 flex items-center justify-between">
        <span>分析历史</span>
        <Button 
          variant="ghost" 
          size="sm" 
          @click="toggleAnalysisHistory"
          class="p-1 h-auto"
        >
          <ChevronDown 
            :class="['w-3 h-3 transition-transform', showAnalysisHistory ? 'rotate-180' : '']"
          />
        </Button>
      </div>
      
      <div v-if="showAnalysisHistory" class="space-y-1 max-h-80 overflow-y-auto">
        <div 
          v-for="analysis in analyses" 
          :key="analysis.id"
          class="group cursor-pointer p-2 rounded border transition-all"
          :class="analysis.id === props.selectedAnalysisId
            ? 'bg-[#f6edfb] dark:bg-[#2d1b3d] border-[#b67fda] text-[#7a3fa4] dark:text-[#b67fda] font-semibold shadow-sm'
            : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600'"
          @click="emit('select-analysis', analysis.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{{ analysis.analysis_type }}（{{ analysis.birth_year }}-{{ analysis.birth_month }}-{{ analysis.birth_day }} {{ analysis.birth_time }}）</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(new Date(analysis.created_at)) }}</p>
            </div>
            <div class="flex items-center gap-1 ml-2">
              <span class="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {{ analysis.analysis_type }}
              </span>
              <span v-if="analysis.sync_status === 'pending'" class="text-[10px] text-yellow-500 dark:text-yellow-400 ml-1">待同步</span>
              <span v-else-if="analysis.sync_status === 'failed'" class="text-[10px] text-red-500 dark:text-red-400 ml-1">同步失败</span>
              <span v-else class="text-[10px] text-green-500 dark:text-green-400 ml-1">已同步</span>
              <Button 
                variant="ghost" 
                size="sm" 
                @click.stop="emit('delete-analysis', analysis.id)"
                class="opacity-0 group-hover:opacity-100 p-1 h-auto"
              >
                <Trash2 class="w-3 h-3 text-red-500 dark:text-red-400" />
              </Button>
            </div>
          </div>
        </div>
        <div v-if="analyses.length === 0" class="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
          暂无分析历史
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Trash2 } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import { useRoute } from 'vue-router'

const chatStore = useChatStore()
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)
const baziStore = useBaziStore()
const analyses = computed(() => baziStore.sortedAnalyses)
const route = useRoute()

// 根据当前路由决定显示哪些历史记录
const shouldShowHistoryPanel = computed(() => {
  return route.name === 'chat' || route.name === 'analysis'
})

const shouldShowChatHistory = computed(() => {
  return route.name === 'chat'
})

const shouldShowAnalysisHistory = computed(() => {
  return route.name === 'analysis'
})

// 新增：选中项高亮
const props = defineProps<{
  selectedChatId?: string | null
  selectedAnalysisId?: string | null
}>()

// Events
const emit = defineEmits<{
  'select-chat': [id: string]
  'delete-chat': [id: string]
  'select-analysis': [id: string]
  'delete-analysis': [id: string]
}>()

// 状态
const showChatHistory = ref(true)
const showAnalysisHistory = ref(true)

// 方法
const toggleChatHistory = () => {
  showChatHistory.value = !showChatHistory.value
}

const toggleAnalysisHistory = () => {
  showAnalysisHistory.value = !showAnalysisHistory.value
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '今天'
  } else if (diffDays === 2) {
    return '昨天'
  } else if (diffDays <= 7) {
    return `${diffDays - 1}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

// 获取会话同步状态（仅登录用户用）
function getSyncStatus(chatId: string): 'synced' | 'pending' | 'failed' | 'conflict' | undefined {
  const conv = chatStore.conversations.find(c => c.id === chatId)
  return conv?.sync_status
}

const handleDeleteAnalysis = async (id: string) => {
  await baziStore.removeAnalysis(id)
}
</script>