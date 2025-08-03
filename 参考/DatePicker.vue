<template>
  <div class="date-picker-page">
    <!-- SEO Meta Tags -->
    <el-teleport to="head">
      <title>吉日择日 - 北斗九号日历</title>
      <meta name="description" content="北斗九号日历提供专业的吉日择日服务，根据您的生辰八字智能推荐黄道吉日，助您趋吉避凶，把握人生重要时机。">
      <meta name="keywords" content="吉日择日,黄道吉日,择日指南,八字分析,北斗九号">
      <!-- Open Graph tags for social sharing -->
      <meta property="og:title" content="吉日择日 - 北斗九号日历">
      <meta property="og:description" content="北斗九号日历提供专业的吉日择日服务，根据您的生辰八字智能推荐黄道吉日，助您趋吉避凶，把握人生重要时机。">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="北斗九号">
      <meta property="og:url" content="https://www.9day.tech/date-picker">
      <meta property="og:image" content="https://www.9day.tech/icons/icon-192x192.png">
    </el-teleport>
    <div class="date-picker-container">
              <!-- 营销提示部分 -->
        <div class="marketing-container">
          <div class="marketing-tip">
            <div class="tip-content">
              <span class="sparkle">🌌</span>
              免登录、免费获得个人近七日的吉日选项，输入生日信息试试看吧
            </div>
          </div>
        </div>
      <!-- 生日信息输入区域 -->
      <div class="birth-info-section pixel-card">
        <h2 class="section-title">个人信息</h2>
        <el-form :model="formData" label-width="100px" class="pixel-theme">
          <el-form-item label="出生日期">
            <div class="date-input-container">
              <el-date-picker
                v-model="formData.birthDateTime"
                type="datetime"
                placeholder="选择出生日期和时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
                :default-time="new Date(2000, 0, 1, 12, 0, 0)"
                :size="isMobile ? 'large' : 'default'"
                :editable="false"
                :clearable="false"
                :teleported="true"
                :popper-class="isMobile ? 'mobile-date-picker' : ''"
              />
            </div>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="formData.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <!-- 需求类型选择区域 -->
      <div class="purpose-section pixel-card">
        <h2 class="section-title">选择吉日需求</h2>
        <div class="purpose-buttons">
          <el-button
            v-for="purpose in purposes"
            :key="purpose.key"
            class="purpose-button pixel-theme"
            :class="{ active: selectedPurpose === purpose.key }"
            @click="selectPurpose(purpose.key)"
          >
            {{ purpose.label }}
          </el-button>
        </div>
      </div>

      <!-- 月历显示区域 -->
      <div class="calendar-section pixel-card">
        <h2 class="section-title">推荐日期（近7日）</h2>
        <div class="month-header">
          <span>{{ currentMonth }}月</span>
        </div>
        <div class="weekday-row">
          <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']" 
               :key="day" 
               class="weekday-header">{{ day }}</div>
        </div>
        <div class="calendar-grid">
          <div
            v-for="day in monthDays"
            :key="day.date"
            class="calendar-day"
            :class="{
              'other-month': !day.isCurrentMonth,
              'next-seven-days': isInNextSevenDays(day.date),
              'recommended': isRecommendedDay(day.date),
              'selected': selectedDate === day.date
            }"
            @click="selectDate(day.date)"
          >
            <div class="day-info">
              <span class="day-number">{{ formatDay(day.date) }}</span>
              <span v-if="day.score && isInNextSevenDays(day.date)" class="score">
                {{ Math.round(day.score) }}分
              </span>
            </div>
          </div>
        </div>

        <!-- 添加保存按钮 -->
        <div class="save-button-container">
          <el-button
            class="save-button pixel-theme"
            :loading="savingImage"
            @click="captureAndDownload"
          >
            {{ savingImage ? '正在保存...' : '保存择日报告' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { fetchFortuneAnalysis } from '@/api/bazi'
import { useUserStore } from '@/stores/user'
import html2canvas from 'html2canvas'

// 响应式状态
const formData = ref({
  birthDateTime: '',
  gender: 'male'
})

// 新增保存状态
const savingImage = ref(false)

// 新增截图方法
const captureAndDownload = async () => {
  try {
    savingImage.value = true
    const element = document.querySelector('.date-picker-container')
    
    // 创建水印
    const watermark = document.createElement('div')
    Object.assign(watermark.style, {
      position: 'absolute',
      bottom: '15px',
      right: '15px',
      color: 'rgba(0,0,0,0.6)',
      fontSize: '14px',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'rgba(255,255,255,0.3)',
      padding: '2px 5px',
      borderRadius: '3px'
    })
    watermark.innerText = 'www.9day.tech'
    
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        const container = clonedDoc.querySelector('.date-picker-container')
        container.style.position = 'relative'
        container.appendChild(watermark)
      }
    })

    // 生成图片并下载
    const link = document.createElement('a')
    link.download = `9day_择日报告_${dayjs().format('YYYYMMDD_HHmmss')}.png`
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('带水印报告保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('报告保存失败: ' + error.message)
  } finally {
    savingImage.value = false
  }
}

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 获取用户唯一标识符
const getUserId = () => {
  if (userStore.token) {
    return userStore.user.id
  }
  
  // 为访客生成唯一会话ID（关闭浏览器后失效）
  let guestId = sessionStorage.getItem('guestId')
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    sessionStorage.setItem('guestId', guestId)
  }
  return guestId
}

