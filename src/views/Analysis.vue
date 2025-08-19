<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 relative h-screen">
    <!-- SEO组件 -->
    <SEO 
      title="八字运势分析 - 北斗九号日历"
      description="基于传统命理学的专业八字分析，精准预测你的当年当月运势与注意事项。包括基础分析、用神分析、运势预测、运势评分。"
      keywords="八字分析,运势预测,命理分析,用神分析,运势评分,生辰八字,命理服务,命理指导"
    />
    
    <!-- 主体布局：左侧历史 + 右侧分析 -->
    <div class="flex h-full overflow-hidden">
      <!-- 左侧历史面板 -->
      <AnalysisHistory
        :selected-analysis-id="selectedAnalysisId"
        @select="handleSelectAnalysis"
        @delete="handleDeleteAnalysis"
      />

      <!-- 右侧分析区域 -->
      <div class="flex-1 p-8">
        <div class="max-w-6xl mx-auto">
          <!-- 输入表单 -->
          <AnalysisForm
            v-if="!analysisResult"
            v-model="formData"
          />

          <!-- 分析结果 -->
          <AnalysisResult
            v-if="analysisResult"
            :analysis-result="analysisResult"
            @save="handleSaveReport"
            @reset="handleResetAnalysis"
            @chat="handleChatWithReport"
          />

          <!-- Start Analysis Button -->
          <div v-if="!analysisResult" class="mt-8 flex justify-center">
            <Button
              size="lg"
              variant="default"
              :disabled="isAnalyzing"
              @click="handleStartAnalysis"
            >
              <Star class="w-5 h-5 mr-2" />
              {{ isAnalyzing ? '分析中...' : '开始分析' }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 全局分析中遮罩 -->
    <div v-if="isAnalyzing" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <div class="text-lg text-white font-semibold">正在为您分析，请稍候...</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Star } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import SEO from '@/components/SEO.vue'
import AnalysisHistory from '@/components/analysis/AnalysisHistory.vue'
import AnalysisForm from '@/components/analysis/AnalysisForm.vue'
import AnalysisResult from '@/components/analysis/AnalysisResult.vue'

// API
import { analyzeBazi, ANALYSIS_PARTS } from '@/api/bazi'
// 引入 Pinia store
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import { updateUserInfo } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'

// 表单数据
const formData = reactive({
  gender: '男' as '男' | '女',
  birthDateTime: '1983-12-11T08:00',
  analysisTypes: {
    basic: true,
    deity: true,
    ai: true
  },
  analysisScope: {
    year: true,
    month: false,
    day: false
  }
})

const isAnalyzing = ref<boolean>(false)
const analysisResult = ref<{ 分析类型: string; 分析时间: string; 分析结果: Record<string, string> } | null>(null)
const showLoginModal = ref(false)

const chatStore = useChatStore()
const userStore = useUserStore()
const baziStore = useBaziStore()
const route = useRoute()
const router = useRouter()

// 当前选中的分析历史ID
const selectedAnalysisId = ref<string | null>(null)

// 自动导入用户八字信息
const userHasBaziInfo = computed(() => {
  return !!(
    userStore.user &&
    userStore.user.birth_year &&
    userStore.user.birth_month &&
    userStore.user.birth_day &&
    userStore.user.birth_time &&
    userStore.user.gender
  )
})

// 页面加载时自动填充
onMounted(async () => {
  // 初始化数据
  await Promise.all([
    baziStore.initializeStore(),
    baziStore.loadAnalysesFromBackend()
  ])

  // 自动填充用户八字信息
  if (userStore.user && userHasBaziInfo.value) {
    // 组装 yyyy-MM-ddTHH:mm 作为 v-model
    const y = userStore.user.birth_year!.toString().padStart(4, '0')
    const m = userStore.user.birth_month!.toString().padStart(2, '0')
    const d = userStore.user.birth_day!.toString().padStart(2, '0')
    const t = userStore.user.birth_time!.padStart(5, '0')
    formData.birthDateTime = `${y}-${m}-${d}T${t}`
    formData.gender = userStore.user.gender === 'male' || userStore.user.gender === '男' ? '男' : '女'
  } else if (!userStore.user) {
    // 未登录，填充默认八字信息
    formData.birthDateTime = '1999-09-09T09:09'
    formData.gender = '男'
  }
})

