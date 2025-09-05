<template>
  <div class="space-y-6">
    <!-- 当前大运 -->
    <div class="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span class="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
        当前大运
      </h3>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <div class="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
            {{ dayunData.天干 }}{{ dayunData.地支 }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ dayunData.五行.天干五行 }}{{ dayunData.五行.地支五行 }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 流年流月流日 -->
    <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
        流年流月流日
      </h3>
      
      <div class="grid grid-cols-3 gap-4">
        <!-- 流年 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">流年</div>
            <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
              {{ timeInfo.流年.天干 }}{{ timeInfo.流年.地支 }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {{ timeInfo.流年.五行.天干五行 }}{{ timeInfo.流年.五行.地支五行 }}
            </div>
          </div>
        </div>
        
        <!-- 流月 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">流月</div>
            <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
              {{ timeInfo.流月.天干 }}{{ timeInfo.流月.地支 }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {{ timeInfo.流月.五行.天干五行 }}{{ timeInfo.流月.五行.地支五行 }}
            </div>
          </div>
        </div>
        
        <!-- 流日 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">流日</div>
            <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
              {{ timeInfo.流日.天干 }}{{ timeInfo.流日.地支 }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {{ timeInfo.流日.五行.天干五行 }}{{ timeInfo.流日.五行.地支五行 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DayunInfo {
  天干: string
  地支: string
  五行: { 天干五行: string; 地支五行: string }
}

interface TimeInfo {
  流年: {
    天干: string
    地支: string
    五行: { 天干五行: string; 地支五行: string }
  }
  流月: {
    天干: string
    地支: string
    五行: { 天干五行: string; 地支五行: string }
  }
  流日: {
    天干: string
    地支: string
    五行: { 天干五行: string; 地支五行: string }
  }
}

defineProps<{
  dayunData: DayunInfo
  timeInfo: TimeInfo
}>()
</script>