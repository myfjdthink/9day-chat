import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import type { BaziAnalysis } from '@/api/bazi'
import { AnalysisStatus } from '@/api/bazi'
import {
  getBaziAnalyses,
  getBaziAnalysis,
  createBaziAnalysis,
  updateBaziAnalysis,
  deleteBaziAnalysis
} from '@/api/bazi'

export const useBaziStore = defineStore('bazi', () => {
  const userStore = useUserStore()

  // ========== 状态 ==========
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const analyses = ref<BaziAnalysis[]>([])

  // ========== 计算属性 ==========
  const sortedAnalyses = computed(() => {
    return [...analyses.value].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  })

  // ========== 远程数据操作 ==========
  const loadAnalyses = async () => {
    // if (!userStore.checkLogin()) {
    //   userStore.showLogin()
    //   return []
    // }

    isLoading.value = true
    try {
      if(!userStore.user) {
        return []
      }
      const userId = userStore.user.id
      const data = await getBaziAnalyses(userId)
      analyses.value = data
      return data
    } catch (err: any) {
      console.error('获取八字分析列表失败:', err)
      error.value = err.message || '获取分析历史失败，请稍后重试'
      return []
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
      const newAnalysis = await createBaziAnalysis(userId, data)
      analyses.value = [...analyses.value, newAnalysis]
      return newAnalysis
    } catch (e) {
      throw e
    }
  }

  const removeAnalysis = async (analysisId: string) => {
    if (!userStore.checkLogin()) {
      userStore.showLogin()
      throw new Error('请先登录')
    }

    try {
      await deleteBaziAnalysis(analysisId)
      analyses.value = analyses.value.filter(a => a.id !== analysisId)
    } catch (e) {
      throw e
    }
  }

  const updateAnalysis = async (analysisId: string, data: Partial<BaziAnalysis>) => {
    if (!userStore.checkLogin()) {
      userStore.showLogin()
      throw new Error('请先登录')
    }

    try {
      const updatedAnalysis = await updateBaziAnalysis(analysisId, data)
      const index = analyses.value.findIndex(a => a.id === analysisId)
      if (index !== -1) {
        analyses.value[index] = updatedAnalysis
      }
      return updatedAnalysis
    } catch (e) {
      throw e
    }
  }

  const getAnalysis = async (analysisId: string) => {
    if (!userStore.checkLogin()) {
      userStore.showLogin()
      throw new Error('请先登录')
    }

    try {
      const analysis = await getBaziAnalysis(analysisId)
      const index = analyses.value.findIndex(a => a.id === analysisId)
      if (index !== -1) {
        analyses.value[index] = analysis
      } else {
        analyses.value.push(analysis)
      }
      return analysis
    } catch (e) {
      throw e
    }
  }

  const $reset = () => {
    error.value = null
    analyses.value = []
  }

  return {
    isLoading,
    error,
    analyses,
    sortedAnalyses,
    loadAnalyses,
    addAnalysis,
    removeAnalysis,
    updateAnalysis,
    getAnalysis,
    $reset,
    clearError: () => { error.value = null }
  }
})