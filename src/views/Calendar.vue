<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- SEO组件 -->
    <SEO 
      :title="$t('calendar.seo.title')"
      :pageTitle="$t('calendar.seo.pageTitle')"
      :description="$t('calendar.seo.description')"
      :keywords="$t('calendar.seo.keywords')"
    />
    
    <!-- 页面主标题 -->
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 text-center pt-4 md:pt-6">{{ $t('calendar.title') }}</h1>
    
    <!-- 未登录提示 -->
    <div v-if="!userStore.isLoggedIn" class="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl w-full text-center">
        <div class="mb-6">
          <!-- 展示图片 -->
          <div class="mb-6">
            <div class="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8 mb-8">
              <img 
                src="/src/assets/好运日历.jpg" 
                alt="好运日历" 
                class="w-80 h-52 sm:w-96 sm:h-64 object-cover rounded-lg shadow-lg"
              />
              <img 
                src="/src/assets/择日.jpg" 
                alt="择日" 
                class="w-80 h-52 sm:w-96 sm:h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ $t('calendar.unauthed.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-2">{{ $t('calendar.unauthed.subtitle') }}</p>
          <p class="text-sm text-purple-600 dark:text-purple-400">{{ $t('calendar.unauthed.tagline') }}</p>
        </div>
        <div class="space-y-3">
          <Button @click="goToLogin" class="w-full" variant="default">
            {{ $t('auth.login') }}
          </Button>
          <Button @click="goToRegister" class="w-full" variant="outline">
            {{ $t('auth.register') }}
          </Button>
        </div>
      </div>
    </div>

    <!-- 已登录内容 -->
    <div v-else class="p-3 md:p-4">
      <!-- 功能区，响应式布局 -->
      <div class="w-full h-full">
        <!-- 右侧整体区域 -->
        <div class="w-full h-full bg-white dark:bg-gray-800">
          <div class="flex flex-col xl:flex-row h-full gap-4 xl:gap-6">
            <!-- 左侧区域：小日历和运势信息 -->
            <div class="w-full xl:w-80 flex flex-col">
              <!-- 小日历 -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 mb-4">
                <div class="flex items-center justify-between mb-2">
                  <Button variant="ghost" size="sm" @click="changeMonth(-1)" class="h-10 w-10 p-0 md:h-6 md:w-6">‹</Button>
                  <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {{ currentMonthLabel }}
                  </h3>
                  <Button variant="ghost" size="sm" @click="changeMonth(1)" class="h-10 w-10 p-0 md:h-6 md:w-6">›</Button>
                </div>
                
                <!-- 小日历网格 -->
                <div class="grid grid-cols-7 gap-1">
                  <!-- 星期标题 -->
                  <div v-for="day in weekDays" :key="day" class="text-center text-xs text-gray-500 dark:text-gray-300 py-0.5">
                    {{ day.charAt(0) }}
                  </div>
                  <!-- 日期格子 -->
                  <div
                    v-for="day in calendarDays"
                    :key="day.date"
                    @click="selectDate(day.date)"
                    class="relative h-7 w-7 text-xs cursor-pointer transition-colors flex items-center justify-center rounded"
                    :class="[
                      day.date === selectedDate ? 'bg-blue-500 text-white' : '',
                      !day.isCurrentMonth ? 'text-gray-400' : '',
                      recommendedDays.includes(day.date) ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : '',
                      day.date === todayStr ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' : '',
                      day.date !== selectedDate ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''
                    ]"
                  >
                    {{ day.dayOfMonth }}
                    <!-- 推荐标记 -->
                    <div
                      v-if="recommendedDays.includes(day.date)"
                      class="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 运势信息 -->
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 flex-1">
                <!-- 日期信息显示 - 作为运势模块的头部 -->
                <div class="mb-2 p-2 bg-white/30 dark:bg-gray-800/30 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <div class="grid grid-cols-1 gap-2 text-xs">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600 dark:text-gray-400">{{ $t('calendar.labels.gregorian') }}</span>
                      <span class="font-medium text-gray-800 dark:text-gray-200">{{ selectedDateInfo.solar }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600 dark:text-gray-400">{{ $t('calendar.labels.lunar') }}</span>
                      <span class="font-medium text-gray-800 dark:text-gray-200">{{ selectedDateInfo.lunar }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600 dark:text-gray-400">{{ $t('calendar.labels.ganzhi') }}</span>
                      <span class="font-medium text-gray-800 dark:text-gray-200">{{ selectedDateInfo.ganzhi }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- 运势数据显示 -->
                <div v-if="fortuneData">
                  <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ $t('calendar.labels.score') }}</h4>
                  <div class="flex items-center space-x-1">
                    <span class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ fortuneData.overallScore }}</span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">分</span>
                  </div>
                </div>

                <p class="text-xs text-gray-700 dark:text-gray-300 mb-2">{{ fortuneData.overallDesc }}</p>

                <!-- 运势评分网格 -->
                <div class="grid grid-cols-4 gap-1 mb-3">
                  <div v-for="field in scoreFields" :key="field.key" class="text-center">
                    <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ field.label }}</div>
                    <div class="text-sm font-semibold" :class="getPurposeScoreColor(fortuneData[field.key])">
                      {{ fortuneData[field.key] }}
                    </div>
                  </div>
                </div>

                <!-- 今日建议和忌讳 -->
                <div class="space-y-2">
                  <div v-if="fortuneData.advice?.length">
                    <h5 class="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">{{ $t('calendar.labels.adviceTitle') }}</h5>
                    <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      <li v-for="item in fortuneData.advice" :key="item" class="flex items-start">
                        <span class="text-green-500 mr-1">•</span>
                        <span class="flex-1">{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                  <div v-if="fortuneData.avoid?.length">
                    <h5 class="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">{{ $t('calendar.labels.avoidTitle') }}</h5>
                    <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      <li v-for="item in fortuneData.avoid" :key="item" class="flex items-start">
                        <span class="text-red-500 mr-1">•</span>
                        <span class="flex-1">{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                </div>
                
                <!-- 无运势数据时的提示 -->
                <div v-else class="text-center py-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('calendar.labels.emptyPrompt') }}</p>
                </div>
                
                <!-- 事项选择 -->
                <div class="mt-3">
                  <div class="font-bold text-sm mb-2">{{ $t('calendar.labels.choosePurpose') }}</div>
                  <div class="grid grid-cols-3 gap-1 mb-2">
                    <Button
                      v-for="item in purposes"
                      :key="item.key"
                      :variant="selectedPurpose === item.key ? 'secondary' : 'outline'"
                      class="text-xs h-9 md:h-7"
                      @click="selectPurpose(item.key)"
                    >
                      {{ item.label }}
                    </Button>
                  </div>
                  <!-- 择日推荐按钮 -->
                  <Button 
                    variant="default" 
                    @click="handleRecommend" 
                    :disabled="!selectedPurpose" 
                    class="w-full px-6 py-2 text-sm font-medium mt-2"
                  >
                    {{ $t('calendar.labels.recommendButton') }}
                  </Button>
                </div>
              </div>
            </div>

            <!-- 右侧区域：展开的大日历 -->
            <div class="flex-1">
              <div class="flex items-center justify-center mb-3">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {{ currentMonthLabel }}{{ $t('calendar.labels.monthHeadingSuffix') }}
                </h2>
              </div>

              <!-- 大日历表格 -->
              <div class="grid grid-cols-7 gap-1 md:gap-1 lg:gap-2">
                <!-- 星期标题 -->
                <div v-for="day in weekDays" :key="day" class="text-center text-xs md:text-sm font-medium text-gray-500 dark:text-gray-300 py-1.5 md:py-2">
                  {{ day }}
                </div>
                <!-- 日期格子 -->
                <div
                  v-for="day in calendarDays"
                  :key="day.date"
                  @click="selectDate(day.date)"
                  class="relative border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex flex-col items-center justify-center p-1 md:p-1.5 rounded"
                  :class="[
                    day.date === selectedDate ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:border-blue-500' : '',
                    !day.isCurrentMonth ? 'text-gray-400' : '',
                    recommendedDays.includes(day.date) ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-500' : '',
                    day.date === todayStr ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-500' : ''
                  ]"
                >
                  <span class="text-sm md:text-base font-medium mb-0.5">{{ day.dayOfMonth }}</span>
                  
                  <!-- 择日评分显示 -->
                  <div v-if="selectedPurpose && day.isCurrentMonth && getPurposeScore(day.date) > 0" class="text-center mt-0.5">
                    <span
                      class="text-[10px] md:text-xs font-bold px-1 py-0.5 rounded"
                      :class="[
                        getPurposeScoreColor(getPurposeScore(day.date)),
                        getPurposeScore(day.date) >= 65 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                      ]"
                    >
                      {{ getPurposeScore(day.date) }}{{ $t('calendar.labels.points') }}
                    </span>
                  </div>
                  
                  <!-- 吉日标记 -->
                  <div
                    v-if="recommendedDays.includes(day.date) && day.isCurrentMonth"
                    class="absolute top-1 right-1 text-red-600 font-bold text-xs"
                  >
                    {{ $t('calendar.labels.luckyTag') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <!-- 登录/信息不全弹窗 -->
      <Modal
        :show="showModal"
        :title="$t('calendar.modal.title')"
        :message="modalMsg"
        :confirmText="modalType === 'incomplete' ? $t('calendar.modal.goComplete') : $t('calendar.modal.confirm')"
        :cancelText="modalType === 'incomplete' ? $t('common.cancel') : ''"
        :onConfirm="modalType === 'incomplete' ? handleGoProfile : () => (showModal = false)"
        :onCancel="() => (showModal = false)"
      >
        <template #icon>
          <!-- 使用自定义9.png图标替换默认加号 -->
          <img src="@/assets/9.png" :alt="$t('sidebar.logoAlt')" class="mx-auto mb-4 w-12 h-12 rounded-full shadow" />
      </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Modal from '@/components/ui/Modal.vue'
import { useUserStore } from '@/stores/user'
import SEO from '@/components/SEO.vue'
import { fetchFortuneAnalysis, analyzeFortuneRange } from '@/api/bazi'
import { useRouter } from 'vue-router'
// @ts-ignore
import { Lunar, Solar } from 'lunar-javascript'
import { i18n } from '@/i18n'

// 事项类型（国际化）
const purposes = computed(() => [
  { key: 'career', label: i18n.global.t('calendar.purposes.career') },
  { key: 'love', label: i18n.global.t('calendar.purposes.love') },
  { key: 'travel', label: i18n.global.t('calendar.purposes.travel') },
  { key: 'exam', label: i18n.global.t('calendar.purposes.exam') },
  { key: 'wealth', label: i18n.global.t('calendar.purposes.wealth') }
])
const selectedPurpose = ref('')

// 事项类型与API字段映射
const purposeFieldMap: Record<string, string> = {
  career: 'career',
  love: 'love',
  travel: 'travel',
  exam: 'contract', // "考试"对应API的contract字段
  wealth: 'wealth'
}

// 日历相关
const todayStr = dayjs().format('YYYY-MM-DD')
const selectedDate = ref(todayStr)
const currentMonth = ref(dayjs())
const weekDays = computed(() => [
  i18n.global.t('calendar.weekdays.sun'),
  i18n.global.t('calendar.weekdays.mon'),
  i18n.global.t('calendar.weekdays.tue'),
  i18n.global.t('calendar.weekdays.wed'),
  i18n.global.t('calendar.weekdays.thu'),
  i18n.global.t('calendar.weekdays.fri'),
  i18n.global.t('calendar.weekdays.sat')
])

const calendarDays = computed(() => {
  const firstDay = currentMonth.value.startOf('month')
  const lastDay = currentMonth.value.endOf('month')
  const start = firstDay.subtract(firstDay.day(), 'day')
  const days = []
  let d = start
  for (let i = 0; i < 42; i++) {
    days.push({
      date: d.format('YYYY-MM-DD'),
      dayOfMonth: d.date(),
      isCurrentMonth: d.month() === currentMonth.value.month()
    })
    d = d.add(1, 'day')
  }
  return days
})
const currentMonthLabel = computed(() => {
  const locale = i18n.global.locale.value
  return locale === 'zh-CN'
    ? currentMonth.value.format('YYYY年M月')
    : currentMonth.value.format('MMMM YYYY')
})

// 选中日期的详细信息
const selectedDateInfo = computed(() => {
  const date = dayjs(selectedDate.value)
  const solar = Solar.fromYmd(date.year(), date.month() + 1, date.date())
  const lunar = solar.getLunar()
  
  return {
    solar: date.format('YYYY年M月D日 dddd'),
    lunar: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    ganzhi: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日`
  }
})

function changeMonth(delta: number) {
  currentMonth.value = currentMonth.value.add(delta, 'month')
  // 切换月份时清空当前数据并重新获取
  if (selectedPurpose.value) {
    const monthKey = currentMonth.value.format('YYYY-MM')
    if (!monthlyFortuneCache.value[monthKey]) {
      // 如果新月份没有缓存数据，清空显示
      fortuneScores.value = {}
      recommendedDays.value = []
    } else {
      // 如果有缓存数据，重新处理
      processMonthlyData(monthlyFortuneCache.value[monthKey])
    }
  }
}
function selectDate(date: string) {
  selectedDate.value = date
  fetchFortune(date)
}

// 用户与API
const userStore = useUserStore()
const router = useRouter()
const showModal = ref(false)
const modalMsg = ref('')
const modalType = ref<'info' | 'incomplete'>('info') // 弹窗类型

// 推荐日高亮
const recommendedDays = ref<string[]>([])
const isRecommending = ref(false) // 择日推荐loading状态

// 月度运势数据缓存
const monthlyFortuneCache = ref<Record<string, any>>({})
const fortuneScores = ref<Record<string, Record<string, number>>>({})

// 运势数据
const fortuneData = ref<any>(null)

// 评分字段与标签（国际化）
const scoreFields = computed(() => [
  { key: 'career', label: i18n.global.t('calendar.scoreFields.career'), icon: '💼' },
  { key: 'love', label: i18n.global.t('calendar.scoreFields.love'), icon: '💝' },
  { key: 'wealth', label: i18n.global.t('calendar.scoreFields.wealth'), icon: '💰' },
  { key: 'luck', label: i18n.global.t('calendar.scoreFields.luck'), icon: '🌟' },
  { key: 'mood', label: i18n.global.t('calendar.scoreFields.mood'), icon: '😊' },
  { key: 'travel', label: i18n.global.t('calendar.scoreFields.travel'), icon: '✈️' },
  { key: 'friend', label: i18n.global.t('calendar.scoreFields.friend'), icon: '👫' },
  { key: 'entertainment', label: i18n.global.t('calendar.scoreFields.entertainment'), icon: '🎮' }
])

// 评分描述与建议
function getOverallDesc(score: number) {
  if (score >= 90) return i18n.global.t('calendar.overall.excellent')
  if (score >= 75) return i18n.global.t('calendar.overall.good')
  if (score >= 60) return i18n.global.t('calendar.overall.stable')
  if (score >= 40) return i18n.global.t('calendar.overall.low')
  return i18n.global.t('calendar.overall.veryLow')
}
function generateAdvice(data: any) {
  return [
    data.wealth > 70 && i18n.global.t('calendar.advice.investSmall'),
    data.career > 65 && i18n.global.t('calendar.advice.grabOpportunity'),
    data.love > 60 && i18n.global.t('calendar.advice.arrangeDate'),
    data.travel > 60 && i18n.global.t('calendar.advice.planShortTrip'),
    data.luck > 80 && i18n.global.t('calendar.advice.visitBenefactor'),
    data.mood > 70 && i18n.global.t('calendar.advice.stayPositive')
  ].filter(Boolean).slice(0, 3)
}
function generateAvoid(data: any) {
  return [
    data.wealth < 50 && i18n.global.t('calendar.avoid.highRiskInvest'),
    data.career < 50 && i18n.global.t('calendar.avoid.conflictWithSuperior'),
    data.love < 40 && i18n.global.t('calendar.avoid.emotionalConflict'),
    data.travel < 40 && i18n.global.t('calendar.avoid.longTrip'),
    data.mood < 40 && i18n.global.t('calendar.avoid.majorDecisions')
  ].filter(Boolean).slice(0, 3)
}

// 获取八字分析参数
function getBaziParams(date: string): {
  birth_datetime: string
  current_datetime: string
  gender: '男' | '女'
  analysis_parts: never[]
} | null {
  console.log('=== getBaziParams 调试 ===')
  const user = userStore.user
  console.log('用户信息:', user)
  
  const requiredFields = ['birth_year', 'birth_month', 'birth_day', 'birth_time', 'gender']
  const missingFields = requiredFields.filter(field => !user?.[field as keyof typeof user])
  
  if (!user || missingFields.length > 0) {
    console.log('缺少必要字段:', missingFields)
    console.log('用户对象存在:', !!user)
    return null
  }
  
  // 明确类型推断，保证 gender 为 '男' | '女'
  let gender: '男' | '女' = '女'
  if (user.gender === '男' || user.gender === 'male') gender = '男'
  else if (user.gender === '女' || user.gender === 'female') gender = '女'
  
  const params = {
    birth_datetime: `${user.birth_year}-${String(user.birth_month).padStart(2, '0')}-${String(user.birth_day).padStart(2, '0')} ${user.birth_time}:00`,
    current_datetime: `${date} 00:00:00`,
    gender,
    analysis_parts: []
  }
  
  console.log('八字参数构建完成:', params)
  return params
}

// 获取单日运势（调用后端API）
async function fetchFortune(date: string) {
  console.log('=== fetchFortune 开始调试 ===')
  console.log('1. 检查用户token:', userStore.token ? '存在' : '不存在')
  console.log('2. token值:', userStore.token)
  console.log('3. 用户登录状态:', userStore.isLoggedIn)
  console.log('4. 用户信息完整性:', userStore.user ? '用户信息存在' : '用户信息为空')
  console.log('5. 用户详细信息:', userStore.user)
  console.log('6. localStorage token:', localStorage.getItem('access_token'))
  console.log('🔍 开始获取运势数据:', { date, token: !!userStore.token, user: userStore.user, isLoggedIn: userStore.isLoggedIn })
  
  if (!userStore.isLoggedIn) {
    console.log('❌ 用户未登录或token已过期')
    console.log('提示：请先登录以获取运势数据')
    // 显示友好的提示信息
    fortuneData.value = {
      overallScore: 0,
      overallDesc: i18n.global.t('calendar.fallback.overallDesc'),
      career: 0,
      love: 0,
      wealth: 0,
      luck: 0,
      mood: 0,
      travel: 0,
      friend: 0,
      entertainment: 0,
      advice: [i18n.global.t('calendar.fallback.advice1')],
      avoid: [i18n.global.t('calendar.fallback.avoid1')]
    }
    return;
  }
  
  console.log('✅ 用户已登录，开始准备API请求')
  
  console.log('✅ 用户已登录，token存在')
  console.log('3. 检查用户信息:', userStore.user)
  
  const params = getBaziParams(date)
  console.log('4. 八字参数:', params)
  if (!params) {
    console.log('❌ 八字信息不完整:', userStore.user)
    console.log('八字信息不完整，退出函数')
    modalMsg.value = i18n.global.t('calendar.modal.incompleteBazi');
    showModal.value = true;
    fortuneData.value = null;
    return;
  }
  
  console.log('✅ 八字信息完整，准备调用API:', params)
  
  const requestBody = {
    birth_datetime: params.birth_datetime,
    current_datetime: params.current_datetime,
    gender: params.gender
  }
  console.log('5. API请求参数:', requestBody)
  
  // params.gender 已经是 '男' | '女' 类型，无需断言
  try {
    // 调用后端API获取运势数据
    console.log('📡 调用fetchFortuneAnalysis API...')
    console.log('6. 开始发送API请求...')
    const res = await fetchFortuneAnalysis(requestBody)
    
    console.log('📡 API响应:', res)
    console.log('7. API响应结果:', res)
    
    if (res.success && res.data?.data) {
      const d = res.data.data
      console.log('✅ 运势数据获取成功:', d)
      
      // 只取页面需要的字段
      const values = [
        d.career, d.love, d.wealth, d.luck, d.mood, d.travel, d.friend, d.entertainment
      ].map(v => typeof v === 'number' ? v : 0)
      const overallScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      
      fortuneData.value = {
        ...d,
        overallScore,
        overallDesc: getOverallDesc(overallScore),
        advice: generateAdvice(d),
        avoid: generateAvoid(d)
      }
      
      console.log('✅ 运势数据处理完成:', fortuneData.value)
      console.log('8. 运势数据设置成功:', fortuneData.value)
    } else {
      console.log('❌ API返回失败:', res)
      console.error('获取运势失败:', res.message)
      console.log('9. 失败响应详情:', res)
      fortuneData.value = null
      modalMsg.value = res.message || i18n.global.t('calendar.errors.fetchFailed')
      showModal.value = true
    }
  } catch (e: any) {
    console.error('❌ API调用异常:', e)
    console.error('获取运势出错:', e)
    console.log('10. 错误详情:', {
      message: e.message,
      status: e.status,
      statusText: e.statusText,
      data: e.data
    })
    fortuneData.value = null
    modalMsg.value = i18n.global.t('calendar.errors.fetchFailed')
    showModal.value = true
  } finally {
    console.log('=== fetchFortune 调试结束 ===')
  }
}
// 择日推荐 - 使用新的fortune_range API
async function handleRecommend() {
  console.log('=== handleRecommend 开始调试 ===')
  console.log('1. 用户点击择日推荐按钮')
  console.log('2. 当前选择的事项:', selectedPurpose.value)
  
  if (!selectedPurpose.value) {
    modalMsg.value = i18n.global.t('calendar.modal.selectPurpose')
    modalType.value = 'info'
    showModal.value = true
    return
  }
  
  console.log('3. 获取八字参数...')
  const params = getBaziParams(todayStr)
  console.log('4. 八字参数:', params)
  
  if (!params) {
    console.log('八字信息不完整，退出函数')
    modalMsg.value = i18n.global.t('calendar.modal.incompleteBazi');
    modalType.value = 'incomplete';
    showModal.value = true;
    return;
  }
  
  isRecommending.value = true // 开始loading
  console.log('5. 开始择日推荐流程...')
  
  try {
    // 获取当前显示月份的数据
    const monthKey = currentMonth.value.format('YYYY-MM')
    console.log('6. 当前月份:', monthKey)
    
    // 检查缓存
    if (monthlyFortuneCache.value[monthKey]) {
      console.log('7. 使用缓存数据')
      processMonthlyData(monthlyFortuneCache.value[monthKey])
    } else {
      console.log('8. 获取新数据')
      await fetchMonthlyFortune(monthKey, params)
    }
    
  } catch (e) {
    console.error('14. 择日推荐过程出错:', e)
    modalMsg.value = i18n.global.t('calendar.modal.recommendFail')
    modalType.value = 'info';
    showModal.value = true;
  } finally {
    isRecommending.value = false // 结束loading
    console.log('=== handleRecommend 调试结束 ===')
  }
}

// 获取月度运势数据
async function fetchMonthlyFortune(monthKey: string, params: any) {
  const startDate = currentMonth.value.startOf('month').format('YYYY-MM-DD')
  const endDate = currentMonth.value.endOf('month').format('YYYY-MM-DD')
  
  console.log('9. 请求月度数据:', { startDate, endDate })
  
  const requestBody = {
    birth_datetime: params.birth_datetime.replace(' ', 'T'),
    start_date: startDate,
    end_date: endDate,
    gender: params.gender
  }
  
  console.log('10. 请求参数:', requestBody)
  
  try {
    // 调用新的fortune_range API
    const data = await analyzeFortuneRange(requestBody)
    console.log('11. API响应:', data)
    
    // 缓存数据
    monthlyFortuneCache.value[monthKey] = data
    
    // 处理数据
    processMonthlyData(data)
    
  } catch (error) {
    console.error('获取月度运势数据失败:', error)
    throw error
  }
}

// 处理月度数据
function processMonthlyData(data: any) {
  console.log('12. 处理月度数据:', data)
  
  // 清空之前的数据
  fortuneScores.value = {}
  recommendedDays.value = []
  
  // 处理每日数据
  if (Array.isArray(data)) {
    data.forEach((dayData: any) => {
      if (dayData.date && dayData.fortune?.data) {
        const date = dayData.date
        const scores = dayData.fortune.data
        
        // 存储每日各项分数
        fortuneScores.value[date] = scores
        
        // 检查当前选择事项的分数
        const field = purposeFieldMap[selectedPurpose.value]
        const score = scores[field] || 0
        
        // 65分以上标记为吉日
        if (score >= 65) {
          recommendedDays.value.push(date)
        }
      }
    })
  }
  
  console.log('13. 处理完成，吉日:', recommendedDays.value)
  console.log('14. 分数数据:', fortuneScores.value)
  
  // 显示结果
  const luckyDays = recommendedDays.value
  if (luckyDays.length === 0) {
    const label = purposes.value.find(p => p.key === selectedPurpose.value)?.label || ''
    modalMsg.value = i18n.global.t('calendar.month.noLucky', { label })
    modalType.value = 'info'
    showModal.value = true
  } else {
    const luckyDaysWithScores = luckyDays.map(date => {
      const score = fortuneScores.value[date]?.[purposeFieldMap[selectedPurpose.value]] || 0
      return `${date} (${score}${i18n.global.t('calendar.labels.points')})`
    })
    const label = purposes.value.find(p => p.key === selectedPurpose.value)?.label || ''
    modalMsg.value = i18n.global.t('calendar.month.luckyListTitle', { label }) + '\n' + luckyDaysWithScores.join('\n')
    modalType.value = 'info'
    showModal.value = true
  }
}

// 获取择日评分
function getPurposeScore(date: string): number {
  if (!selectedPurpose.value || !fortuneScores.value[date]) return 0
  const field = purposeFieldMap[selectedPurpose.value]
  return fortuneScores.value[date][field] || 0
}

// 获取择日评分颜色
function getPurposeScoreColor(score: number): string {
  if (score >= 80) return 'text-red-500'
  if (score >= 70) return 'text-orange-500'
  if (score >= 65) return 'text-purple-500'
  return 'text-gray-500'
}

function selectPurpose(key: string) {
  selectedPurpose.value = key
  // 重新计算推荐日期
  updateRecommendedDays()
}

// 更新推荐日期
function updateRecommendedDays() {
  if (!selectedPurpose.value) {
    recommendedDays.value = []
    return
  }
  
  const field = purposeFieldMap[selectedPurpose.value]
  recommendedDays.value = []
  
  Object.keys(fortuneScores.value).forEach(date => {
    const score = fortuneScores.value[date][field] || 0
    if (score >= 65) {
      recommendedDays.value.push(date)
    }
  })
}

function handleGoProfile() {
  showModal.value = false
  router.push('/profile')
}

function goLogin() {
  router.push('/login')
}

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}

// 页面初始化
async function initPage() {
  console.log('=== initPage 开始调试 ===')
  console.log('🚀 页面初始化，开始获取运势数据')
  console.log('1. 当前用户token:', userStore.token ? '存在' : '不存在')
  console.log('2. 当前用户信息:', userStore.user)
  console.log('3. localStorage token:', localStorage.getItem('access_token'))
  
  // 如果localStorage有token但store没有，尝试初始化用户状态
  const localToken = localStorage.getItem('access_token')
  if (localToken && !userStore.token) {
    console.log('4. 发现localStorage有token但store未初始化，尝试初始化用户状态')
    try {
      userStore.init()
      console.log('5. 用户状态初始化完成:', {
        isLoggedIn: userStore.isLoggedIn,
        token: userStore.token,
        user: userStore.user
      })
      
      // 如果token有效但用户信息为空，获取用户信息
      if (userStore.token && !userStore.user) {
        console.log('5.1. 获取用户信息...')
        await userStore.fetchUser()
        console.log('5.2. 用户信息获取完成:', userStore.user)
      }
    } catch (error) {
      console.error('6. 用户状态初始化失败:', error)
    }
  }
  
  // 确保用户信息已加载
  if (userStore.token && !userStore.user) {
    console.log('🔄 用户已登录但信息未加载，正在获取用户信息...')
    console.log('7. 开始获取用户信息...')
    await userStore.fetchUser()
    console.log('8. 用户信息获取完成:', userStore.user)
  }
  
  console.log('9. 开始获取运势数据，选中日期:', selectedDate.value)
  await fetchFortune(selectedDate.value)
  console.log('=== initPage 调试结束 ===')
}

// 监听选中日期变化
watch(selectedDate, (newDate) => {
  console.log('=== watch selectedDate 开始调试 ===')
  console.log('📅 选中日期变化:', newDate)
  console.log('1. 新选中的日期:', newDate)
  fetchFortune(newDate)
  console.log('=== watch selectedDate 调试结束 ===')
})

// 页面挂载时初始化
onMounted(async () => {
  console.log('=== onMounted 开始调试 ===')
  console.log('页面已挂载，开始初始化...')
  
  // 检查localStorage中的token
  const localToken = localStorage.getItem('access_token')
  console.log('localStorage中的token:', localToken ? '存在' : '不存在')
  if (localToken) {
    console.log('localStorage token值:', localToken.substring(0, 20) + '...')
  }
  
  // 初始化用户store
  console.log('初始化用户store...')
  userStore.init()
  console.log('用户store初始化完成，token:', userStore.token ? '存在' : '不存在')
  
  if (userStore.token) {
    console.log('发现token，获取用户信息...')
    try {
      await userStore.fetchUser()
      console.log('用户信息获取完成，开始初始化页面')
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  } else {
    console.log('未发现token，直接初始化页面')
  }
  
  // 等待用户信息加载完成后再初始化页面
  await initPage()
  
  console.log('=== onMounted 调试结束 ===')
})
</script>

<style scoped>
@media (max-width: 640px) {
  .max-w-xl {
    max-width: 100vw !important;
  }
}
</style>
