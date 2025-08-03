<template>
  <div class="fortune-container">
    <!-- SEO Meta Tags -->
    <el-teleport to="head">
      <title>每日运势 - 北斗九号日历</title>
      <meta name="description" content="北斗九号日历每日运势分析，为您提供全方位的运势指数、吉凶指引和行动建议，助您把握机遇，趋吉避凶。">
      <meta name="keywords" content="每日运势,运势预测,运势指数,吉凶指引,北斗九号">
      <!-- Open Graph tags for social sharing -->
      <meta property="og:title" content="每日运势 - 北斗九号日历">
      <meta property="og:description" content="北斗九号日历每日运势分析，为您提供全方位的运势指数、吉凶指引和行动建议，助您把握机遇，趋吉避凶。">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="北斗九号">
      <meta property="og:url" content="https://www.9day.tech/fortune">
      <meta property="og:image" content="https://www.9day.tech/icons/icon-192x192.png">
    </el-teleport>
    <!-- 综合运势（包含建议） -->
    <div class="fortune-card overall">
      <!-- 综合评分区块 -->
      <div class="card-header">
        <h3 class="card-title">{{ selectedDate }} 运势总览</h3>
        <div class="overall-score">
          综合评分 {{ overallScore }}%
          <div class="stars-rating">
            <span v-for="star in 5" :key="star" class="star-icon">
              {{ star <= Math.floor(overallScore/30) ? '★' : '☆' }}
            </span>
          </div>
        </div>
      </div>
      <p class="overall-desc">{{ getOverallDescription(overallScore) }}</p>

      <!-- 新增建议区块 -->
      <div class="advice-section">
        <div class="advice-grid">
          <div class="advice-card positive">
            <h4 class="advice-title">今日建议</h4>
            <ul class="advice-list">
              <li v-for="(advice, index) in dailyAdvice" :key="index">{{ advice }}</li>
              <li v-if="!dailyAdvice.length" class="empty-tip">暂无特别建议</li>
            </ul>
          </div>
          <div class="advice-card caution">
            <h4 class="advice-title">忌讳事项</h4>
            <ul class="advice-list">
              <li v-for="(taboo, index) in avoidMatters" :key="index">{{ taboo }}</li>
              <li v-if="!avoidMatters.length" class="empty-tip">今日无特别忌讳</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 原有顺序保持不变的区块 -->
    <!-- 1. 核心运势 -->
    <div class="fortune-section">
      <h3 class="section-title">核心运势</h3>
      <div class="fortune-grid core">
        <div 
          v-for="key in coreFields"
          :key="key"
          class="fortune-item"
          @click="handleFortuneItemClick(key)"
        >
          <div class="item-header">
            <span class="item-icon">{{ getFortuneIcon(key) }}</span>
            <span class="item-title">{{ getFortuneLabel(key) }}</span>
          </div>
          <div class="item-score">{{ scores[key] }}%</div>
          <p class="item-desc">{{ getFortuneDescription(scores[key]) }}</p>
        </div>
      </div>
    </div>

    <!-- 2. 职场运势 -->
    <div class="fortune-section">
      <h3 class="section-title">职场运势</h3>
      <div class="fortune-grid workplace">
        <div 
          v-for="key in workplaceFields"
          :key="key"
          class="fortune-item"
          @click="handleFortuneItemClick(key)"
        >
          <div class="item-header">
            <span class="item-icon">{{ getFortuneIcon(key) }}</span>
            <span class="item-title">{{ getFortuneLabel(key) }}</span>
          </div>
          <div class="item-score">{{ scores[key] }}%</div>
          <p class="item-desc">{{ getFortuneDescription(scores[key]) }}</p>
        </div>
      </div>
    </div>

    <!-- 3. 社交运势 -->
    <div class="fortune-section">
      <h3 class="section-title">社交运势</h3>
      <div class="fortune-grid social">
        <div 
          v-for="key in socialFields"
          :key="key"
          class="fortune-item"
          @click="handleFortuneItemClick(key)"
        >
          <div class="item-header">
            <span class="item-icon">{{ getFortuneIcon(key) }}</span>
            <span class="item-title">{{ getFortuneLabel(key) }}</span>
          </div>
          <div class="item-score">{{ scores[key] }}%</div>
          <p class="item-desc">{{ getFortuneDescription(scores[key]) }}</p>
        </div>
      </div>
    </div>

    <!-- 4. 财务运势 -->
    <div class="fortune-section">
      <h3 class="section-title">财务运势</h3>
      <div class="fortune-grid finance">
        <div 
          v-for="key in financeFields"
          :key="key"
          class="fortune-item"
          @click="handleFortuneItemClick(key)"
        >
          <div class="item-header">
            <span class="item-icon">{{ getFortuneIcon(key) }}</span>
            <span class="item-title">{{ getFortuneLabel(key) }}</span>
          </div>
          <div class="item-score">{{ scores[key] }}%</div>
          <p class="item-desc">{{ getFortuneDescription(scores[key]) }}</p>
        </div>
      </div>
    </div>

    <!-- 5. 个人状态 -->
    <div class="fortune-section">
      <h3 class="section-title">个人状态</h3>
      <div class="fortune-grid personal">
        <div 
          v-for="key in personalFields"
          :key="key"
          class="fortune-item"
          @click="handleFortuneItemClick(key)"
        >
          <div class="item-header">
            <span class="item-icon">{{ getFortuneIcon(key) }}</span>
            <span class="item-title">{{ getFortuneLabel(key) }}</span>
          </div>
          <div class="item-score">{{ scores[key] }}%</div>
          <p class="item-desc">{{ getFortuneDescription(scores[key]) }}</p>
        </div>
      </div>
    </div>

    <!-- 日历组件移至最底部 -->
    <div class="calendar-section">
      <div class="calendar-tip">选择日期查看当日运势指数</div>
      <div class="calendar-header">
        <div class="nav-button prev" @click="changeMonth(-1)">‹</div>
        <div class="current-month">{{ currentMonth }}</div>
        <div class="nav-button next" @click="changeMonth(1)">›</div>
      </div>
      
      <div class="calendar-grid">
        <!-- 星期标题 -->
        <div 
          v-for="day in weekDays" 
          :key="day"
          class="weekday-cell"
        >
          {{ day }}
        </div>
        
        <!-- 日期格子 -->
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="day-cell"
          :class="{
            'current-month': day.isCurrentMonth,
            'selected': day.date === selectedDate,
            'today': day.isCurrent
          }"
          @click="selectDate(day.date)"
        >
          <div class="day-number">{{ day.dayOfMonth }}</div>
          <div v-if="day.isCurrent" class="today-marker"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { Lock } from '@element-plus/icons-vue'