// 动态生成缓存键（包含唯一用户标识）
const CACHE_KEY = computed(() => `datepickerCache_${getUserId()}`)

// 从缓存中加载分析结果
const loadCachedAnalysis = () => {
  const cachedData = localStorage.getItem(CACHE_KEY.value)
  if (cachedData) {
    const parsedData = JSON.parse(cachedData)
    const cachedDate = dayjs(parsedData.currentDate)
    const today = dayjs().startOf('day')

    // 检查缓存日期是否是今天
    if (cachedDate.isSame(today, 'day')) {
      rawFortuneData.value = parsedData.fortuneData
      formData.value = parsedData.formData
      selectedPurpose.value = parsedData.selectedPurpose
      console.log('已从缓存加载分析结果')
    }
  }
}

// 保存分析结果到缓存
const saveAnalysisToCache = () => {
  const cacheData = {
    currentDate: new Date(),
    fortuneData: rawFortuneData.value,
    formData: formData.value,
    selectedPurpose: selectedPurpose.value
  }
  localStorage.setItem(CACHE_KEY.value, JSON.stringify(cacheData))
  console.log('分析结果已缓存')
}

// 清除缓存
const clearCache = () => {
  localStorage.removeItem(CACHE_KEY.value)
}

// 监听用户登录状态变化
watch(() => userStore.token, (newToken, oldToken) => {
  if (newToken) {
    // 用户登录时清除访客缓存
    sessionStorage.removeItem('guestId')
    clearCache()
  } else if (oldToken) {
    // 用户退出登录时清除登录用户缓存
    clearCache()
  }
})

// 监听窗口关闭事件（仅处理访客）
onUnmounted(() => {
  if (!userStore.token) {
    // 清空访客相关存储
    sessionStorage.removeItem('guestId')
    clearCache()
  }
})

// 修改updateFortuneData函数
const updateFortuneData = async () => {
  if (!formData.value.birthDateTime) {
    ElMessage.warning('请先选择出生日期')
    return
  }

  // 如果已有缓存数据且生日信息未变更，直接使用缓存数据
  if (rawFortuneData.value.length > 0) {
    fortuneData.value = rawFortuneData.value
    return
  }

  try {
    const promises = nextSevenDays.value.map(day => {
      return fetchFortuneAnalysis({
        birth_datetime: formData.value.birthDateTime,
        current_datetime: `${day.date} 00:00:00`,
        gender: formData.value.gender
      })
    })

    const results = await Promise.all(promises)
    rawFortuneData.value = results.map((res, index) => ({
      date: nextSevenDays.value[index].date,
      ...res.data?.data
    }))
    // 更新显示数据
    fortuneData.value = rawFortuneData.value
    // 保存到缓存
    saveAnalysisToCache()
  } catch (error) {
    console.error('获取运势数据失败:', error)
    ElMessage.error('获取运势数据失败，请稍后重试')
  }
}

