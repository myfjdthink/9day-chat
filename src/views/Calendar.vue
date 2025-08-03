<template>
  <div class="flex flex-col items-center min-h-screen bg-white dark:bg-gray-900 px-2 py-4 md:px-4 md:py-8">
    <!-- SEO组件 -->
    <SEO 
      title="择日推荐 - 北斗九号日历"
      description="智能推荐黄道吉日，为重要事项选择最佳时机，趋吉避凶。支持结婚择日、开业择日、搬家择日、出行择日等多种场景。"
      keywords="择日推荐,黄道吉日,结婚择日,开业择日,搬家择日,出行择日,吉日选择,命理择日"
    />
    
    <template v-if="!userStore.token">
      <div class="flex flex-col items-center justify-center gap-6 mt-12">
        <img src="@/assets/择日.jpg" alt="择日" class="w-80 max-w-full rounded-xl shadow" />
        <img src="@/assets/好运日历.jpg" alt="好运日历" class="w-80 max-w-full rounded-xl shadow" />
        <Button class="mt-6 px-8 py-3 text-lg font-bold bg-[#b67fda] text-white rounded-lg shadow hover:bg-[#a06cc7]" @click="goLogin">
          获取个人好运日历
        </Button>
      </div>
    </template>
    <template v-else>
      <!-- 功能区，紧凑布局 -->
      <div class="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow p-2 md:p-4 mb-4">
        <!-- 事项选择与择日推荐 -->
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <Button
            v-for="item in purposes"
            :key="item.key"
            :variant="selectedPurpose === item.key ? 'secondary' : 'outline'"
            class="flex-1 min-w-[80px] text-xs md:text-sm h-8 md:h-10 px-2 md:px-4"
            @click="selectPurpose(item.key)"
          >
            {{ item.label }}
          </Button>
          <Button variant="default" @click="handleRecommend" :disabled="!selectedPurpose" class="h-8 md:h-10 px-3 md:px-6 text-xs md:text-sm">择日推荐</Button>
        </div>
        <!-- 日历组件 -->
        <div class="mb-2 md:mb-3">
          <div class="flex items-center justify-between mb-0.5 md:mb-1">
            <span class="font-bold text-sm md:text-base">{{ currentMonthLabel }}</span>
            <div>
              <Button variant="ghost" size="sm" @click="changeMonth(-1)" class="h-6 w-6 md:h-7 md:w-7 p-0">‹</Button>
              <Button variant="ghost" size="sm" @click="changeMonth(1)" class="h-6 w-6 md:h-7 md:w-7 p-0">›</Button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-0.5 text-center text-[11px] md:text-xs text-gray-500 dark:text-gray-300 mb-0.5">
            <div v-for="d in weekDays" :key="d">{{ d }}</div>
          </div>
          <div class="grid grid-cols-7 gap-0.5">
            <div
              v-for="day in calendarDays"
              :key="day.date"
              :class="[
                'rounded-md cursor-pointer select-none transition-all flex flex-col items-center justify-center text-[13px] md:text-base min-h-[22px] md:min-h-[28px] aspect-square',
                day.isCurrentMonth ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900 opacity-60',
                day.date === selectedDate && day.date !== todayStr ? 'text-[#0b3289] font-bold bg-[#e6eaf6]' : '',
                recommendedDays.includes(day.date) ? 'ring-2 ring-green-400' : '',
                day.date === todayStr ? 'border border-[#b67fda]' : ''
              ]"
              @click="selectDate(day.date)"
            >
              <div :class="[
                'flex-1 flex items-center justify-center w-full h-full',
                day.date === todayStr ? 'text-[#b67fda] font-bold' : '',
                day.date === selectedDate && day.date !== todayStr ? 'text-[#0b3289] font-bold' : ''
              ]">
                {{ day.dayOfMonth }}
              </div>
              <div v-if="recommendedDays.includes(day.date)" class="text-[9px] text-green-500 leading-none">吉</div>
              <div v-if="day.date === todayStr" class="text-[9px] text-[#b67fda] leading-none">今</div>
            </div>
          </div>
        </div>
        <!-- 运势预览区 -->
        <Card v-if="fortuneData">
          <div class="p-2 md:p-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-1 md:mb-2 gap-1">
              <div class="font-bold text-base md:text-lg">{{ selectedDate }} 运势总览</div>
              <div class="text-[#b67fda] font-bold text-base md:text-lg">综合评分 {{ fortuneData.overallScore }}%</div>
            </div>
            <div class="mb-1 md:mb-2 text-gray-600 dark:text-gray-300 text-xs md:text-base">{{ fortuneData.overallDesc }}</div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
              <div v-for="item in coreFields" :key="item.key" class="bg-gray-50 dark:bg-gray-900 rounded p-1 md:p-2 flex flex-col items-center">
                <div class="text-lg md:text-2xl">{{ item.icon }}</div>
                <div class="font-bold text-xs md:text-base text-gray-900 dark:text-gray-100">{{ item.label }}</div>
                <div class="text-[#b67fda] font-bold text-xs md:text-base">{{ fortuneData[item.key] }}%</div>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
              <div v-for="item in otherFields" :key="item.key" class="bg-gray-50 dark:bg-gray-900 rounded p-1 md:p-2 flex flex-col items-center">
                <div class="text-lg md:text-2xl">{{ item.icon }}</div>
                <div class="font-bold text-xs md:text-base text-gray-900 dark:text-gray-100">{{ item.label }}</div>
                <div class="text-[#b67fda] font-bold text-xs md:text-base">{{ fortuneData[item.key] }}%</div>
              </div>
            </div>
            <div class="mt-2 md:mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <Card>
                <div class="p-1 md:p-2">
                  <div class="font-bold mb-0.5 md:mb-1 text-green-600 dark:text-green-400 text-xs md:text-base">今日建议</div>
                  <ul class="list-disc pl-4 md:pl-5 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                    <li v-for="(advice, idx) in fortuneData.advice" :key="idx">{{ advice }}</li>
                    <li v-if="!fortuneData.advice.length" class="text-gray-400 dark:text-gray-500">暂无特别建议</li>
                  </ul>
                </div>
              </Card>
              <Card>
                <div class="p-1 md:p-2">
                  <div class="font-bold mb-0.5 md:mb-1 text-red-500 dark:text-red-400 text-xs md:text-base">忌讳事项</div>
                  <ul class="list-disc pl-4 md:pl-5 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                    <li v-for="(taboo, idx) in fortuneData.avoid" :key="idx">{{ taboo }}</li>
                    <li v-if="!fortuneData.avoid.length" class="text-gray-400 dark:text-gray-500">今日无特别忌讳</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
      <!-- 登录/信息不全弹窗 -->
      <Modal
        :show="showModal"
        title="提示"
        :message="modalMsg"
        :confirmText="modalType === 'incomplete' ? '去完善' : '确定'"
        :cancelText="modalType === 'incomplete' ? '取消' : ''"
        :onConfirm="modalType === 'incomplete' ? handleGoProfile : () => (showModal = false)"
        :onCancel="() => (showModal = false)"
      >
        <template #icon>
          <!-- 使用自定义9.png图标替换默认加号 -->
          <img src="@/assets/9.png" alt="icon" class="mx-auto mb-4 w-12 h-12 rounded-full shadow" />
        </template>
      </Modal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Modal from '@/components/ui/Modal.vue'
