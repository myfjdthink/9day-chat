<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              :variant="formData.gender === '男' ? 'default' : 'outline'"
              @click="updateGender('男')"
            >
              男
            </Button>
            <Button
              :variant="formData.gender === '女' ? 'default' : 'outline'"
              @click="updateGender('女')"
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
              v-model="formData.birthDateTime"
              class="w-full"
            />
            <CalendarIcon class="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          <!-- Confirmation Message -->
          <div class="mt-3 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
            <div class="flex items-center space-x-2">
              <CalendarIcon class="w-4 h-4 text-green-600" />
              <span class="text-sm text-green-800 dark:text-green-200">
                已选择：{{ formatDateTime(formData.birthDateTime) }} <span class="text-green-600">(新历)</span>
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
                    v-model="formData.analysisTypes.basic"
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
                    v-model="formData.analysisTypes.deity"
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
                    v-model="formData.analysisTypes.ai"
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
              :variant="formData.analysisScope.year ? 'default' : 'outline'"
              @click="updateAnalysisScope('year')"
            >
              流年
            </Button>
            <Button
              :variant="formData.analysisScope.month ? 'default' : 'outline'"
              @click="updateAnalysisScope('month')"
            >
              流月
            </Button>
            <Button
              :variant="formData.analysisScope.day ? 'default' : 'outline'"
              @click="updateAnalysisScope('day')"
            >
              流日
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Start Analysis Button -->
    <div class="flex justify-center">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { User, Settings, Calendar as CalendarIcon, Star } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { analyzeBazi, ANALYSIS_PARTS } from '@/api/bazi'

// 表单数据
const formData = reactive({
  gender: '男' as '男' | '女',
  birthDateTime: '1999-09-09T09:09',
  analysisTypes: {
    basic: true,
    deity: true,
    ai: true
  },
  analysisScope: {
    year: true,
    month: false,
    day: false
  }
})

const router = useRouter()
const userStore = useUserStore()
const isAnalyzing = ref(false)

// 格式化日期时间
const formatDateTime = (dateTime: string): string => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}

// 更新性别
const updateGender = (gender: '男' | '女') => {
  formData.gender = gender
}

// 更新分析范围
const updateAnalysisScope = (scope: 'year' | 'month' | 'day') => {
  formData.analysisScope[scope] = !formData.analysisScope[scope]
}

// 获取分析范围数组
const getAnalysisParts = (): string[] => {
  const parts: string[] = []
  if (formData.analysisScope.year) parts.push(ANALYSIS_PARTS.FLOW_YEAR)
  if (formData.analysisScope.month) parts.push(ANALYSIS_PARTS.FLOW_MONTH)
  if (formData.analysisScope.day) parts.push(ANALYSIS_PARTS.FLOW_DAY)
  return parts
}

// 开始分析
const handleStartAnalysis = async (): Promise<void> => {
  if (!formData.birthDateTime) {
    alert('请选择出生日期时间')
    return
  }

  const analysisParts = getAnalysisParts()
  if (analysisParts.length === 0) {
    alert('请至少选择一个分析范围')
    return
  }

  if (!await userStore.checkLoginAndShow()) {
    return
  }

  try {
    isAnalyzing.value = true
    const response = await analyzeBazi(
      userStore.user!.id,
      {
        birth_datetime: formData.birthDateTime,
        current_datetime: new Date().toISOString(),
        gender: formData.gender,
        analysis_parts: analysisParts
      }
    )

    // 跳转到新的分析页面
    if ((response as any).id) {
      router.push(`/analysis/${(response as any).id}`)
    } else {
      console.error('分析结果中缺少ID')
      alert('分析创建成功，但无法跳转到详情页')
    }
  } catch (error: any) {
    console.error('分析过程中出现错误:', error)
    alert(error.message || '分析过程中出现错误')
  } finally {
    isAnalyzing.value = false
  }
}

// 自动导入用户八字信息
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
  // 自动填充用户八字信息
  if (userStore.user && userHasBaziInfo.value) {
    // 组装 yyyy-MM-ddTHH:mm 作为 v-model
    const y = userStore.user.birth_year!.toString().padStart(4, '0')
    const m = userStore.user.birth_month!.toString().padStart(2, '0')
    const d = userStore.user.birth_day!.toString().padStart(2, '0')
    const t = userStore.user.birth_time!.padStart(5, '0')
    formData.birthDateTime = `${y}-${m}-${d}T${t}`
    formData.gender = userStore.user.gender === 'male' || userStore.user.gender === '男' ? '男' : '女'
  } else if (!userStore.user) {
    // 未登录，填充默认八字信息
    formData.birthDateTime = '1999-09-09T09:09'
    formData.gender = '男'
  }
})
</script> 