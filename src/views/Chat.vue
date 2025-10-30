<template>
  <div class="flex-1 flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO组件 -->
    <SEO 
      title="AI智能命理对话 - 专业八字运势咨询 | 北斗九号日历"
      pageTitle="AI对话"
      description="与专业AI命理助手在线对话，获取个性化八字分析、运势预测、择日建议等服务。基于深度学习的智能命理系统，24小时为您提供专业的命理咨询和人生指导建议。支持语音对话和文字交流。"
      keywords="AI命理对话,智能八字咨询,在线运势预测,AI命理助手,智能择日建议,命理问答,运势咨询,人工智能算命,在线命理师"
    />
    
    <!-- Top Bar -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img src="@/assets/logo.png" alt="北斗九号日历Logo - AI智能八字运势分析平台" class="w-5 h-5 object-contain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">AI命理问答 - 智能算命咨询</h1>
        </div>
        <!-- 移除重复的暗黑模式按钮 -->
      </div>
    </div>

    <!-- 分析报告消息渲染在消息区 -->

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Welcome Screen -->
      <div v-if="chatStore.currentMessages.length === 0" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            <img src="@/assets/logo.png" alt="北斗九号日历 - 专业AI智能命理预测服务平台标志" class="w-16 h-16 object-contain" />
          </div>
          <h2 class="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">开始命理咨询</h2>
          <p class="text-gray-500 dark:text-gray-300">专业解答您的困惑，一起探讨人生方向</p>
        </div>
      </div>

      <!-- Messages -->
      <div v-else ref="messageContainer" class="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div class="max-w-4xl mx-auto space-y-6">
          <div 
            v-for="message in chatStore.currentMessages as unknown as ChatMessage[]" 
            :key="message.id" 
            :class="[
              message.role === 'report'
                ? 'flex flex-col items-center'
                // 修正：根据 sender_type 判断左右
                : message.sender_type === 'user'
                  ? 'flex flex-row-reverse items-start space-x-reverse space-x-2'
                  : 'flex flex-row items-start space-x-2'
            ]"
          >
            <!-- 分析报告消息 -->
            <template v-if="message.role === 'report'">
              <div class="flex-shrink-0">
                <img :src="aiAvatar" alt="AI智能命理大师头像 - 专业八字运势分析助手" class="w-8 h-8 rounded-full object-cover bg-white dark:bg-gray-800" />
              </div>
              <div
                class="max-w-[70%] px-4 py-2 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-[#b67fda] text-[#b67fda] dark:text-[#b67fda] rounded-tl-none cursor-pointer"
                @click="showReportPanel = !showReportPanel"
              >
                <div class="font-semibold flex items-center">
                  <span>{{ JSON.parse(message.content).name }}</span>
                  <span class="ml-2 text-xs">{{ showReportPanel ? '▲' : '▼' }}</span>
                </div>
                <div v-if="showReportPanel" class="mt-2 whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
                  {{ JSON.parse(message.content).content }}
                </div>
              </div>
            </template>
            <!-- 普通消息 -->
            <template v-else>
              <!-- 头像，根据 sender_type 区分 -->
              <div class="flex-shrink-0">
                <img 
                  :src="message.sender_type === 'user' ? (userStore.user?.gender === 'female' ? girlAvatar : boyAvatar) : aiAvatar"
                  :alt="message.sender_type === 'user' ? 'User Avatar' : 'AI Avatar'"
                  class="w-8 h-8 rounded-full object-cover bg-white dark:bg-gray-800"
                />
              </div>
              <!-- 消息气泡，根据 sender_type 区分左右样式 -->
              <div
                :class="[
                  'max-w-[70%] px-4 py-2 rounded-lg overflow-hidden',
                  message.sender_type === 'user'
                    ? 'border border-[#b67fda] text-[#b67fda] bg-white dark:bg-gray-800 dark:text-[#b67fda] rounded-tr-none'
                    : message.error
                    ? 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 rounded-tl-none'
                    : 'border border-[#0b3289] text-[#0b3289] bg-white dark:bg-gray-800 dark:text-[#0b3289] rounded-tl-none'
                ]"
              >
                <!-- Markdown 内容 -->
                <div 
                  v-if="!message.error" 
                  class="prose prose-sm dark:prose-invert max-w-none"
                  v-html="renderMarkdown(message.content)"
                  @click="handleContentClick"
                ></div>
                <!-- 错误消息 -->
                <p v-else class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
                <span class="text-xs opacity-50 mt-1 block text-gray-600 dark:text-gray-400">
                  {{ new Date(message.timestamp).toLocaleTimeString() }}
                </span>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="chatStore.isLoading" class="max-w-4xl mx-auto mt-4">
          <div class="flex items-start space-x-2">
            <div class="flex-shrink-0">
              <img 
                :src="aiAvatar"
                alt="AI Avatar"
                class="w-8 h-8 rounded-full object-cover bg-white dark:bg-gray-800"
              />
            </div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 max-w-[70%] px-4 py-2 rounded-lg rounded-tl-none">
              <div class="flex items-center space-x-2">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-300">正在为您认真分析...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Preview -->
      <div v-if="previewImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closePreview">
        <img :src="previewImage" alt="Preview" class="max-w-[90%] max-h-[90vh] object-contain" />
      </div>

      <!-- Input Area (Fixed at bottom) -->
      <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 w-full">
        <div class="max-w-4xl mx-auto">
          <!-- 快速按钮区域 -->
          <div class="mb-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              class="flex items-center space-x-1 text-xs"
              :disabled="chatStore.isLoading"
              @click="handleQuickAction('bazi')"
            >
              <span class="text-purple-600">🔮</span>
              <span>对话八字</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              class="flex items-center space-x-1 text-xs"
              :disabled="chatStore.isLoading"
              @click="handleQuickAction('exam')"
            >
              <span class="text-blue-600">📚</span>
              <span>考公考编</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              class="flex items-center space-x-1 text-xs"
              :disabled="chatStore.isLoading"
              @click="handleQuickAction('love')"
            >
              <span class="text-pink-600">💕</span>
              <span>感情运势</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              class="flex items-center space-x-1 text-xs"
              :disabled="chatStore.isLoading"
              @click="handleQuickAction('health')"
            >
              <span class="text-green-600">🏥</span>
              <span>健康运势</span>
            </Button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="flex space-x-2 items-center">
            <Input
              v-model="input"
              ref="inputRef"
              placeholder="输入您的问题..."
              class="flex-1"
            />
            <Button
              type="submit"
              variant="default"
              :disabled="chatStore.isLoading || !input.trim()"
            >
              发送
            </Button>
          </form>
        </div>
      </div>
    </div>
    <!-- 选择分析报告弹窗（美化样式，参考 PasswordReset.vue） -->
    <div v-if="showReportDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">选择要添加的八字分析报告</h3>
          <p class="text-gray-500 dark:text-gray-300">请选择一份历史八字分析报告作为对话上下文</p>
        </div>
        <div class="max-h-64 overflow-y-auto space-y-2 mb-4 px-1">
          <div v-for="record in analyses" :key="record.id" class="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100 text-base">
                {{ record.analysis_type }}（{{ record.birth_year }}-{{ record.birth_month }}-{{ record.birth_day }} {{ record.birth_time }}）
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-300 mt-1">
                {{ formatDate(new Date(record.created_at)) }}
              </div>
            </div>
            <Button size="sm" variant="default" class="ml-2" @click="addReportToContext(record)">
              添加
            </Button>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button size="sm" variant="outline" @click="showReportDialog = false">取消</Button>
        </div>
      </div>
    </div>
    <!-- 对话历史弹窗（美化样式，参考 PasswordReset.vue） -->
    <div v-if="showHistoryDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">选择历史对话</h3>
          <p class="text-gray-500 dark:text-gray-300">请选择一条历史对话进入</p>
        </div>
        <div class="max-h-64 overflow-y-auto space-y-2 mb-4 px-1">
          <div v-for="chat in chatStore.chatHistory" :key="chat.id" class="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer" @click="selectHistoryChat(chat.id)">
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100 text-base">{{ chat.title }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-300 mt-1">{{ formatDate(new Date(chat.date)) }}</div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button size="sm" variant="outline" @click="showHistoryDialog = false">取消</Button>
        </div>
      </div>
    </div>
    <Modal
      :show="showLoginModal"
      title="登录提示"
      message="请先登录后再使用此功能"
      confirmText="去登录"
      cancelText="取消"
      :onConfirm="handleLoginConfirm"
      :onCancel="handleLoginCancel"
    />
    <!-- 没有八字分析历史提示弹窗 -->
    <Modal
      :show="showNoAnalysisDialog"
      title="提示"
      message="您还没有完成八字分析，请先去完成八字分析，然后才能使用此功能。"
      confirmText="去八字分析"
      cancelText="取消"
      :onConfirm="handleNoAnalysisConfirm"
      :onCancel="handleNoAnalysisCancel"
    />
    <!-- 快速动作选择弹窗 -->
    <div v-if="showQuickActionDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">选择八字分析报告</h3>
          <p class="text-gray-500 dark:text-gray-300">请选择一份历史八字分析报告作为对话上下文</p>
        </div>
        <div class="max-h-64 overflow-y-auto space-y-2 mb-4 px-1">
          <div v-for="record in analyses" :key="record.id" class="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100 text-base">
                {{ record.analysis_type }}（{{ record.birth_year }}-{{ record.birth_month }}-{{ record.birth_day }} {{ record.birth_time }}）
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-300 mt-1">
                {{ formatDate(new Date(record.created_at)) }}
              </div>
            </div>
            <Button size="sm" variant="default" class="ml-2" @click="handleQuickActionWithReport(record)">
              选择
            </Button>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button size="sm" variant="outline" @click="showQuickActionDialog = false">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Message as APIMessage } from '@/api/chat'