import { emitter } from '@/stores/user'
import userService from '@/utils/userRequest'
import { fetchFortuneAnalysis } from '@/api/bazi'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const router = useRouter()
const userStore = useUserStore()
const today = new Date();
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))

// 用户八字信息
const userBaziInfo = ref(null)

// 登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 初始化运势数据为模拟数据
const initializeScores = () => {
  return {
    wealth: 75,
    career: 80,
    love: 70,
    luck: 85,
    boss: 65,
    colleague: 75,
    client: 70,
    social: 80,
    negotiation: 75,
    cooperation: 70,
    contract: 65,
    payment: 75,
    mood: 85,
    travel: 70,
    friend: 80,
    entertainment: 75
  }
}

const mockDemoScores = initializeScores()
const scores = ref(initializeScores())

// 缓存相关
const fortuneCache = new Map()
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24小时缓存过期
let lastApiCallTime = 0
const API_CALL_INTERVAL = 800 // 接口调用最小间隔（毫秒）

// 清除缓存和重置数据
const clearCache = () => {
  fortuneCache.clear()
  scores.value = initializeScores()
}

// 检查是否可以调用API
const canCallApi = () => {
  if (!isLoggedIn.value) return false
  const now = Date.now()
  if (now - lastApiCallTime < API_CALL_INTERVAL) {
    return false
  }
  lastApiCallTime = now
  return true
}

// 获取缓存key
const getCacheKey = (params) => {
  if (!isLoggedIn.value) return null
  return `${userStore.user?.id}_${params.birth_datetime}_${params.current_datetime}_${params.gender}`
}

// 检查缓存
const getFromCache = (key) => {
  if (!key || !isLoggedIn.value) return null
  const cached = fortuneCache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
    fortuneCache.delete(key)
    return null
  }
  
  return cached.data
}

// 设置缓存
const setCache = (key, data) => {
  if (!key || !isLoggedIn.value) return
  fortuneCache.set(key, {
    data,
    timestamp: Date.now()
  })
}

