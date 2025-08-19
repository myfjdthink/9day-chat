<template>
  <!-- 左侧历史面板 -->
  <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
    <!-- 历史面板头部 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">分析历史</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          @click="toggleAnalysisHistory"
          class="p-1 h-auto"
        >
          <ChevronDown 
            :class="['w-4 h-4 transition-transform', showAnalysisHistory ? 'rotate-180' : '']"
          />
        </Button>
      </div>
    </div>

    <!-- 历史列表 -->
    <div v-if="showAnalysisHistory" class="flex-1 overflow-y-auto p-4 space-y-2">
      <div 
        v-for="analysis in analyses" 
        :key="analysis.id"
        class="group cursor-pointer p-3 rounded-lg border transition-all"
        :class="analysis.id === selectedAnalysisId
          ? 'bg-[#f6edfb] dark:bg-[#2d1b3d] border-[#b67fda] text-[#7a3fa4] dark:text-[#b67fda] font-semibold shadow-sm'
          : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600'"
        @click="handleSelectAnalysis(analysis.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ analysis.analysis_type }}（{{ analysis.birth_year }}-{{ analysis.birth_month }}-{{ analysis.birth_day }} {{ analysis.birth_time }}）</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(new Date(analysis.created_at)) }}</p>
          </div>
          <div class="flex items-center gap-1 ml-2">
            <span class="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {{ analysis.analysis_type }}
            </span>
            <span v-if="analysis.sync_status === 'pending'" class="text-[10px] text-yellow-500 dark:text-yellow-400 ml-1">待同步</span>
            <span v-else-if="analysis.sync_status === 'failed'" class="text-[10px] text-red-500 dark:text-red-400 ml-1">同步失败</span>
            <span v-else class="text-[10px] text-green-500 dark:text-green-400 ml-1">已同步</span>
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
import { ref, computed } from 'vue'
import { ChevronDown, Trash2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { useBaziStore } from '@/stores/bazi'
import dayjs from 'dayjs'
import type { BaziAnalysis } from '@/api/bazi'

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

// 状态
const showAnalysisHistory = ref(true)

// 切换历史列表显示/隐藏
const toggleAnalysisHistory = () => {
  showAnalysisHistory.value = !showAnalysisHistory.value
}

// 格式化日期
const formatDate = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 选择分析记录
const handleSelectAnalysis = (id: string) => {
  emit('select', id)
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
</script> 