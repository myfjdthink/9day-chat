<template>
  <div class="space-y-6">
    <!-- 八字排盘 -->
    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        八字排盘
      </h3>
      
      <!-- 传统竖排八字格式 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div class="flex justify-center">
          <div class="flex flex-col space-y-3 text-center">
            <!-- 年柱 -->
            <div class="flex justify-center items-center space-x-4 py-2">
              <div class="text-sm text-gray-500 dark:text-gray-400 w-8">年</div>
              <div class="flex items-center space-x-2">
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ baziData.八字信息.年柱.干支组合.天干 }}
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ baziData.八字信息.年柱.干支组合.地支 }}
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300 w-16">
                {{ baziData.八字信息.年柱.五行属性.天干五行 }}{{ baziData.八字信息.年柱.五行属性.地支五行 }}
              </div>
            </div>
            
            <!-- 月柱 -->
            <div class="flex justify-center items-center space-x-4 py-2">
              <div class="text-sm text-gray-500 dark:text-gray-400 w-8">月</div>
              <div class="flex items-center space-x-2">
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ baziData.八字信息.月柱.干支组合.天干 }}
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ baziData.八字信息.月柱.干支组合.地支 }}
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300 w-16">
                {{ baziData.八字信息.月柱.五行属性.天干五行 }}{{ baziData.八字信息.月柱.五行属性.地支五行 }}
              </div>
            </div>
            
            <!-- 日柱 -->
            <div class="flex justify-center items-center space-x-4 py-2 bg-red-50 dark:bg-red-900/20 rounded">
              <div class="text-sm text-gray-500 dark:text-gray-400 w-8">日</div>
              <div class="flex items-center space-x-2">
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                  {{ baziData.八字信息.日柱.干支组合.天干 }}
                </div>
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                  {{ baziData.八字信息.日柱.干支组合.地支 }}
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300 w-16">
                {{ baziData.八字信息.日柱.五行属性.天干五行 }}{{ baziData.八字信息.日柱.五行属性.地支五行 }}
              </div>
            </div>
            
            <!-- 时柱 -->
            <div class="flex justify-center items-center space-x-4 py-2">
              <div class="text-sm text-gray-500 dark:text-gray-400 w-8">时</div>
              <div class="flex items-center space-x-2">
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ baziData.八字信息.时柱.干支组合.天干 }}
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ baziData.八字信息.时柱.干支组合.地支 }}
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300 w-16">
                {{ baziData.八字信息.时柱.五行属性.天干五行 }}{{ baziData.八字信息.时柱.五行属性.地支五行 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 五行统计 -->
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        五行统计
      </h3>
      
      <div class="grid grid-cols-2 gap-3">
        <!-- 五行分布 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">五行分布</h4>
          <div class="space-y-2">
            <div v-for="(count, element) in baziData.五行统计.五行分布" :key="element" class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ element }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(count / Math.max(...Object.values(baziData.五行统计.五行分布))) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100 w-4">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 最强最弱五行 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">五行强弱</h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">最强五行</span>
              <span class="text-sm font-medium text-green-600 dark:text-green-400">{{ baziData.五行统计.最强五行 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">最弱五行</span>
              <span class="text-sm font-medium text-red-600 dark:text-red-400">{{ baziData.五行统计.最弱五行 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BaziInfo {
  性别: string
  八字信息: {
    年柱: {
      干支组合: { 天干: string; 地支: string }
      五行属性: { 天干五行: string; 地支五行: string }
    }
    月柱: {
      干支组合: { 天干: string; 地支: string }
      五行属性: { 天干五行: string; 地支五行: string }
    }
    日柱: {
      干支组合: { 天干: string; 地支: string }
      五行属性: { 天干五行: string; 地支五行: string }
    }
    时柱: {
      干支组合: { 天干: string; 地支: string }
      五行属性: { 天干五行: string; 地支五行: string }
    }
  }
  五行统计: {
    五行分布: Record<string, number>
    最强五行: string
    最弱五行: string
  }
  当前大运信息: {
    天干: string
    地支: string
    五行: { 天干五行: string; 地支五行: string }
  }
  流年流月流日信息: {
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
}

defineProps<{
  baziData: BaziInfo
}>()
</script>