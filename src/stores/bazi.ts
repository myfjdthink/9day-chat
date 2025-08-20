import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BaziAnalysis } from '@/api/bazi'
import {
  getBaziAnalyses,
  getBaziAnalysis,
  createBaziAnalysis,
  updateBaziAnalysis,
  deleteBaziAnalysis
} from '@/api/bazi'

export const useBaziStore = defineStore('bazi', () => {
  // ========== 状态 ==========
  // 八字分析列表
  const analyses = ref<BaziAnalysis[]>([])
  // 是否加载中
  const isLoading = ref(false)
  // 错误信息
  const error = ref<string | null>(null)

  // ========== 计算属性 ==========
  // 按时间倒序排列
  const sortedAnalyses = computed(() => {
    return [...analyses.value].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  })

  // ========== 远程数据操作 ==========
  /**
   * 获取八字分析列表
   */
  const loadAnalyses = async () => {
    isLoading.value = true
    try {
      const remoteList = await getBaziAnalyses()
      analyses.value = remoteList
    } catch (err: any) {
      console.error('获取八字分析列表失败:', err)
      error.value = err.response?.data?.message || '获取分析历史失败，请稍后重试'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 新建八字分析
   */
  const addAnalysis = async (data: Omit<BaziAnalysis, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await createBaziAnalysis(data)
      analyses.value.unshift(res)
    } catch (e) {
      throw e
    }
  }

  /**
   * 删除八字分析
   */
  const removeAnalysis = async (analysisId: string) => {
    const idx = analyses.value.findIndex(a => a.id === analysisId)
    if (idx === -1) return
    try {
      await deleteBaziAnalysis(analysisId)
      analyses.value.splice(idx, 1)
    } catch (e) {
      throw e
    }
  }

  /**
   * 更新八字分析
   */
  const updateAnalysis = async (analysisId: string, data: Partial<BaziAnalysis>) => {
    const analysis = analyses.value.find(a => a.id === analysisId)
    if (!analysis) return
    try {
      const res = await updateBaziAnalysis(analysisId, data)
      Object.assign(analysis, res)
    } catch (e) {
      throw e
    }
  }

  /**
   * 重置 store
   */
  const $reset = () => {
    analyses.value = []
  }

  // ========== 导出 ==========
  return {
    analyses,
    sortedAnalyses,
    isLoading,
    error,
    loadAnalyses,
    addAnalysis,
    removeAnalysis,
    updateAnalysis,
    $reset,
    clearError: () => { error.value = null }
  }
})