const currentDate = computed(() => {
  return dayjs(selectedDate.value).format('YYYY年M月D日')
})

const lunarInfo = computed(() => {
  // TODO: 根据选中日期计算农历信息
  return '甲辰年 丁丑月 壬辰日'
})

const weekday = computed(() => {
  return '星期' + '日一二三四五六'.charAt(dayjs(selectedDate.value).day())
})

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDays = computed(() => {
  const selectedDay = dayjs(selectedDate.value)
  const firstDayOfMonth = selectedDay.startOf('month')
  const lastDayOfMonth = selectedDay.endOf('month')
  
  // 获取日历网格的起始日期（上月最后几天）
  const startDate = firstDayOfMonth.subtract(firstDayOfMonth.day(), 'day')
  
  const days = []
  let currentDate = startDate
  
  // 生成6周的日历数据
  for (let i = 0; i < 42; i++) {
    const date = currentDate.format('YYYY-MM-DD')
    days.push({
      date,
      dayOfMonth: currentDate.date(),
      isCurrentMonth: currentDate.month() === selectedDay.month(),
      isCurrent: date === dayjs().format('YYYY-MM-DD')
    })
    currentDate = currentDate.add(1, 'day')
  }
  
  return days
})

// 获取用户八字信息
const fetchUserBaziInfo = async () => {
  try {
    const user = userStore.user
    
    // 检查是否有完整的八字信息
    if (!user || !user.birth_year || !user.birth_month || 
        !user.birth_day || !user.birth_time || !user.gender) {
      return {
        success: false,
        message: '请先在个人信息页面完善您的八字信息'
      }
    }

    // 格式化出生日期时间
    const birthTime = user.birth_time.padStart(5, '0') // 确保时间格式为 HH:mm
    const birthDatetime = `${user.birth_year}-${String(user.birth_month).padStart(2, '0')}-${String(user.birth_day).padStart(2, '0')} ${birthTime}:00`

    userBaziInfo.value = {
      birth_datetime: birthDatetime,
      gender: user.gender
    }
    
    return { success: true }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      success: false,
      message: '获取用户信息失败，请重试'
    }
  }
}

// 添加一个工具函数来处理分数
const parseScore = (value) => {
  if (value === undefined || value === null) return 0
  if (typeof value === 'number') {
    return Math.max(0, Math.min(100, Math.round(value)))
  }
  if (typeof value === 'string') {
    let num = parseFloat(value)
    if (window.innerWidth < 768) {
      num = Math.round(num / 5) * 5 // 移动端数值取5的倍数
    }
    return isNaN(num) ? 0 : Math.max(0, Math.min(100, Math.round(num)))
  }
  return 0
}

// 获取运势数据
const fetchFortuneData = async (date) => {
  try {
    // 未登录时使用模拟数据
    if (!isLoggedIn.value) {
      scores.value = initializeScores()
      return
    }

    // 检查API调用频率
    if (!canCallApi()) {
      ElMessage.warning('你点得太快了，让我缓缓')
      return
    }

    // 获取用户八字信息
    const userInfoResult = await fetchUserBaziInfo()
    if (!userInfoResult.success) {
      ElMessageBox.confirm(
        userInfoResult.message,
        '提示',
        {
          confirmButtonText: '去完善',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          router.push('/profile')
        })
        .catch(() => {
          scores.value = initializeScores()
        })
      return
    }

    // 准备API参数
    const params = {
      birth_datetime: userBaziInfo.value.birth_datetime,
      current_datetime: `${date} 00:00:00`,
      gender: userBaziInfo.value.gender
    }

    // 检查缓存
    const cacheKey = getCacheKey(params)
    const cachedData = getFromCache(cacheKey)
    if (cachedData) {
      scores.value = { ...cachedData }
      return
    }

    // 调用API获取运势数据
    const response = await fetchFortuneAnalysis(params)
    
    if (response.success && response.data?.data) {
      const fortuneData = response.data.data
      const mappedScores = {}
      
      // 直接使用返回的数据，因为API返回的字段名已经是英文的
      const validFields = [
        'wealth', 'career', 'love', 'luck', 'boss',
        'colleague', 'client', 'social', 'negotiation',
        'cooperation', 'contract', 'payment', 'mood',
        'travel', 'friend', 'entertainment'
      ]

      // 处理每个字段，确保是有效的数字
      validFields.forEach(field => {
        mappedScores[field] = parseScore(fortuneData[field])
      })

      // 确保所有字段都有默认值
      const defaultScores = initializeScores()
      Object.keys(defaultScores).forEach(key => {
        if (typeof mappedScores[key] !== 'number') {
          mappedScores[key] = defaultScores[key]
        }
      })

      scores.value = mappedScores
      setCache(cacheKey, mappedScores)
      ElMessage.success('运势数据获取成功')
    } else {
      console.error('运势数据格式:', response)
      throw new Error('运势数据格式不正确')
    }
  } catch (error) {
    console.error('获取运势数据失败:', error)
    ElMessage.error(error.message || '获取运势数据失败，请稍后重试')
    scores.value = initializeScores()
  }
}

