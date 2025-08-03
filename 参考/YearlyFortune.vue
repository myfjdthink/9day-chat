<template>
  <div class="pixel-page">
    <!-- SEO Meta Tags -->
    <el-teleport to="head">
      <title>年运分析 - 北斗九号日历</title>
      <meta name="description" content="北斗九号日历提供专业的年运分析服务，为您解析全年运势，提供每月运势预测和指导建议。">
      <meta name="keywords" content="年运分析,运势预测,月运分析,北斗九号">
      <meta property="og:title" content="年运分析 - 北斗九号日历">
      <meta property="og:description" content="北斗九号日历提供专业的年运分析服务，为您解析全年运势，提供每月运势预测和指导建议。">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="北斗九号">
      <meta property="og:url" content="https://www.9day.tech/yearly-fortune">
      <meta property="og:image" content="https://www.9day.tech/icons/icon-192x192.png">
    </el-teleport>

    <div class="pixel-card">
      <!-- 顶部标题栏 -->
      <div class="pixel-title-bar">
        <div class="left">
          <el-button class="pixel-theme" @click="navigateToHome">
            返回首页
          </el-button>
        </div>
        <div class="right">
          <el-button class="pixel-theme" @click="handleReset" :loading="loading">
            重新分析
          </el-button>
        </div>
      </div>

      <!-- 表单部分，移除条件渲染 -->
      <div class="input-layout">
        <div class="form-container">
          <div class="pixel-form">
            <el-form :model="formData" label-width="120px" class="pixel-theme">
              <el-form-item label="出生日期">
                <div class="date-picker-container">
                  <el-date-picker
                    v-model="formData.birthDate"
                    type="datetime"
                    placeholder="选择出生日期和时间"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm"
                    :default-time="new Date(1999, 9, 9, 9, 0, 0)"
                    :size="isMobile ? 'large' : 'default'"
                    :editable="false"
                    :clearable="false"
                    :teleported="true"
                    :popper-class="isMobile ? 'mobile-date-picker' : ''"
                  />
                  <div class="date-example">
                    示例：1999-09-09 09:00
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="性别">
                <el-radio-group v-model="formData.gender">
                  <el-radio value="男">男</el-radio>
                  <el-radio value="女">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="分析年份">
                <el-radio-group v-model="formData.selectedYear" class="year-selector">
                  <el-radio :value="2024">2024年</el-radio>
                  <el-radio :value="2025">2025年</el-radio>
                  <el-radio :value="2026">2026年</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item>
                <div class="form-buttons-container">
                  <el-button 
                    type="primary" 
                    @click="handleAnalyze" 
                    :loading="loading"
                    class="analysis-btn"
                  >
                    开始分析
                  </el-button>
                  <el-button
                    type="success"
                    :disabled="!hasAnyResult"
                    @click="captureAndDownload"
                    :loading="savingImage"
                    class="save-btn"
                  >
                    📷 保存报告
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 营销提示部分 -->
        <div class="marketing-container">
          <div class="marketing-tip">
            <div class="tip-content">
              <span class="sparkle">✨</span>
              温馨提示，个人年度运势分析过程大概需要 3-5 分钟，请你耐心等待一下哟！
            </div>
          </div>
        </div>
      </div>

      <!-- 分析进度显示 -->
      <template v-if="loading">        
        <div class="pixel-section">
          <div class="progress-container">
            <div class="progress-title">分析进度</div>
            <div class="progress-list">
              <div class="progress-item" :class="{ 'done': analysisStatus.year.done }">
                <span class="progress-icon">{{ analysisStatus.year.done ? '✓' : '⋯' }}</span>
                <span class="progress-text">{{ analysisStatus.year.done ? '年运分析完成' : '正在分析年运...' }}</span>
              </div>
              <div v-for="(month, index) in analysisStatus.months" :key="index"
                   class="progress-item" :class="{ 'done': month.done }">
                <span class="progress-icon">{{ month.done ? '✓' : '⋯' }}</span>
                <span class="progress-text">{{ month.done ? `${index === 11 ? nextYear : currentYear}年${index === 11 ? 1 : index + 2}月运分析完成` : `正在分析${index === 11 ? nextYear : currentYear}年${index === 11 ? 1 : index + 2}月运...` }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 分析结果展示区域 -->
      <div v-if="hasStartedAnalysis || hasAnyResult" class="pixel-section">
        

        <div class="fortune-content">
          <!-- 年运分析 -->
          <div class="fortune-section" v-if="yearAnalysis">
            <div class="fortune-main-title">{{ currentYear }}年运分析</div>
            <div class="fortune-text" v-html="yearAnalysis"></div>
            <div v-if="yearAnalysisTime" class="analysis-meta">
              <div class="meta-item">
                <div class="analysis-time">分析时间：{{ formatAnalysisTime(yearAnalysisTime) }}</div>
                <div class="website-mark">来源：www.9day.tech</div>
              </div>
            </div>
          </div>

          <!-- 月运分析 -->
          <div v-for="month in Object.keys(monthAnalyses).sort((a, b) => {
               const monthA = Number(a);
               const monthB = Number(b);
               // 特殊处理1月，将其排在最后
               if (monthA === 1) return 1;
               if (monthB === 1) return -1;
               return monthA - monthB;
             })" 
               :key="month" 
               class="fortune-section">
            <div class="fortune-main-title">
              {{ month === '1' ? `${nextYear}年1` : `${currentYear}年${month}` }}月运分析
            </div>
            <div class="fortune-text" v-html="monthAnalyses[month].content"></div>
            <div v-if="monthAnalyses[month].analysisTime" class="analysis-meta">
              <div class="meta-item">
                <div class="analysis-time">分析时间：{{ formatAnalysisTime(monthAnalyses[month].analysisTime) }}</div>
                <div class="website-mark">来源：www.9day.tech</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { useUserStore } from '../stores/user'