import { Moon, Plus } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { chat, ChatAPIError } from '@/api/chat'
import { SYSTEM_ROLES } from '@/api/config'
import { useChatStore } from '@/stores/chat'
import { useRoute, useRouter } from 'vue-router'
import type { Message as StoreMessage } from '@/stores/chat'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import { defineProps, nextTick } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import boyAvatar from '@/assets/boy.png'
import girlAvatar from '@/assets/girl.png'
import aiAvatar from '@/assets/9.png'
import SEO from '@/components/SEO.vue'

const props = defineProps<{ conversationId?: string | null }>()

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return '' // 使用普通的代码块
  }
})

const chatStore = useChatStore()
const userStore = useUserStore()
const baziStore = useBaziStore()
const analyses = computed(() => baziStore.sortedAnalyses)

// 调试：打印当前消息列表，检查 sender_type 字段
console.log('当前消息列表：', chatStore.currentMessages)
const displayName = computed(() => userStore.user ? (userStore.user.username || userStore.user.email) : '')

// 扩展消息类型，支持'report'
type ChatMessage = StoreMessage & { role: 'user' | 'assistant' | 'report' }
const route = useRoute()
const router = useRouter()
const input = ref('')
const inputRef = ref<any>(null)
const messageContainer = ref<HTMLElement | null>(null)
const previewImage = ref<string | null>(null)

