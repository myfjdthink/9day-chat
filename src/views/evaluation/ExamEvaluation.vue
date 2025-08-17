<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
    <!-- 装饰性背景元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div class="absolute top-0 left-0 w-64 h-64 bg-red-100 dark:bg-red-900 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute top-1/2 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-4 py-12 relative">
      <!-- 返回按钮 -->
      <Button
        variant="ghost"
        class="mb-8 hover:scale-105 transition-transform"
        @click="router.back()"
      >
        <span class="mr-2">←</span>
        返回
      </Button>

      <!-- 测评介绍 -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif">考公考编运势测评</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">明晰前程 · 把握机遇 · 扶摇直上</p>
        </div>
        
        <Card class="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardContent>
            <div class="space-y-8">
              <div class="flex items-center space-x-6 bg-gradient-to-r from-red-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg">
                <div class="w-20 h-20 bg-gradient-to-br from-red-400 to-blue-500 dark:from-red-600 dark:to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 transform rotate-3 shadow-lg">
                  <span class="text-4xl">📚</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">专业命理分析，助你把握上岸机会</h2>
                  <p class="text-gray-600 dark:text-gray-300">基于传统八字命理，结合现代数据分析，为您提供精准的考运预测</p>
                </div>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center font-serif">测评助您了解</h3>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <span class="text-red-600 dark:text-red-400">壹</span>
                      </div>
                      <span class="text-gray-700 dark:text-gray-300">今年考试成功概率</span>
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span class="text-blue-600 dark:text-blue-400">贰</span>
                      </div>
                      <span class="text-gray-700 dark:text-gray-300">个人特质与考试匹配度</span>
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span class="text-green-600 dark:text-green-400">叁</span>
                      </div>
                      <span class="text-gray-700 dark:text-gray-300">未来三年运势对比</span>
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span class="text-purple-600 dark:text-purple-400">肆</span>
                      </div>
                      <span class="text-gray-700 dark:text-gray-300">个性化备考建议</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 生辰八字表单 -->
      <div class="max-w-2xl mx-auto">
        <Card class="transform hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
          <CardContent>
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">请填写您的生辰八字</h3>
              <p class="text-gray-600 dark:text-gray-400">精准分析，助您把握上岸良机</p>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-inner">
                <BirthInfoForm
                  v-model="birthInfo"
                  class="birth-info-form"
                />
              </div>

              <!-- 提交按钮 -->
              <div class="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  :disabled="isLoading"
                  class="w-full md:w-auto min-w-[240px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span class="flex items-center justify-center space-x-2">
                    <span class="text-lg">{{ isLoading ? '命理分析中...' : '开始测评' }}</span>
                    <span v-if="!isLoading" class="text-xl">→</span>
                    <span v-else class="animate-spin">⟳</span>
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <!-- 底部装饰 -->
        <div class="mt-12 text-center text-gray-500 dark:text-gray-400 space-y-2">
          <p class="text-sm">精心打造的命理测评系统</p>
          <div class="flex justify-center space-x-2">
            <span>✧</span>
            <span>问道前程</span>
            <span>✧</span>
            <span>把握机遇</span>
            <span>✧</span>
            <span>扶摇直上</span>
            <span>✧</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.birth-info-form :deep(.form-group) {
  @apply mb-6 last:mb-0;
}

.birth-info-form :deep(label) {
  @apply text-gray-700 dark:text-gray-300 font-medium mb-2 block;
}

.birth-info-form :deep(input),
.birth-info-form :deep(select) {
  @apply w-full rounded-lg border border-gray-300 dark:border-gray-600 
         bg-white dark:bg-gray-700 
         text-gray-900 dark:text-white
         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
         focus:border-transparent
         transition-all duration-200;
}

.birth-info-form :deep(.radio-group) {
  @apply flex space-x-4;
}

.birth-info-form :deep(.radio-group label) {
  @apply inline-flex items-center cursor-pointer;
}

.birth-info-form :deep(.radio-group input[type="radio"]) {
  @apply w-4 h-4 text-blue-600 dark:text-blue-400 
         focus:ring-blue-500 dark:focus:ring-blue-400
         border-gray-300 dark:border-gray-600;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import BirthInfoForm from '@/components/BirthInfoForm.vue'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const birthInfo = ref({
  gender: '男' as '男' | '女',
  birthDateTime: '1990-01-01T00:00'
})
const isLoading = ref(false)

// 表单提交
const handleSubmit = async () => {
  isLoading.value = true
  try {
    const dt = dayjs(birthInfo.value.birthDateTime)
    // 跳转到结果页面，并传递参数
    router.push({
      path: '/evaluation/exam/result',
      query: {
        year: dt.year(),
        month: dt.month() + 1,
        day: dt.date(),
        time: getChineseTime(dt.hour(), dt.minute()),
        gender: birthInfo.value.gender
      }
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

// 将小时和分钟转换为中国传统时辰
function getChineseTime(hour: number, minute: number): string {
  const totalMinutes = hour * 60 + minute
  const timeRanges = [
    { name: '子时', start: 23 * 60, end: 24 * 60 + 60 },
    { name: '丑时', start: 1 * 60, end: 3 * 60 },
    { name: '寅时', start: 3 * 60, end: 5 * 60 },
    { name: '卯时', start: 5 * 60, end: 7 * 60 },
    { name: '辰时', start: 7 * 60, end: 9 * 60 },
    { name: '巳时', start: 9 * 60, end: 11 * 60 },
    { name: '午时', start: 11 * 60, end: 13 * 60 },
    { name: '未时', start: 13 * 60, end: 15 * 60 },
    { name: '申时', start: 15 * 60, end: 17 * 60 },
    { name: '酉时', start: 17 * 60, end: 19 * 60 },
    { name: '戌时', start: 19 * 60, end: 21 * 60 },
    { name: '亥时', start: 21 * 60, end: 23 * 60 }
  ]

  // 处理跨午夜的情况
  let adjustedMinutes = totalMinutes
  if (totalMinutes >= 23 * 60) {
    adjustedMinutes = totalMinutes
  } else {
    adjustedMinutes = totalMinutes + 24 * 60
  }

  for (const range of timeRanges) {
    const start = range.start
    const end = range.end > 24 * 60 ? range.end - 24 * 60 : range.end
    if (
      (adjustedMinutes >= start && adjustedMinutes < end) ||
      (adjustedMinutes >= start + 24 * 60 && adjustedMinutes < end + 24 * 60)
    ) {
      return range.name
    }
  }

  return '子时' // 默认返回子时
}
</script>