import { fetchYearAnalysis, fetchMonthAnalysis } from '../api/bazi'
import html2canvas from 'html2canvas'
import { marked } from 'marked'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const formData = reactive({
  birthDate: '',
  gender: '男',
  selectedYear: 2024
})

// 状态管理
const loading = ref(false)
const yearAnalysis = ref('')
const yearAnalysisTime = ref('')
const monthAnalyses = reactive({})
const currentYear = computed(() => formData.selectedYear)
const nextYear = computed(() => currentYear.value + 1)

// 本地缓存相关
const CACHE_KEY = 'yearlyFortuneCache'
const cacheData = ref(null)

// 保存分析结果到本地缓存
const saveToCache = () => {
  const data = {
    yearAnalysis: yearAnalysis.value,
    yearAnalysisTime: yearAnalysisTime.value,
    monthAnalyses: { ...monthAnalyses },
    selectedYear: currentYear.value,
    timestamp: new Date().getTime()
  }
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
}

// 从本地缓存加载分析结果
const loadFromCache = () => {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      const data = JSON.parse(cached)
      // 检查缓存是否过期（24小时）
      const now = new Date().getTime()
      if (now - data.timestamp <= 24 * 60 * 60 * 1000) {
        yearAnalysis.value = data.yearAnalysis
        yearAnalysisTime.value = data.yearAnalysisTime
        Object.assign(monthAnalyses, data.monthAnalyses)
        formData.selectedYear = data.selectedYear
        return true
      }
    } catch (e) {
      console.error('缓存数据解析失败:', e)
    }
  }
  return false
}

// 移动设备检测
const isMobile = computed(() => {
  return window.innerWidth <= 768
})

// 分析状态追踪
const analysisStatus = reactive({
  year: { done: false },
  months: Array(12).fill().map(() => ({ done: false }))
})

// 计算属性
const hasStartedAnalysis = computed(() => loading.value)
const hasAnyResult = computed(() => yearAnalysis.value || Object.keys(monthAnalyses).length > 0)

// 新增保存状态
const savingImage = ref(false)

// 截图方法
const captureAndDownload = async () => {
  try {
    savingImage.value = true
    const element = document.querySelector('.pixel-section')
    
    // 创建更醒目的水印
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
        const section = clonedDoc.querySelector('.pixel-section')
        section.style.position = 'relative' // 确保水印定位正确
        section.appendChild(watermark)
      }
    })

    // 生成图片并下载
    const link = document.createElement('a')
    link.download = `9day_年运报告_${dayjs().format('YYYYMMDD_HHmmss')}.png`
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

