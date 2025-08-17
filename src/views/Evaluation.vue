<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
    <!-- 装饰性背景元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div class="absolute top-0 left-0 w-64 h-64 bg-red-100 dark:bg-red-900 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      <div class="absolute top-1/2 left-1/2 w-72 h-72 bg-green-100 dark:bg-green-900 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-4 py-12 relative">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif relative inline-block">
          <span class="relative z-10">命理测评</span>
          <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-500/20 via-blue-500/20 to-green-500/20 rounded-full"></div>
        </h1>
        <p class="text-gray-600 dark:text-gray-400">探索人生 · 明晰前程 · 把握机遇</p>
      </div>

      <!-- 测评卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- 考公考编测评 -->
        <Card 
          class="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700" 
          @click="handleSceneClick('exam')"
        >
          <CardContent>
            <div class="relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              
              <div class="flex items-center space-x-6">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center transform rotate-3 shadow-lg">
                  <span class="text-3xl">📚</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif">考公考编测评</h3>
                  <p class="text-gray-600 dark:text-gray-300">分析考试运势，助你把握上岸机会</p>
                  <div class="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <span>立即测评</span>
                    <span class="ml-2">→</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 感情运势测评 -->
        <Card class="transform transition-all duration-300 shadow-md bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 relative overflow-hidden">
          <div class="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm"></div>
          <CardContent class="relative">
            <div class="flex items-center space-x-6">
              <div class="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 rounded-lg flex items-center justify-center transform rotate-3">
                <span class="text-3xl">💕</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <h3 class="text-xl font-bold text-gray-900/60 dark:text-white/60 font-serif">感情运势测评</h3>
                  <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500">即将上线</span>
                </div>
                <p class="text-gray-500/80 dark:text-gray-400/80 mt-2">敬请期待...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 健康运势测评 -->
        <Card class="transform transition-all duration-300 shadow-md bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 relative overflow-hidden">
          <div class="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm"></div>
          <CardContent class="relative">
            <div class="flex items-center space-x-6">
              <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center transform rotate-3">
                <span class="text-3xl">🏥</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <h3 class="text-xl font-bold text-gray-900/60 dark:text-white/60 font-serif">健康运势测评</h3>
                  <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500">即将上线</span>
                </div>
                <p class="text-gray-500/80 dark:text-gray-400/80 mt-2">敬请期待...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 八字运势测评 -->
        <Card class="transform transition-all duration-300 shadow-md bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 relative overflow-hidden">
          <div class="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm"></div>
          <CardContent class="relative">
            <div class="flex items-center space-x-6">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg flex items-center justify-center transform rotate-3">
                <span class="text-3xl">🔮</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <h3 class="text-xl font-bold text-gray-900/60 dark:text-white/60 font-serif">八字运势测评</h3>
                  <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500">即将上线</span>
                </div>
                <p class="text-gray-500/80 dark:text-gray-400/80 mt-2">敬请期待...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 底部装饰 -->
      <div class="mt-16 text-center text-gray-500 dark:text-gray-400 space-y-2">
        <p class="text-sm">专业命理分析，助您明晰前程</p>
        <div class="flex justify-center space-x-2">
          <span>✧</span>
          <span>探索命理</span>
          <span>✧</span>
          <span>把握机遇</span>
          <span>✧</span>
          <span>扶摇直上</span>
          <span>✧</span>
        </div>
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
