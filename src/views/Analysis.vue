<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900 relative"> <!-- 加 relative -->
    <div class="max-w-6xl mx-auto">
      <!-- 输入部分 -->
      <div v-if="!analysisResult" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Basic Information -->
        <div class="space-y-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm p-6">
          <div class="flex items-center space-x-2 mb-6">
            <User class="w-5 h-5 text-green-500" />
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">基本信息</h2>
          </div>

          <!-- Gender Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">性别</label>
            <div class="flex space-x-3">
              <Button
                :variant="gender === '男' ? 'default' : 'outline'"
                @click="gender = '男'"
              >
                男
              </Button>
              <Button
                :variant="gender === '女' ? 'default' : 'outline'"
                @click="gender = '女'"
              >
                女
              </Button>
            </div>
          </div>

          <!-- Birth Date and Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              出生日期和时间 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Input
                type="datetime-local"
                v-model="birthDateTime"
                class="w-full"
              />
              <CalendarIcon class="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>

            <!-- Confirmation Message -->
            <div class="mt-3 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
              <div class="flex items-center space-x-2">
                <CalendarIcon class="w-4 h-4 text-green-600" />
                <span class="text-sm text-green-800 dark:text-green-200">
                  已选择：{{ formatDateTime(birthDateTime) }} <span class="text-green-600">(新历)</span>
                </span>
              </div>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-300 mt-2">出生时间已选择，可点击输入框重新调整</p>
          </div>
        </div>

        <!-- Analysis Configuration -->
        <div class="space-y-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm p-6">
          <div class="flex items-center space-x-2 mb-6">
            <Settings class="w-5 h-5 text-green-500" />
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">分析配置</h2>
          </div>

          <!-- Analysis Types -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">分析类型</label>
            <div class="space-y-3">
              <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
                <CardContent class="p-4">
                  <div class="flex items-start space-x-3">
                    <Checkbox
                      :checked="analysisTypes.basic"
                      @update:checked="analysisTypes.basic = $event"
                      class="mt-1"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">基础分析</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-300">八字排盘、五行分析、基本信息</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
                <CardContent class="p-4">
                  <div class="flex items-start space-x-3">
                    <Checkbox
                      :checked="analysisTypes.deity"
                      @update:checked="analysisTypes.deity = $event"
                      class="mt-1"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">用神分析</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-300">用神喜忌、避神分析、格局判断</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
                <CardContent class="p-4">
                  <div class="flex items-start space-x-3">
                    <Checkbox
                      :checked="analysisTypes.ai"
                      @update:checked="analysisTypes.ai = $event"
                      class="mt-1"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">AI智能分析</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-300">运势预测、性格分析、人生建议</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- AI Analysis Scope -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">AI分析范围</label>
            <div class="flex space-x-3">
              <Button
                :variant="analysisScope.year ? 'default' : 'outline'"
                @click="analysisScope.year = !analysisScope.year"
              >
                流年
              </Button>
              <Button
                :variant="analysisScope.month ? 'default' : 'outline'"
                @click="analysisScope.month = !analysisScope.month"
              >
                流月
              </Button>
              <Button
                :variant="analysisScope.day ? 'default' : 'outline'"
                @click="analysisScope.day = !analysisScope.day"
              >
                流日
              </Button>
            </div>
          </div>
        </div>
      </div>

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

      <!-- Analysis Results -->
      <div v-if="analysisResult" class="mt-12 space-y-8">
        <!-- 报告内容区域，支持滚动 -->
        <div ref="reportRef" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-h-[80vh] overflow-y-auto">
          <h2 class="text-xl font-semibold mb-4 dark:text-gray-100">分析结果</h2>
          <!-- 分析时间和类型 -->
          <div class="mb-6 text-sm text-gray-600 dark:text-gray-300">
            <p>分析类型：{{ analysisResult.分析类型 }}</p>
            <p>分析时间：{{ formatDateTime(analysisResult.分析时间) }}</p>
          </div>
          <!-- 分析内容 -->
          <div class="space-y-6">
            <template v-for="(content, type) in analysisResult.分析结果" :key="type">
              <div class="border-t pt-4 dark:border-gray-700">
                <h3 class="text-lg font-medium mb-3 dark:text-gray-100">{{ type }}</h3>
                <!-- 分析内容 markdown 渲染区 -->
                <div class="prose max-w-none dark:prose-invert" v-html="formatMarkdown(content)"></div>
              </div>
            </template>
          </div>
        </div>
        <!-- 底部操作栏：sticky 定位在主内容区底部，不遮挡侧边栏 -->
        <div class="sticky bottom-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 shadow-lg">
          <div class="w-full max-w-4xl mx-auto flex justify-center gap-6 px-2">
            <Button
              size="lg"
              variant="secondary"
              @click="handleSaveReport"
            >
              保存报告
            </Button>
            <Button
              size="lg"
              variant="outline"
              @click="handleResetAnalysis"
            >
              重新分析
            </Button>
            <Button
              size="lg"
              variant="default"
              @click="handleChatWithReport"
            >
              对话报告
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
        <div class="text-lg text-white font-semibold">AI正在分析，请稍候...</div>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { BaziAnalysis } from '@/api/bazi'