// 展开分析报告相关逻辑
const showReportPanel = ref(false)
const reportName = ref('分析报告')
const reportContent = ref('')

// 插入/替换分析报告消息
function insertReportMessage(name: string, content: string) {
  const conversation = chatStore.currentConversation
  if (!conversation) return
  // 查找最后一条普通消息（用户或AI）的位置
  const lastMsgIdx = (() => {
    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      const role = (conversation.messages[i] as any).role
      if (role === 'user' || role === 'assistant') return i
    }
    return -1
  })()
  const reportMsg: import('@/stores/chat').Message = {
    id: Date.now().toString(),
    role: 'report',
    content: JSON.stringify({ name, content }),
    timestamp: new Date(),
    message_type: 'report', // 新增
    sender_type: 'assistant', // 新增
    sync_status: 'pending', // 新增
    client_message_id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}` // 新增
  }
  // 插入到最后一条普通消息之后
  if (lastMsgIdx !== -1) {
    conversation.messages.splice(lastMsgIdx + 1, 0, reportMsg)
  } else {
    // 没有普通消息则插到末尾
    conversation.messages.push(reportMsg)
  }
  // 新增：插入后立即本地持久化
  chatStore.saveConversations()
}

// 合并为如下：
watch(
  () => [route.query.conversationId, route.query.reportContext],
  async ([conversationId, reportContext]) => {
    if (conversationId) {
      // 切换到指定会话
      await chatStore.selectConversation(conversationId as string)
      // 切换对话后自动滚动到最新消息
      await nextTick()
      scrollToBottom()
    }
    // 只有在当前会话没有 report 消息时才插入，避免重复
    if (reportContext) {
      const hasReport = chatStore.currentMessages.some(msg => msg.role === 'report')
      if (!hasReport) {
        // 优先用query.name，否则查找
        const name = route.query.name as string || '分析报告'
        reportName.value = name
        reportContent.value = reportContext as string
        insertReportMessage(reportName.value, reportContent.value)
        // 插入后清除 query 参数，避免刷新或跳转重复插入
        router.replace({
          path: route.path,
          query: { ...route.query, reportContext: undefined, name: undefined }
        })
      }
    } else {
      reportName.value = '分析报告'
      reportContent.value = ''
      showReportPanel.value = false
    }
  },
  { immediate: true }
)

// 渲染 Markdown
const renderMarkdown = (content: string) => {
  return md.render(content)
}

// 处理内容点击事件（图片预览）
const handleContentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.tagName === 'IMG') {
    previewImage.value = (target as HTMLImageElement).src
  }
}

// 关闭图片预览
const closePreview = () => {
  previewImage.value = null
}

// 选择分析报告弹窗相关逻辑
const showReportDialog = ref(false)
const formatDate = (date: Date) => {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
// 格式化八字报告内容，优先用 analysis_results 字段
function formatReportText(record: any): string {
  if (record.analysis_results && typeof record.analysis_results === 'object') {
    return Object.entries(record.analysis_results)
      .map(([type, content]) => `【${type}】\n${content}\n`).join('\n')
  }
  if (record.notes && typeof record.notes === 'string') {
    return record.notes
  }
  return ''
}
// 安全生成八字报告标题，避免 undefined
function safeReportName(record: any): string {
  const type = record.analysis_type || '分析报告'
  const year = record.birth_year || '未知'
  const month = record.birth_month || '未知'
  const day = record.birth_day || '未知'
  const time = record.birth_time || '未知'
  return `${type}（${year}-${month}-${day} ${time}）`
}
// 添加八字报告到对话上下文（role: 'report'，不进入20轮历史）
const addReportToContext = (record: any) => {
  // 检查登录状态
  if (!userStore.user) {
    showLoginModal.value = true
    return
  }
  // 格式化报告内容
  const reportText = formatReportText(record)
  const reportName = safeReportName(record)
  // 插入“report”类型消息
  insertReportMessage(reportName, reportText)
  showReportDialog.value = false
}

// 加号按钮点击事件，直接弹出弹窗，不做登录校验
const handleAddReportClick = () => {
  showReportDialog.value = true
}

// 对话历史弹窗相关逻辑
const showHistoryDialog = ref(false)
const selectHistoryChat = async (id: string) => {
  await chatStore.selectConversation(id)
  showHistoryDialog.value = false
  // 切换对话后自动滚动到最新消息
  await nextTick()
  scrollToBottom()
}

// 类型保护函数，确保 msg.role 只为 'user' 或 'assistant'
function isUserOrAssistant(msg: StoreMessage): msg is StoreMessage & { role: 'user' | 'assistant' } {
  return msg.role === 'user' || msg.role === 'assistant'
}

// 格式化历史对话
const formatHistory = (historyArr: APIMessage[]) => {
  if (!historyArr.length) return ''
  return historyArr.map(msg => `${msg.role === 'user' ? '用户' : 'AI'}：${msg.content}`).join('\n')
}

// 便捷的对话发送逻辑
const handleSubmit = async () => {
  if (!input.value.trim() || chatStore.isLoading) return

  const userInput = input.value
  input.value = ''

  // 检查当前会话中最新的 report 类型消息，作为分析报告上下文
  const latestReportMsg = chatStore.currentMessages
    .filter(msg => msg.role === 'report')
    .slice(-1)[0]
  let reportContext = latestReportMsg ? JSON.parse(latestReportMsg.content).content : undefined
  let prompt = ''
  // 只保留 user 和 assistant 类型的消息，过滤掉 report，避免类型错误
  const history: APIMessage[] = chatStore.currentMessages
    .filter(isUserOrAssistant)
    .map((msg) => ({
      role: msg.role,
      content: msg.content
    }))

  if (reportContext) {
    prompt = `【分析报告】\n${reportContext}\n【历史对话】\n${formatHistory(history)}\n【用户提问】\n${userInput}`
  } else {
    prompt = userInput
  }

  chatStore.addMessage({
    role: 'user',
    content: userInput,
    message_type: 'text', // 新增
    sender_type: 'user' // 新增
  })

  chatStore.setLoading(true)

  try {
    // 有分析报告时，历史已拼进prompt，history参数传空数组
    const aiResponse = await chat(
      prompt,
      SYSTEM_ROLES.FORTUNE_TELLER,
      undefined, // provider
      undefined, // modelName
      reportContext ? [] : history
    )
    
    chatStore.addMessage({
      role: 'assistant',
      content: aiResponse,
      message_type: 'text',
      sender_type: 'assistant'
    })
  } catch (error) {
    console.error('Error sending message:', error)
    
    let errorMessage = '抱歉，发生了未知错误，请稍后重试。'
    
    if (error instanceof ChatAPIError) {
      if (error.statusCode === 429) {
        errorMessage = '请求过于频繁，请稍后再试。'
      } else if (error.statusCode === 500) {
        errorMessage = '服务器暂时不可用，请稍后重试。'
      } else if (error.statusCode && error.statusCode >= 400) {
        errorMessage = `请求失败：${error.message}`
      } else {
        errorMessage = `AI服务错误：${error.message}`
      }
    } else if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = '网络连接失败，请检查网络连接后重试。'
      } else {
        errorMessage = `错误：${error.message}`
      }
    }
    
    chatStore.addMessage({
      role: 'assistant',
      content: errorMessage,
      error: true,
      message_type: 'text',
      sender_type: 'assistant'
    })
  } finally {
    chatStore.setLoading(false)
    // 发送消息后自动聚焦输入框
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

// 初始化数据
onMounted(() => {
  chatStore.initializeExampleData()
  if (!chatStore.currentConversationId) {
    chatStore.createConversation()
  }
  // 初始化后自动滚动到最新消息
  nextTick(() => {
    scrollToBottom()
  })
})

// 自动滚动到最新消息
const scrollToBottom = async () => {
  await Promise.resolve()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动到底部
watch(() => chatStore.currentMessages.length, () => {
  scrollToBottom()
})

// 监听加载状态变化，自动滚动到底部
watch(() => chatStore.isLoading, (newVal) => {
  if (newVal) {
    scrollToBottom()
  }
})

const showLoginModal = ref(false)
const handleLoginConfirm = () => {
  showLoginModal.value = false
  router.push('/login')
}
const handleLoginCancel = () => {
  showLoginModal.value = false
}

// 快速动作逻辑
const handleQuickAction = async (actionType: string) => {
  if (!userStore.user) {
    showLoginModal.value = true
    return
  }

  // 检查是否有八字分析历史
  if (analyses.value.length === 0) {
    // 没有八字分析历史，提示用户先去完成八字分析
    showNoAnalysisDialog.value = true
    return
  }

  // 有历史，让用户选择对应的八字分析
  showQuickActionDialog.value = true
  selectedActionType.value = actionType
}

// 新增状态变量
const showNoAnalysisDialog = ref(false)
const showQuickActionDialog = ref(false)
const selectedActionType = ref('')

// 处理没有八字分析历史时的确认
const handleNoAnalysisConfirm = () => {
  showNoAnalysisDialog.value = false
  router.push('/bazi') // 跳转到八字分析页面
}

const handleNoAnalysisCancel = () => {
  showNoAnalysisDialog.value = false
}

// 获取动作类型的中文名称
const getActionTypeName = (actionType: string) => {
  switch (actionType) {
    case 'bazi': return '对话八字'
    case 'exam': return '考公考编'
    case 'love': return '感情问题'
    case 'health': return '身体健康'
    default: return ''
  }
}

// 处理用户选择八字分析报告后的快速动作
const handleQuickActionWithReport = async (record: any) => {
  if (!selectedActionType.value) return
  
  const actionType = selectedActionType.value
  selectedActionType.value = ''
  showQuickActionDialog.value = false

  // 格式化报告内容
  const reportText = formatReportText(record)
  const reportName = safeReportName(record)
  
  // 插入"report"类型消息
  insertReportMessage(reportName, reportText)

  // 根据动作类型生成相应的提示词
  let prompt = ''
  switch (actionType) {
    case 'bazi':
      prompt = '请基于我的八字分析报告，为我详细解读八字信息，包括日主、用神、喜忌等关键信息。'
      break
    case 'exam':
      prompt = '请基于我的八字分析报告，分析我在考公考编方面的运势和注意事项，包括适合的岗位方向、考试时间选择等。'
      break
    case 'love':
      prompt = '请基于我的八字分析报告，分析我的感情运势，包括桃花运、婚姻时机、配偶特征等。'
      break
    case 'health':
      prompt = '请基于我的八字分析报告，分析我的身体健康状况，包括需要注意的疾病、养生建议等。'
      break
    default:
      return
  }

  // 添加用户消息
  chatStore.addMessage({
    role: 'user',
    content: prompt,
    message_type: 'text',
    sender_type: 'user'
  })

  chatStore.setLoading(true)

  try {
    // 获取最新的 report 消息作为上下文
    const latestReportMsg = chatStore.currentMessages
      .filter(msg => msg.role === 'report')
      .slice(-1)[0]
    const reportContext = latestReportMsg ? JSON.parse(latestReportMsg.content).content : undefined

    // 只保留 user 和 assistant 类型的消息
    const history: APIMessage[] = chatStore.currentMessages
      .filter(isUserOrAssistant)
      .map((msg) => ({
        role: msg.role,
        content: msg.content
      }))

    // 构建包含报告的 prompt
    const fullPrompt = reportContext 
      ? `【分析报告】\n${reportContext}\n【历史对话】\n${formatHistory(history)}\n【用户提问】\n${prompt}`
      : prompt

    // 调用 chat API
    const aiResponse = await chat(
      fullPrompt,
      SYSTEM_ROLES.FORTUNE_TELLER,
      undefined,
      undefined,
      reportContext ? [] : history // 有报告时不传历史
    )
    
    chatStore.addMessage({
      role: 'assistant',
      content: aiResponse,
      message_type: 'text',
      sender_type: 'assistant'
    })
  } catch (error) {
    console.error('Error sending message:', error)
    
    let errorMessage = '抱歉，发生了未知错误，请稍后重试。'
    
    if (error instanceof ChatAPIError) {
      if (error.statusCode === 429) {
        errorMessage = '请求过于频繁，请稍后再试。'
      } else if (error.statusCode === 500) {
        errorMessage = '服务器暂时不可用，请稍后重试。'
      } else if (error.statusCode && error.statusCode >= 400) {
        errorMessage = `请求失败：${error.message}`
      } else {
        errorMessage = `AI服务错误：${error.message}`
      }
    } else if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = '网络连接失败，请检查网络连接后重试。'
      } else {
        errorMessage = `错误：${error.message}`
      }
    }
    
    chatStore.addMessage({
      role: 'assistant',
      content: errorMessage,
      error: true,
      message_type: 'text',
      sender_type: 'assistant'
    })
  } finally {
    chatStore.setLoading(false)
  }
}
</script>

<style>
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Markdown Styles */
.prose {
  @apply text-gray-900 dark:text-gray-100;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply text-gray-900 dark:text-gray-100;
}

.prose p {
  @apply text-gray-900 dark:text-gray-100;
}

.prose ul,
.prose ol {
  @apply text-gray-900 dark:text-gray-100;
}

.prose li {
  @apply text-gray-900 dark:text-gray-100;
}

.prose strong {
  @apply text-gray-900 dark:text-gray-100 font-semibold;
}

.prose em {
  @apply text-gray-900 dark:text-gray-100 italic;
}

.prose a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 text-gray-700 dark:text-gray-300;
}

.prose img {
  border-radius: 0.375rem; /* rounded-md */
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s;
  max-height: 300px;
}

.prose img:hover {
  opacity: 0.9;
}

.prose pre {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100;
  border-radius: 0.375rem;
  padding: 1rem;
  overflow-x: auto;
}

.prose code {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.dark .prose pre,
.dark .prose code {
  background-color: #374151 !important; /* dark:bg-gray-700 */
  color: #f3f4f6 !important; /* dark:text-gray-100 */
}

.dark .prose pre code {
  background-color: transparent !important;
  color: inherit !important;
}
</style>