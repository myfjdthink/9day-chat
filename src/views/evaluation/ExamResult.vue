<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
    <!-- 装饰性背景元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div class="absolute top-0 left-0 w-64 h-64 bg-red-100 dark:bg-red-900 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      <div class="absolute top-1/2 left-1/2 w-72 h-72 bg-green-100 dark:bg-green-900 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-4 py-12 relative">
      <!-- 返回按钮 -->
      <Button
        variant="ghost"
        class="mb-8 hover:scale-105 transition-transform"
        @click="router.push('/evaluation')"
      >
        <span class="mr-2">←</span>
        返回测评首页
      </Button>

      <!-- 测评结果 -->
      <div class="max-w-4xl mx-auto space-y-10">
        <!-- 标题 -->
        <div class="text-center relative">
          <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif relative">
            考公考编运势分析报告
          </h1>
          <div class="inline-flex items-center space-x-2 text-lg text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 px-6 py-2 rounded-full backdrop-blur-sm">
            <span class="text-red-500 dark:text-red-400">{{ birthYear }}年</span>
            <span class="text-blue-500 dark:text-blue-400">{{ birthMonth }}月</span>
            <span class="text-green-500 dark:text-green-400">{{ birthDay }}日</span>
            <span class="text-purple-500 dark:text-purple-400">{{ birthTime }}</span>
          </div>
        </div>

        <!-- 今年成功率 -->
        <Card class="transform hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center font-serif">
                  <span class="mr-3 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    📊
                  </span>
                  今年成功率分析
                </h2>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  命理推演 · 数据分析
                </div>
              </div>

              <div class="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                
                <div class="relative w-48 h-48 mb-6 md:mb-0">
                  <!-- 圆环进度条 -->
                  <svg class="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke-width="12"
                      stroke="currentColor"
                      fill="transparent"
                      class="text-gray-200 dark:text-gray-600"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke-width="12"
                      stroke="currentColor"
                      fill="transparent"
                      :stroke-dasharray="2 * Math.PI * 88"
                      :stroke-dashoffset="2 * Math.PI * 88 * (1 - successRate / 100)"
                      class="text-blue-500 dark:text-blue-400 transition-all duration-1000"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <span class="text-5xl font-bold text-blue-600 dark:text-blue-400">{{ successRate }}</span>
                      <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">%</span>
                    </div>
                  </div>
                </div>

                <div class="md:ml-8 flex-1 relative">
                  <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span class="text-lg font-medium text-gray-900 dark:text-white">运势分析</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {{ successRateAnalysis }}
                    </p>
                    <div class="pt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span class="mr-2">✨</span>
                      <span>基于八字命理与现代数据分析</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 个性分析 -->
        <Card class="transform hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center font-serif">
                  <span class="mr-3 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    🎯
                  </span>
                  个性特质分析
                </h2>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  天赋禀赋 · 性格倾向
                </div>
              </div>

              <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                
                <div class="space-y-4">
                  <div class="grid gap-4">
                    <div v-for="(trait, index) in personalityTraits" :key="index" 
                         class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 transform hover:scale-[1.02] transition-all duration-300">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-3">
                          <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                               :class="{
                                 'bg-red-100 dark:bg-red-900 text-red-500': index === 0,
                                 'bg-blue-100 dark:bg-blue-900 text-blue-500': index === 1,
                                 'bg-green-100 dark:bg-green-900 text-green-500': index === 2,
                                 'bg-yellow-100 dark:bg-yellow-900 text-yellow-500': index === 3,
                                 'bg-purple-100 dark:bg-purple-900 text-purple-500': index === 4,
                               }">
                            {{ ['壹', '贰', '叁', '肆', '伍'][index] }}
                          </div>
                          <span class="font-medium text-gray-900 dark:text-white">{{ trait.name }}</span>
                        </div>
                        <span class="text-lg font-semibold"
                              :class="{
                                'text-red-500': index === 0,
                                'text-blue-500': index === 1,
                                'text-green-500': index === 2,
                                'text-yellow-500': index === 3,
                                'text-purple-500': index === 4,
                              }">
                          {{ trait.score }}%
                        </span>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-1000"
                             :class="{
                               'bg-red-500': index === 0,
                               'bg-blue-500': index === 1,
                               'bg-green-500': index === 2,
                               'bg-yellow-500': index === 3,
                               'bg-purple-500': index === 4,
                             }"
                             :style="{ width: `${trait.score}%` }">
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span class="text-lg font-medium text-gray-900 dark:text-white">综合分析</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {{ personalityAnalysis }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 未来几年对比 -->
        <Card class="transform hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center font-serif">
                  <span class="mr-3 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    📈
                  </span>
                  未来三年运势对比
                </h2>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  运势预测 · 趋势分析
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                
                <div class="space-y-6">
                  <div class="grid gap-6">
                    <div v-for="(year, index) in futureYears" :key="index" 
                         class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 transform hover:scale-[1.02] transition-all duration-300">
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-3">
                          <div class="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
                               :class="{
                                 'bg-blue-100 dark:bg-blue-900 text-blue-600': index === 0,
                                 'bg-green-100 dark:bg-green-900 text-green-600': index === 1,
                                 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600': index === 2,
                               }">
                            {{ year.year }}
                          </div>
                          <div class="flex flex-col">
                            <span class="text-sm text-gray-500 dark:text-gray-400">运势指数</span>
                            <span class="text-2xl font-bold"
                                  :class="{
                                    'text-blue-600': index === 0,
                                    'text-green-600': index === 1,
                                    'text-yellow-600': index === 2,
                                  }">
                              {{ year.score }}%
                            </span>
                          </div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span class="text-sm"
                                :class="{
                                  'text-blue-500': index === 0,
                                  'text-green-500': index === 1,
                                  'text-yellow-500': index === 2,
                                }">
                            {{ ['平稳', '上升', '变化'][index] }}
                          </span>
                          <span class="text-xl transform"
                                :class="{
                                  'text-blue-500': index === 0,
                                  'text-green-500': index === 1,
                                  'text-yellow-500': index === 2,
                                }">
                            {{ ['→', '↗', '↕'][index] }}
                          </span>
                        </div>
                      </div>
                      <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-1000"
                             :class="year.class"
                             :style="{ width: `${year.score}%` }">
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-lg font-medium text-gray-900 dark:text-white">趋势分析</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {{ futureAnalysis }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 备考建议 -->
        <Card class="transform hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center font-serif">
                  <span class="mr-3 w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    📝
                  </span>
                  备考建议
                </h2>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  专业指导 · 实践建议
                </div>
              </div>

              <div class="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-200 dark:bg-yellow-800 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                
                <div class="grid gap-4">
                  <div v-for="(advice, index) in examAdvice" :key="index" 
                       class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 transform hover:scale-[1.02] transition-all duration-300">
                    <div class="flex space-x-4">
                      <div class="w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-lg font-bold shadow-inner"
                           :class="{
                             'from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 text-red-600': index === 0,
                             'from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 text-orange-600': index === 1,
                             'from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 text-yellow-600': index === 2,
                             'from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 text-green-600': index === 3,
                             'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-600': index === 4,
                           }">
                        {{ ['壹', '贰', '叁', '肆', '伍'][index] }}
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ advice }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 底部按钮组 -->
        <div class="flex flex-wrap justify-center gap-4 pt-8">
          <Button 
            variant="outline" 
            @click="handleRetry"
            class="transform hover:scale-105 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span class="flex items-center space-x-2">
              <span>🔄</span>
              <span>重新测评</span>
            </span>
          </Button>
          <Button 
            variant="outline" 
            @click="handleChat"
            class="transform hover:scale-105 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            <span class="flex items-center space-x-2">
              <span>💬</span>
              <span>深入命理问答</span>
            </span>
          </Button>
          <Button 
            variant="outline" 
            @click="handleBazi"
            class="transform hover:scale-105 transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900"
          >
            <span class="flex items-center space-x-2">
              <span>🎯</span>
              <span>八字分析</span>
            </span>
          </Button>
          <Button 
            variant="outline" 
            @click="handleFortune"
            class="transform hover:scale-105 transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900"
          >
            <span class="flex items-center space-x-2">
              <span>✨</span>
              <span>运势分析</span>
            </span>
          </Button>
        </div>

        <!-- 底部装饰 -->
        <div class="mt-12 text-center text-gray-500 dark:text-gray-400 space-y-2">
          <p class="text-sm">愿此分析助您一臂之力</p>
          <div class="flex justify-center space-x-2">
            <span>✧</span>
            <span>明晰前程</span>
            <span>✧</span>
            <span>把握机遇</span>
            <span>✧</span>
            <span>金榜题名</span>
            <span>✧</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { chat } from '@/api/chat'