// 获取运势图标
const getFortuneIcon = (key) => {
  const icons = {
    wealth: '💰',    // 钱袋，表示财运
    career: '💼',    // 公文包，表示事业
    love: '💝',      // 心形，表示桃花运
    luck: '🌟',      // 星星，表示贵人运
    boss: '👔',      // 领带，表示上司关系
    colleague: '👥',  // 握手，表示同事关系
    client: '🤵',    // 商务人士，表示客户关系
    social: '🗣️',    // 社交，表示社交
    negotiation: '💬', // 对话，表示谈判
    cooperation: '🤝', // 循环箭头，表示合作
    contract: '📝',   // 文档，表示签约
    payment: '💸',    // 带翅膀的钱，表示收款
    mood: '😊',      // 笑脸，表示心情
    travel: '✈️',     // 飞机，表示出行
    friend: '👫',     // 人群，表示朋友
    entertainment: '🎮' // 游戏手柄，表示娱乐
  }
  return icons[key] || '🎲'
}

// 获取运势标签
const getFortuneLabel = (key) => {
  const labels = {
    wealth: '财运',
    career: '事业',
    love: '桃花运',
    luck: '贵人运',
    boss: '上司关系',
    colleague: '同事关系',
    client: '客户关系',
    social: '社交',
    negotiation: '谈判',
    cooperation: '合作',
    contract: '签约/考试',
    payment: '收款',
    mood: '心情',
    travel: '出行',
    friend: '约朋友',
    entertainment: '吃喝玩乐'
  }
  return labels[key] || '运势'
}

// 处理运势项点击
const handleFortuneItemClick = (key) => {
  if (!isLoggedIn.value) {
    router.push({
      path: '/login',
      query: { 
        redirect: '/fortune',
        deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop' // 添加设备类型参数
      }
    })
  }
  // 添加点击反馈动画
  const item = event.currentTarget
  item.style.transform = 'scale(0.95)'
  setTimeout(() => {
    item.style.transform = 'scale(1)'
  }, 200)
}

// 修改日期单元格的样式类判断
const getCellClass = (date) => {
  const cellDate = dayjs(date).format('YYYY-MM-DD');
  const selected = selectedDate.value === cellDate;
  
  return {
    'other-month': !isCurrentMonth(date),
    'today': isToday(date),
    'selected': selected && !isToday(date) // 确保选中的非今天日期显示选中样式
  };
};

// 修改日期选择处理函数
const handleDateSelect = async (day) => {
  const newDate = dayjs(day.date).format('YYYY-MM-DD');
  selectedDate.value = newDate; // 更新选中日期
  
  if (!isLoggedIn.value) {
    router.push({
      path: '/login',
      query: { redirect: '/fortune' }
    });
    return;
  }
  
  try {
    scores.value = initializeScores();
    await fetchFortuneData(day.date);
  } catch (error) {
    console.error('处理日期选择失败:', error);
    ElMessage.error('获取运势数据失败，请重试');
    scores.value = initializeScores();
  }
};

// 组件挂载时初始化数据
onMounted(async () => {
  // 如果未登录，直接跳转到登录页面
  if (!isLoggedIn.value) {
    router.push({
      path: '/login',
      query: { redirect: '/fortune' }
    })
    return
  }

  // 移除可能存在的旧监听器
  emitter.off('clearCache')
  // 添加新的监听器
  emitter.on('clearCache', () => {
    console.log('清除缓存事件触发')
    clearCache()
  })

  await fetchFortuneData(selectedDate.value)
})

// 组件卸载时清理
onUnmounted(() => {
  emitter.off('clearCache')
})

