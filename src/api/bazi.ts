import type { AxiosResponse } from 'axios'
import request from './request-main'
import requestUser from './request-user'
import { 
  PROVIDERS, 
  MODELS, 
  getDefaultModelConfig,
  type ProviderType,
  type ModelType
} from './config'
import { API_ENDPOINTS } from './config'

// 根据API文档更新八字分析参数类型
interface BaziAnalysisParams {
  birth_datetime: string
  current_datetime?: string // 可选，默认为当前时间
  gender: '男' | '女'
  analysis_parts?: string[] // 可选，要分析的部分：流年、流月、流日
  provider?: string // 可选，模型提供商
  model_name?: string // 可选，模型名称
}

interface BaziAnalysisResult {
  success: boolean
  message: string
  data: {
    分析结果: {
      流年: string
      流月: string
      流日: string
    }
    分析类型: string
    分析时间: string
  }
}

// 重试函数
const retryRequest = async (fn: () => Promise<any>, retries = 3, delay = 2000): Promise<any> => {
  try {
    return await fn()
  } catch (error: any) {
    if (retries === 0 || (error.response && error.response.status !== 504)) {
      throw error
    }
    console.log(`请求失败，${delay/1000}秒后重试，剩余重试次数：${retries}`)
    await new Promise(resolve => setTimeout(resolve, delay))
    return retryRequest(fn, retries - 1, delay)
  }
}

// 创建分析任务
export const createAnalysisTask = async (params: BaziAnalysisParams): Promise<{ taskId: string }> => {
  const { provider: defaultProvider, model: defaultModel } = getDefaultModelConfig()
  const requestParams = {
    ...params,
    provider: params.provider || defaultProvider,
    model_name: params.model_name || defaultModel
  }
  
  const response = await request.post('/bazi/ai/create-task', requestParams)
  return response.data
}

// 获取任务状态
export const getAnalysisStatus = async (taskId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: BaziAnalysisResult
  error?: string
}> => {
  const response = await request.get(`/bazi/ai/task-status/${taskId}`)
  return response.data
}

// 轮询任务结果
export const pollAnalysisResult = async (
  taskId: string, 
  { maxAttempts = 30, interval = 2000 } = {}
): Promise<BaziAnalysisResult> => {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    const { status, result, error } = await getAnalysisStatus(taskId)
    
    if (status === 'completed' && result) {
      return result
    }
    
    if (status === 'failed') {
      throw new Error(error || '分析失败')
    }
    
    if (status === 'pending' || status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, interval))
      attempts++
      continue
    }
  }
  
  throw new Error('分析超时，请稍后重试')
}

// 兜底模型配置
const FALLBACK_CONFIG = {
  PROVIDER: PROVIDERS.ZHIPUAI,
  MODEL: MODELS.GLM_4_FLASH_250414
} as const

// 主分析函数
export const analyzeBazi = async (params: BaziAnalysisParams): Promise<BaziAnalysisResult> => {
  const tryWithModel = async (provider: string, model: string) => {
    const requestParams = {
      ...params,
      provider,
      model_name: model
    }
    
    try {
      // 1. 创建任务
      const { taskId } = await createAnalysisTask(requestParams)
      
      // 2. 轮询结果（最多等待 60 秒）
      return await pollAnalysisResult(taskId, {
        maxAttempts: 30,  // 30次尝试
        interval: 2000    // 每2秒一次
      })
    } catch (error: any) {
      // 如果后端未实现异步接口，降级到同步调用
      if (error.response?.status === 404) {
        console.warn('后端未实现异步接口，使用同步调用')
        return retryRequest(async () => {
          const response = await request.post('/bazi/ai', requestParams)
          return response.data
        })
      }
      throw error
    }
  }

  try {
    // 首先尝试使用指定的模型
    return await tryWithModel(
      params.provider || getDefaultModelConfig().provider,
      params.model_name || getDefaultModelConfig().model
    )
  } catch (error: any) {
    console.warn('主模型分析失败，尝试使用兜底模型:', error)
    
    // 特定错误才使用兜底模型（超时、模型不可用等）
    if (
      error.name === 'AbortError' || // 超时
      error.response?.status === 503 || // 服务不可用
      error.message.includes('model not available') || // 模型不可用
      error.message.includes('timeout') // 超时相关错误
    ) {
      try {
        console.log('使用兜底模型重试:', FALLBACK_CONFIG)
        return await tryWithModel(FALLBACK_CONFIG.PROVIDER, FALLBACK_CONFIG.MODEL)
      } catch (fallbackError) {
        console.error('兜底模型也失败了:', fallbackError)
        throw fallbackError // 如果兜底模型也失败，则抛出错误
      }
    }
    
    // 其他错误直接抛出
    throw error
  }
}

