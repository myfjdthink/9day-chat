<template>
  <!-- 左侧历史面板 -->
  <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
    <!-- 历史面板头部 -->
    <div class="p-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">对话历史</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          @click="toggleChatHistory"
          class="p-1 h-auto"
        >
          <ChevronDown 
            :class="['w-4 h-4 transition-transform', showChatHistory ? 'rotate-180' : '']"
          />
        </Button>
      </div>
    </div>

    <!-- 历史列表 -->
    <div v-if="showChatHistory" class="flex-1 overflow-y-auto p-4 space-y-2">
      <div 
        v-for="chat in chatStore.chatHistory" 
        :key="chat.id"
        class="group cursor-pointer p-3 rounded-lg border transition-all"
        :class="chat.id === chatStore.currentConversationId
          ? 'bg-[#f6edfb] dark:bg-[#2d1b3d] border-[#b67fda] text-[#7a3fa4] dark:text-[#b67fda] font-semibold shadow-sm'
          : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600'"
        @click="selectHistoryChat(chat.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ chat.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(chat.date) }}</p>
          </div>
          <div class="flex items-center gap-1 ml-2">
            <!-- 登录用户显示同步状态 -->
            <template v-if="isLoggedIn">
              <span v-if="getSyncStatus(chat.id) === 'synced'" class="text-[10px] text-green-600 dark:text-green-400">已同步</span>
              <span v-else-if="getSyncStatus(chat.id) === 'pending'" class="text-[10px] text-yellow-600 dark:text-yellow-400">待同步</span>
              <span v-else-if="getSyncStatus(chat.id) === 'failed'" class="text-[10px] text-red-600 dark:text-red-400">同步失败</span>
            </template>
            <Button 
              variant="ghost" 
              size="sm" 
              @click.stop="handleDeleteChat(chat.id)"
              class="opacity-0 group-hover:opacity-100 p-1 h-auto"
            >
              <Trash2 class="w-3 h-3 text-red-500 dark:text-red-400" />
            </Button>
          </div>
        </div>
      </div>
      
      <div v-if="chatStore.chatHistory.length === 0" class="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
        暂无对话历史
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
import { nextTick } from 'vue'

const chatStore = useChatStore()
const userStore = useUserStore()

const emit = defineEmits<{
  'scroll-to-bottom': []
}>()

// 对话历史相关状态和功能
const showChatHistory = ref(true)
const isLoggedIn = computed(() => !!userStore.user)

// 切换对话历史显示/隐藏
const toggleChatHistory = () => {
  showChatHistory.value = !showChatHistory.value
}

// 获取会话同步状态
function getSyncStatus(chatId: string): 'synced' | 'pending' | 'failed' | 'conflict' | undefined {
  const conv = chatStore.conversations.find(c => c.id === chatId)
  return conv?.sync_status
}

// 删除对话
const handleDeleteChat = async (id: string) => {
  chatStore.removeConversation(id)
}

// 选择历史对话
const selectHistoryChat = async (id: string) => {
  await chatStore.selectConversation(id)
  // 切换对话后自动滚动到最新消息
  await nextTick()
  emit('scroll-to-bottom')
}

// 格式化日期
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
    return new Date(date).toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}
</script> 