import { useUserStore } from '@/stores/user'
import SEO from '@/components/SEO.vue'
import { fetchFortuneAnalysis } from '@/api/bazi'
import { useRouter } from 'vue-router'

// 事项类型
const purposes = [
  { key: 'career', label: '事业' },
  { key: 'love', label: '情感' },
  { key: 'travel', label: '出行' },
  { key: 'exam', label: '考试' },
  { key: 'wealth', label: '投资' }
]
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
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

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
const currentMonthLabel = computed(() => currentMonth.value.format('YYYY年M月'))
function changeMonth(delta: number) {
  currentMonth.value = currentMonth.value.add(delta, 'month')
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

// 运势数据
const fortuneData = ref<any>(null)

// 评分字段与标签
const coreFields = [
  { key: 'career', label: '事业', icon: '💼' },
  { key: 'love', label: '情感', icon: '💝' },
  { key: 'wealth', label: '财富', icon: '💰' },
  { key: 'luck', label: '贵人', icon: '🌟' }
]
const otherFields = [
  { key: 'mood', label: '心情', icon: '😊' },
  { key: 'travel', label: '出行', icon: '✈️' },
  { key: 'friend', label: '朋友', icon: '👫' },
  { key: 'entertainment', label: '娱乐', icon: '🎮' }
]

// 评分描述与建议
function getOverallDesc(score: number) {
  if (score >= 90) return '运势极佳，宜大胆进取，扩展事业版图';
  if (score >= 75) return '运势优异，适合把握机会，开展新事物';
  if (score >= 60) return '运势平稳，可以按部就班推进计划';
  if (score >= 40) return '运势偏低，宜静观其变，做好风险防范';
  return '今日运势较低，建议谨慎行事，避免重大决策';
}
function generateAdvice(data: any) {
  return [
    data.wealth > 70 && '适合进行小额投资理财',
    data.career > 65 && '主动争取工作表现机会',
    data.love > 60 && '适合安排浪漫约会',
    data.travel > 60 && '适合计划短途旅行',
    data.luck > 80 && '适合拜会贵人寻求帮助',
    data.mood > 70 && '保持积极心态，迎接挑战'
  ].filter(Boolean).slice(0, 3)
}
function generateAvoid(data: any) {
  return [
    data.wealth < 50 && '避免高风险投资',
    data.career < 50 && '避免与上级正面冲突',
    data.love < 40 && '减少情感冲突，避免误会',
    data.travel < 40 && '长途出行建议改期',
    data.mood < 40 && '减少重大决策避免情绪化'
  ].filter(Boolean).slice(0, 3)
}

// 获取八字分析参数
function getBaziParams(date: string): {
  birth_datetime: string
  current_datetime: string
  gender: '男' | '女'
  analysis_parts: never[]
} | null {
  const user = userStore.user
  if (!user || !user.birth_year || !user.birth_month || !user.birth_day || !user.birth_time || !user.gender) {
    return null
  }
  // 明确类型推断，保证 gender 为 '男' | '女'
  let gender: '男' | '女' = '女'
  if (user.gender === '男' || user.gender === 'male') gender = '男'
  else if (user.gender === '女' || user.gender === 'female') gender = '女'
  return {
    birth_datetime: `${user.birth_year}-${String(user.birth_month).padStart(2, '0')}-${String(user.birth_day).padStart(2, '0')} ${user.birth_time}:00`,
    current_datetime: `${date} 00:00:00`,
    gender,
    analysis_parts: []
  }
}

// 获取单日运势（调用后端API）
async function fetchFortune(date: string) {
  if (!userStore.token) {
    modalMsg.value = '请先登录后使用好运日历功能';
    showModal.value = true;
    fortuneData.value = null;
    return;
  }
  const params = getBaziParams(date)
  if (!params) {
    modalMsg.value = '请先在个人信息页面完善您的八字信息';
    showModal.value = true;
    fortuneData.value = null;
    return;
  }
  // params.gender 已经是 '男' | '女' 类型，无需断言
  try {
    // 调用后端API获取运势数据
    const res = await fetchFortuneAnalysis({
      birth_datetime: params.birth_datetime,
      current_datetime: params.current_datetime,
      gender: params.gender
    })
    if (res.success && res.data?.data) {
      const d = res.data.data
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
    } else {
      fortuneData.value = null
      modalMsg.value = res.message || '获取运势数据失败'
      showModal.value = true
    }
  } catch (e) {
    fortuneData.value = null
    modalMsg.value = '获取运势数据失败，请稍后重试'
    showModal.value = true
  }
}
// 择日推荐（调用后端API，循环近七天，增强用户提示）
async function handleRecommend() {
  if (!userStore.token) {
    modalMsg.value = '请先登录后使用择日推荐功能';
    modalType.value = 'incomplete';
    showModal.value = true;
    return;
  }
  if (!selectedPurpose.value) {
    modalMsg.value = '请先选择事项类型';
    modalType.value = 'info';
    showModal.value = true;
    return;
  }
  const params = getBaziParams(todayStr)
  if (!params) {
    modalMsg.value = '请先在个人信息页面完善您的八字信息';
    modalType.value = 'incomplete';
    showModal.value = true;
    return;
  }
  isRecommending.value = true // 开始loading
  try {
    // 近七天并发请求，时间格式需用T分隔
    const days: string[] = []
    for (let i = 0; i < 7; i++) {
      days.push(dayjs(todayStr).add(i, 'day').format('YYYY-MM-DD'))
    }
    const promises = days.map(date =>
      fetchFortuneAnalysis({
        birth_datetime: params.birth_datetime.replace(' ', 'T'),
        current_datetime: `${date}T00:00:00`,
        gender: params.gender
      }).then(res => {
        // 事项key与API字段映射
        const field = purposeFieldMap[selectedPurpose.value]
        return {
          date,
          score: res.success && res.data?.data ? res.data.data[field] ?? 0 : 0
        }
      }).catch(() => ({ date, score: 0 }))
    )
    const results = await Promise.all(promises)
    // 推荐分数大于等于80的日子
    const recommended = results.filter(r => r.score >= 80)
    recommendedDays.value = recommended.map(r => r.date)
    // 日志输出，便于调试
    console.log('推荐吉日:', recommendedDays.value)
    // 增强用户提示
    if (recommended.length === 0) {
      modalMsg.value = '近七天暂无分数高于80的吉日，请尝试更换事项。'
      modalType.value = 'info';
      showModal.value = true;
    } else {
      modalMsg.value = '推荐吉日：\n' + recommended.map(r => `${r.date}（${r.score}分）`).join('\n')
      modalType.value = 'info';
      showModal.value = true;
    }
  } catch (e) {
    modalMsg.value = '获取推荐吉日失败，请稍后重试。'
    modalType.value = 'info';
    showModal.value = true;
  } finally {
    isRecommending.value = false // 结束loading
  }
}

function selectPurpose(key: string) {
  selectedPurpose.value = key
  recommendedDays.value = []
}

function handleGoProfile() {
  showModal.value = false
  router.push('/profile')
}

function goLogin() {
  router.push('/login')
}

// 页面初始化
fetchFortune(selectedDate.value)
</script>

<style scoped>
@media (max-width: 640px) {
  .max-w-xl {
    max-width: 100vw !important;
  }
}
</style> 