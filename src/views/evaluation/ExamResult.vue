<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <Button
        variant="ghost"
        class="mb-6"
        @click="router.push('/evaluation')"
      >
        <span class="mr-2">←</span>
        返回测评首页
      </Button>

      <!-- 测评结果 -->
      <div class="max-w-3xl mx-auto space-y-8">
        <!-- 标题 -->
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">考公考编运势分析报告</h1>
          <p class="text-gray-500 dark:text-gray-400">
            {{ birthYear }}年{{ birthMonth }}月{{ birthDay }}日 {{ birthTime }}
          </p>
        </div>

        <!-- 今年成功率 -->
        <Card>
          <CardContent>
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="mr-2">📊</span>
                今年成功率分析
              </h2>
              <div class="flex items-center justify-center">
                <div class="relative w-48 h-48">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-4xl font-bold text-blue-600 dark:text-blue-400">{{ successRate }}%</span>
                  </div>
                  <!-- 这里可以添加圆环进度条动画 -->
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                {{ successRateAnalysis }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- 个性分析 -->
        <Card>
          <CardContent>
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="mr-2">🎯</span>
                个性特质分析
              </h2>
              <div class="space-y-3">
                <div v-for="(trait, index) in personalityTraits" :key="index" class="flex items-center">
                  <div class="w-32 flex-shrink-0 text-gray-600 dark:text-gray-400">{{ trait.name }}</div>
                  <div class="flex-1">
                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        class="h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                        :style="{ width: `${trait.score}%` }"
                      ></div>
                    </div>
                  </div>
                  <div class="w-12 text-right text-gray-600 dark:text-gray-400">{{ trait.score }}%</div>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                {{ personalityAnalysis }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- 未来几年对比 -->
        <Card>
          <CardContent>
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="mr-2">📈</span>
                未来三年运势对比
              </h2>
              <div class="space-y-4">
                <div v-for="(year, index) in futureYears" :key="index" class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">{{ year.year }}年</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ year.score }}%</span>
                  </div>
                  <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      class="h-2 rounded-full"
                      :class="year.class"
                      :style="{ width: `${year.score}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                {{ futureAnalysis }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- 备考建议 -->
        <Card>
          <CardContent>
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="mr-2">📝</span>
                备考建议
              </h2>
              <div class="space-y-3">
                <div v-for="(advice, index) in examAdvice" :key="index" class="flex space-x-3">
                  <div class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    {{ index + 1 }}
                  </div>
                  <p class="text-gray-600 dark:text-gray-300">{{ advice }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 底部按钮组 -->
        <div class="flex flex-wrap justify-center gap-4 pt-8">
          <Button variant="outline" @click="handleRetry">
            重新测评
          </Button>
          <Button variant="outline" @click="handleChat">
            深入命理问答
          </Button>
          <Button variant="outline" @click="handleBazi">
            八字分析
          </Button>
          <Button variant="outline" @click="handleFortune">
            运势分析
          </Button>
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
