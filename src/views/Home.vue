<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-6xl mx-auto">
      <!-- Welcome Section -->
      <div class="text-center mb-6 md:mb-8">
        <div class="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <img src="@/assets/logo.png" alt="Logo" class="w-16 h-16 object-contain" />
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-3">对话八字运势，AI大师与你同行</h1>
        <p class="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 md:mb-6">一站式八字运势分析、智能对话与专业命理预测，风水大师就在你身边，助你洞悉当年当月运势与注意事项</p>

        <div class="flex flex-col md:flex-row justify-center items-center md:space-x-4 space-y-2 md:space-y-0">
          <Button
            size="lg"
            variant="default"
            @click="router.push('/chat')"
          >
            <MessageCircle class="w-5 h-5 mr-2" />
            立即开启智能对话
          </Button>
          <Button
            size="lg"
            variant="outline"
            @click="router.push('/analysis')"
          >
            <Star class="w-5 h-5 mr-2" />
            八字运势分析
          </Button>
        </div>
      </div>

      <!-- Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800">
          <CardContent class="p-4 md:p-6">
            <div class="flex items-center space-x-3 mb-2 md:mb-4">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <MessageCircle class="w-5 h-5 md:w-6 md:h-6 text-green-500" />
              </div>
              <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">AI智能对话</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-2 md:mb-4">与AI助手自然交流，获得八字运势、生活、事业等多领域的专业解答</p>
            <ul class="text-xs md:text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• 支持中文对话</li>
              <li>• 实时响应</li>
              <li>• 多轮对话记忆</li>
            </ul>
          </CardContent>
        </Card>

        <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800">
          <CardContent class="p-4 md:p-6">
            <div class="flex items-center space-x-3 mb-2 md:mb-4">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Star class="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              </div>
              <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">八字运势分析</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-2 md:mb-4">基于传统命理学的专业八字分析，精准预测你的当年当月运势与注意事项</p>
            <ul class="text-xs md:text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• 基础分析</li>
              <li>• 用神分析</li>
              <li>• AI智能预测</li>
            </ul>
          </CardContent>
        </Card>

        <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800">
          <CardContent class="p-4 md:p-6">
            <div class="flex items-center space-x-3 mb-2 md:mb-4">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <User class="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
              <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">专属风水大师</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-2 md:mb-4">随时随地，风水大师为你答疑解惑，助力人生规划与决策</p>
            <ul class="text-xs md:text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• 个性化建议</li>
              <li>• 贴心提醒</li>
              <li>• 专业命理指导</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <!-- 社交媒体信息区块 -->
      <div class="mt-6 md:mt-8">
        <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 text-center">
          <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">联系我们</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-3 md:mb-4">欢迎通过以下方式与我们交流：</p>
          <div class="flex flex-wrap justify-center gap-2 md:gap-4">
            <!-- QQ 复制 -->
            <button
              @click="copyQQ"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition cursor-pointer"
            >
              <span class="text-xl">🐧</span>
              <span>QQ号码</span>
            </button>
            <!-- 邮箱 -->
            <a
              href="mailto:3960688438@qq.com"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-800 transition"
            >
              <span class="text-xl">📧</span>
              <span>邮件联系</span>
            </a>
            <!-- Twitter -->
            <a
              href="https://twitter.com/WaterJ3201"
              target="_blank" rel="noopener"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <span class="text-xl">𝕏</span>
              <span>Twitter</span>
            </a>
            <!-- 小红书 -->
            <a
              href="https://www.xiaohongshu.com/user/profile/621b22980000000010004579"
              target="_blank" rel="noopener"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-pink-50 dark:bg-pink-900 text-pink-700 dark:text-pink-200 rounded-lg border border-pink-200 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-800 transition"
            >
              <span class="text-xl">🍠</span>
              <span>小红书</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Home, MessageCircle, Star, User, Users, BarChart3, TrendingUp } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'

// QQ号码点击复制功能
import { ref } from 'vue'

const router = useRouter()

// 复制QQ号码到剪贴板
function copyQQ() {
  const qq = '3960688438'
  navigator.clipboard.writeText(qq).then(() => {
    // 简单提示，实际项目可用 ElMessage 或自定义弹窗
    alert('QQ号码已复制到剪贴板：' + qq)
  }).catch(() => {
    alert('复制失败，请手动复制：' + qq)
  })
}
</script>