// 在组件挂载时加载用户信息和缓存
onMounted(async () => {
  if (isLoggedIn.value) {
    try {
      const userInfo = await userStore.fetchUserInfo()
      if (userInfo) {
        // 检查是否有完整的生日信息
        if (userInfo.birth_year && userInfo.birth_month && userInfo.birth_day && userInfo.birth_time) {
          const birthDateTime = dayjs(
            `${userInfo.birth_year}-${String(userInfo.birth_month).padStart(2, '0')}-${String(userInfo.birth_day).padStart(2, '0')} ${userInfo.birth_time}`
          ).format('YYYY-MM-DD HH:mm:ss')
          formData.value.birthDateTime = birthDateTime
          formData.value.gender = userInfo.gender || 'male' // 设置默认性别为男性
          console.log('已加载用户生日信息:', birthDateTime)
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    }
  }

  // 如果没有获取到生日信息，且未登录，保持为空
  if (!formData.value.birthDateTime && !isLoggedIn.value) {
    formData.value.birthDateTime = ''
    console.log('未登录用户，日期保持为空')
  } else if (!formData.value.birthDateTime) {
    formData.value.birthDateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log('已登录用户使用默认生日信息:', formData.value.birthDateTime)
  }

  // 加载缓存数据
  loadCachedAnalysis()
})

const selectedPurpose = ref('')
const selectedDate = ref('')
const fortuneData = ref([])
// 添加原始数据缓存
const rawFortuneData = ref([])

// 需求类型定义
const purposes = [
  { key: 'negotiation', label: '商务谈判' },
  { key: 'contract', label: '签约/考试' },
  { key: 'love', label: '约会拍拖' },
  { key: 'travel', label: '旅游出行' },
  { key: 'boss', label: '约见领导' },
  { key: 'investment', label: '投资理财' }
]

// 计算属性
const isMobile = computed(() => {
  return window.innerWidth < 768
})

const currentMonth = computed(() => {
  return dayjs().month() + 1
})

const monthDays = computed(() => {
  const today = dayjs()
  const firstDayOfMonth = today.startOf('month')
  const lastDayOfMonth = today.endOf('month')
  const days = []

  // 获取这个月第一天是星期几（0-6，0代表星期日）
  const firstDayWeekday = firstDayOfMonth.day()

  // 添加上个月的日期
  const prevMonth = firstDayOfMonth.subtract(1, 'month')
  const prevMonthLastDay = prevMonth.endOf('month').date()
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = prevMonth.date(prevMonthLastDay - i).format('YYYY-MM-DD')
    days.push({
      date,
      isCurrentMonth: false,
      score: getScoreForDate(date)
    })
  }

  // 添加当前月的日期
  for (let i = 1; i <= lastDayOfMonth.date(); i++) {
    const date = today.date(i).format('YYYY-MM-DD')
    days.push({
      date,
      isCurrentMonth: true,
      score: getScoreForDate(date)
    })
  }

  // 添加下个月的日期以填满日历网格
  const nextMonth = lastDayOfMonth.add(1, 'day')
  const remainingDays = 42 - days.length // 6行7列 = 42天
  for (let i = 1; i <= remainingDays; i++) {
    const date = nextMonth.add(i - 1, 'day').format('YYYY-MM-DD')
    days.push({
      date,
      isCurrentMonth: false,
      score: getScoreForDate(date)
    })
  }

  return days
})

const nextSevenDays = computed(() => {
  const days = []
  const today = dayjs()
  
  for (let i = 0; i < 7; i++) {
    const currentDate = today.add(i, 'day')
    days.push({
      date: currentDate.format('YYYY-MM-DD'),
      score: getScoreForDate(currentDate.format('YYYY-MM-DD'))
    })
  }
  return days
})

// 方法
const selectPurpose = (purpose) => {
  selectedPurpose.value = purpose
  updateFortuneData()
}

const selectDate = (date) => {
  selectedDate.value = date
}

const formatDay = (date) => {
  return dayjs(date).format('DD')
}

const formatWeekday = (date) => {
  return dayjs(date).format('ddd')
}

const getScoreForDate = (date) => {
  const dayData = rawFortuneData.value.find(d => d.date === date)
  if (!dayData) return null
  
  // 根据选择的需求类型返回对应分数
  switch (selectedPurpose.value) {
    case 'negotiation': return dayData.negotiation
    case 'contract': return dayData.contract
    case 'love': return dayData.love
    case 'travel': return dayData.travel
    case 'boss': return dayData.boss
    case 'investment': return dayData.wealth
    default: return null
  }
}



// 监听需求类型和生日信息变化
watch(
  [selectedPurpose, () => [formData.value.birthDateTime, formData.value.gender]],
  ([newPurpose, [newBirthDateTime, newGender]], [oldPurpose, [oldBirthDateTime, oldGender]]) => {
    // 只有在选择了需求类型，并且生日信息发生变化时才更新数据
    if (newPurpose) {
      // 如果生日信息发生变化，清空缓存并重新获取数据
      if (newBirthDateTime !== oldBirthDateTime || newGender !== oldGender) {
        rawFortuneData.value = []
        updateFortuneData()
      }
    }
  }
)

const isRecommendedDay = (date) => {
  const score = getScoreForDate(date)
  return score && score >= 80 // 分数大于等于80的日子被认为是推荐日期
}

const isInNextSevenDays = (date) => {
  return nextSevenDays.value.some(day => day.date === date)
}
</script>

<style scoped>
.date-picker-page {
  min-height: 100vh;
  padding: 0.5rem;
  background: #f0f2f5;
  background-image: linear-gradient(45deg, #f0f2f5 25%, #e6e9ed 25%, #e6e9ed 50%, #f0f2f5 50%, #f0f2f5 75%, #e6e9ed 75%, #e6e9ed 100%);
  background-size: 20px 20px;
  display: flex;
  flex-direction: column;
}

.marketing-container {
  width: 100%;
  margin-bottom: 1rem;
}

.marketing-tip {
  width: 100%;
  max-width: 50rem;
  margin: 0 auto;
  background: rgb(253, 235, 71);
  border: var(--pixel-size) solid var(--border-dark);
  border-radius: var(--radius);
  box-shadow: 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.8);
  padding: 1.1rem;
  transition: all 0.2s ease;
}

.marketing-tip:hover {
  transform: translateY(-2px);
}

.tip-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--border-dark);
  font-weight: bold;
  text-align: center;
}