import { SYSTEM_ROLES } from '@/api/chat'

const router = useRouter()
const route = useRoute()

// 从路由参数获取生辰八字信息
const birthYear = ref(route.query.year)
const birthMonth = ref(route.query.month)
const birthDay = ref(route.query.day)
const birthTime = ref(route.query.time)
const gender = ref(route.query.gender)

// 测评结果数据
const successRate = ref(85)
const successRateAnalysis = ref('根据您的八字分析，今年考运相对较好。天干地支显示您在学习和考试方面具有较强的潜力，特别是在公务员考试这类需要严谨思维的考试中更具优势。建议把握今年的机会，积极备考。')

const personalityTraits = ref([
  { name: '学习能力', score: 88 },
  { name: '逻辑思维', score: 92 },
  { name: '专注度', score: 85 },
  { name: '抗压能力', score: 78 },
  { name: '记忆力', score: 90 }
])
const personalityAnalysis = ref('您的八字显示具有较强的学习能力和逻辑思维，这是考试的重要优势。虽然抗压能力稍显不足，但通过合理规划和调节可以有效改善。建议在备考过程中多关注心理调适，保持良好的学习状态。')

const futureYears = ref([
  { year: 2024, score: 85, class: 'bg-blue-600 dark:bg-blue-400' },
  { year: 2025, score: 92, class: 'bg-green-600 dark:bg-green-400' },
  { year: 2026, score: 75, class: 'bg-yellow-600 dark:bg-yellow-400' }
])
const futureAnalysis = ref('从运势走向来看，2024年整体运势不错，2025年将迎来一个较好的机遇期，建议重点把握。2026年虽然整体运势略有下降，但通过努力依然可以取得好成绩。')

