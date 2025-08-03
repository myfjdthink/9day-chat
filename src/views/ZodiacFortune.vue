<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <!-- SEO组件 -->
    <SEO 
      title="生肖运势 - 北斗九号日历"
      description="每日生肖运势分析，了解今日吉凶，把握良机，趋利避害。提供今日运势评分、事业财运分析、健康感情运势、吉凶建议。"
      keywords="生肖运势,今日运势,运势分析,生肖分析,吉凶预测,运势评分,事业财运,健康感情"
    />
    
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {{ fortuneData?.分析时间 ? `${new Date(fortuneData.分析时间).getMonth() + 1}月${new Date(fortuneData.分析时间).getDate()}日生肖运势` : '生肖运势' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-300">今日生肖运势分析，助您把握良机</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">正在分析生肖运势...</p>
      </div>

      <!-- 运势分析结果 -->
      <div v-if="fortuneData && !loading" class="space-y-4">
        <!-- 总体运势分析 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">今日运势总览</h2>
            <div class="flex items-center gap-3">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(fortuneData.分析时间) }}
              </div>
              <button 
                @click="refreshFortune" 
                :disabled="loading"
                class="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="刷新运势数据"
              >
                <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </button>
              <button 
                @click="shareFortune" 
                :disabled="sharing"
                class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="分享生肖运势"
              >
                <svg v-if="!sharing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </button>
            </div>
          </div>
          
          <!-- 优化后的运势分析显示 -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-4">
            <!-- 今日生肖信息 -->
            <div class="flex items-center mb-3">
              <div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">今日生肖属：{{ getZodiacFromEarthBranch(fortuneData.今日地支) }}</h3>
              </div>
            </div>

            <!-- 紧凑型运势分析内容 -->
            <div v-if="sortedFortuneSections.length > 0" class="space-y-2">
              <div v-for="(section, index) in sortedFortuneSections" :key="index" class="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                <!-- 运势类型标题 -->
                <div class="flex items-center mb-2">
                  <div :class="getSectionIconClass(section.type)" class="w-6 h-6 rounded-full flex items-center justify-center mr-2 shadow-sm">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="section.type === '三合'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else-if="section.type === '平运'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      <path v-else-if="section.type === '值太岁'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      <path v-else-if="section.type === '六合'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      <path v-else-if="section.type === '相破'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else-if="section.type === '相害'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-base font-bold" :class="getSectionTextClass(section.type)">{{ section.title }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ section.subtitle }}</p>
                  </div>
                </div>

                <!-- 生肖运势网格 -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="(fortune, zodiacIndex) in section.fortunes" :key="zodiacIndex" 
                       class="flex items-start space-x-2 p-2 bg-gray-50 dark:bg-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                    <!-- 生肖图标 -->
                    <div class="flex-shrink-0">
                      <ZodiacIcon :zodiac="fortune.zodiac" class="w-5 h-5" />
                    </div>
                    
                    <!-- 运势内容 -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center mb-1">
                        <span class="font-medium text-gray-800 dark:text-gray-200 mr-2 text-xs">属{{ fortune.zodiac }}</span>
                        <span class="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0" :class="getZodiacStatusClass(section.type)">
                          {{ getZodiacStatusText(section.type) }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">{{ fortune.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 备用：直接显示运势分析文本 -->
            <div v-else class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div class="prose prose-sm dark:prose-invert max-w-none">
                <div class="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {{ fortuneData.运势分析 }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生肖运势网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="(fortune, zodiac) in fortuneData.生肖运势" 
            :key="zodiac"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <!-- 生肖图标和名称 -->
            <div class="relative h-28 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
              <div class="absolute inset-0 bg-black bg-opacity-10"></div>
              <div class="relative z-10 text-center">
                <div class="w-14 h-14 mx-auto mb-1 flex items-center justify-center">
                  <ZodiacIcon :zodiac="zodiac" class="w-10 h-10" />
                </div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">{{ zodiac }}</h3>
              </div>
            </div>

            <!-- 运势详情 -->
            <div class="p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">地支：{{ fortune.地支 || '未知' }}</span>
                <span 
                  :class="getRelationTypeClass(fortune.关系类型)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ fortune.关系类型 }}
                </span>
              </div>

              <!-- 运势描述 -->
              <div class="space-y-1">
                <div class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ fortune.运势描述 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mt-8">
        <div class="flex items-center">
          <div class="w-5 h-5 bg-red-400 dark:bg-red-500 rounded-full flex items-center justify-center mr-3">
            <span class="text-white text-xs">!</span>
          </div>
          <span class="text-red-800 dark:text-red-200">{{ error }}</span>
        </div>
      </div>
    </div>

    <!-- 隐藏的分享内容容器 -->
    <div ref="shareContainer" class="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 z-50 opacity-0 pointer-events-none" style="transform: translateX(-9999px);">
      <!-- 16:9 手机屏幕比例容器 -->
      <div class="w-full h-full flex items-center justify-center p-4">
        <div class="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl overflow-hidden" style="aspect-ratio: 9/16;">
          <div class="p-4 h-full flex flex-col">
            <!-- 分享标题 -->
            <div class="text-center mb-4">
              <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">生肖运势</h1>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">今日生肖运势分析，助您把握良机</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(fortuneData?.分析时间 || '') }}</p>
            </div>

            <!-- 总体运势分析 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 mb-4 flex-shrink-0">
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <span class="text-white font-bold text-sm">{{ fortuneData?.今日地支 }}</span>
                </div>
                <div>
                  <h2 class="text-sm font-bold text-gray-800 dark:text-gray-100">今日运势总览</h2>
                  <p class="text-xs text-gray-600 dark:text-gray-400">今日地支：{{ fortuneData?.今日地支 }}</p>
                </div>
              </div>
              <div class="text-gray-700 dark:text-gray-300 leading-relaxed text-xs">
                {{ fortuneData?.运势分析 }}
              </div>
            </div>

            <!-- 生肖运势网格 - 3x4 布局 -->
            <div class="grid grid-cols-3 gap-2 flex-1 overflow-y-auto">
              <div 
                v-for="(fortune, zodiac) in fortuneData?.生肖运势" 
                :key="zodiac"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <!-- 生肖图标和名称 -->
                <div class="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-2 text-center">
                  <div class="mb-1">
                    <ZodiacIcon :zodiac="zodiac" class="text-lg" />
                  </div>
                  <h3 class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ zodiac }}</h3>
                </div>

                <!-- 运势详情 -->
                <div class="p-2">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-gray-500 dark:text-gray-400">地支：{{ fortune.地支 || '未知' }}</span>
                    <span 
                      :class="getRelationTypeClass(fortune.关系类型)"
                      class="px-1 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ fortune.关系类型 }}
                    </span>
                  </div>

                  <!-- 运势描述 -->
                  <div class="space-y-1">
                    <div class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      {{ fortune.运势描述 }}
                    </div>
                    <!-- 关系信息 -->
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-xs text-gray-500 dark:text-gray-400">关系：{{ fortune.关系类型 }}</span>
                      <span class="text-xs px-1 py-0.5 rounded-full" :class="getIntensityClass(fortune.强度值)">
                        强度: {{ fortune.强度值 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 水印 - 左下角 -->
            <div class="absolute bottom-2 left-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
              www.9day.tech 北斗九号日历
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { analyzeZodiacFortune } from '@/api/bazi'
import type { ZodiacFortuneResponse } from '@/api/bazi'
import ZodiacIcon from '@/components/ZodiacIcon.vue'
import SEO from '@/components/SEO.vue'
import html2canvas from 'html2canvas'

// 响应式数据
const loading = ref(false)
const sharing = ref(false)
const error = ref('')
const fortuneData = ref<ZodiacFortuneResponse['data'] | null>(null)
const cacheStatus = ref<{ type: 'cache' | 'fresh'; message: string } | null>(null)
const shareContainer = ref<HTMLElement>()

// 格式化日期时间
const formatDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化日期
const formatDate = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

// 地支到生肖的映射
const getZodiacFromEarthBranch = (earthBranch: string) => {
  const mapping: { [key: string]: string } = {
    '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔', '辰': '龙', '巳': '蛇',
    '午': '马', '未': '羊', '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪'
  }
  return mapping[earthBranch] || earthBranch
}

// 定义运势数据结构类型
interface ZodiacFortune {
  zodiac: string
  content: string
}

interface FortuneSection {
  type: string
  title: string
  subtitle: string
  fortunes: ZodiacFortune[]
}

// 解析运势文本为结构化数据
const parsedFortuneSections = computed(() => {
  if (!fortuneData.value?.运势分析) return []
  
  const text = fortuneData.value.运势分析
  const sections: FortuneSection[] = []
  
  // 根据新API格式解析运势分析文本
  const sectionPatterns = [
    { 
      type: '值太岁', 
      title: '值太岁（龙）', 
      subtitle: '本命年运势',
      pattern: /值太岁（龙）：(.+?)(?=\n\n|$)/ 
    },
    { 
      type: '相破', 
      title: '相破（牛）', 
      subtitle: '运势平平',
      pattern: /相破（牛）：(.+?)(?=\n\n|$)/ 
    },
    { 
      type: '相害', 
      title: '相害（虎、兔）', 
      subtitle: '需注意人际关系',
      pattern: /相害（虎、兔）：\n- 虎：(.+?)\n- 兔：(.+?)(?=\n\n|$)/ 
    },
    { 
      type: '相冲', 
      title: '相冲', 
      subtitle: '易有冲突',
      pattern: /相冲（(.+?)）：(.+?)(?=\n\n|$)/ 
    },
    { 
      type: '相刑', 
      title: '相刑', 
      subtitle: '需谨慎行事',
      pattern: /相刑（(.+?)）：(.+?)(?=\n\n|$)/ 
    },
    { 
      type: '三合', 
      title: '三合（鼠、猴）', 
      subtitle: '贵人相助',
      pattern: /三合（鼠、猴）：\n- 鼠：(.+?)\n- 猴：(.+?)(?=\n\n|$)/ 
    },
    { 
      type: '六合', 
      title: '六合（鸡）', 
      subtitle: '运势极佳',
      pattern: /六合（鸡）：(.+?)(?=\n\n|$)/ 
    },
    { 
      type: '平运', 
      title: '平运（蛇、马、羊、狗、猪）', 
      subtitle: '运势平稳',
      pattern: /平运（蛇、马、羊、狗、猪）：\n- 蛇：(.+?)\n- 马：(.+?)\n- 羊：(.+?)\n- 狗：(.+?)\n- 猪：(.+?)(?=\n\n|$)/ 
    }
  ]
  
  sectionPatterns.forEach(({ type, title, subtitle, pattern }) => {
    const match = text.match(pattern)
    if (match) {
      const fortunes: ZodiacFortune[] = []
      
      if (type === '相害') {
        fortunes.push({ zodiac: '虎', content: match[1] })
        fortunes.push({ zodiac: '兔', content: match[2] })
      } else if (type === '相冲') {
        // 相冲可能有多个生肖，需要解析
        const zodiacs = match[1].split('、')
        const content = match[2]
        zodiacs.forEach(zodiac => {
          fortunes.push({ zodiac: zodiac.trim(), content })
        })
      } else if (type === '相刑') {
        // 相刑可能有多个生肖，需要解析
        const zodiacs = match[1].split('、')
        const content = match[2]
        zodiacs.forEach(zodiac => {
          fortunes.push({ zodiac: zodiac.trim(), content })
        })
      } else if (type === '三合') {
        fortunes.push({ zodiac: '鼠', content: match[1] })
        fortunes.push({ zodiac: '猴', content: match[2] })
      } else if (type === '平运') {
        fortunes.push({ zodiac: '蛇', content: match[1] })
        fortunes.push({ zodiac: '马', content: match[2] })
        fortunes.push({ zodiac: '羊', content: match[3] })
        fortunes.push({ zodiac: '狗', content: match[4] })
        fortunes.push({ zodiac: '猪', content: match[5] })
      } else if (type === '值太岁') {
        fortunes.push({ zodiac: '龙', content: match[1] })
      } else if (type === '相破') {
        fortunes.push({ zodiac: '牛', content: match[1] })
      } else if (type === '六合') {
        fortunes.push({ zodiac: '鸡', content: match[1] })
      }
      
      if (fortunes.length > 0) {
        sections.push({ type, title, subtitle, fortunes })
      }
    }
  })
  
  return sections
})

// 按好中差顺序排序运势类型
const sortedFortuneSections = computed(() => {
  const sections = parsedFortuneSections.value
  const priorityOrder = {
    '六合': 1,    // 最好
    '三合': 2,    // 很好
    '平运': 3,    // 一般
    '相破': 4,    // 较差
    '相害': 5,    // 差
    '相冲': 6,    // 差
    '相刑': 7,    // 差
    '值太岁': 8   // 最差
  }
  
  return sections.sort((a, b) => {
    const priorityA = priorityOrder[a.type as keyof typeof priorityOrder] || 999
    const priorityB = priorityOrder[b.type as keyof typeof priorityOrder] || 999
    return priorityA - priorityB
  })
})

// 获取运势类型图标样式
const getSectionIconClass = (type: string) => {
  switch (type) {
    case '三合':
      return 'bg-green-500'
    case '平运':
      return 'bg-yellow-500'
    case '值太岁':
      return 'bg-red-500'
    case '六合':
      return 'bg-purple-500'
    case '相破':
      return 'bg-orange-500'
    case '相害':
      return 'bg-red-500'
    case '相冲':
      return 'bg-red-500'
    case '相刑':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

// 获取运势类型文字样式
const getSectionTextClass = (type: string) => {
  switch (type) {
    case '三合':
      return 'text-green-700 dark:text-green-400'
    case '平运':
      return 'text-yellow-700 dark:text-yellow-400'
    case '值太岁':
      return 'text-red-700 dark:text-red-400'
    case '六合':
      return 'text-purple-700 dark:text-purple-400'
    case '相破':
      return 'text-orange-700 dark:text-orange-400'
    case '相害':
      return 'text-red-700 dark:text-red-400'
    case '相冲':
      return 'text-red-700 dark:text-red-400'
    case '相刑':
      return 'text-red-700 dark:text-red-400'
    default:
      return 'text-gray-700 dark:text-gray-300'
  }
}

// 获取生肖状态样式
const getZodiacStatusClass = (type: string) => {
  switch (type) {
    case '三合':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    case '平运':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    case '值太岁':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case '六合':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    case '相破':
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    case '相害':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case '相冲':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case '相刑':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
}

// 获取生肖状态文字
const getZodiacStatusText = (type: string) => {
  switch (type) {
    case '三合':
      return '贵人运旺'
    case '平运':
      return '运势平稳'
    case '值太岁':
      return '需谨慎'
    case '六合':
      return '运气极佳'
    case '相破':
      return '易遇变故'
    case '相害':
      return '需注意'
    case '相冲':
      return '易有冲突'
    case '相刑':
      return '需谨慎'
    default:
      return '运势一般'
  }
}

// 获取关系类型样式类
const getRelationTypeClass = (type: string) => {
  switch (type) {
    case '相刑':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case '平运':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    case '相合':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    case '相冲':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case '三合':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    case '六合':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    case '相破':
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    case '相害':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case '值太岁':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
}

// 获取强度值样式类
const getIntensityClass = (intensity: number) => {
  if (intensity >= 8) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  if (intensity >= 6) return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
  if (intensity >= 4) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  if (intensity >= 2) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
  return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

// 分享运势图片
const shareFortune = async () => {
  if (!fortuneData.value || !shareContainer.value) return
  
  sharing.value = true
  
  try {
    // 临时显示分享容器
    shareContainer.value.style.opacity = '1'
    shareContainer.value.style.pointerEvents = 'auto'
    shareContainer.value.style.transform = 'translateX(0)'
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 生成图片 - 16:9 手机屏幕比例
    const canvas = await html2canvas(shareContainer.value, {
      backgroundColor: '#f8fafc', // 使用渐变背景色
      scale: 3, // 提高图片质量到3倍
      useCORS: true,
      allowTaint: true,
      width: 1080, // 16:9 比例宽度
      height: 1920, // 16:9 比例高度 (9:16)
      logging: false, // 关闭日志
      removeContainer: false, // 不移除容器
      foreignObjectRendering: true, // 支持外部对象渲染
      imageTimeout: 15000, // 增加图片加载超时时间
    })
    
    // 转换为图片并下载
    const link = document.createElement('a')
    link.download = `生肖运势_${formatDateTime(fortuneData.value.分析时间).replace(/[\/\s:]/g, '_')}.png`
    link.href = canvas.toDataURL('image/png', 1.0) // 最高质量
    link.click()
    
  } catch (err) {
    console.error('生成分享图片失败:', err)
    error.value = '生成分享图片失败，请稍后重试'
  } finally {
    // 隐藏分享容器
    if (shareContainer.value) {
      shareContainer.value.style.opacity = '0'
      shareContainer.value.style.pointerEvents = 'none'
      shareContainer.value.style.transform = 'translateX(-9999px)'
    }
    sharing.value = false
  }
}

// 分析运势（使用缓存）
const analyzeFortune = async () => {
  loading.value = true
  error.value = ''
  cacheStatus.value = null
  
  try {
    const response = await analyzeZodiacFortune({}, false) // 使用缓存，获取全部生肖
    fortuneData.value = response.data
    
    // 根据响应消息判断是否使用了缓存
    if (response.message.includes('缓存')) {
      cacheStatus.value = { type: 'cache', message: '使用缓存数据，点击刷新按钮获取最新数据' }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '分析失败，请稍后重试'
    console.error('生肖运势分析失败:', err)
  } finally {
    loading.value = false
  }
}

// 强制刷新运势（忽略缓存）
const refreshFortune = async () => {
  loading.value = true
  error.value = ''
  cacheStatus.value = null
  
  try {
    const response = await analyzeZodiacFortune({}, true) // 强制刷新，获取全部生肖
    fortuneData.value = response.data
    cacheStatus.value = { type: 'fresh', message: '已强制刷新，获取最新数据' }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '强制刷新失败，请稍后重试'
    console.error('强制刷新生肖运势失败:', err)
  } finally {
    loading.value = false
  }
}

// 页面加载时自动分析
onMounted(() => {
  analyzeFortune()
})
</script>

<style scoped>
.prose {
  max-width: none;
}

/* 文本截断样式 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 