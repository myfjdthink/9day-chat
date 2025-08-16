<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900 relative">
    <!-- SEO组件 -->
    <SEO 
      title="八字运势分析 - 北斗九号日历"
      description="基于传统命理学的专业八字分析，精准预测你的当年当月运势与注意事项。包括基础分析、用神分析、运势预测、运势评分。"
      keywords="八字分析,运势预测,命理分析,用神分析,运势评分,生辰八字,命理服务,命理指导"
    />
    
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
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">运势预测</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-300">运势分析、性格分析、人生建议</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- AI Analysis Scope -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">选择分析范围</label>
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
          <div class="mb-6">
            <h2 class="text-2xl font-bold mb-2 dark:text-gray-100">八字分析报告</h2>
            <!-- 分析时间和类型 -->
            <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <div class="flex items-center space-x-1">
                <CalendarIcon class="w-4 h-4" />
                <span>分析时间：{{ formatDateTime(analysisResult.分析时间) }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <Settings class="w-4 h-4" />
                <span>分析类型：{{ analysisResult.分析类型 }}</span>
              </div>
            </div>
          </div>
          
          <!-- 分析内容 - 使用虚拟列表优化长列表渲染 -->
          <div class="space-y-8">
            <template v-for="[type, content] in Object.entries(analysisResult.分析结果).slice(0, visibleItems)" :key="type">
              <div 
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700"
                v-observe-visibility="(isVisible: boolean) => handleVisibilityChange(type, isVisible)"
                :data-type="type"
              >
                <!-- 标题区域 -->
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-sm">{{ getAnalysisTypeIcon(type) }}</span>
                  </div>
                  <h3 class="text-xl font-semibold dark:text-gray-100">{{ type }}分析</h3>
                  <div class="flex-1"></div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-600 px-2 py-1 rounded">
                    {{ getAnalysisTypeDescription(type) }}
                  </div>
                </div>
                
                <!-- 分析内容 markdown 渲染区 - 懒加载优化 -->
                <div class="prose max-w-none dark:prose-invert prose-sm">
                  <div v-if="visibleSections[type]" v-html="formatMarkdown(content)" class="leading-relaxed"></div>
                  <div v-else class="h-32 flex items-center justify-center">
                    <div class="animate-pulse">
                      <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          
          <!-- 分析总结 -->
          <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div class="flex items-center space-x-2 mb-2">
              <Star class="w-5 h-5 text-blue-600" />
              <h4 class="font-medium text-blue-800 dark:text-blue-200">分析总结</h4>
            </div>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              本次分析涵盖了 {{ Object.keys(analysisResult.分析结果).length }} 个维度，
              为您提供了全面的八字分析报告。建议您根据分析结果，结合实际情况做出相应的调整和规划。
            </p>
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
              <Download class="w-4 h-4 mr-2" />
              保存报告
            </Button>
            <Button
              size="lg"
              variant="outline"
              @click="handleResetAnalysis"
            >
              <RefreshCw class="w-4 h-4 mr-2" />
              重新分析
            </Button>
            <Button
              size="lg"
              variant="default"
              @click="handleChatWithReport"
            >
              <MessageSquare class="w-4 h-4 mr-2" />
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
import { ref, reactive, computed, onMounted, watch, defineAsyncComponent, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { ObjectDirective, DirectiveBinding } from 'vue'

interface ExtendedHTMLElement extends HTMLElement {
  _observe_visibility_observer?: ReturnType<typeof useIntersectionObserver>
}

// 注册observe-visibility指令
const vObserveVisibility: ObjectDirective<ExtendedHTMLElement> = {
  mounted: (el: ExtendedHTMLElement, binding: DirectiveBinding<(isVisible: boolean) => void>) => {
    const observer = useIntersectionObserver(el, ([{ isIntersecting }]) => {
      binding.value(isIntersecting)
    })
    el._observe_visibility_observer = observer
  },
  unmounted: (el: ExtendedHTMLElement) => {
    if (el._observe_visibility_observer) {
      el._observe_visibility_observer.stop()
    }
  }
}
import type { Ref } from 'vue'
import type { BaziAnalysis } from '@/api/bazi'

// UI Components - 异步加载非关键组件
const Button = defineAsyncComponent(() => import('@/components/ui/Button.vue'))
const Input = defineAsyncComponent(() => import('@/components/ui/Input.vue'))
const Card = defineAsyncComponent(() => import('@/components/ui/Card.vue'))
const CardContent = defineAsyncComponent(() => import('@/components/ui/CardContent.vue'))
const Checkbox = defineAsyncComponent(() => import('@/components/ui/Checkbox.vue'))
const Modal = defineAsyncComponent(() => import('@/components/ui/Modal.vue'))
const SEO = defineAsyncComponent(() => import('@/components/SEO.vue'))

// 按需导入图标
import { User, Settings, Calendar as CalendarIcon, Star, Download, RefreshCw, MessageSquare } from 'lucide-vue-next'

// Third-party libraries
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { marked } from 'marked'
// 引入html2canvas用于截图
import html2canvas from 'html2canvas'

// API
import { analyzeBazi, ANALYSIS_PARTS } from '@/api/bazi'
// import { PROVIDERS, MODELS } from '@/api/config'
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

// 虚拟列表相关状态
const visibleItems = ref(3) // 初始显示3个项目
const visibleSections = reactive<Record<string, boolean>>({})
const intersectionObserver = ref<IntersectionObserver | null>(null)

// 处理元素可见性变化
const handleVisibilityChange = (type: string, isVisible: boolean): void => {
  if (isVisible && !visibleSections[type]) {
    visibleSections[type] = true
    // 如果当前可见的是最后一个项目，增加可见项目数量
    const currentItems = Object.keys(analysisResult.value?.分析结果 || {}).slice(0, visibleItems.value)
    if (currentItems[currentItems.length - 1] === type) {
      visibleItems.value += 2
    }
  }
}

// 清理观察器
onUnmounted(() => {
  if (intersectionObserver.value) {
    intersectionObserver.value.disconnect()
  }
})

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

// 格式化Markdown内容 - 使用缓存优化性能
const markdownCache = new Map<string, string>()
const formatMarkdown = (content: string): string => {
  if (markdownCache.has(content)) {
    return markdownCache.get(content)!
  }

  // 移除 "流年/流月/流日信息：" 这样的标题
  let processedContent = content.replace(/^#\s*流年\/流月\/流日信息：?\s*\n*/g, '')
  
  // 如果内容以 # 开头，移除第一个标题
  processedContent = processedContent.replace(/^#\s*[^#\n]*\n*/g, '')
  
  const result = marked(processedContent)
  markdownCache.set(content, result)
  return result
}

// 获取分析范围数组，严格按选项返回
const getAnalysisParts = (): string[] => {
  const parts: string[] = []
  if (analysisScope.year) parts.push(ANALYSIS_PARTS.FLOW_YEAR)
  if (analysisScope.month) parts.push(ANALYSIS_PARTS.FLOW_MONTH)
  if (analysisScope.day) parts.push(ANALYSIS_PARTS.FLOW_DAY)
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
      analysis_parts: analysisParts,
      // 可选：指定模型提供商和模型名称
      // provider: 'zhipuai',
      // model_name: 'glm-4-flash-250414'
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
        gender: (gender.value === '男' ? 'male' : 'female') as 'male' | 'female',
        analysis_type: 'basic',
        notes: markdownReport,
        display_name: '',
        user_nickname: userStore.user?.username || '',
        analysis_results: response.data.分析结果,
        summary: {},
        settings: {},
        extra_metadata: {}
      }
      // ======================================
      await baziStore.addAnalysis(params)
      // 新增：分析成功后，若用户无八字信息则自动保存
      await trySaveUserBaziInfo()
      // 新增：分析成功后自动跳转到分析结果页面
      const latest = baziStore.sortedAnalyses[0]
      if (latest) {
        router.push({ path: '/analysis', query: { analysisId: latest.id } })
      }
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
    birthDateTime.value = `${y}-${m}-${d}T${t}`
    gender.value = userStore.user.gender === 'male' || userStore.user.gender === '男' ? '男' : '女'
  } else if (!userStore.user) {
    // 未登录，填充默认八字信息
    birthDateTime.value = '1999-09-09T09:09'
    gender.value = '男'
  }

  // 初始化Intersection Observer
  intersectionObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const type = entry.target.getAttribute('data-type')
        if (type) {
          handleVisibilityChange(type, entry.isIntersecting)
        }
      })
    },
    {
      root: reportRef.value,
      threshold: 0.1
    }
  )
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