.sparkle {
  animation: sparkle 1.5s infinite;
  display: inline-block;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes sparkle {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

@media (max-width: 768px) {
  .date-picker-page {
    max-height: 100vh;
    overflow-x: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(44, 62, 80, 0.3) transparent;
  }

  .date-picker-page::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .date-picker-page::-webkit-scrollbar-track {
    background: transparent;
  }

  .date-picker-page::-webkit-scrollbar-thumb {
    background-color: rgba(44, 62, 80, 0.3);
    border-radius: 4px;
  }

  .date-picker-page::-webkit-scrollbar-thumb:hover {
    background-color: rgba(44, 62, 80, 0.5);
  }
}

.date-picker-container {
  max-width: 50rem;
  min-width: 20rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.75rem;
  flex: 1;
  width: 100%;
}

.pixel-card {
  background: white;
  border: var(--pixel-size) solid var(--border-dark);
  border-radius: var(--radius);
  padding: 1.25rem;
  box-shadow: 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.8);
  transition: all 0.2s ease;
}

.pixel-card:hover {
  transform: translateY(-2px);
}

.section-title {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.purpose-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem auto;
  max-width: 600px;
  padding: 0 1rem;
}

.purpose-button {
  width: 100%;
  min-width: 100px;
  max-width: none;
  height: 44px;
  font-size: 1rem;
  border: 3px solid #2c3e50;
  border-radius: 4px;
  transition: all 0.2s ease;
  padding: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #2c3e50;
  box-shadow: 4px 4px 0 #2c3e50;
  image-rendering: pixelated;
}

.purpose-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #2c3e50;
}

.purpose-button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #2c3e50;
}

.purpose-button.active {
  background: #3498db;
  color: white;
  border-color: #2980b9;
  box-shadow: 4px 4px 0 #2980b9;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--gap-sm);
  margin-top: var(--gap-sm);
  width: 100%;
}

.weekday-header {
  text-align: center;
  font-weight: bold;
  color: var(--text-dark);
  padding: var(--gap-sm);
}

