<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- SEO 组件 -->
    <SEO 
      title="考试运势分析 - 北斗九号日历" 
      description="基于八字命理分析考试运势，提供专业的考试时机建议和备考指导"
      keywords="考试运势,八字分析,考试时机,备考建议,命理分析"
    />

    <div class="container mx-auto px-4 py-6">
      <!-- 面包屑导航 -->
      <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <router-link to="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          首页
        </router-link>
        <span>/</span>
        <span class="text-gray-800 dark:text-gray-200 font-medium">考运测算</span>
      </nav>

      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <img src="@/assets/graduation.png" alt="考运测算" class="w-6 h-6" />
          </div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">考运测算</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          基于八字命理分析您的考试运势，为您提供专业的考试时机建议和备考指导
        </p>
        
        <!-- 功能介绍卡片 -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">精准时机分析</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">根据八字命理分析最佳考试时间，提升考试成功率</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">运势评分</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">量化分析考试运势，提供详细的有利和不利因素</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lightbulb class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">专业建议</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">提供个性化的考试策略和注意事项</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入表单 -->
      <div class="max-w-2xl mx-auto mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <Calendar class="w-5 h-5 mr-2 text-blue-600" />
            基本信息
          </h2>
          
          <form @submit.prevent="handleAnalyzeExamFortune" class="space-y-6">
            <!-- 出生时间 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                出生时间 *
              </label>
              <input
                v-model="formData.birth_datetime"
                type="datetime-local"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- 当前时间 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                当前时间 *
              </label>
              <input
                v-model="formData.current_datetime"
                type="datetime-local"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- 性别 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                性别 *
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="formData.gender"
                    type="radio"
                    value="男"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">男</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="formData.gender"
                    type="radio"
                    value="女"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">女</span>
                </label>
              </div>
            </div>

            <!-- 分析类型 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                分析类型 *
              </label>
              <select
                v-model="formData.analysis_type"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="monthly">月度分析</option>
                <option value="yearly">年度分析</option>
              </select>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#b67fda] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#a06cc7] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Loader2 v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
              <img v-else src="@/assets/graduation.png" alt="开始分析" class="w-5 h-5 mr-2" />
              {{ loading ? '分析中...' : '开始分析' }}
            </button>
          </form>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="max-w-2xl mx-auto mb-8">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-center">
            <AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p class="text-red-700 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- 分析结果 -->
      <div v-if="fortuneData" class="max-w-6xl mx-auto">
        <!-- 基本信息卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Info class="w-5 h-5 mr-2 text-blue-600" />
              分析概览
            </h2>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDateTime(fortuneData?.分析时间) }}
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="text-sm text-blue-600 dark:text-blue-400 font-medium">分析类型</div>
              <div class="text-lg font-semibold text-blue-800 dark:text-blue-200">{{ fortuneData?.分析类型 || '未知' }}</div>
            </div>
            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div class="text-sm text-purple-600 dark:text-purple-400 font-medium">基准年份</div>
              <div class="text-lg font-semibold text-purple-800 dark:text-purple-200">{{ fortuneData?.基准年份 || '未知' }}年</div>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div class="text-sm text-green-600 dark:text-green-400 font-medium">
                {{ fortuneData?.分析类型 === 'yearly' ? '分析年份' : '分析月份' }}
              </div>
              <div class="text-lg font-semibold text-green-800 dark:text-green-200">
                {{ fortuneData?.分析类型 === 'yearly' ? Object.keys(fortuneData?.年份分析 || {}).length + '个年份' : Object.keys(fortuneData?.月份分析 || {}).length + '个月' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 分析结果 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <!-- 月份分析结果 -->
          <div 
            v-if="fortuneData?.分析类型 === 'monthly' && fortuneData?.月份分析"
            v-for="(monthData, month) in fortuneData.月份分析" 
            :key="month"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <!-- 月份标题 -->
            <div class="bg-[#b67fda] p-4">
              <h3 class="text-lg font-bold text-white flex items-center justify-between">
                 <span>{{ month }}</span>
                <div class="flex items-center space-x-3">
                   <div :class="getScoreClass(monthData.考试评分?.总分)" class="px-4 py-2 rounded-full text-lg font-bold shadow-lg border-2 border-white/20">
                     {{ monthData.考试评分?.总分 || 0 }}分
                   </div>
                   <div :class="getGradeClass(monthData.考试评分?.等级)" class="px-4 py-2 rounded-full text-lg font-bold shadow-lg border-2 border-white/20">
                     {{ monthData.考试评分?.等级 || '未知' }}
                   </div>
                 </div>
               </h3>
               <p class="text-white/90 text-sm mt-1">{{ monthData.考试评分?.总结 || '暂无总结' }}</p>
            </div>

            <!-- 考试评分详情 -->
            <div class="p-4">
              <!-- 有利因素 -->
              <div class="mb-4" v-if="monthData.考试评分?.有利因素 && Array.isArray(monthData.考试评分.有利因素) && monthData.考试评分.有利因素.length > 0">
                <h4 class="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center">
                  <TrendingUp class="w-4 h-4 mr-1" />
                  有利因素
                </h4>
                <div class="space-y-1">
                   <div 
                     v-for="factor in monthData.考试评分.有利因素" 
                     :key="factor"
                     class="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded"
                   >
                     {{ factor }}
                   </div>
                 </div>
              </div>

              <!-- 不利因素 -->
               <div class="mb-4" v-if="monthData.考试评分?.不利因素 && Array.isArray(monthData.考试评分.不利因素) && monthData.考试评分.不利因素.length > 0">
                 <h4 class="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center">
                   <TrendingDown class="w-4 h-4 mr-1" />
                   不利因素
                 </h4>
                 <div class="space-y-1">
                   <div 
                     v-for="factor in monthData.考试评分.不利因素" 
                     :key="factor"
                     class="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded"
                   >
                     {{ factor }}
                   </div>
                 </div>
               </div>

              <!-- 考试建议 -->
               <div class="mb-4" v-if="monthData.考试建议 && Array.isArray(monthData.考试建议) && monthData.考试建议.length > 0">
                 <h4 class="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center">
                   <Lightbulb class="w-4 h-4 mr-1" />
                   考试建议
                 </h4>
                 <div class="space-y-2">
                   <div 
                     v-for="(suggestion, index) in monthData.考试建议.slice(0, 3)" 
                     :key="`suggestion-${index}`"
                     class="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded leading-relaxed"
                   >
                     {{ suggestion }}
                   </div>
                 </div>
               </div>

              <!-- 特别提醒 -->
               <div v-if="monthData.考试评分?.特别提醒 && Array.isArray(monthData.考试评分.特别提醒) && monthData.考试评分.特别提醒.length > 0">
                 <h4 class="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                   <AlertTriangle class="w-4 h-4 mr-1" />
                   特别提醒
                 </h4>
                 <div class="space-y-1">
                   <div 
                     v-for="reminder in monthData.考试评分.特别提醒" 
                     :key="reminder"
                     class="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded"
                   >
                     {{ reminder }}
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <!-- 年份分析结果 -->
          <div 
            v-if="fortuneData?.分析类型 === 'yearly' && fortuneData?.年份分析"
            v-for="(yearData, year) in fortuneData.年份分析" 
            :key="year"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <!-- 年份标题 -->
            <div class="bg-[#0b3289] p-4">
              <h3 class="text-lg font-bold text-white flex items-center justify-between">
                <span>{{ year }}</span>
                <div class="flex items-center space-x-3">
                  <div :class="getScoreClass(yearData.考试评分?.总分)" class="px-4 py-2 rounded-full text-lg font-bold shadow-lg border-2 border-white/20">
                    {{ yearData.考试评分?.总分 || 0 }}分
                  </div>
                  <div :class="getGradeClass(yearData.考试评分?.等级)" class="px-4 py-2 rounded-full text-lg font-bold shadow-lg border-2 border-white/20">
                    {{ yearData.考试评分?.等级 || '未知' }}
                  </div>
                </div>
              </h3>
              <p class="text-white/90 text-sm mt-1">{{ yearData.考试评分?.总结 || '暂无总结' }}</p>
            </div>

            <!-- 考试评分详情 -->
            <div class="p-4">
              <!-- 有利因素 -->
              <div class="mb-4" v-if="yearData.考试评分?.有利因素 && Array.isArray(yearData.考试评分.有利因素) && yearData.考试评分.有利因素.length > 0">
                <h4 class="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center">
                  <TrendingUp class="w-4 h-4 mr-1" />
                  有利因素
                </h4>
                <div class="space-y-1">
                  <div 
                    v-for="factor in yearData.考试评分.有利因素" 
                    :key="factor"
                    class="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded"
                  >
                    {{ factor }}
                  </div>
                </div>
              </div>

              <!-- 不利因素 -->
              <div class="mb-4" v-if="yearData.考试评分?.不利因素 && Array.isArray(yearData.考试评分.不利因素) && yearData.考试评分.不利因素.length > 0">
                <h4 class="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center">
                  <TrendingDown class="w-4 h-4 mr-1" />
                  不利因素
                </h4>
                <div class="space-y-1">
                  <div 
                    v-for="factor in yearData.考试评分.不利因素" 
                    :key="factor"
                    class="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded"
                  >
                    {{ factor }}
                  </div>
                </div>
              </div>

              <!-- 考试建议 -->
              <div class="mb-4" v-if="yearData.考试建议 && Array.isArray(yearData.考试建议) && yearData.考试建议.length > 0">
                <h4 class="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center">
                  <Lightbulb class="w-4 h-4 mr-1" />
                  考试建议
                </h4>
                <div class="space-y-2">
                  <div 
                    v-for="(suggestion, index) in yearData.考试建议.slice(0, 3)" 
                    :key="`year-suggestion-${index}`"
                    class="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded leading-relaxed"
                  >
                    {{ suggestion }}
                  </div>
                </div>
              </div>

              <!-- 特别提醒 -->
              <div v-if="yearData.考试评分?.特别提醒 && Array.isArray(yearData.考试评分.特别提醒) && yearData.考试评分.特别提醒.length > 0">
                <h4 class="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                  <AlertTriangle class="w-4 h-4 mr-1" />
                  特别提醒
                </h4>
                <div class="space-y-1">
                  <div 
                    v-for="reminder in yearData.考试评分.特别提醒" 
                    :key="reminder"
                    class="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded"
                  >
                    {{ reminder }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 使用说明和FAQ部分 -->
      <div v-if="!fortuneData" class="mt-12 space-y-8">
        <!-- 使用说明 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <Info class="w-6 h-6 mr-2 text-blue-500" />
            使用说明
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-gray-100">填写出生信息</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300">准确填写您的出生日期和时间，这是分析的基础</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-gray-100">设置考试时间</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300">输入您计划参加考试的时间或当前时间</p>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-gray-100">选择分析类型</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300">选择按月分析或按年分析，获得不同时间维度的运势</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">4</div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-gray-100">查看分析结果</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300">获得详细的运势评分、建议和注意事项</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ部分 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <AlertCircle class="w-6 h-6 mr-2 text-orange-500" />
            常见问题
          </h2>
          <div class="space-y-6">
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Q: 考试运势分析的准确性如何？</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">A: 基于传统八字命理理论，结合现代算法分析。运势分析仅供参考，实际考试成功还需要充分的准备和努力。</p>
            </div>
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Q: 出生时间不准确会影响分析结果吗？</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">A: 是的，出生时间的准确性直接影响八字排盘和分析结果。建议尽量提供准确的出生时间，误差不超过2小时。</p>
            </div>
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Q: 月分析和年分析有什么区别？</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">A: 月分析提供更精细的时间维度，适合短期考试规划；年分析提供整体运势趋势，适合长期学习规划。</p>
            </div>
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Q: 运势不好的时候还能参加考试吗？</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">A: 运势分析只是参考因素之一。即使运势一般，通过充分准备、调整心态和采纳建议，仍然可以取得好成绩。</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Q: 如何提升考试运势？</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">A: 根据分析结果中的建议，调整学习方法、选择合适的考试时间、保持良好心态，并结合实际情况制定备考策略。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { analyzeExamFortune, type ExamFortuneRequest, type ExamFortuneResponse, type MonthAnalysis, type YearAnalysis } from '@/api/exam'
import SEO from '@/components/SEO.vue'
import { 
  Calendar, 
  Loader2, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  AlertTriangle,
  Clock,
  User,
  ChevronDown,
  Star,
  CheckCircle,
  Target
} from 'lucide-vue-next'

// 响应式数据
const loading = ref(false)
const error = ref('')
const fortuneData = ref<ExamFortuneResponse['data'] | null>(null)

// 表单数据
const formData = ref<{
  birth_datetime: string
  current_datetime: string
  gender: '男' | '女'
  analysis_type: 'monthly' | 'yearly'
}>({
  birth_datetime: '',
  current_datetime: '',
  gender: '男',
  analysis_type: 'monthly'
})

// 格式化日期时间
const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return '未知时间'
  
  const date = new Date(dateTimeStr)
  if (isNaN(date.getTime())) return '无效时间'
  
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取分数样式类
const getScoreClass = (score: number) => {
  if (typeof score !== 'number' || isNaN(score)) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  if (score >= 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
}

// 获取等级样式类
const getGradeClass = (grade: string) => {
  if (!grade || typeof grade !== 'string') return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  
  switch (grade) {
    case '优秀':
    case '良好':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case '一般':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case '较弱':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case '很弱':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// 分析考试运势
const handleAnalyzeExamFortune = async () => {
  // 表单验证
  if (!formData.value.birth_datetime || !formData.value.current_datetime) {
    error.value = '请填写完整的出生时间和当前时间'
    return
  }
  
  const birthDate = new Date(formData.value.birth_datetime)
  const currentDate = new Date(formData.value.current_datetime)
  
  if (isNaN(birthDate.getTime()) || isNaN(currentDate.getTime())) {
    error.value = '请输入有效的日期时间'
    return
  }
  
  if (birthDate >= currentDate) {
    error.value = '出生时间不能晚于或等于当前时间'
    return
  }
  
  loading.value = true
  error.value = ''
  fortuneData.value = null
  
  try {
    const response = await analyzeExamFortune({
      analysis_type: formData.value.analysis_type,
      birth_datetime: formData.value.birth_datetime,
      current_datetime: formData.value.current_datetime,
      gender: formData.value.gender
    })
    
    if (response && response.data) {
      fortuneData.value = response.data
    } else {
      throw new Error('服务器返回数据格式错误')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '分析失败，请稍后重试'
    console.error('考试运势分析失败:', err)
  } finally {
    loading.value = false
  }
}

// 页面加载时设置默认时间
onMounted(() => {
  const now = new Date()
  const birth = new Date('1990-01-01T12:00:00')
  
  formData.value.current_datetime = now.toISOString().slice(0, 16)
  formData.value.birth_datetime = birth.toISOString().slice(0, 16)
})
</script>

<style scoped>
.prose {
  max-width: none;
}
</style>