// 监听分析结果变化，初始化visibleSections
watch(
  () => analysisResult.value,
  (newResult) => {
    if (newResult) {
      // 重置可见项目数量
      visibleItems.value = 3
      // 初始化可见状态
      Object.keys(newResult.分析结果).forEach(type => {
        visibleSections[type] = false
      })
    }
  }
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

// 根据分析类型返回图标
const getAnalysisTypeIcon = (type: string) => {
  switch (type) {
    case '八字排盘':
      return '🔮'
    case '五行分析':
      return '⚖️'
    case '用神分析':
      return '🎯'
    case '格局判断':
      return '🎲'
    case '运势预测':
      return '🔮'
    case '性格分析':
      return '🧠'
    case '人生建议':
      return '💡'
    default:
      return '📝'
  }
}

// 根据分析类型返回描述
const getAnalysisTypeDescription = (type: string) => {
  switch (type) {
    case '八字排盘':
      return '详细解读您的八字命盘，包括五行、十神、神煞等'
    case '五行分析':
      return '深入分析您的五行属性，揭示性格特点和运势走向'
    case '用神分析':
      return '根据您的八字，为您推荐最佳用神，助您趋吉避凶'
    case '格局判断':
      return '判断您的八字格局，分析您的命运走向'
    case '运势预测':
      return '基于您的八字，预测未来一年的运势变化'
    case '性格分析':
      return '通过您的八字，分析您的性格特征和潜在优势'
    case '人生建议':
      return '基于您的八字，提供具体的人生建议和规划'
    default:
      return '详细分析您的八字信息'
  }
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