// UI Components
import { User, Settings, Calendar as CalendarIcon, Star } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Modal from '@/components/ui/Modal.vue'

// Third-party libraries
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { marked } from 'marked'
// 引入html2canvas用于截图
import html2canvas from 'html2canvas'

// API
import { analyzeBazi } from '@/api/bazi'
// 引入 Pinia store
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import { updateUserInfo } from '@/api/user' // 新增导入
import { useRoute, useRouter } from 'vue-router' // 保证路由相关导入

// 配置 dayjs
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

interface AnalysisTypes {
  basic: boolean
  deity: boolean
  ai: boolean
}

interface AnalysisScope {
  year: boolean
  month: boolean
  day: boolean
}

const gender = ref<'男' | '女'>('男')
const birthDateTime = ref<string>('1983-12-11T08:00')
const isAnalyzing = ref<boolean>(false)
const analysisResult = ref<{ 分析类型: string; 分析时间: string; 分析结果: Record<string, string> } | null>(null)

const analysisTypes = reactive<AnalysisTypes>({
  basic: true,
  deity: true,
  ai: true
})

// 分析范围初始值全部为false，需用户手动选择
const analysisScope = reactive<AnalysisScope>({
  year: true,
  month: false,
  day: false
})

// 用于获取分析报告区域的DOM引用
const reportRef = ref<HTMLElement | null>(null)