const getChineseWeekday = (date) => {
  const weekDay = dayjs(date).day()  // 获取星期几 (0-6)
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  return '星期' + weekDays[weekDay]
}

// 修改建议数据结构为数组
const dailyAdvice = ref([])
const avoidMatters = ref([])

// 更新建议生成逻辑（根据参考文件中的generateAdvice方法）
const generateAdvice = (data) => {
  return [
    data.wealth > 70 && '适合进行小额投资理财',
    data.career > 65 && '主动争取工作表现机会',
    data.love > 60 && '适合安排浪漫约会',
    data.social > 75 && '积极参与社交活动拓展人脉',
    data.negotiation > 70 && '可以安排重要的谈判',
    data.luck > 80 && '适合拜会贵人寻求帮助',
    data.cooperation > 65 && '开展商业合作',
    data.mood > 70 && '保持积极心态，迎接挑战',
    data.travel > 60 && '适合计划短途旅行'
  ].filter(Boolean).slice(0, 3) // 最多显示3条
}

const generateAvoidance = (data) => {
  return [
    data.contract < 60 && '避免签署重要法律文件',
    data.payment < 50 && '注意应收账款催收',
    data.mood < 40 && '减少重大决策避免情绪化',
    data.travel < 40 && '长途出行建议改期',
    data.boss < 45 && '避免直接顶撞上级',
    data.colleague < 50 && '注意团队协作方式',
    data.client < 55 && '重要客户沟通前做好预案',
    data.entertainment < 50 && '减少娱乐活动，专注工作'
  ].filter(Boolean).slice(0, 3) // 最多显示3条
}

// 深度监听所有评分项变化
watch(() => ({...scores.value}), (newVal) => {
  dailyAdvice.value = generateAdvice(newVal)
  avoidMatters.value = generateAvoidance(newVal)
})

// 新增数据映射关系
const CORE_FIELDS = ['wealth', 'career', 'love', 'luck']
const WORKPLACE_FIELDS = ['boss', 'colleague', 'client']
const SOCIAL_FIELDS = ['social', 'negotiation', 'cooperation']
const FINANCE_FIELDS = ['contract', 'payment']
const PERSONAL_FIELDS = ['mood', 'travel', 'friend', 'entertainment']

const coreFields = computed(() => CORE_FIELDS)
const workplaceFields = computed(() => WORKPLACE_FIELDS)
const socialFields = computed(() => SOCIAL_FIELDS)
const financeFields = computed(() => FINANCE_FIELDS)
const personalFields = computed(() => PERSONAL_FIELDS)

const overallScore = computed(() => {
  const values = Object.values(scores.value)
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
})

const getOverallDescription = (score) => {
  const descriptions = [
    { min: 0, text: '今日运势极低，建议谨慎行事，避免重大决策' },
    { min: 30, text: '运势偏低，宜静观其变，做好风险防范' },
    { min: 50, text: '运势平稳，可以按部就班地推进计划' },
    { min: 70, text: '运势向好，适合把握机会，开展新事物' },
    { min: 85, text: '运势优异，宜大胆进取，扩展事业版图' },
    { min: 95, text: '运势极佳，重大事项皆宜，把握黄金机遇' }
  ]
  return descriptions.reverse().find(d => score >= d.min)?.text || ''
}

const getFortuneDescription = (score) => {
  const levels = [
    [90, '极佳'], [80, '优秀'], [70, '良好'],
    [60, '尚可'], [40, '一般'], [0, '欠佳']
  ]
  return levels.find(([min]) => score >= min)?.[1] || ''
}

// 添加月份切换方法
const changeMonth = (delta) => {
  const newDate = dayjs(selectedDate.value).add(delta, 'month')
  selectedDate.value = newDate.format('YYYY-MM-DD')
}

// 添加日期选择处理
const selectDate = (date) => {
  selectedDate.value = date
  fetchFortuneData(date)
}

// 计算属性添加月份显示
const currentMonth = computed(() => {
  return dayjs(selectedDate.value).format('YYYY年M月')
})
</script>