// 预设的分析部分
export const ANALYSIS_PARTS = {
  FLOW_YEAR: '流年',
  FLOW_MONTH: '流月', 
  FLOW_DAY: '流日'
} as const

// 从配置文件导入的常量已在文件顶部导入，这里不再重复定义

// ========== 八字分析历史相关类型和接口 ========== //

/**
 * 八字分析记录类型，对应后端结构
 */
export interface BaziAnalysis {
  id: string
  client_analysis_id: string
  user_id?: string
  birth_year: number
  birth_month: number
  birth_day: number
  birth_time: string
  gender: 'male' | 'female'
  analysis_type: string
  notes?: string
  display_name?: string // 新增
  user_nickname?: string // 新增
  analysis_results?: Record<string, any> // 新增，JSON
  summary?: Record<string, any> // 新增，JSON
  settings?: Record<string, any> // 新增，JSON
  extra_metadata?: Record<string, any> // 新增，JSON
  sync_status: 'pending' | 'synced' | 'failed' | 'conflict'
  created_at: string
  updated_at: string
}

/**
 * 获取八字分析列表
 * @param params 分页参数
 */
export async function getBaziAnalyses(params?: { skip?: number; limit?: number }): Promise<BaziAnalysis[]> {
  const res = await requestUser.get('/bazi/analyses', { params })
  return res.data as BaziAnalysis[]
}

/**
 * 获取单个八字分析
 * @param analysis_id 分析ID
 */
export async function getBaziAnalysis(analysis_id: string): Promise<BaziAnalysis> {
  const res = await requestUser.get(`/bazi/analyses/${analysis_id}`)
  return res.data as BaziAnalysis
}

/**
 * 创建八字分析
 * @param data 分析参数
 */
export async function createBaziAnalysis(
  data: Omit<BaziAnalysis, 'id' | 'created_at' | 'updated_at' | 'sync_status'> & { client_analysis_id: string }
): Promise<BaziAnalysis> {
  const res = await requestUser.post('/bazi/analyses', data)
  return res.data as BaziAnalysis
}

/**
 * 更新八字分析
 * @param analysis_id 分析ID
 * @param data 更新字段
 */
export async function updateBaziAnalysis(analysis_id: string, data: Partial<BaziAnalysis>): Promise<BaziAnalysis> {
  const res = await requestUser.put(`/bazi/analyses/${analysis_id}`, data)
  return res.data as BaziAnalysis
}

/**
 * 删除八字分析
 * @param analysis_id 分析ID
 */
export async function deleteBaziAnalysis(analysis_id: string): Promise<void> {
  await requestUser.delete(`/bazi/analyses/${analysis_id}`)
}

/**
 * 同步八字分析（批量）
 * @param analysis_ids 分析ID数组
 * @param force_sync 是否强制同步
 */
export async function syncBaziAnalyses(analysis_ids: string[], force_sync = false): Promise<any> {
  const res = await requestUser.post('/bazi/analyses/sync', { analysis_ids, force_sync })
  return res.data
}

/**
 * 按同步状态获取分析
 * @param sync_status 同步状态
 * @param params 分页参数
 */
export async function getBaziAnalysesBySyncStatus(sync_status: string, params?: { skip?: number; limit?: number }): Promise<BaziAnalysis[]> {
  const res = await requestUser.get(`/bazi/analyses/sync-status/${sync_status}`, { params })
  return res.data as BaziAnalysis[]
}

/**
 * 每日运势分析
 * @param params { birth_datetime, current_datetime, gender }
 * @returns 后端返回的运势评分数据
 */
export async function fetchFortuneAnalysis(params: {
  birth_datetime: string
  current_datetime: string
  gender: '男' | '女'
}): Promise<any> {
  return retryRequest(async () => {
    const res = await request.post('/bazi/fortune', params)
    return res.data
  })
} 

export async function analyzeTenYearsSingle(params: {
  birth_datetime: string
  current_datetime: string
  gender: '男' | '女'
  provider?: string
  model_name?: string
}): Promise<any> {
  const { provider: defaultProvider, model: defaultModel } = getDefaultModelConfig()
  const requestParams = {
    ...params,
    provider: params.provider || defaultProvider,
    model_name: params.model_name || defaultModel
  }
  return retryRequest(async () => {
    try {
      const res = await request.post(API_ENDPOINTS.TEN_YEARS_SINGLE, requestParams, {
        headers: { accept: 'application/json' }
      })
      return res.data
    } catch (error: any) {
      if (error.response?.status === 500) {
        const minimal = {
          birth_datetime: params.birth_datetime,
          current_datetime: params.current_datetime,
          gender: params.gender
        }
        const res2 = await request.post(API_ENDPOINTS.TEN_YEARS_SINGLE, minimal, {
          headers: { accept: 'application/json' }
        })
        return res2.data
      }
      throw error
    }
  })
}

