import type { AxiosResponse } from 'axios'
import request from './request-main'
import requestAPP from './request'
import requestUser from './request-user'

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

export const analyzeBazi = async (params: BaziAnalysisParams): Promise<BaziAnalysisResult> => {
  const response: AxiosResponse<BaziAnalysisResult> = await request.post('/bazi/ai', params)
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
  data: Omit<BaziAnalysis, 'id' | 'created_at' | 'updated_at'>
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