<style lang="scss">
:root {
  --primary-color: #c62828;
  --gap-xs: 0.8rem;  /* 8px */
  --gap-sm: 1.2rem;  /* 12px */
  --gap-md: 1.6rem;  /* 16px */
  --radius: 0.4rem;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fortune-container {
  padding: var(--gap-md);
  max-width: 1200px;
  margin: 0 auto;
  border: var(--pixel-size) solid var(--border-dark);
  box-shadow: var(--pixel-size) var(--pixel-size) 0 rgba(0, 0, 0, 0.8);
  background-color: var(--text-light);
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
}

.fortune-grid {
  display: grid;
  gap: var(--gap-md);
  border: var(--pixel-size) solid var(--border-dark);
  padding: var(--gap-md);
  background-color: var(--text-light);
  box-shadow: var(--pixel-size) var(--pixel-size) 0 rgba(0, 0, 0, 0.8);
  margin-top: var(--gap-sm);
  
  &.core { grid-template-columns: repeat(2, 1fr); }
  &.workplace { grid-template-columns: repeat(3, 1fr); }
  &.social { grid-template-columns: repeat(3, 1fr); }
  &.finance { grid-template-columns: repeat(2, 1fr); }
  &.personal { grid-template-columns: repeat(2, 1fr); }

  @media (min-width: 768px) {
    &.core { grid-template-columns: repeat(4, 1fr); }
    &.personal { grid-template-columns: repeat(4, 1fr); }
  }
}

.fortune-item {
  background: var(--text-light);
  padding: var(--gap-md);
  border: var(--pixel-size) solid var(--border-dark);
  box-shadow: var(--pixel-size) var(--pixel-size) 0 rgba(0, 0, 0, 0.8);
  transition: transform 0.2s;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  
  &:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
  
  .item-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    margin-bottom: 1rem;
  }
  
  .item-icon {
    font-size: 1.6rem;
    color: var(--primary-color);
    flex-shrink: 0;
  }
  
  .item-title {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--border-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .item-score {
    text-align: right;
    font-size: 1.6rem;
    color: var(--primary-color);
    margin: 0.6rem 0;
    flex-shrink: 0;
  }
  
  .item-desc {
    font-size: 1rem;
    color: var(--border-dark);
    line-height: 1.4;
    flex-grow: 1;
    overflow-wrap: break-word;
    word-break: break-all;
  }
}

.advice-section {
  margin-top: var(--gap-lg);
  padding-top: var(--gap-lg);
  border-top: var(--pixel-size) solid var(--border-light);
  
  .advice-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-lg);
  }
  
  .advice-card {
    padding: var(--gap-lg);
    border: var(--pixel-size) solid var(--border-dark);
    background: var(--text-light);
    box-shadow: var(--pixel-size) var(--pixel-size) 0 rgba(0, 0, 0, 0.8);
    transition: all 0.3s ease;
    height: 100%;
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: calc(var(--pixel-size) + 2px) calc(var(--pixel-size) + 2px) 0 rgba(0, 0, 0, 0.8);
    }
    
    &.positive { border-top: calc(var(--pixel-size) * 2) solid #4caf50; }
    &.caution { border-top: calc(var(--pixel-size) * 2) solid #ff9800; }
  }
}

@media (max-width: 480px) {
  .fortune-grid {
    &.core,
    &.workplace,
    &.social,
    &.finance,
    &.personal {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .fortune-item {
    padding: var(--gap-xs);
    .item-title { font-size: 1.2rem; }
    .item-score { font-size: 1.4rem; }
  }
  
  .advice-section {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* 全局弹窗样式 */
.el-message-box {
  background-color: var(--text-light);
  border: var(--pixel-size) solid var(--border-dark);
  box-shadow: 8px 8px 0 var(--border-dark);
  border-radius: 0;
  padding: 20px;
  position: relative;
}

.el-message-box::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px dashed var(--border-dark);
  pointer-events: none;
}

.el-message-box__header {
  padding: 0 0 16px 0;
  border-bottom: var(--pixel-size) dotted var(--border-dark);
}

.el-message-box__title {
  font-size: 20px;
  font-weight: bold;
  color: var(--border-dark);
}

.el-message-box__content {
  padding: 16px 0;
  color: var(--border-dark);
  font-size: 16px;
  line-height: 1.5;
}

.el-message-box__btns {
  padding: 16px 0 0 0;
  border-top: var(--pixel-size) dotted var(--border-dark);
}

.el-message-box__btns button {
  background-color: var(--text-light);
  border: var(--pixel-size) solid var(--border-dark);
  box-shadow: 4px 4px 0 var(--border-dark);
  color: var(--border-dark);
  font-weight: bold;
  padding: 8px 16px;
  margin-left: 16px;
  transition: all 0.2s ease;
}

.el-message-box__btns button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--border-dark);
}

.el-message-box__btns .el-button--primary {
  background-color: var(--accent-color);
}


/* 移动端弹窗样式 */
@media (max-width: 600px) {
  .el-message-box {
    width: 90% !important;
    border-width: 2px;
    box-shadow: 4px 4px 0 var(--border-dark);
  }

  .el-message-box::before {
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-width: 1px;
  }

  .el-message-box__btns button {
    border-width: 1px;
    box-shadow: 2px 2px 0 var(--border-dark);
    padding: 6px 12px;
    margin-left: 8px;
  }

  .el-message-box__btns button:hover {
    transform: none;
    box-shadow: 2px 2px 0 var(--border-dark);
  }
}
</style>

<style scoped>
/* 日历容器 */
.calendar-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  margin-top: 3rem;
  padding-bottom: 2rem;
}

