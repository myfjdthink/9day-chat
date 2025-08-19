<template>
  <div class="mt-12 space-y-8">
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
          @click="$emit('save')"
        >
          <Download class="w-4 h-4 mr-2" />
          保存报告
        </Button>
        <Button
          size="lg"
          variant="outline"
          @click="$emit('reset')"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          重新分析
        </Button>
        <Button
          size="lg"
          variant="default"
          @click="$emit('chat')"
        >
          <MessageSquare class="w-4 h-4 mr-2" />
          对话报告
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { Star, Settings, Calendar as CalendarIcon, Download, RefreshCw, MessageSquare } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { marked } from 'marked'
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

interface Props {
  analysisResult: {
    分析类型: string
    分析时间: string
    分析结果: Record<string, string>
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'save': []
  'reset': []
  'chat': []
}>()

// 用于获取分析报告区域的DOM引用
const reportRef = ref<HTMLElement | null>(null)

// 虚拟列表相关状态
const visibleItems = ref(3) // 初始显示3个项目
const visibleSections = reactive<Record<string, boolean>>({})
const intersectionObserver = ref<IntersectionObserver | null>(null)

// 处理元素可见性变化
const handleVisibilityChange = (type: string, isVisible: boolean): void => {
  if (isVisible && !visibleSections[type]) {
    visibleSections[type] = true
    // 如果当前可见的是最后一个项目，增加可见项目数量
    const currentItems = Object.keys(props.analysisResult.分析结果).slice(0, visibleItems.value)
    if (currentItems[currentItems.length - 1] === type) {
      visibleItems.value += 2
    }
  }
}

// 格式化日期时间
const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString('zh-CN')
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

// 清理观察器
onUnmounted(() => {
  if (intersectionObserver.value) {
    intersectionObserver.value.disconnect()
  }
})
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