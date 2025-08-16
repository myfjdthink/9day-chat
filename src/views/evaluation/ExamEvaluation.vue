<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <Button
        variant="ghost"
        class="mb-6"
        @click="router.back()"
      >
        <span class="mr-2">←</span>
        返回
      </Button>

      <!-- 测评介绍 -->
      <div class="max-w-3xl mx-auto mb-12">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">考公考编测评</h1>
        <Card>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-4xl">📚</span>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">专业命理分析，助你把握上岸机会</h2>
                  <p class="text-gray-500 dark:text-gray-400">基于八字命理，分析考试运势和成功概率</p>
                </div>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">测评可以帮你了解：</h3>
                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                  <li class="flex items-center">
                    <span class="mr-2">✓</span>
                    今年考试成功概率
                  </li>
                  <li class="flex items-center">
                    <span class="mr-2">✓</span>
                    个人特质与考试匹配度
                  </li>
                  <li class="flex items-center">
                    <span class="mr-2">✓</span>
                    未来3年运势对比
                  </li>
                  <li class="flex items-center">
                    <span class="mr-2">✓</span>
                    个性化备考建议
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 生辰八字表单 -->
      <div class="max-w-2xl mx-auto">
        <Card>
          <CardContent>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">请填写您的生辰八字</h3>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <BirthInfoForm
                v-model="birthInfo"
              />

              <!-- 提交按钮 -->
              <div class="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  :disabled="isLoading"
                  class="w-full md:w-auto min-w-[200px]"
                >
                  {{ isLoading ? '分析中...' : '开始测评' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

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
  // 检查登录状态
  if (!userStore.user) {
    router.push('/login')
    return
  }

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
