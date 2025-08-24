<template>
  <!-- 左侧历史面板 -->
  <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
    <!-- 历史面板头部 -->
    <div class="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">分析历史</h2>
    </div>

    <!-- 历史列表 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
      <div 
        v-for="analysis in analyses" 
        :key="analysis.id"
        class="group cursor-pointer p-3 rounded-lg border transition-all mb-2"
        :class="analysis.id === selectedAnalysisId
          ? 'bg-[#f6edfb] dark:bg-[#2d1b3d] border-[#b67fda] text-[#7a3fa4] dark:text-[#b67fda] font-semibold shadow-sm'
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600'"
        @click="handleSelectAnalysis(analysis.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ analysis.birth_year }}-{{ analysis.birth_month }}-{{ analysis.birth_day }} {{ analysis.birth_time }}</p>
          </div>
          <div class="flex items-center gap-1 ml-2">
            <span 
              class="text-[10px] px-1.5 py-0.5 rounded"
              :class="{
                'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': analysis.status === 'COMPLETED',
                'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200': analysis.status === 'PROCESSING',
                'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200': analysis.status === 'FAILED'
              }"
            >
              {{ getStatusText(analysis.status) }}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              @click.stop="handleDeleteAnalysis(analysis.id)"
              class="opacity-0 group-hover:opacity-100 p-1 h-auto"
            >
              <Trash2 class="w-3 h-3 text-red-500 dark:text-red-400" />
            </Button>
          </div>
        </div>
      </div>
      
      <div v-if="analyses.length === 0" class="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
        暂无分析历史
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { useBaziStore } from '@/stores/bazi'
import dayjs from 'dayjs'
import type { BaziAnalysis } from '@/api/bazi'
import { AnalysisStatus } from '@/api/bazi'
import { useRouter } from 'vue-router'

interface Props {
  selectedAnalysisId?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'select': [id: string]
  'delete': [id: string]
}>()

const baziStore = useBaziStore()
const analyses = computed(() => baziStore.sortedAnalyses)

// 获取状态文本
const getStatusText = (status: AnalysisStatus): string => {
  switch (status) {
    case AnalysisStatus.COMPLETED:
      return '已完成'
    case AnalysisStatus.PROCESSING:
      return '分析中'
    case AnalysisStatus.FAILED:
      return '失败'
    default:
      return '未知'
  }
}

const router = useRouter()

// 选择分析记录
const handleSelectAnalysis = (id: string) => {
  router.push(`/analysis/${id}`)
}

// 删除分析记录
const handleDeleteAnalysis = async (id: string) => {
  if (confirm('确定要删除此分析记录吗？')) {
    try {
      await baziStore.removeAnalysis(id)
      emit('delete', id)
    } catch (e) {
      alert('删除失败')
      console.error(e)
    }
  }
}

// 自动刷新定时器
let refreshTimer: number | null = null

// 刷新历史列表
const refreshAnalyses = async () => {
  await baziStore.loadAnalyses()
}

// 设置自动刷新
onMounted(() => {
  // 初始加载
  refreshAnalyses()
  
  // 每30秒刷新一次
  refreshTimer = window.setInterval(refreshAnalyses, 30000)
})

// 清理定时器
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script> 