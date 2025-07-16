import type { AxiosResponse } from 'axios'
import request from './request-main'
import requestUser from './request-user'

interface BaziAnalysisParams {
  birth_datetime: string
  current_datetime: string
  gender: '男' | '女'
  analysis_parts: string[]
}

interface BaziAnalysisResult {
  success: boolean
  message: string
  data: {
    分析结果: {
      流年?: string
      流月?: string
      流日?: string
    }
    分析类型: string
    分析时间: string
  }
}

export const analyzeBazi = async (params: BaziAnalysisParams): Promise<BaziAnalysisResult> => {
  const response: AxiosResponse<BaziAnalysisResult> = await request.post('/bazi/ai', params)
  return response.data
}

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