<template>
  <div class="space-y-4">
    <!-- 格局分析 -->
    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        {{ t('home.analysis.report.labels.deityTitle') }}
      </h3>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {{ yongshenData.格局 }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ t('home.analysis.report.labels.pattern') }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 用神忌神 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- 用神 -->
      <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          {{ t('home.analysis.report.labels.usefulElements') }}
        </h3>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
          <div class="space-y-1">
            <div v-for="(god, index) in yongshenData.用神" :key="index" class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ god }}</span>
            </div>
            <div v-if="yongshenData.用神.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              {{ t('home.analysis.report.labels.emptyUseful') }}
            </div>
          </div>
        </div>
        
        <!-- <div class="mt-2 text-xs text-green-600 dark:text-green-400">
          正印(金)、偏印(水)、正官(土)、七杀(火)、食神(木)、伤官(火)
        </div> -->
      </div>
      
      <!-- 忌神 -->
      <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          {{ t('home.analysis.fields.tabooElement') }}
        </h3>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
          <div class="space-y-2">
            <div v-for="(god, index) in yongshenData.忌神" :key="index" class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ god }}</span>
            </div>
            <div v-if="yongshenData.忌神.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              {{ t('home.analysis.report.labels.emptyTaboo') }}
            </div>
          </div>
        </div>
        
        <!-- <div class="mt-2 text-xs text-red-600 dark:text-red-400">
          正财(水)、偏财(金)、比肩(木)、劫财(火)
        </div> -->
      </div>
    </div>
    
    <!-- 取用原则 -->
    <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
        {{ t('home.analysis.fields.principle') }}
      </h3>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ yongshenData.取用 }}
        </p>
      </div>
    </div>
    
    <!-- 分析结论 - 已隐藏 -->
    <!-- <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        分析结论
      </h3>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="prose prose-sm dark:prose-invert max-w-none">
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {{ yongshenData.分析 }}
          </p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import * as vueI18n from 'vue-i18n'
interface YongshenInfo {
  格局: string
  用神: string[]
  忌神: string[]
  取用: string
  大运分析: Record<string, any>
  分析: string
}

defineProps<{
  yongshenData: YongshenInfo
}>()

const { useI18n } = vueI18n as any
const { t } = useI18n()
</script>
