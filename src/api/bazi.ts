import type { AxiosResponse } from 'axios'
// import request from './request-main'
import requestAPP from './request'

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

// 新API返回的数据结构
interface NewBaziAnalysisResponse {
  id: number
  userId: number
  birthDateTime: string
  gender: '男' | '女'
  analysisType: string
  analysisContent: {
    流年?: string
    流月?: string
    流日?: string
  }
  createdAt: string
  updatedAt: string
  status: string
}

export const analyzeBazi = async (
  userId: string,
  params: BaziAnalysisParams
): Promise<BaziAnalysisResult> => {
  const response: AxiosResponse<BaziAnalysisResult> = await requestAPP.post('/bazi/analysis', {
    user_id: parseInt(userId),
    birth_datetime: params.birth_datetime,
    gender: params.gender,
    analysis_parts: params.analysis_parts || ['流年', '流月', '流日']
  })
  return response.data
}

// 预设的分析部分
export const ANALYSIS_PARTS = {
  FLOW_YEAR: '流年',
  FLOW_MONTH: '流月', 
  FLOW_DAY: '流日'
} as const

// 预设的模型提供商（与 chat.ts 保持一致）
export const PROVIDERS = {
  OLLAMA: 'ollama',
  ZHIPUAI: 'zhipuai',
  DEEPSEEK: 'deepseek',
  GEMINI: 'gemini',
  OPENROUTER: 'openrouter'
} as const

// 预设的模型（与 chat.ts 保持一致）
export const MODELS = {
  GLM_4_FLASH: 'glm-4.5-flash',
  GLM_4V: 'glm-4v',
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat-v3-0324:free',
  DEEPSEEK_CODER: 'deepseek/deepseek-coder-v2:free'
} as const

// ========== 八字分析历史相关类型和接口 ========== //

/**
 * 八字分析记录类型，对应后端结构
 */
export interface BaziAnalysis {
  id: string
  user_id?: string
  birth_year: number
  birth_month: number
  birth_day: number
  birth_time: string
  gender: 'male' | 'female'
  analysis_type: string
  notes?: string
  display_name?: string
  user_nickname?: string
  analysis_results?: Record<string, any>
  summary?: Record<string, any>
  settings?: Record<string, any>
  extra_metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

// 新服务返回的数据结构转换函数
function convertNewToOldFormat(newData: NewBaziAnalysisResponse): BaziAnalysis {
  // 从 birthDateTime 中提取年月日时间
  const birthDate = new Date(newData.birthDateTime)
  
  return {
    id: String(newData.id),
    user_id: String(newData.userId),
    birth_year: birthDate.getFullYear(),
    birth_month: birthDate.getMonth() + 1,
    birth_day: birthDate.getDate(),
    birth_time: birthDate.toTimeString().split(' ')[0],
    gender: newData.gender === '男' ? 'male' : 'female',
    analysis_type: newData.analysisType,
    analysis_results: newData.analysisContent,
    created_at: newData.createdAt,
    updated_at: newData.updatedAt,
    // 保持其他可选字段为 undefined
    notes: undefined,
    display_name: undefined,
    user_nickname: undefined,
    summary: undefined,
    settings: undefined,
    extra_metadata: undefined
  }
}

/**
 * 获取八字分析列表
 * @param params 分页参数
 */
export async function getBaziAnalyses(
  userId: string,
  params?: { skip?: number; limit?: number }
): Promise<BaziAnalysis[]> {
  // 使用新的API路径，默认用户ID为1
  const res = await requestAPP.get(`/bazi/user/${userId}/analyses`, { 
    params: {
      page: params?.skip ? Math.floor(params.skip / (params.limit || 10)) + 1 : 1,
      limit: params?.limit || 10
    }
  })
  // 确保返回的数据是数组
  const analysisArray = Array.isArray(res.data) ? res.data : (res.data?.data || [])
  return analysisArray.map(convertNewToOldFormat)
}

/**
 * 获取单个八字分析
 * @param analysis_id 分析ID
 */
export async function getBaziAnalysis(analysis_id: string): Promise<BaziAnalysis> {
  // 使用新的API路径
  const res = await requestAPP.get(`/bazi/analysis/${analysis_id}`)
  return convertNewToOldFormat(res.data)
}

/**
 * 创建八字分析
 * @param data 分析参数
 */
export async function createBaziAnalysis(
  userId: string,
  data: Omit<BaziAnalysis, 'id' | 'created_at' | 'updated_at'>
): Promise<BaziAnalysis> {
  // 使用新的API路径和参数格式
  const newFormatData = {
    user_id: parseInt(userId),
    birth_datetime: new Date(
      data.birth_year,
      data.birth_month - 1,
      data.birth_day,
      ...data.birth_time.split(':').map(Number)
    ).toISOString(),
    gender: data.gender === 'male' ? '男' : '女',
    analysis_parts: ['流年', '流月', '流日']
  }
  
  const res = await requestAPP.post('/bazi/analysis', newFormatData)
  return convertNewToOldFormat(res.data)
}

/**
 * 更新八字分析 - 空实现
 * @param analysis_id 分析ID
 * @param data 更新字段
 */
export async function updateBaziAnalysis(analysis_id: string, data: Partial<BaziAnalysis>): Promise<BaziAnalysis> {
  // 空实现
  throw new Error('Method not implemented')
}

/**
 * 删除八字分析 - 空实现
 * @param analysis_id 分析ID
 */
export async function deleteBaziAnalysis(analysis_id: string): Promise<void> {
  // 空实现
  throw new Error('Method not implemented')
} 