const examAdvice = ref([
  '充分利用早上5-7点的黄金学习时间，这个时段您的记忆力和理解力最佳。',
  '建议在9月-11月期间参加考试，这段时间您的运势较为有利。',
  '可以选择与财经、法律相关的岗位，这些领域与您的八字相性较好。',
  '注意调节作息，保证充足的休息时间，避免过度疲劳影响发挥。',
  '建议佩戴一些代表智慧的饰品，如紫水晶，可以帮助增强考试运势。'
])

// 生成测评结果
const generateResult = async () => {
  try {
    // 构建分析提示词
    const prompt = `请根据以下生辰八字信息，分析考公考编运势：
    出生年月日时：${birthYear.value}年${birthMonth.value}月${birthDay.value}日 ${birthTime.value}
    
    请提供以下分析：
    1. 今年考试成功概率
    2. 个性特质分析（学习能力、逻辑思维、专注度、抗压能力、记忆力）
    3. 未来三年运势对比
    4. 备考建议
    
    要求：
    - 分析要专业、具体
    - 建议要实用、可操作
    - 注意积极正面，给出希望
    `

    // 调用AI接口获取分析结果
    const response = await chat(prompt, SYSTEM_ROLES.FORTUNE_TELLER)
    
    // TODO: 解析AI返回的结果，更新页面数据
    console.log('AI分析结果：', response)
    
  } catch (error) {
    console.error('生成分析结果失败：', error)
  }
}

// 底部按钮点击处理
const handleRetry = () => {
  router.push('/evaluation/exam')
}

const handleChat = () => {
  router.push({
    path: '/chat/exam',
    query: {
      year: birthYear.value,
      month: birthMonth.value,
      day: birthDay.value,
      time: birthTime.value
    }
  })
}

const handleBazi = () => {
  router.push('/bazi')
}

const handleFortune = () => {
  router.push('/fortune')
}

onMounted(() => {
  // 页面加载时生成测评结果
  generateResult()
})
</script>

<style scoped>
/* 可以添加一些动画效果的样式 */
</style>
