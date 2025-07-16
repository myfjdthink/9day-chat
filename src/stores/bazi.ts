import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BaziAnalysis } from '@/api/bazi'
import {
  getBaziAnalyses,
  getBaziAnalysis,
  createBaziAnalysis,
  updateBaziAnalysis,
  deleteBaziAnalysis,
  syncBaziAnalyses
} from '@/api/bazi'
import { useUserStore } from './user'

// 本地存储键名
const STORAGE_KEY = 'bazi_analyses'

export const useBaziStore = defineStore('bazi', () => {
  // ========== 状态 ==========
  // 本地八字分析列表
  const analyses = ref<BaziAnalysis[]>([])
  // 是否加载中
  const isLoading = ref(false)
  // 错误信息
  const error = ref<string | null>(null)

  // ========== 本地缓存加载/保存 ==========
  const loadFromStorage = (): BaziAnalysis[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at)
        }))
      }
    } catch (e) {
      console.warn('加载本地八字分析缓存失败', e)
    }
    return []
  }

  const saveAnalyses = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses.value))
    } catch (e) {
      console.warn('保存本地八字分析缓存失败', e)
    }
  }

  // ========== 计算属性 ==========
  // 按时间倒序排列
  const sortedAnalyses = computed(() => {
    return [...analyses.value].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  })

  // ========== 初始化 ==========
  const initializeStore = () => {
    analyses.value = loadFromStorage()
  }

  // ========== 云端同步相关 ==========
  /**
   * 拉取云端八字分析并合并本地未同步分析
   * @param force 是否强制覆盖本地
   */
  const loadAnalysesFromBackend = async (force = false) => {
    isLoading.value = true
    try {
      const remoteList = await getBaziAnalyses()
      // 标记为已同步
      remoteList.forEach(item => { item.sync_status = 'synced' })
      if (force) {
        analyses.value = remoteList
      } else {
        // 合并本地未同步分析（用 client_analysis_id 去重）
        const localPending = analyses.value.filter(a => a.sync_status !== 'synced')
        const all = [...remoteList]
        localPending.forEach(localItem => {
          if (!all.some(r => r.client_analysis_id === localItem.client_analysis_id)) {
            all.push(localItem)
          }
        })
        analyses.value = all
      }
      saveAnalyses()
    } catch (err: any) {
      console.error('获取八字分析列表失败:', err)
      error.value = err.response?.data?.message || '获取分析历史失败，请稍后重试'
      // 静默失败，不影响本地数据
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 新建八字分析（本地+同步）
   */
  const addAnalysis = async (data: Omit<BaziAnalysis, 'id' | 'created_at' | 'updated_at' | 'sync_status'> & { client_analysis_id: string }) => {
    // 本地先生成一条 pending 分析
    const now = new Date()
    const newAnalysis: BaziAnalysis = {
      ...data,
      id: now.getTime().toString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      sync_status: 'pending'
    }
    analyses.value.unshift(newAnalysis)
    saveAnalyses()
    // 自动同步到云端（仅已登录时）
    const userStore = useUserStore()
    if (!userStore.user || !userStore.token) return
    try {
      const res = await createBaziAnalysis(data)
      // 用云端返回数据替换本地
      Object.assign(newAnalysis, res, { sync_status: 'synced' })
      saveAnalyses()
    } catch (e) {
      newAnalysis.sync_status = 'failed'
      saveAnalyses()
      throw e
    }
  }

  /**
   * 删除八字分析（本地+云端）
   */
  const removeAnalysis = async (analysisId: string) => {
    const idx = analyses.value.findIndex(a => a.id === analysisId)
    if (idx === -1) return
    const analysis = analyses.value[idx]
    analyses.value.splice(idx, 1)
    saveAnalyses()
    // 只同步已同步的分析
    if (analysis.sync_status === 'synced') {
      try {
        await deleteBaziAnalysis(analysisId)
      } catch (e) {
        // 删除失败可重试
        analysis.sync_status = 'failed'
        analyses.value.unshift(analysis)
        saveAnalyses()
        throw e
      }
    }
  }

  /**
   * 更新八字分析（本地+云端）
   */
  const updateAnalysis = async (analysisId: string, data: Partial<BaziAnalysis>) => {
    const analysis = analyses.value.find(a => a.id === analysisId)
    if (!analysis) return
    Object.assign(analysis, data)
    analysis.updated_at = new Date().toISOString()
    analysis.sync_status = 'pending'
    saveAnalyses()
    // 自动同步到云端
    try {
      const res = await updateBaziAnalysis(analysisId, data)
      Object.assign(analysis, res, { sync_status: 'synced' })
      saveAnalyses()
    } catch (e) {
      analysis.sync_status = 'failed'
      saveAnalyses()
      throw e
    }
  }

  /**
   * 批量同步所有 pending/failed 的分析
   */
  const syncAllPending = async () => {
    const pendingIds = analyses.value.filter(a => a.sync_status !== 'synced').map(a => a.id)
    if (pendingIds.length === 0) return
    try {
      await syncBaziAnalyses(pendingIds)
      // 同步成功后刷新云端数据
      await loadAnalysesFromBackend(true)
    } catch (e) {
      // 同步失败不抛出
    }
  }

  /**
   * 重置 store
   */
  const $reset = () => {
    analyses.value = []
    saveAnalyses()
  }

  // ========== 导出 ==========
  return {
    analyses,
    sortedAnalyses,
    isLoading,
    error,
    initializeStore,
    loadAnalysesFromBackend,
    addAnalysis,
    removeAnalysis,
    updateAnalysis,
    syncAllPending,
    $reset,
    saveAnalyses,
    clearError: () => { error.value = null }
  }
})