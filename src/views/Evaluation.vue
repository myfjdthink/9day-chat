<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">命理测评</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 考公考编测评 -->
        <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="handleSceneClick('exam')">
          <CardContent>
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span class="text-2xl">📚</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">考公考编测评</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">分析考试运势，助你把握上岸机会</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 感情运势测评 -->
        <Card class="opacity-60 cursor-not-allowed">
          <CardContent>
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                <span class="text-2xl">💕</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">感情运势测评</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">敬请期待...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 健康运势测评 -->
        <Card class="opacity-60 cursor-not-allowed">
          <CardContent>
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span class="text-2xl">🏥</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">健康运势测评</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">敬请期待...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 八字运势测评 -->
        <Card class="opacity-60 cursor-not-allowed">
          <CardContent>
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span class="text-2xl">🔮</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">八字运势测评</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">敬请期待...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'

const router = useRouter()

const handleSceneClick = (scene: string) => {
  if (scene === 'exam') {
    router.push({ name: 'ExamEvaluation' })
  }
}
</script>