// 格式化分析时间
const formatAnalysisTime = (time) => {
  if (!time) return '未知时间'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 导航方法
const navigateToHome = () => {
  router.push('/')
}

// 重置分析状态
const handleReset = () => {
  // 清除缓存数据
  localStorage.removeItem(CACHE_KEY)
  // 重置分析结果
  yearAnalysis.value = ''
  yearAnalysisTime.value = ''
  Object.keys(monthAnalyses).forEach(key => delete monthAnalyses[key])
  // 重置表单数据
  formData.selectedYear = new Date().getFullYear()
  // 重置分析状态
  analysisStatus.year.done = false
  analysisStatus.months.forEach(month => month.done = false)
  // 重置加载状态
  loading.value = false
}

// 获取分析参数
const getAnalysisParams = (date) => {
  if (!formData.birthDate) {
    throw new Error('请选择出生日期和时间')
  }

  const birthDate = dayjs(formData.birthDate)
  const isYearAnalysis = dayjs(date).month() === 1 && dayjs(date).date() === 14
  
  const params = {
    birth_datetime: formData.birthDate,
    current_datetime: dayjs(date).format('YYYY-MM-DDTHH:mm:00'),
    gender: formData.gender === '男' ? 'male' : 'female',
    analysis_parts: isYearAnalysis ? ['流年'] : ['流月']
  }

  return params
}

// 处理分析结果
const handleAnalysisResult = (date, result) => {
  const month = dayjs(date).month() + 1
  
  if (month === 2 && dayjs(date).date() === 14) {
    // 处理年运分析
    if (result.success && result.data) {
      const yearContent = result.data?.分析结果?.流年 || '暂无年运分析数据'
      yearAnalysis.value = marked(yearContent)
      yearAnalysisTime.value = result.data?.分析时间
      analysisStatus.year.done = true
      // 保存到缓存
      saveToCache()
    } else if (result.error) {
      console.error('年运分析失败:', result.error)
      yearAnalysis.value = '年运分析暂时无法获取，请稍后重试'
      analysisStatus.year.done = true
    }
  } else {
    // 处理月运分析
    if (result.success && result.data) {
      const monthContent = result.data?.分析结果?.流月 || `暂无${month}月运分析数据`
      const isNextYearJanuary = month === 1
      monthAnalyses[month] = {
        content: marked(monthContent),
        analysisTime: result.data?.分析时间,
        year: isNextYearJanuary ? nextYear.value : currentYear.value
      }
      const monthIndex = isNextYearJanuary ? 11 : month - 2
      analysisStatus.months[monthIndex].done = true
      // 保存到缓存
      saveToCache()
    } else if (result.error) {
      console.error(`${month}月运分析失败:`, error)
      const isNextYearJanuary = month === 1
      monthAnalyses[month] = {
        content: `${month}月运分析暂时无法获取，请稍后重试`,
        analysisTime: new Date().toISOString(),
        year: isNextYearJanuary ? nextYear.value : currentYear.value
      }
      const monthIndex = isNextYearJanuary ? 11 : month - 2
      analysisStatus.months[monthIndex].done = true
    }
  }
}

// 队列处理API请求
const processQueue = async (dates) => {
  const timeout = 30000
  const retryDelay = 2000
  const maxRetries = 3
  const batchSize = 3 // 每批处理的请求数量改为3个
  let isCancelled = false

  // 监听路由变化
  const stopRouteWatch = router.beforeEach(() => {
    isCancelled = true
    return true
  })

  try {
    // 按批次处理请求
    for (let i = 0; i < dates.length; i += batchSize) {
      if (isCancelled) break

      const batch = dates.slice(i, i + batchSize)
      const batchPromises = batch.map(async (date) => {
        let retries = 0
        while (retries < maxRetries) {
          try {
            const params = getAnalysisParams(date)
            const isYearAnalysis = dayjs(date).month() === 1 && dayjs(date).date() === 14
            const result = isYearAnalysis
              ? await fetchYearAnalysis(params)
              : await fetchMonthAnalysis(params)
            handleAnalysisResult(date, result)
            return
          } catch (error) {
            retries++
            if (retries === maxRetries) {
              console.error(`分析请求失败 (${dayjs(date).format('YYYY-MM')}):`, error)
              handleAnalysisResult(date, { error })
            } else {
              await new Promise(resolve => setTimeout(resolve, retryDelay))
            }
          }
        }
      })

      await Promise.all(batchPromises.map(p => Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), timeout))]))).catch(error => {
        console.error('批量请求出错:', error)
      })

      // 批次间增加延迟，避免请求过于密集
      if (i + batchSize < dates.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  } finally {
    stopRouteWatch()
  }
}