/**
 * 生肖运势分析参数
 */
interface ZodiacFortuneParams {
  current_datetime?: string // 可选，默认为当前时间
  birth_datetime?: string // 可选，用户出生日期时间
  gender?: '男' | '女' // 可选，性别
  provider?: string // 可选，模型提供商
  model_name?: string // 可选，模型名称
}

/**
 * 单个生肖运势信息
 */
interface ZodiacFortuneInfo {
  地支: string
  关系类型: string
  关系程度: string
  强度值: number
  影响范围: string
  运势描述: string
}

/**
 * 关系统计信息
 */
interface RelationStatistics {
  生肖列表: string[]
  数量: number
  程度: string
  强度值: number
}

/**
 * 生肖运势响应数据
 */
interface ZodiacFortuneData {
  分析时间: string
  今日地支: string
  运势分析: string
  生肖运势: Record<string, ZodiacFortuneInfo>
  关系统计: Record<string, RelationStatistics>
}

/**
 * 生肖运势分析响应
 */
export interface ZodiacFortuneResponse {
  success: boolean
  message: string
  data: ZodiacFortuneData
}

// 生肖名称映射
export const ZODIAC_NAMES = {
  '鼠': 'Rat',
  '牛': 'Ox', 
  '虎': 'Tiger',
  '兔': 'Rabbit',
  '龙': 'Dragon',
  '蛇': 'Snake',
  '马': 'Horse',
  '羊': 'Goat',
  '猴': 'Monkey',
  '鸡': 'Rooster',
  '狗': 'Dog',
  '猪': 'Pig'
} as const

// 生肖颜色映射
export const ZODIAC_COLORS = {
  '鼠': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  '牛': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
  '虎': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  '兔': 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
  '龙': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  '蛇': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  '马': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  '羊': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
  '猴': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
  '鸡': 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
  '狗': 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200',
  '猪': 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
} as const

// ========== 生肖运势缓存逻辑 ========== //

/**
 * 生肖运势缓存项
 */
interface ZodiacFortuneCache {
  data: ZodiacFortuneResponse['data']
  timestamp: number
  params: ZodiacFortuneParams
}

/**
 * 生肖运势缓存键生成
 */
function generateCacheKey(params: ZodiacFortuneParams): string {
  const keyParts = [
    params.current_datetime || 'today',
    params.birth_datetime || 'no-birth',
    params.gender || 'no-gender',
    params.provider || 'default',
    params.model_name || 'default'
  ]
  return `zodiac-fortune:${keyParts.join(':')}`
}

/**
 * 检查是否为同一天
 */
function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1)
  const date2 = new Date(timestamp2)
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

/**
 * 获取生肖运势缓存
 */
export function getZodiacFortuneCache(params: ZodiacFortuneParams): ZodiacFortuneResponse['data'] | null {
  try {
    const cacheKey = generateCacheKey(params)
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      const cacheData: ZodiacFortuneCache = JSON.parse(cached)
      const now = Date.now()
      
      // 检查是否为同一天
      if (isSameDay(cacheData.timestamp, now)) {
        console.log('使用生肖运势缓存数据')
        return cacheData.data
      } else {
        // 不是同一天，清除过期缓存
        localStorage.removeItem(cacheKey)
      }
    }
  } catch (error) {
    console.warn('读取生肖运势缓存失败:', error)
  }
  
  return null
}

/**
 * 设置生肖运势缓存
 */
export function setZodiacFortuneCache(params: ZodiacFortuneParams, data: ZodiacFortuneResponse['data']): void {
  try {
    const cacheKey = generateCacheKey(params)
    const cacheData: ZodiacFortuneCache = {
      data,
      timestamp: Date.now(),
      params
    }
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    console.log('生肖运势数据已缓存')
  } catch (error) {
    console.warn('设置生肖运势缓存失败:', error)
  }
}

/**
 * 清除生肖运势缓存
 */
export function clearZodiacFortuneCache(params?: ZodiacFortuneParams): void {
  try {
    if (params) {
      // 清除特定参数的缓存
      const cacheKey = generateCacheKey(params)
      localStorage.removeItem(cacheKey)
      console.log('已清除特定生肖运势缓存')
    } else {
      // 清除所有生肖运势缓存
      const keys = Object.keys(localStorage)
      const zodiacKeys = keys.filter(key => key.startsWith('zodiac-fortune:'))
      zodiacKeys.forEach(key => localStorage.removeItem(key))
      console.log('已清除所有生肖运势缓存')
    }
  } catch (error) {
    console.warn('清除生肖运势缓存失败:', error)
  }
}

