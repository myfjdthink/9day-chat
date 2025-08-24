<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 relative h-screen">
    <!-- SEO组件 -->
    <SEO 
      title="八字运势分析 - 北斗九号日历"
      description="基于传统命理学的专业八字分析，精准预测你的当年当月运势与注意事项。包括基础分析、用神分析、运势预测、运势评分。"
      keywords="八字分析,运势预测,命理分析,用神分析,运势评分,生辰八字,命理服务,命理指导"
    />
    
    <!-- 主体布局：左侧历史 + 右侧分析 -->
    <div class="flex h-full">
      <!-- 左侧历史面板 - 固定定位 -->
      <div class="w-64 fixed top-16 bottom-0 left-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <AnalysisHistory
          :selected-analysis-id="selectedAnalysisId"
          @select="handleSelectAnalysis"
          @delete="handleDeleteAnalysis"
        />
      </div>

      <!-- 右侧分析区域 -->
      <div class="flex-1 ml-64">
        <div class="max-w-6xl mx-auto p-8">
          <!-- 新增分析表单 -->
          <AnalysisNew v-if="!analysisResult" />

          <!-- 分析结果 -->
          <AnalysisResult
            v-if="analysisResult"
            :analysis-result="analysisResult"
            @save="handleSaveReport"
            @reset="handleResetAnalysis"
            @chat="handleChatWithReport"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import SEO from '@/components/SEO.vue'
import AnalysisHistory from '@/components/analysis/AnalysisHistory.vue'
import AnalysisNew from '@/components/analysis/AnalysisNew.vue'
import AnalysisResult from '@/components/analysis/AnalysisResult.vue'

// API
import { AnalysisStatus } from '@/api/bazi'
// 引入 Pinia store
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import { useRoute, useRouter } from 'vue-router'

// 分析结果类型
interface AnalysisResult {
  分析类型: string
  分析时间: string
  分析结果: Record<string, string>
  status: AnalysisStatus
}

const analysisResult = ref<AnalysisResult | null>(null)
const chatStore = useChatStore()
const userStore = useUserStore()
const baziStore = useBaziStore()
const route = useRoute()
const router = useRouter()

// 当前选中的分析历史ID
const selectedAnalysisId = ref<string | null>(null)

// 监听路由参数变化
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      selectedAnalysisId.value = newId as string
      try {
        const record = await baziStore.getAnalysis(newId as string)
        const analysisResultField = (record as any).analysis_results || (record as any).analysis_result
        analysisResult.value = {
          分析类型: record.analysis_type,
          分析时间: record.created_at,
          分析结果: analysisResultField || (record.notes ? parseResultText(record.notes) : {}),
          status: record.status as AnalysisStatus
        }
      } catch (error) {
        console.error('获取分析记录失败:', error)
        analysisResult.value = null
      }
    }
  },
  { immediate: true }
)

// 页面加载时自动填充
onMounted(async () => {
  // 如果有路由参数，加载对应的分析
  if (route.params.id) {
    const analysisId = route.params.id as string
    try {
      const record = await baziStore.getAnalysis(analysisId)
      selectedAnalysisId.value = analysisId
      const analysisResultField = (record as any).analysis_results || (record as any).analysis_result
      analysisResult.value = {
        分析类型: record.analysis_type,
        分析时间: record.created_at,
        分析结果: analysisResultField || (record.notes ? parseResultText(record.notes) : {}),
        status: record.status as AnalysisStatus
      }
    } catch (error) {
      console.error('获取分析记录失败:', error)
      analysisResult.value = null
    }
  }
})

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
  if (!await userStore.checkLoginAndShow()) {
    return
  }

  const reportText = Object.entries(analysisResult.value.分析结果)
    .map(([type, content]) => `【${type}】\n${content}\n`).join('\n')
  const reportName = `八字分析-${new Date(analysisResult.value.分析时间).toLocaleString()}`
  const newChatId = await chatStore.createConversation()
  router.push({ path: '/chat', query: { reportContext: reportText, name: reportName, conversationId: newChatId } })
}

// 选择历史分析
const handleSelectAnalysis = async (id: string) => {
  selectedAnalysisId.value = id
  try {
    const record = await baziStore.getAnalysis(id)
    const analysisResultField = (record as any).analysis_results || (record as any).analysis_result
    analysisResult.value = {
      分析类型: record.analysis_type,
      分析时间: record.created_at,
      分析结果: analysisResultField || (record.notes ? parseResultText(record.notes) : {}),
      status: record.status as AnalysisStatus
    }
  } catch (error) {
    console.error('获取分析记录失败:', error)
    analysisResult.value = null
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