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

// 简化后的分析结果类型
interface BaziAnalysisResult {
  分析结果: {
    流年?: string
    流月?: string
    流日?: string
  }
  分析类型: string
  分析时间: string
}

// 新API返回的数据结构
interface NewBaziAnalysisResponse {
  id: number
  userId: number
  createdAt: string
  updatedAt: string
  analysisType: string
  status: string
  birthDateTime: string
  birthLocation: string | null
  gender: 'MALE' | 'FEMALE'
  analysisParts: string[]
  targetYear: number | null
  analysisContent: Record<string, any> | null
  errorMessage: string | null
}

interface APIResponse<T> {
  data: T
  code: number
  message: string
}

export const analyzeBazi = async (
  userId: string,
  params: BaziAnalysisParams
): Promise<BaziAnalysis> => {
  const response = await requestAPP.post<NewBaziAnalysisResponse>('/bazi/analysis', {
    user_id: parseInt(userId),
    birth_datetime: params.birth_datetime,
    gender: params.gender,
    analysis_parts: params.analysis_parts || ['流年', '流月', '流日']
  })

  return convertNewToOldFormat(response.data)
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

// 八字分析状态枚举
export enum AnalysisStatus {
  PROCESSING = 'PROCESSING', // 分析中
  COMPLETED = 'COMPLETED',   // 分析完成
  FAILED = 'FAILED'         // 分析失败
}

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
  status: AnalysisStatus
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
  const birthDate = new Date(newData.birthDateTime)
  
  return {
    id: String(newData.id),
    user_id: String(newData.userId),
    birth_year: birthDate.getFullYear(),
    birth_month: birthDate.getMonth() + 1,
    birth_day: birthDate.getDate(),
    birth_time: birthDate.toTimeString().slice(0, 5),
    gender: newData.gender === 'MALE' ? 'male' : 'female',
    analysis_type: newData.analysisType,
    analysis_results: newData.analysisContent || undefined,
    created_at: newData.createdAt,
    updated_at: newData.updatedAt,
    status: newData.status as AnalysisStatus,
    notes: newData.errorMessage || undefined,
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
  const response = await requestAPP.get<APIResponse<{data: NewBaziAnalysisResponse[]}>>(`/bazi/user/${userId}/analyses`, { 
    params: {
      page: params?.skip ? Math.floor(params.skip / (params.limit || 10)) + 1 : 1,
      limit: params?.limit || 10
    }
  })
  console.log('getBaziAnalyses response:', response)
  // 确保返回的数据是数组
  const analysisArray = Array.isArray(response.data.data) ? response.data.data : []
  return analysisArray.map(item => convertNewToOldFormat(item))
}

/**
 * 获取单个八字分析
 * @param analysis_id 分析ID
 */
export async function getBaziAnalysis(analysis_id: string): Promise<BaziAnalysis> {
  const response = await requestAPP.get<NewBaziAnalysisResponse>(`/bazi/analysis/${analysis_id}`)
  console.log('getBaziAnalysis response:', response)
  return convertNewToOldFormat(response.data)
}

/**
 * 创建八字分析
 * @param data 分析参数
 */
export async function createBaziAnalysis(
  userId: string,
  data: Omit<BaziAnalysis, 'id' | 'created_at' | 'updated_at'>
): Promise<BaziAnalysis> {
  const newFormatData = {
    user_id: parseInt(userId),
    birth_datetime: new Date(
      data.birth_year,
      data.birth_month - 1,
      data.birth_day,
      ...data.birth_time.split(':').map(Number)
    ).toISOString(),
    gender: data.gender === 'male' ? 'MALE' : 'FEMALE',
    analysis_parts: ['流年', '流月', '流日']
  }
  
  const response = await requestAPP.post<APIResponse<NewBaziAnalysisResponse>>('/bazi/analysis', newFormatData)
  return convertNewToOldFormat(response.data)
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