/**
 * 生肖运势分析API（带缓存）
 * @param params 分析参数
 * @param forceRefresh 是否强制刷新（忽略缓存）
 * @returns Promise<ZodiacFortuneResponse>
 */
export async function analyzeZodiacFortune(params: ZodiacFortuneParams = {}, forceRefresh = false): Promise<ZodiacFortuneResponse> {
  // 使用默认配置，除非明确指定了其他配置
  const { provider: defaultProvider, model: defaultModel } = getDefaultModelConfig()
  const requestParams = {
    ...params,
    provider: params.provider || defaultProvider,
    model_name: params.model_name || defaultModel
  }
  
  // 如果不是强制刷新，先检查缓存
  if (!forceRefresh) {
    const cachedData = getZodiacFortuneCache(requestParams)
    if (cachedData) {
      return {
        success: true,
        message: '从缓存获取生肖运势数据',
        data: cachedData
      }
    }
  }
  
  // 请求新数据
  const response: AxiosResponse<ZodiacFortuneResponse> = await request.post('/bazi/zodiac-fortune', requestParams)
  
  // 缓存成功的数据
  if (response.data.success) {
    setZodiacFortuneCache(requestParams, response.data.data)
  }
  
  return response.data
}

// ========== 基础分析和用神分析接口 ========== //

/**
 * 基础分析参数
 */
interface BaseAnalysisParams {
  birth_datetime: string
  current_datetime: string
  gender: '男' | '女'
}

/**
 * 基础分析响应数据结构
 */
interface BaseAnalysisData {
  基础分析: {
    性别: string
    八字信息: {
      年柱: {
        干支组合: { 天干: string; 地支: string }
        五行属性: { 天干五行: string; 地支五行: string }
      }
      月柱: {
        干支组合: { 天干: string; 地支: string }
        五行属性: { 天干五行: string; 地支五行: string }
      }
      日柱: {
        干支组合: { 天干: string; 地支: string }
        五行属性: { 天干五行: string; 地支五行: string }
      }
      时柱: {
        干支组合: { 天干: string; 地支: string }
        五行属性: { 天干五行: string; 地支五行: string }
      }
    }
    五行统计: {
      五行分布: Record<string, number>
      最强五行: string
      最弱五行: string
    }
    当前大运信息: {
      天干: string
      地支: string
      五行: { 天干五行: string; 地支五行: string }
    }
    流年流月流日信息: {
      流年: {
        天干: string
        地支: string
        五行: { 天干五行: string; 地支五行: string }
      }
      流月: {
        天干: string
        地支: string
        五行: { 天干五行: string; 地支五行: string }
      }
      流日: {
        天干: string
        地支: string
        五行: { 天干五行: string; 地支五行: string }
      }
    }
  }
}

/**
 * 基础分析响应
 */
export interface BaseAnalysisResponse {
  success: boolean
  message: string
  data: BaseAnalysisData
}

/**
 * 用神分析响应数据结构
 */
interface YongshenAnalysisData {
  格局: string
  用神: string[]
  忌神: string[]
  取用: string
  大运分析: Record<string, any>
  分析: string
}

/**
 * 用神分析响应
 */
export interface YongshenAnalysisResponse {
  success: boolean
  message: string
  data: YongshenAnalysisData
}

/**
 * 基础分析API
 * @param params 分析参数
 * @returns Promise<BaseAnalysisResponse>
 */
export async function analyzeBase(params: BaseAnalysisParams): Promise<BaseAnalysisResponse> {
  return retryRequest(async () => {
    const response = await request.post('/bazi/base', params)
    return response.data
  })
}

/**
 * 用神分析API
 * @param params 分析参数
 * @returns Promise<YongshenAnalysisResponse>
 */
export async function analyzeYongshen(params: BaseAnalysisParams): Promise<YongshenAnalysisResponse> {
  return retryRequest(async () => {
    const response = await request.post('/bazi/yongshen', params)
    return response.data
  })
}

// ========== 运势范围分析接口 ========== //

/**
 * 运势范围分析参数
 */
interface FortuneRangeParams {
  birth_datetime: string
  start_date: string
  end_date: string
  gender: '男' | '女'
}

/**
 * 运势范围分析响应
 */
export interface FortuneRangeResponse {
  success: boolean
  message: string
  data: any[]
}

/**
 * 运势范围分析API
 * @param params 分析参数
 * @returns Promise<FortuneRangeResponse>
 */
export async function analyzeFortuneRange(params: FortuneRangeParams): Promise<any[]> {
  return retryRequest(async () => {
    const response = await request.post('/bazi/fortune_range', params)
    return response.data
  })
}