// 执行分析
const handleAnalyze = async () => {
  if (!formData.birthDate) {
    ElMessage.warning('请选择出生日期和时间')
    return
  }

  // 清除旧的缓存数据
  // 重置所有状态但不刷新页面
  localStorage.removeItem(CACHE_KEY)
  yearAnalysis.value = ''
  Object.keys(monthAnalyses).forEach(key => delete monthAnalyses[key])
  
  try {
    loading.value = true
    analysisStatus.year.done = false
    analysisStatus.months.forEach(month => month.done = false)

    const dates = []
    // 添加年运分析日期（2月14日）
    dates.push(dayjs(`${formData.selectedYear}-02-14 12:00:00`))

    // 添加月运分析日期（从2月开始到次年1月，每月15日）
    for (let month = 2; month <= 12; month++) {
      dates.push(dayjs(`${formData.selectedYear}-${String(month).padStart(2, '0')}-15 12:00:00`))
    }
    // 添加次年1月的分析日期（1月15日）
    dates.push(dayjs(`${Number(formData.selectedYear) + 1}-01-15 12:00:00`))

    await processQueue(dates)
  } catch (error) {
    console.error('分析过程出错:', error)
    ElMessage.error('分析过程出错，请稍后重试')
  } finally {
    loading.value = false
  }
}



// 在状态管理部分后添加
// 自动填充用户八字信息
const autoFillBaziInfo = () => {
  const baziInfo = userStore.getBaziInfo
  if (baziInfo) {
    const { birth_year, birth_month, birth_day, birth_time, gender } = baziInfo
    // 格式化日期时间
    const birthDateTime = `${birth_year}-${String(birth_month).padStart(2, '0')}-${String(birth_day).padStart(2, '0')} ${birth_time || '12:00'}`
    formData.birthDate = birthDateTime
    formData.gender = gender === 'male' ? '男' : '女'
  }
}

// 在组件挂载时获取用户信息
onMounted(async () => {
  try {
    // 如果用户已登录，获取并填充八字信息
    if (userStore.isLoggedIn) {
      await userStore.fetchUserInfo()
      autoFillBaziInfo()
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.warning('获取用户信息失败，请手动填写信息')
  }
})
</script>



<style scoped>
.pixel-page {
  padding: 20px;
  min-height: 100vh;
  background: #f5f5f5;
}

.pixel-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 20px;
}

.pixel-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 表单样式 */
.input-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.form-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.pixel-form {
  max-width: 600px;
  margin: 0 auto;
}

.date-picker-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date-example {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.form-buttons-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.analysis-btn {
  min-width: 120px;
}

/* 营销提示样式 */
.marketing-container {
  margin-top: 20px;
}

.marketing-tip {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #01579b;
}

.sparkle {
  font-size: 20px;
  animation: sparkle 1.5s infinite alternate;
}

@keyframes sparkle {
  0% { opacity: 0.6; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1.1); }
}

/* 进度显示样式 */
.progress-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
}

.progress-item.done {
  color: #67c23a;
}

.progress-icon {
  font-size: 18px;
}

/* 分析结果样式 */
.fortune-section {
  margin-bottom: 30px;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.fortune-main-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
  border-bottom: 3px solid #409eff;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

.fortune-main-title::before {
  content: '✨';
  margin-right: 10px;
  font-size: 20px;
}

.fortune-text {
  font-size: clamp(13px, 2.5vw, 14px);
  line-height: 1.5;
}

.fortune-text :deep(h3) {
  font-size: clamp(14px, 3vw, 16px);
  font-weight: bold;
  margin: 10px 0 6px 0;
  padding: clamp(6px, 2vw, 8px) clamp(8px, 2vw, 12px);
  background-color: #f0f0f0;
  border-bottom: 2px solid #000;
}

.fortune-text :deep(p) {
  margin: 6px 0;
  line-height: 1.6;
  text-indent: 2em;
}

.fortune-section {
  margin-bottom: 16px;
  padding: clamp(12px, 2.5vw, 16px);
}

.fortune-main-title {
  padding: clamp(6px, 2vw, 8px) clamp(10px, 2.5vw, 12px);
  font-size: clamp(14px, 3vw, 16px);
  font-weight: bold;
  margin-bottom: 12px;
  background-color: #E6E6FA;
  border-bottom: 2px solid #000;
}

.fortune-text {
  line-height: 1.6;
  color: #606266;
}

.analysis-meta {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #909399;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-content {
  text-align: center;
  padding: 40px 0;
}

.loading-animation {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .pixel-page {
    padding: 10px;
  }

  .fortune-section {
    padding: 15px;
  }

  .fortune-main-title {
    font-size: 18px;
  }
  
  .form-container {
    padding: 15px;
  }
  
  .tip-content {
    font-size: 14px;
  }
}
</style>