// 格式化日期时间为北京时间
const formatDateTime = (dateTime: string): string => {
  return dayjs(dateTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
}

// 格式化Markdown内容
const formatMarkdown = (content: string): string => {
  return marked(content)
}

// 获取分析范围数组，严格按选项返回
const getAnalysisParts = (): string[] => {
  const parts: string[] = []
  if (analysisScope.year) parts.push('流年')
  if (analysisScope.month) parts.push('流月')
  if (analysisScope.day) parts.push('流日')
  return parts
}

// 新增分析成功后，自动保存到本地+云端
const handleStartAnalysis = async (): Promise<void> => {
  if (!birthDateTime.value) {
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
    const birthDateTimeBeijing = dayjs(birthDateTime.value).tz('Asia/Shanghai').format()
    const currentDateTimeBeijing = dayjs().tz('Asia/Shanghai').format()
    const response = await analyzeBazi({
      birth_datetime: birthDateTimeBeijing,
      current_datetime: currentDateTimeBeijing,
      gender: gender.value,
      analysis_parts: analysisParts
    })
    if (response.success) {
      analysisResult.value = response.data
      // 生成 markdown 报告
      const dt = dayjs(birthDateTime.value).tz('Asia/Shanghai')
      const markdownReport = Object.entries(response.data.分析结果)
        .map(([type, content]) => `### ${type}\n${content}\n`)
        .join('\n')
      // ====== 关键：严格对齐后端API文档字段 ======
      const params = {
        client_analysis_id: `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        birth_year: dt.year(),
        birth_month: dt.month() + 1,
        birth_day: dt.date(),
        birth_time: dt.format('HH:mm'),
        gender: (gender.value === '男' ? 'male' : 'female') as 'male' | 'female', // 类型断言，确保类型安全
        analysis_type: 'basic', // 可根据 analysisTypes 进一步细化
        notes: markdownReport,
        display_name: '', // 可选，前端可不传，后端自动生成
        user_nickname: userStore.user?.username || '', // 可选
        analysis_results: response.data.分析结果, // JSON
        summary: {}, // 可选
        settings: {}, // 可选
        extra_metadata: {} // 可选
      }
      // ======================================
      console.log('addAnalysis 参数', params)
      await baziStore.addAnalysis(params)
      // 新增：分析成功后，若用户无八字信息则自动保存
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

// 新增：保存报告和重新分析方法
/**
 * 保存分析报告为图片
 */
const handleSaveReport = async () => {
  if (!reportRef.value || !analysisResult.value) return
  // 使用html2canvas将分析报告区域渲染为canvas
  const canvas = await html2canvas(reportRef.value, {
    backgroundColor: '#fff', // 保证图片背景为白色
    useCORS: true
  })
  // 将canvas转为图片并下载
  const imgData = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = imgData
  a.download = `分析报告_${formatDateTime(analysisResult.value.分析时间)}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 重新分析，重置界面
 */
const handleResetAnalysis = () => {
  analysisResult.value = null
}

// 对话报告按钮逻辑
const handleChatWithReport = async () => {
  if (!analysisResult.value) return
  // 检查登录状态
  if (!userStore.user) {
    showLoginModal.value = true
    return
  }
  // 整理分析报告为纯文本
  const reportText = Object.entries(analysisResult.value.分析结果)
    .map(([type, content]) => `【${type}】\n${content}\n`).join('\n')
  const reportName = `八字分析-${formatDateTime(analysisResult.value.分析时间)}`
  // 新建一条对话记录，并等待返回后端 UUID
  const newChatId = await chatStore.createConversation()
  // 跳转到/chat并带上reportContext和name参数，Chat.vue会自动插入气泡
  router.push({ path: '/chat', query: { reportContext: reportText, name: reportName, conversationId: newChatId } })
}

const chatStore = useChatStore()
const userStore = useUserStore()
const baziStore = useBaziStore()
const route = useRoute()
const router = useRouter()

// ========== 新增：自动导入用户八字信息 ========== //
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
onMounted(() => {
  baziStore.initializeStore()
  baziStore.loadAnalysesFromBackend()
  // 自动填充用户八字信息
  if (userStore.user && userHasBaziInfo.value) {
    // 组装 yyyy-MM-ddTHH:mm 作为 v-model
    const y = userStore.user.birth_year!.toString().padStart(4, '0')
    const m = userStore.user.birth_month!.toString().padStart(2, '0')
    const d = userStore.user.birth_day!.toString().padStart(2, '0')
    const t = userStore.user.birth_time!.padStart(5, '0')
    birthDateTime.value = `${y}-${m}-${d}T${t}`
    gender.value = userStore.user.gender === 'male' || userStore.user.gender === '男' ? '男' : '女'
  } else if (!userStore.user) {
    // 未登录，填充默认八字信息
    birthDateTime.value = '1999-09-09T09:09'
    gender.value = '男'
  }
})

// ========== 新增：首次填写自动保存为用户默认出生日期 ========== //
let hasSavedUserBazi = false // 只保存一次
async function trySaveUserBaziInfo() {
  if (!userStore.user || userHasBaziInfo.value || hasSavedUserBazi) return
  // 解析 birthDateTime
  const dt = birthDateTime.value
  if (!dt || !gender.value) return
  const [date, time] = dt.split('T')
  if (!date || !time) return
  const [year, month, day] = date.split('-').map(Number)
  // 保存到用户信息
  try {
    await updateUserInfo({
      username: userStore.user.username || '',
      phone: userStore.user.phone || '',
      birth_year: year,
      birth_month: month,
      birth_day: day,
      birth_time: time,
      gender: gender.value === '男' ? 'male' : 'female'
    })
    await userStore.fetchUser() // 刷新用户信息
    hasSavedUserBazi = true
  } catch (e) {
    // 可加日志
    console.warn('自动保存用户八字信息失败', e)
  }
}

// 历史分析数据源，替换原 chatStore.analysisHistory
const analyses = computed<BaziAnalysis[]>(() => baziStore.sortedAnalyses)

// 当前选中的分析历史ID
const selectedAnalysisId = ref<string | null>(null)

// 监听 analyses 和 analysisId，数据和 id 任一变化都尝试展示历史
watch(
  [analyses, () => route.query.analysisId],
  ([list, id]) => {
    if (id) {
      showAnalysisFromHistory(id as string)
    } else {
      analysisResult.value = null
    }
  },
  { immediate: true }
)

// 展示历史分析
function showAnalysisFromHistory(id: string) {
  // 统一转字符串对比，兼容 id/client_analysis_id
  const record = analyses.value.find(r => String(r.id) === String(id) || String((r as any).client_analysis_id) === String(id))
  if (record) {
    let resultObj = {}
    // 优先兼容 analysis_results 字段
    const analysisResultField = (record as any).analysis_results || (record as any).analysis_result
    // 调试日志，便于排查数据结构
    console.log('历史分析记录', record)
    console.log('analysis_results:', (record as any).analysis_results)
    console.log('analysis_result:', (record as any).analysis_result)
    console.log('notes:', record.notes)
    if (analysisResultField && Object.keys(analysisResultField).length > 0) {
      resultObj = analysisResultField
    } else if (record.notes) {
      resultObj = parseResultText(record.notes)
    }
    analysisResult.value = {
      分析类型: record.analysis_type,
      分析时间: record.created_at,
      分析结果: resultObj
    }
    selectedAnalysisId.value = id
  } else {
    analysisResult.value = null
  }
}

// 解析纯文本为对象（简单分段）
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

// 直接点击历史分析项时，强制刷新内容
function handleSelectAnalysis(id: string) {
  showAnalysisFromHistory(id)
  selectedAnalysisId.value = id
  // 如需同步到 URL，可加：router.replace({ query: { ...route.query, analysisId: id } })
}

const showLoginModal = ref(false)
const handleLoginConfirm = () => {
  showLoginModal.value = false
  router.push('/login')
}
const handleLoginCancel = () => {
  showLoginModal.value = false
}
</script>

<style>
.prose {
  @apply text-gray-800;
}

.prose h3 {
  @apply text-lg font-medium mt-4 mb-2;
}

.prose p {
  @apply my-2;
}

.prose ul {
  @apply list-disc list-inside my-2;
}

.prose li {
  @apply my-1;
}
</style>