// 获取分析范围数组
const getAnalysisParts = (): string[] => {
  const parts: string[] = []
  if (formData.analysisScope.year) parts.push(ANALYSIS_PARTS.FLOW_YEAR)
  if (formData.analysisScope.month) parts.push(ANALYSIS_PARTS.FLOW_MONTH)
  if (formData.analysisScope.day) parts.push(ANALYSIS_PARTS.FLOW_DAY)
  return parts
}

// 开始分析
const handleStartAnalysis = async (): Promise<void> => {
  if (!formData.birthDateTime) {
    alert('请选择出生日期时间')
    return
  }

  const analysisParts = getAnalysisParts()
  if (analysisParts.length === 0) {
    alert('请至少选择一个分析范围')
    return
  }

  try {
    isAnalyzing.value = true
    const response = await analyzeBazi({
      birth_datetime: formData.birthDateTime,
      current_datetime: new Date().toISOString(),
      gender: formData.gender,
      analysis_parts: analysisParts
    })

    if (response.success) {
      analysisResult.value = response.data
      // 生成 markdown 报告
      const dt = new Date(formData.birthDateTime)
      const markdownReport = Object.entries(response.data.分析结果)
        .map(([type, content]) => `### ${type}\n${content}\n`)
        .join('\n')

      const params = {
        client_analysis_id: `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        birth_year: dt.getFullYear(),
        birth_month: dt.getMonth() + 1,
        birth_day: dt.getDate(),
        birth_time: dt.toTimeString().slice(0, 5),
        gender: (formData.gender === '男' ? 'male' : 'female') as 'male' | 'female',
        analysis_type: 'basic',
        notes: markdownReport,
        display_name: '',
        user_nickname: userStore.user?.username || '',
        analysis_results: response.data.分析结果,
        summary: {},
        settings: {},
        extra_metadata: {}
      }

      await baziStore.addAnalysis(params)
      await trySaveUserBaziInfo()
    } else {
      throw new Error(response.message || '分析失败')
    }
  } catch (error: any) {
    alert(error.message || '分析过程中出现错误')
  } finally {
    isAnalyzing.value = false
  }
}

// 保存用户八字信息
let hasSavedUserBazi = false
async function trySaveUserBaziInfo() {
  if (!userStore.user || userHasBaziInfo.value || hasSavedUserBazi) return
  const dt = new Date(formData.birthDateTime)
  try {
    await updateUserInfo({
      username: userStore.user.username || '',
      phone: userStore.user.phone || '',
      birth_year: dt.getFullYear(),
      birth_month: dt.getMonth() + 1,
      birth_day: dt.getDate(),
      birth_time: dt.toTimeString().slice(0, 5),
      gender: formData.gender === '男' ? 'male' : 'female'
    })
    await userStore.fetchUser()
    hasSavedUserBazi = true
  } catch (e) {
    console.warn('自动保存用户八字信息失败', e)
  }
}

// 保存报告
const handleSaveReport = async () => {
  // 实现保存报告的逻辑
}

// 重新分析
const handleResetAnalysis = () => {
  analysisResult.value = null
}

// 对话报告
const handleChatWithReport = async () => {
  if (!analysisResult.value) return
  if (!userStore.user) {
    showLoginModal.value = true
    return
  }

  const reportText = Object.entries(analysisResult.value.分析结果)
    .map(([type, content]) => `【${type}】\n${content}\n`).join('\n')
  const reportName = `八字分析-${new Date(analysisResult.value.分析时间).toLocaleString()}`
  const newChatId = await chatStore.createConversation()
  router.push({ path: '/chat', query: { reportContext: reportText, name: reportName, conversationId: newChatId } })
}

// 选择历史分析
const handleSelectAnalysis = (id: string) => {
  selectedAnalysisId.value = id
  const record = baziStore.sortedAnalyses.find(r => r.id === id)
  if (record) {
    const analysisResultField = (record as any).analysis_results || (record as any).analysis_result
    analysisResult.value = {
      分析类型: record.analysis_type,
      分析时间: record.created_at,
      分析结果: analysisResultField || (record.notes ? parseResultText(record.notes) : {})
    }
  }
}

// 处理历史记录删除
const handleDeleteAnalysis = (id: string) => {
  if (selectedAnalysisId.value === id) {
    analysisResult.value = null
    selectedAnalysisId.value = null
  }
}

// 解析纯文本为对象
function parseResultText(text: string) {
  const result: Record<string, string> = {}
  const blocks = text.split(/【(.+?)】/g).filter(Boolean)
  for (let i = 0; i < blocks.length; i += 2) {
    const key = blocks[i]
    const value = blocks[i + 1]?.trim() || ''
    if (key && value) result[key] = value
  }
  return result
}

// 登录相关
const handleLoginConfirm = () => {
  showLoginModal.value = false
  router.push('/login')
}

const handleLoginCancel = () => {
  showLoginModal.value = false
}
</script>

<style>
/* 基础文本样式 */
.prose {
  color: #1f2937; /* text-gray-800 */
}

.dark .prose {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 标题样式 */
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #1f2937; /* text-gray-800 */
}

.dark .prose h1,
.dark .prose h2,
.dark .prose h3,
.dark .prose h4,
.dark .prose h5,
.dark .prose h6 {
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose h3 {
  font-size: 1.125rem; /* text-lg */
  font-weight: 500; /* font-medium */
  margin-top: 1rem; /* mt-4 */
  margin-bottom: 0.5rem; /* mb-2 */
}

/* 段落样式 */
.prose p {
  margin-top: 0.5rem; /* my-2 */
  margin-bottom: 0.5rem; /* my-2 */
  color: #1f2937; /* text-gray-800 */
}

.dark .prose p {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 列表样式 */
.prose ul {
  list-style-type: disc; /* list-disc */
  list-style-position: inside; /* list-inside */
  margin-top: 0.5rem; /* my-2 */
  margin-bottom: 0.5rem; /* my-2 */
  color: #1f2937; /* text-gray-800 */
}

.dark .prose ul {
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose li {
  margin-top: 0.25rem; /* my-1 */
  margin-bottom: 0.25rem; /* my-1 */
  color: #1f2937; /* text-gray-800 */
}

.dark .prose li {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 强调样式 */
.prose strong {
  color: #1f2937; /* text-gray-800 */
  font-weight: 600; /* font-semibold */
}

.dark .prose strong {
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose em {
  color: #1f2937; /* text-gray-800 */
  font-style: italic; /* italic */
}

.dark .prose em {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 链接样式 */
.prose a {
  color: #2563eb; /* text-blue-600 */
}

.dark .prose a {
  color: #60a5fa; /* dark:text-blue-400 */
}

.prose a:hover {
  color: #1d4ed8; /* hover:text-blue-800 */
}

.dark .prose a:hover {
  color: #93c5fd; /* dark:hover:text-blue-300 */
}

/* 引用样式 */
.prose blockquote {
  border-left-width: 4px; /* border-l-4 */
  border-left-color: #d1d5db; /* border-gray-300 */
  padding-left: 1rem; /* pl-4 */
  color: #374151; /* text-gray-700 */
}

.dark .prose blockquote {
  border-left-color: #4b5563; /* dark:border-gray-600 */
  color: #d1d5db; /* dark:text-gray-300 */
}

/* 代码样式 */
.prose code {
  background-color: #f3f4f6; /* bg-gray-100 */
  color: #1f2937; /* text-gray-800 */
  padding: 0.125rem 0.25rem; /* px-1 py-0.5 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
}

.dark .prose code {
  background-color: #374151; /* dark:bg-gray-700 */
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose pre {
  background-color: #f3f4f6; /* bg-gray-100 */
  color: #1f2937; /* text-gray-800 */
  padding: 1rem; /* p-4 */
  border-radius: 0.5rem; /* rounded-lg */
  overflow-x: auto; /* overflow-x-auto */
}

.dark .prose pre {
  background-color: #374151; /* dark:bg-gray-700 */
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose pre code {
  background-color: transparent; /* bg-transparent */
  color: inherit; /* text-inherit */
  padding: 0; /* p-0 */
}
</style>