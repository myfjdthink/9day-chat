import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'  // 添加 user store 导入
import type { BaziAnalysis } from '@/api/bazi'
import {
  getBaziAnalyses,
  getBaziAnalysis,
  createBaziAnalysis,
  updateBaziAnalysis,
  deleteBaziAnalysis
} from '@/api/bazi'

export const useBaziStore = defineStore('bazi', () => {
  const userStore = useUserStore()  // 获取 user store

  // ========== 状态 ==========
  const analyses = ref<BaziAnalysis[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ========== 计算属性 ==========
  const sortedAnalyses = computed(() => {
    return [...analyses.value].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  })

  // ========== 远程数据操作 ==========
  const loadAnalyses = async () => {
    if (!userStore.checkLogin()) {
      userStore.showLogin()
      return
    }

    isLoading.value = true
    try {
      const userId = userStore.user!.id
      const remoteList = await getBaziAnalyses(userId)
      analyses.value = remoteList
    } catch (err: any) {
      console.error('获取八字分析列表失败:', err)
      error.value = err.response?.data?.message || '获取分析历史失败，请稍后重试'
    } finally {
      isLoading.value = false
    }
  }

  const addAnalysis = async (data: Omit<BaziAnalysis, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userStore.checkLogin()) {
      userStore.showLogin()
      throw new Error('请先登录')
    }

    try {
      const userId = userStore.user!.id
      const res = await createBaziAnalysis(userId, data)
      analyses.value.unshift(res)
      return res
    } catch (e) {
      throw e
    }
  }

  const removeAnalysis = async (analysisId: string) => {
    if (!userStore.checkLogin()) {
      userStore.showLogin()
      throw new Error('请先登录')
    }

    const idx = analyses.value.findIndex(a => a.id === analysisId)
    if (idx === -1) return

    try {
      await deleteBaziAnalysis(analysisId)
      analyses.value.splice(idx, 1)
    } catch (e) {
      throw e
    }
  }

  const updateAnalysis = async (analysisId: string, data: Partial<BaziAnalysis>) => {
    if (!userStore.checkLogin()) {
      userStore.showLogin()
      throw new Error('请先登录')
    }

    const analysis = analyses.value.find(a => a.id === analysisId)
    if (!analysis) return

    try {
      const res = await updateBaziAnalysis(analysisId, data)
      Object.assign(analysis, res)
    } catch (e) {
      throw e
    }
  }

  const $reset = () => {
    analyses.value = []
    error.value = null
  }

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