.calendar-day {
  aspect-ratio: 1;
  border: var(--pixel-size) solid var(--border-light);
  border-radius: var(--radius);
  padding: var(--gap-sm);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: white;
}

.calendar-day:hover {
  transform: translateY(-2px);
  box-shadow: var(--pixel-size) var(--pixel-size) 0 rgba(0, 0, 0, 0.8);
}

.calendar-day.selected {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-dark);
  transform: scale(1.05);
  box-shadow: var(--pixel-size) var(--pixel-size) 0 rgba(0, 0, 0, 0.8);
  z-index: 1;
}

.score {
  font-size: 0.8rem;
  margin-top: 0.2rem;
  color: var(--accent-color);
  font-weight: bold;
}

.calendar-day.selected .score {
  color: white;
}

.save-button-container {
  margin-top: 1.5rem;
  text-align: center;
}

.save-button {
  width: 100%;
  max-width: 18.75rem;
  min-width: 12.5rem;
  height: 2.75rem;
  font-size: 1rem;
  font-weight: bold;
  background: #4CAF50;
  color: white;
  border: 3px solid #2c3e50;
  box-shadow: 4px 4px 0 rgba(44, 62, 80, 0.8);
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  image-rendering: pixelated;
}

.save-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(44, 62, 80, 0.8);
}

.save-button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(44, 62, 80, 0.8);
}

.purpose-button {
  width: 100%;
  min-width: 100px;
  max-width: none;
  height: 44px;
  font-size: 1rem;
  border: 3px solid #2c3e50;
  border-radius: 4px;
  transition: all 0.2s ease;
  padding: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #2c3e50;
  box-shadow: 4px 4px 0 rgba(44, 62, 80, 0.8);
  image-rendering: pixelated;
}

.purpose-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(44, 62, 80, 0.8);
}

.purpose-button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(44, 62, 80, 0.8);
}

.purpose-button.active {
  background: #3498db;
  color: white;
  border-color: #2980b9;
  box-shadow: 4px 4px 0 rgba(41, 128, 185, 0.8);
}

.month-header {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.weekday-header {
  text-align: center;
  font-weight: bold;
  color: #2c3e50;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
}

.calendar-day {
  aspect-ratio: 1;
  border: 0.125rem solid #ddd;
  border-radius: 0.375rem;
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
  min-height: 2.5rem;
  min-width: 2.5rem;
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.next-seven-days {
  background: #f8f9fa;
  border-color: #3498db;
}

.calendar-day.recommended {
  border-color: #e74c3c;
  border-width: 3px;
}

.calendar-day.selected {
  background: #3498db;
  color: white;
  border-color: #2980b9;
}

.day-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.day-number {
  font-size: 1.1rem;
  font-weight: bold;
}

.score {
  font-size: 0.8rem;
  margin-top: 0.2rem;
  color: #e74c3c;
}

.calendar-day:hover {
  border-color: #3498db;
  transform: translateY(-2px);
}

.calendar-day.recommended {
  border: 2px solid #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.calendar-day.selected {
  background: #3498db;
  color: white;
  border-color: #2980b9;
  box-shadow: 4px 4px 0 rgba(41, 128, 185, 0.8);
}

.day-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.day-number {
  font-size: 1rem;
  font-weight: bold;
  color: #2c3e50;
}

.calendar-day.selected .day-number {
  color: white;
}

.weekday {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.calendar-day.selected .weekday {
  color: rgba(255, 255, 255, 0.8);
}

.score {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #27ae60;
  font-weight: bold;
}

.calendar-day.selected .score {
  color: white;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .date-picker-page {
    padding: 0.25rem;
  }

  .date-picker-container {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .pixel-card {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .section-title {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .purpose-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.375rem;
    padding: 0 0.375rem;
  }

  .calendar-grid {
    gap: 0.25rem;
  }

  .calendar-day {
    padding: 0.25rem;
    min-height: 2.25rem;
    min-width: 2.25rem;
  }

  .day-number {
    font-size: 0.875rem;
  }

  .score {
    font-size: 0.75rem;
    margin-top: 0.125rem;
  }

  .weekday-header {
    font-size: 0.875rem;
  }
}
</style>