.calendar-tip {
  text-align: center;
  color: var(--border-dark);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: var(--radius);
}

/* 日历头部 */
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.current-month {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
}

.nav-button {
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
}

/* 日历网格 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--gap-sm);
  margin-top: var(--gap-lg);
  
  .day-cell {
    aspect-ratio: 1;
    min-height: 48px;
    padding: var(--gap-sm);
    border: var(--pixel-size) solid var(--border-light);
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &.selected {
      background-color: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(198, 40, 40, 0.2);
      z-index: 1;
    }

    &:hover:not(.selected) {
      background-color: #f5f5f5;
      transform: scale(1.02);
    }
  }
}

.day-number {
  font-size: 1rem;
  font-weight: 500;
  z-index: 1;
}

.today-marker {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  background: #ff9800;
  border-radius: 50%;
}

/* 移动端优化 */
@media (max-width: 480px) {
  .calendar-section {
    padding: 12px;
  }
  
  .current-month {
    font-size: 1.1rem;
  }
  
  .nav-button {
    width: 28px;
    height: 28px;
  }
  
  .weekday-cell {
    font-size: 0.8rem;
    padding: 6px 0;
  }
  
  .day-number {
    font-size: 0.9rem;
  }
  
  .today-marker {
    width: 4px;
    height: 4px;
  }
}

/* 仅调整指定区块样式 */
.overall {
  margin-bottom: 2rem;
  
  .card-header {
    margin-bottom: 1.5rem;
  }
  
  .overall-desc {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-light);
  }
}

.advice-section {
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 0;
    right: 0;
    height: 3px;
    background: repeating-linear-gradient(
      -45deg,
      var(--border-light),
      var(--border-light) 3px,
      transparent 3px,
      transparent 6px
    );
  }
  
  .advice-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .advice-card {
    padding: 1rem;
    border: var(--pixel-size) solid var(--border-dark);
    box-shadow: var(--pixel-size) var(--pixel-size) 0 rgba(0, 0, 0, 0.15);
    background: var(--text-light);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: calc(var(--pixel-size) + 2px) calc(var(--pixel-size) + 2px) 0 rgba(0, 0, 0, 0.15);
    }
    
    .advice-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.8rem;
      color: var(--text-light);
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      display: inline-block;
      position: relative;
    }
  
    &.positive .advice-title {
      background: #4CAF50;
    }
  
    &.caution .advice-title {
      background: #FF9800;
    }
    
    .advice-list {
      list-style: none;
      padding: 0;
      margin: 0.3rem 0 0;
      
      li {
        position: relative;
        padding-left: 1.2rem;
        margin-bottom: 0.5rem;
        line-height: 1.3;
        font-size: 0.95rem;
        color: var(--border-dark);
        
        &:before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--primary-color);
          font-size: 1.2rem;
          line-height: 1;
          top: 0.1rem;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .empty-tip {
        color: var(--text-muted);
        font-style: italic;
        text-align: center;
        padding: 0.8rem 0;
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .advice-section {
    margin-top: 2rem;
    margin-bottom: 2.5rem;
    
    &::after {
      bottom: -1.2rem;
      height: 3px;
    }
    
    .advice-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .advice-card {
      padding: 1.5rem;
      
      .advice-title {
        font-size: 1.2rem;
        margin-bottom: 1.2rem;
        padding-bottom: 0.6rem;
      }
      
      .advice-list li {
        font-size: 1rem;
        padding-left: 1.2rem;
        margin-bottom: 0.8rem;
        
        &:before {
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style>