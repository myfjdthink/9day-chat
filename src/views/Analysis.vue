<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900 relative">
    <!-- SEO组件 -->
    <SEO 
      :title="t('home.analysis.seo.title')"
      :pageTitle="t('home.analysis.seo.pageTitle')"
      :description="t('home.analysis.seo.description')"
      :keywords="t('home.analysis.seo.keywords')"
    />
    
    <div class="max-w-6xl mx-auto">
      <!-- 页面主标题 -->
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">{{ t('home.analysis.hero.title') }}</h1>
      
      <!-- 功能介绍卡片 -->
      <div v-if="!analysisResult" class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <User class="w-6 h-6 text-white" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.analysis.features.chart.title') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.features.chart.desc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 class="w-6 h-6 text-white" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.analysis.features.analysis.title') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.features.analysis.desc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb class="w-6 h-6 text-white" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.analysis.features.advice.title') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.features.advice.desc') }}</p>
          </div>
        </div>
      </div>

      <!-- 输入部分 -->
      <div v-if="!analysisResult" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Basic Information -->
        <div class="space-y-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm p-6">
          <div class="flex items-center space-x-2 mb-6">
            <User class="w-5 h-5 text-green-500" />
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('home.analysis.form.basicInfo') }}</h2>
          </div>

          <!-- Gender Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{{ t('home.analysis.form.gender') }}</label>
            <div class="flex space-x-3">
              <Button
                :variant="gender === '男' ? 'default' : 'outline'"
                @click="gender = '男'"
              >
                {{ t('home.analysis.form.male') }}
              </Button>
              <Button
                :variant="gender === '女' ? 'default' : 'outline'"
                @click="gender = '女'"
              >
                {{ t('home.analysis.form.female') }}
              </Button>
            </div>
          </div>

          <!-- Birth Date and Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ t('home.analysis.form.birthLabel') }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Input
                type="datetime-local"
                v-model="birthDateTime"
                class="w-full"
              />
              <CalendarIcon class="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>

            <!-- Confirmation Message -->
            <div class="mt-3 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
              <div class="flex items-center space-x-2">
                <CalendarIcon class="w-4 h-4 text-green-600" />
                <span class="text-sm text-green-800 dark:text-green-200">
                  {{ t('home.analysis.form.selectedTip', { date: formatDateTime(birthDateTime) }) }}
                </span>
              </div>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-300 mt-2">{{ t('home.analysis.form.adjustHint') }}</p>
          </div>
        </div>

        <!-- Analysis Configuration -->
        <div class="space-y-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm p-6">
          <div class="flex items-center space-x-2 mb-6">
            <Settings class="w-5 h-5 text-green-500" />
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('home.analysis.config.title') }}</h2>
          </div>

          <!-- Analysis Types -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{{ t('home.analysis.types.title') }}</label>
            <div class="space-y-3">
              <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
                <CardContent class="p-4">
                  <div class="flex items-start space-x-3">
                    <Checkbox
                      :checked="analysisTypes.basic"
                      @update:checked="analysisTypes.basic = $event"
                      class="mt-1"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('home.analysis.types.basic.title') }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-300">{{ t('home.analysis.types.basic.desc') }}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
                <CardContent class="p-4">
                  <div class="flex items-start space-x-3">
                    <Checkbox
                      :checked="analysisTypes.deity"
                      @update:checked="analysisTypes.deity = $event"
                      class="mt-1"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('home.analysis.types.deity.title') }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-300">{{ t('home.analysis.types.deity.desc') }}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
                <CardContent class="p-4">
                  <div class="flex items-start space-x-3">
                    <Checkbox
                      :checked="analysisTypes.ai"
                      @update:checked="analysisTypes.ai = $event"
                      class="mt-1"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('home.analysis.types.ai.title') }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-300">{{ t('home.analysis.types.ai.desc') }}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- AI Analysis Scope -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{{ t('home.analysis.scope.title') }}</label>
            <div class="flex space-x-3">
              <Button
                :variant="analysisScope.year ? 'default' : 'outline'"
                @click="analysisScope.year = !analysisScope.year"
              >
                {{ t('home.analysis.scope.year') }}
              </Button>
              <Button
                :variant="analysisScope.month ? 'default' : 'outline'"
                @click="analysisScope.month = !analysisScope.month"
              >
                {{ t('home.analysis.scope.month') }}
              </Button>
              <Button
                :variant="analysisScope.day ? 'default' : 'outline'"
                @click="analysisScope.day = !analysisScope.day"
              >
                {{ t('home.analysis.scope.day') }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Start Analysis Button -->
      <div v-if="!analysisResult" class="mt-8 flex justify-center space-x-4">
        <Button
          size="lg"
          variant="default"
          :disabled="isAnalyzing"
          @click="handleStartAnalysis"
        >
          <Star class="w-5 h-5 mr-2" />
          {{ isAnalyzing ? t('home.analysis.actions.loading') : t('home.analysis.actions.start') }}
        </Button>
        <Button
          size="lg"
          variant="default"
          :disabled="isTenYearsAnalyzing"
          @click="handleTenYearsAnalysis"
        >
          <Star class="w-5 h-5 mr-2" />
          {{ isTenYearsAnalyzing ? t('home.analysis.actions.loading') : t('home.analysis.actions.tenYears') }}
        </Button>
      </div>

      <!-- Analysis Results -->
      <div v-if="analysisResult" class="mt-12 space-y-8">
        <!-- 报告内容区域，支持滚动 -->
        <div ref="reportRef" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-h-[90vh] overflow-y-auto">
          <div class="mb-6">
            <h2 class="text-2xl font-bold mb-2 dark:text-gray-100">{{ t('home.analysis.report.title') }}</h2>
            <!-- 分析时间和类型 -->
          <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex items-center space-x-1">
              <CalendarIcon class="w-4 h-4" />
              <span>{{ t('home.analysis.report.timePrefix') }}{{ formatDateTime(analysisResult.analysisTime) }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Settings class="w-4 h-4" />
              <span>{{ t('home.analysis.report.typePrefix') }}{{ analysisResult.analysisType }}</span>
            </div>
          </div>
          </div>
          
          <!-- 分析内容 - 使用虚拟列表优化长列表渲染 -->
          <div class="space-y-8">
            <template v-for="[type, content] in getSortedAnalysisResults().filter(([type]) => type !== '用神分析').slice(0, visibleItems)" :key="type">
              <div 
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700"
                v-observe-visibility="(isVisible: boolean) => handleVisibilityChange(type, isVisible)"
                :data-type="type"
              >
                <!-- 标题区域 -->
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-sm">{{ getAnalysisTypeIcon(type) }}</span>
                  </div>
                  <h3 class="text-xl font-semibold dark:text-gray-100">{{ type === '基础分析' ? t('home.analysis.report.baseAndDeityTitle') : t('home.analysis.report.typeSuffix', { type: getLocalizedTypeName(type) }) }}</h3>
                  <div class="flex-1"></div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-600 px-2 py-1 rounded">
                    {{ getAnalysisTypeDescription(type) }}
                  </div>
                </div>
                
                <!-- 分析内容 - 结构化展示 -->
                <div v-if="visibleSections[type]">
                  <!-- 基础分析和用神分析 - 左右并排布局（仅在组合显示时显示） -->
                  <div v-if="type === '基础分析' && hasBaseAndYongshenData()" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- 左侧：基础分析 -->
                    <div v-if="getStructuredBaseData(getSortedAnalysisResults().find(([t]) => t === '基础分析')?.[1] as string || '')" class="space-y-4">
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">{{ t('home.analysis.report.labels.baseTitle') }}</h4>
                      <BaziDisplay 
                        :baziData="getStructuredBaseData(getSortedAnalysisResults().find(([t]) => t === '基础分析')?.[1] as string || '')!"
                      />
                    </div>
                    
                    <!-- 右侧：用神分析 -->
                    <div v-if="getStructuredYongshenData(getSortedAnalysisResults().find(([t]) => t === '用神分析')?.[1] as string || '')" class="space-y-4">
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">{{ t('home.analysis.report.labels.deityTitle') }}</h4>
                      <YongshenDisplay 
                        :yongshenData="getStructuredYongshenData(getSortedAnalysisResults().find(([t]) => t === '用神分析')?.[1] as string || '')!"
                      />
                    </div>
                  </div>
                  
                  <!-- 单独的基础分析（仅在没有用神分析时显示） -->
                  <BaziDisplay 
                    v-else-if="type === '基础分析' && !hasBaseAndYongshenData() && getStructuredBaseData(content as string)"
                    :baziData="getStructuredBaseData(content as string)"
                  />
                  
                  <!-- 用神分析不单独显示，只在基础分析中组合显示 -->
                  
                  <!-- 其他分析类型 - 保持原有markdown格式 -->
                  <div v-else-if="type === '流年十年' && rawDayunData" class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="px-3 py-1 text-xs rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                        {{ getFlowTenRangeLabel() }}
                      </div>
                    </div>
                    <div class="relative pl-6">
                      <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-200 dark:bg-emerald-900 rounded"></div>
                      <div class="space-y-4">
                        <div
                          v-for="[y, desc] in getSortedFlowTen()"
                          :key="y"
                          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                              <span class="inline-flex items-center px-2 py-0.5 text-xs rounded bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">{{ y }}</span>
                          <span class="text-xs text-emerald-600 dark:text-emerald-300">{{ t('analysis.flowTen.yearLabel') }}</span>
                            </div>
                          </div>
                          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ desc }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="type !== '用神分析'" class="prose max-w-none dark:prose-invert prose-sm">
                    <div v-html="formatMarkdown(content as string)" class="leading-relaxed"></div>
                  </div>
                </div>
                <div v-else class="h-32 flex items-center justify-center">
                  <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          
          <!-- 分析总结 -->
          <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div class="flex items-center space-x-2 mb-2">
              <Star class="w-5 h-5 text-blue-600" />
              <h4 class="font-medium text-blue-800 dark:text-blue-200">{{ t('home.analysis.summary.title') }}</h4>
            </div>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              {{ t('home.analysis.summary.desc', { count: Object.keys(analysisResult.analysisResult).length }) }}
            </p>
          </div>
        </div>
        
        <!-- 底部操作栏：sticky 定位在主内容区底部，不遮挡侧边栏 -->
        <div class="sticky bottom-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 shadow-lg">
          <div class="w-full max-w-4xl mx-auto flex justify-center gap-6 px-2">
            <Button
              size="lg"
              variant="secondary"
              @click="handleSaveReport"
            >
              <Download class="w-4 h-4 mr-2" />
              {{ t('home.analysis.actions.save') }}
            </Button>
            <Button
              size="lg"
              variant="outline"
              @click="handleResetAnalysis"
            >
              <RefreshCw class="w-4 h-4 mr-2" />
              {{ t('home.analysis.actions.reset') }}
            </Button>
            <Button
              size="lg"
              variant="default"
              @click="handleChatWithReport"
            >
              <MessageSquare class="w-4 h-4 mr-2" />
              {{ t('home.analysis.actions.chat') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
    <!-- 全局分析中遮罩 -->
    <div v-if="isAnalyzing || isTenYearsAnalyzing" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <div class="flex flex-col items-center">
          <div class="text-lg text-white font-semibold mb-2">{{ t('home.analysis.overlay.title') }}</div>
          <div class="text-sm text-gray-200">{{ t('home.analysis.overlay.sub1') }}</div>
          <div class="text-xs text-gray-300 mt-1">{{ t('home.analysis.overlay.sub2') }}</div>
        </div>
      </div>
    </div>
    <!-- 使用说明和FAQ部分 -->
    <div v-if="!analysisResult" class="mt-12 space-y-8">
      <!-- 使用说明 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Settings class="w-6 h-6 mr-2 text-blue-500" />
          {{ t('home.analysis.guide.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('home.analysis.guide.step1.title') }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.guide.step1.desc') }}</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('home.analysis.guide.step2.title') }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.guide.step2.desc') }}</p>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('home.analysis.guide.step3.title') }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.guide.step3.desc') }}</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">4</div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('home.analysis.guide.step4.title') }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.guide.step4.desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ部分 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Star class="w-6 h-6 mr-2 text-orange-500" />
          {{ t('home.analysis.faq.title') }}
        </h2>
        <div class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.analysis.faq.q1.title') }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.faq.q1.answer') }}</p>
          </div>
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.analysis.faq.q2.title') }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.faq.q2.answer') }}</p>
          </div>
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.analysis.faq.q3.title') }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.faq.q3.answer') }}</p>
          </div>
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.analysis.faq.q4.title') }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.faq.q4.answer') }}</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.analysis.faq.q5.title') }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.analysis.faq.q5.answer') }}</p>
          </div>
        </div>
      </div>
    </div>

    <Modal
      :show="showLoginModal"
      :title="t('home.analysis.modalLogin.title')"
      :message="t('home.analysis.modalLogin.message')"
      :confirmText="t('home.analysis.modalLogin.confirm')"
      :cancelText="t('home.analysis.modalLogin.cancel')"
      :onConfirm="handleLoginConfirm"
      :onCancel="handleLoginCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, defineAsyncComponent, onUnmounted, nextTick } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { ObjectDirective, DirectiveBinding } from 'vue'

interface ExtendedHTMLElement extends HTMLElement {
  _observe_visibility_observer?: ReturnType<typeof useIntersectionObserver>
}

// 注册observe-visibility指令
const vObserveVisibility: ObjectDirective<ExtendedHTMLElement> = {
  mounted: (el: ExtendedHTMLElement, binding: DirectiveBinding<(isVisible: boolean) => void>) => {
    const observer = useIntersectionObserver(el, ([{ isIntersecting }]) => {
      binding.value(isIntersecting)
    })
    el._observe_visibility_observer = observer
  },
  unmounted: (el: ExtendedHTMLElement) => {
    if (el._observe_visibility_observer) {
      el._observe_visibility_observer.stop()
    }
  }
}
import type { Ref } from 'vue'
import type { BaziAnalysis } from '@/api/bazi'

// UI Components - 异步加载非关键组件
const Button = defineAsyncComponent(() => import('@/components/ui/Button.vue'))
const Input = defineAsyncComponent(() => import('@/components/ui/Input.vue'))
const Card = defineAsyncComponent(() => import('@/components/ui/Card.vue'))
const CardContent = defineAsyncComponent(() => import('@/components/ui/CardContent.vue'))
const Checkbox = defineAsyncComponent(() => import('@/components/ui/Checkbox.vue'))
const Modal = defineAsyncComponent(() => import('@/components/ui/Modal.vue'))
const SEO = defineAsyncComponent(() => import('@/components/SEO.vue'))

// 分析结果展示组件 - 改为同步导入以避免渲染延迟
import BaziDisplay from '@/components/BaziDisplay.vue'
import YongshenDisplay from '@/components/YongshenDisplay.vue'
import DayunDisplay from '@/components/DayunDisplay.vue'

// 按需导入图标
import { User, Settings, Calendar as CalendarIcon, Star, Download, RefreshCw, MessageSquare, BarChart3, Lightbulb } from 'lucide-vue-next'

// Third-party libraries
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { marked } from 'marked'
// 引入html2canvas用于截图
import html2canvas from 'html2canvas'

// API
import { analyzeBazi, analyzeBase, analyzeYongshen, ANALYSIS_PARTS, analyzeTenYearsSingle } from '@/api/bazi'
import { PROVIDERS, MODELS } from '@/api/config'
// 引入 Pinia store
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import { updateUserInfo } from '@/api/user' // 新增导入
import { useRoute, useRouter } from 'vue-router' // 保证路由相关导入
import * as vueI18n from 'vue-i18n'

// 配置 dayjs
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const { useI18n } = vueI18n as any
const { t } = useI18n()

// 将内部类型标识映射为当前语言的展示文案
const getLocalizedTypeName = (type: string): string => {
  if (type.includes('基础分析')) return t('analysis.types.basic.title')
  if (type.includes('用神分析')) return t('analysis.types.deity.title')
  if (type.includes('运势预测')) return t('analysis.types.ai.title')
  if (type.includes('流年十年')) return t('analysis.types.tenYears.title')
  if (type.includes('八字排盘')) return t('analysis.types.basic.title')
  if (type.includes('五行')) return t('analysis.types.basic.title')
  if (type.includes('格局')) return t('analysis.types.deity.title')
  if (type.includes('性格')) return t('analysis.types.ai.title')
  if (type.includes('建议')) return t('analysis.types.ai.title')
  return type
}

interface AnalysisTypes {
  basic: boolean
  deity: boolean
  ai: boolean
}

interface AnalysisScope {
  year: boolean
  month: boolean
  day: boolean
}

const gender = ref<'男' | '女'>('男')
const birthDateTime = ref<string>('1983-12-11T08:00')
const isAnalyzing = ref<boolean>(false)
const isTenYearsAnalyzing = ref<boolean>(false)
type AnalysisResultData = {
  analysisType: string
  analysisTime: string
  analysisResult: Record<string, string>
}
const analysisResult = ref<AnalysisResultData | null>(null)

// 虚拟列表相关状态
const visibleItems = ref(3) // 初始显示3个项目
const visibleSections = reactive<Record<string, boolean>>({})
const intersectionObserver = ref<IntersectionObserver | null>(null)

// 处理元素可见性变化
const handleVisibilityChange = (type: string, isVisible: boolean): void => {
  if (isVisible && !visibleSections[type]) {
    visibleSections[type] = true
    // 如果当前可见的是最后一个项目，增加可见项目数量
    const currentItems = Object.keys(analysisResult.value?.analysisResult || {}).slice(0, visibleItems.value)
    if (currentItems[currentItems.length - 1] === type) {
      visibleItems.value += 2
    }
  }
}

// 清理观察器
onUnmounted(() => {
  if (intersectionObserver.value) {
    intersectionObserver.value.disconnect()
  }
})

const analysisTypes = reactive<AnalysisTypes>({
  basic: true,
  deity: true,
  ai: true
})

// 分析范围初始值全部为false，需用户手动选择
const analysisScope = reactive<AnalysisScope>({
  year: true,
  month: false,
  day: false
})

// 用于获取分析报告区域的DOM引用
const reportRef = ref<HTMLElement | null>(null)

// 格式化日期时间为北京时间
const formatDateTime = (dateTime: string): string => {
  return dayjs(dateTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
}

// 格式化Markdown内容 - 使用缓存优化性能
const markdownCache = new Map<string, string>()
const formatMarkdown = (content: string): string => {
  if (markdownCache.has(content)) {
    return markdownCache.get(content)!
  }

  let processedContent = content.replace(/^#\s*流年\/流月\/流日信息：?\s*\n*/g, '')
  processedContent = processedContent.replace(/^#\s*(Year\/Month\/Day Info|Year\/Month\/Day Information)[:：]?\s*\n*/gi, '')
  
  // 如果内容以 # 开头，移除第一个标题
  processedContent = processedContent.replace(/^#\s*[^#\n]*\n*/g, '')
  
  let result = marked(processedContent)
  
  // 为流年流月流日信息添加特定的CSS类
  result = result.replace(
    /\*\*([流年流月流日])：\*\*/g,
    '<strong class="time-info-label">$1：</strong>'
  )
  
  // 为流年流月流日的内容添加CSS类
  result = result.replace(
    /<strong class="time-info-label">([流年流月流日])：<\/strong>\s*([^<\n]+)/g,
    '<strong class="time-info-label">$1：</strong><span class="time-info-content">$2</span>'
  )
  
  markdownCache.set(content, result)
  return result
}

// 获取分析范围数组，严格按选项返回
const getAnalysisParts = (): string[] => {
  const parts: string[] = []
  if (analysisScope.year) parts.push(ANALYSIS_PARTS.FLOW_YEAR)
  if (analysisScope.month) parts.push(ANALYSIS_PARTS.FLOW_MONTH)
  if (analysisScope.day) parts.push(ANALYSIS_PARTS.FLOW_DAY)
  return parts
}

// 新增分析成功后，自动保存到本地+云端
const handleStartAnalysis = async (): Promise<void> => {
  if (!birthDateTime.value) {
    alert(t('home.analysis.errors.selectBirthTime'))
    return
  }

  // 检查是否至少选择了一种分析类型
  if (!analysisTypes.basic && !analysisTypes.deity && !analysisTypes.ai) {
    alert(t('home.analysis.errors.selectType'))
    return
  }

  // 如果选择了运势预测，需要检查分析范围
  if (analysisTypes.ai) {
    const analysisParts = getAnalysisParts()
    if (analysisParts.length === 0) {
      alert(t('home.analysis.errors.selectScopeForAI'))
      return
    }
  }

  try {
    isAnalyzing.value = true
    const birthDateTimeBeijing = dayjs(birthDateTime.value).tz('Asia/Shanghai').format('YYYY-MM-DDTHH:mm:ss')
    const currentDateTimeBeijing = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DDTHH:mm:ss')
    
    // 合并所有分析结果
    const allResults: Record<string, string> = {}
    const selectedTypes: string[] = []
    
    // 基础分析
    if (analysisTypes.basic) {
      const baseResponse = await analyzeBase({
        birth_datetime: birthDateTimeBeijing,
        current_datetime: currentDateTimeBeijing,
        gender: gender.value
      })
      if (baseResponse.success && baseResponse.data) {
        const baseData = baseResponse.data.基础分析
        
        // 保存原始API数据
        rawBaseData.value = baseData
        
        // 格式化基础分析结果为 markdown
        let baseMarkdown = `## 基础信息\n\n`
        baseMarkdown += `**性别：** ${baseData.性别}\n\n`
        
        baseMarkdown += `### 八字信息\n\n`
        Object.entries(baseData.八字信息).forEach(([pillar, info]: [string, any]) => {
          baseMarkdown += `**${pillar}：** ${info.干支组合.天干}${info.干支组合.地支} (${info.五行属性.天干五行}${info.五行属性.地支五行})\n\n`
        })
        
        baseMarkdown += `### 五行统计\n\n`
        baseMarkdown += `**五行分布：**\n`
        Object.entries(baseData.五行统计.五行分布).forEach(([element, count]) => {
          baseMarkdown += `- ${element}：${count}\n`
        })
        baseMarkdown += `\n**最强五行：** ${baseData.五行统计.最强五行}\n\n`
        baseMarkdown += `**最弱五行：** ${baseData.五行统计.最弱五行}\n\n`
        
        baseMarkdown += `### 当前大运信息\n\n`
        const dayun = baseData.当前大运信息
        baseMarkdown += `**大运：** ${dayun.天干}${dayun.地支} (${dayun.五行.天干五行}${dayun.五行.地支五行})\n\n`
        
        baseMarkdown += `### 流年流月流日信息\n\n`
        const timeInfo = baseData.流年流月流日信息
        baseMarkdown += `**流年：** ${timeInfo.流年.天干}${timeInfo.流年.地支} (${timeInfo.流年.五行.天干五行}${timeInfo.流年.五行.地支五行})\n\n`
        baseMarkdown += `**流月：** ${timeInfo.流月.天干}${timeInfo.流月.地支} (${timeInfo.流月.五行.天干五行}${timeInfo.流月.五行.地支五行})\n\n`
        baseMarkdown += `**流日：** ${timeInfo.流日.天干}${timeInfo.流日.地支} (${timeInfo.流日.五行.天干五行}${timeInfo.流日.五行.地支五行})\n\n`
        
        allResults['基础分析'] = baseMarkdown
        selectedTypes.push('基础分析')
      }
    }
    
    // 用神分析
    if (analysisTypes.deity) {
      const deityResponse = await analyzeYongshen({
        birth_datetime: birthDateTimeBeijing,
        current_datetime: currentDateTimeBeijing,
        gender: gender.value
      })
      if (deityResponse.success && deityResponse.data) {
        const deityData = deityResponse.data
        
        // 保存原始API数据
        rawYongshenData.value = deityData
        
        // 格式化用神分析结果为 markdown
        let deityMarkdown = `## 用神分析\n\n`
        deityMarkdown += `**格局：** ${deityData.格局}\n\n`
        
        deityMarkdown += `### 用神\n\n`
        deityData.用神.forEach((god: string) => {
          deityMarkdown += `- ${god}\n`
        })
        
        deityMarkdown += `\n### 忌神\n\n`
        deityData.忌神.forEach((god: string) => {
          deityMarkdown += `- ${god}\n`
        })
        
        deityMarkdown += `\n**取用原则：** ${deityData.取用}\n\n`
        deityMarkdown += `### 分析结论\n\n${deityData.分析}\n\n`
        
        allResults['用神分析'] = deityMarkdown
        selectedTypes.push('用神分析')
      }
    }
    
    // 运势预测（原有的AI分析）
    if (analysisTypes.ai) {
      const analysisParts = getAnalysisParts()
      const aiResponse = await analyzeBazi({
        birth_datetime: birthDateTimeBeijing,
        current_datetime: currentDateTimeBeijing,
        gender: gender.value,
        analysis_parts: analysisParts
      })
      if (aiResponse.success) {
        // 合并AI分析结果
        Object.entries(aiResponse.data.分析结果).forEach(([type, content]) => {
          allResults[type] = content
        })
        selectedTypes.push('运势预测')
      }
    }
    
    if (Object.keys(allResults).length > 0) {
      analysisResult.value = {
        analysisType: selectedTypes.join('、'),
        analysisTime: dayjs().tz('Asia/Shanghai').format(),
        analysisResult: allResults
      }
      
      // 生成 markdown 报告
      const dt = dayjs(birthDateTime.value).tz('Asia/Shanghai')
      const markdownReport = Object.entries(allResults)
        .map(([type, content]) => `### ${type}\n${content}\n`)
        .join('\n')
      
      // ====== 关键：严格对齐后端API文档字段 ======
      const params = {
        client_analysis_id: `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        birth_year: dt.year(),
        birth_month: dt.month() + 1,
        birth_day: dt.date(),
        birth_time: dt.format('HH:mm'),
        gender: (gender.value === '男' ? 'male' : 'female') as 'male' | 'female',
        analysis_type: selectedTypes.join(','),
        notes: markdownReport,
        display_name: '',
        user_nickname: userStore.user?.username || '',
        analysis_results: allResults,
        summary: {},
        settings: {},
        extra_metadata: {}
      }
      // ======================================
      await baziStore.addAnalysis(params)
      // 新增：分析成功后，若用户无八字信息则自动保存
      await trySaveUserBaziInfo()
      // 新增：分析成功后自动跳转到分析结果页面
      const latest = baziStore.sortedAnalyses[0]
      if (latest) {
        router.push({ path: '/analysis', query: { analysisId: latest.id } })
      }
    } else {
      throw new Error('所有分析接口都失败了')
    }
  } catch (error: any) {
    alert(error.message || '分析过程中出现错误')
  } finally {
    isAnalyzing.value = false
  }
}

// 新增：保存报告和重新分析方法
/**
 * 保存分析报告为图片
 */
const handleSaveReport = async () => {
  if (!reportRef.value || !analysisResult.value) return
  // 使用html2canvas将分析报告区域渲染为canvas
  const canvas = await html2canvas(reportRef.value, {
    backgroundColor: '#fff', // 保证图片背景为白色
    useCORS: true
  })
  // 将canvas转为图片并下载
  const imgData = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = imgData
  a.download = `分析报告_${formatDateTime(analysisResult.value.analysisTime)}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 重新分析，重置界面
 */
const handleResetAnalysis = () => {
  analysisResult.value = null
}

const handleTenYearsAnalysis = async (): Promise<void> => {
  if (!birthDateTime.value) {
    alert(t('home.analysis.errors.selectBirthTime'))
    return
  }
  try {
    isTenYearsAnalyzing.value = true
    const birthDateTimeBeijing = dayjs(birthDateTime.value).tz('Asia/Shanghai').format('YYYY-MM-DDTHH:mm:ss')
    const currentDateTimeBeijing = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DDTHH:mm:ss')
    const allResults: Record<string, string> = {}
    const selectedTypes: string[] = []
    const res: any = await analyzeTenYearsSingle({
      birth_datetime: birthDateTimeBeijing,
      current_datetime: currentDateTimeBeijing,
      gender: gender.value
    })
    const typeFromServer = res?.data?.分析类型
    const timeFromServer = res?.data?.分析时间
    const flowTen = res?.data?.分析结果?.流年十年
    if (flowTen && typeof flowTen === 'object') {
      const years = Object.keys(flowTen).sort()
      const md = years.map(y => `### ${y}\n${flowTen[y]}\n`).join('\n')
      allResults['流年十年'] = md
      selectedTypes.push(getLocalizedTypeName(typeFromServer || '流年十年'))
      analysisResult.value = {
        analysisType: getLocalizedTypeName(typeFromServer || '流年十年'),
        analysisTime: timeFromServer || dayjs().tz('Asia/Shanghai').format(),
        analysisResult: allResults
      }
      rawDayunData.value = flowTen
    } else {
      let content = ''
      if (typeof res === 'string') content = res
      else if (typeof res?.data === 'string') content = res.data
      else if (typeof res?.message === 'string') content = res.message
      else content = JSON.stringify(res?.data ?? res)
      allResults['流年十年'] = content
      selectedTypes.push('十年大运')
      analysisResult.value = {
        analysisType: selectedTypes.join('、'),
        analysisTime: dayjs().tz('Asia/Shanghai').format(),
        analysisResult: allResults
      }
    }
    const dt = dayjs(birthDateTime.value).tz('Asia/Shanghai')
    const markdownReport = Object.entries(allResults)
      .map(([type, c]) => `### ${type}\n${c}\n`)
      .join('\n')
    const params = {
      client_analysis_id: `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      birth_year: dt.year(),
      birth_month: dt.month() + 1,
      birth_day: dt.date(),
      birth_time: dt.format('HH:mm'),
      gender: (gender.value === '男' ? 'male' : 'female') as 'male' | 'female',
      analysis_type: selectedTypes.join(','),
      notes: markdownReport,
      display_name: '',
      user_nickname: userStore.user?.username || '',
      analysis_results: allResults,
      summary: {},
      settings: {},
      extra_metadata: {}
    }
    await baziStore.addAnalysis(params)
    await trySaveUserBaziInfo()
    const latest = baziStore.sortedAnalyses[0]
    if (latest) {
      router.push({ path: '/analysis', query: { analysisId: latest.id } })
    }
  } catch (error: any) {
    const serverMsg = error?.response?.data?.message || error?.response?.data?.detail
    alert(serverMsg || error?.message || '分析过程中出现错误')
  } finally {
    isTenYearsAnalyzing.value = false
  }
}

// 对话报告按钮逻辑
const handleChatWithReport = async () => {
  if (!analysisResult.value) return
  // 检查登录状态
  if (!userStore.user) {
    showLoginModal.value = true
    return
  }
  // 整理分析报告为纯文本
  const reportText = Object.entries(analysisResult.value.analysisResult)
    .map(([type, content]) => `【${type}】\n${content}\n`).join('\n')
  const reportName = `八字分析-${formatDateTime(analysisResult.value.analysisTime)}`
  // 新建一条对话记录，并等待返回后端 UUID
  const newChatId = await chatStore.createConversation()
  // 跳转到/chat并带上reportContext和name参数，Chat.vue会自动插入气泡
  router.push({ path: '/chat', query: { reportContext: reportText, name: reportName, conversationId: newChatId } })
}

const chatStore = useChatStore()
const userStore = useUserStore()
const baziStore = useBaziStore()
const route = useRoute()
const router = useRouter()

// 从首页路由参数自动填充并触发分析
watch(
  () => [route.query.birth, route.query.gender, route.query.auto, route.query.auto10y],
  async ([birth, genderParam, auto, auto10y]) => {
    const bd = typeof birth === 'string' ? birth : ''
    const gd = typeof genderParam === 'string' ? genderParam : ''
    const needAuto = auto === '1'
    const needAutoTenYears = auto10y === '1'
    if (bd) birthDateTime.value = bd
    if (gd === '男' || gd === '女') gender.value = gd
    if (needAuto) {
      // 确保有默认范围，避免校验失败
      analysisTypes.basic = true
      analysisTypes.deity = true
      analysisTypes.ai = true
      analysisScope.year = true
      await nextTick()
      await handleStartAnalysis()
      router.replace({ path: route.path, query: { ...route.query, auto: undefined } })
    } else if (needAutoTenYears) {
      await nextTick()
      await handleTenYearsAnalysis()
    }
  },
  { immediate: true }
)

// ========== 新增：自动导入用户八字信息 ========== //
const userHasBaziInfo = computed(() => {
  return !!(
    userStore.user &&
    userStore.user.birth_year &&
    userStore.user.birth_month &&
    userStore.user.birth_day &&
    userStore.user.birth_time &&
    userStore.user.gender
  )
})

// 页面加载时自动填充
onMounted(async () => {
  // 初始化数据
  await Promise.all([
    baziStore.initializeStore(),
    baziStore.loadAnalysesFromBackend()
  ])

  // 自动填充用户八字信息
  if (userStore.user && userHasBaziInfo.value) {
    // 组装 yyyy-MM-ddTHH:mm 作为 v-model
    const y = userStore.user.birth_year!.toString().padStart(4, '0')
    const m = userStore.user.birth_month!.toString().padStart(2, '0')
    const d = userStore.user.birth_day!.toString().padStart(2, '0')
    const t = userStore.user.birth_time!.padStart(5, '0')
    birthDateTime.value = `${y}-${m}-${d}T${t}`
    gender.value = userStore.user.gender === 'male' || userStore.user.gender === '男' ? '男' : '女'
  } else if (!userStore.user) {
    // 未登录，填充默认八字信息
    birthDateTime.value = '1999-09-09T09:09'
    gender.value = '男'
  }

  // 初始化Intersection Observer
  intersectionObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const type = entry.target.getAttribute('data-type')
        if (type) {
          handleVisibilityChange(type, entry.isIntersecting)
        }
      })
    },
    {
      root: reportRef.value,
      threshold: 0.1
    }
  )
})

// ========== 新增：首次填写自动保存为用户默认出生日期 ========== //
let hasSavedUserBazi = false // 只保存一次
async function trySaveUserBaziInfo() {
  if (!userStore.user || userHasBaziInfo.value || hasSavedUserBazi) return
  // 解析 birthDateTime
  const dt = birthDateTime.value
  if (!dt || !gender.value) return
  const [date, time] = dt.split('T')
  if (!date || !time) return
  const [year, month, day] = date.split('-').map(Number)
  // 保存到用户信息
  try {
    await updateUserInfo({
      username: userStore.user.username || '',
      phone: userStore.user.phone || '',
      birth_year: year,
      birth_month: month,
      birth_day: day,
      birth_time: time,
      gender: gender.value === '男' ? 'male' : 'female'
    })
    await userStore.fetchUser() // 刷新用户信息
    hasSavedUserBazi = true
  } catch (e) {
    // 可加日志
    console.warn('自动保存用户八字信息失败', e)
  }
}

// 历史分析数据源，替换原 chatStore.analysisHistory
const analyses = computed<BaziAnalysis[]>(() => baziStore.sortedAnalyses)

// 当前选中的分析历史ID
const selectedAnalysisId = ref<string | null>(null)

// 监听 analyses 和 analysisId，数据和 id 任一变化都尝试展示历史
watch(
  [analyses, () => route.query.analysisId],
  ([list, id]) => {
    if (id) {
      showAnalysisFromHistory(id as string)
    } else {
      analysisResult.value = null
    }
  },
  { immediate: true }
)

// 监听分析结果变化，初始化visibleSections
watch(
  () => analysisResult.value,
  (newResult) => {
    if (newResult) {
      // 重置可见项目数量
      visibleItems.value = 3
      // 对于历史数据，直接设置为可见；对于新分析，使用懒加载
      Object.keys(newResult.analysisResult).forEach(type => {
        // 如果是从历史记录加载的数据，直接设置为可见
        if (selectedAnalysisId.value) {
          visibleSections[type] = true
        } else {
          // 新分析使用懒加载
          visibleSections[type] = false
        }
      })
      console.log('Watch triggered - visibleSections updated:', visibleSections)
    }
  }
)

// 展示历史分析
function showAnalysisFromHistory(id: string) {
  console.log('showAnalysisFromHistory called with id:', id)
  // 统一转字符串对比，兼容 id/client_analysis_id
  const record = analyses.value.find(r => String(r.id) === String(id) || String((r as any).client_analysis_id) === String(id))
  if (record) {
    console.log('Found analysis record:', record)
    let resultObj = {}
    // 优先兼容 analysis_results 字段
    const analysisResultField = (record as any).analysis_results || (record as any).analysis_result
    // 调试日志，便于排查数据结构
    console.log('历史分析记录', record)
    console.log('analysis_results:', (record as any).analysis_results)
    console.log('analysis_result:', (record as any).analysis_result)
    console.log('notes:', record.notes)
    if (analysisResultField && Object.keys(analysisResultField).length > 0) {
      resultObj = analysisResultField
    } else if (record.notes) {
      resultObj = parseResultText(record.notes)
    }
    
    // 先清空当前结果，强制重新渲染
    analysisResult.value = null
    
    // 使用nextTick确保DOM更新后再设置新数据
    nextTick(() => {
      analysisResult.value = {
        analysisType: record.analysis_type,
        analysisTime: record.created_at,
        analysisResult: resultObj as Record<string, string>
      }
      selectedAnalysisId.value = id
      
      // 立即初始化所有sections为可见
      Object.keys(resultObj).forEach(key => {
        visibleSections[key] = true
      })
      
      console.log('Analysis result set:', analysisResult.value)
      console.log('Visible sections initialized:', visibleSections)
    })
  } else {
    console.log('Analysis record not found for id:', id)
    analysisResult.value = null
  }
}

// 解析纯文本为对象（简单分段）
function parseResultText(text: string) {
  const result: Record<string, string> = {}
  const blocks = text.split(/【(.+?)】/g).filter(Boolean)
  for (let i = 0; i < blocks.length; i += 2) {
    const key = blocks[i]
    const value = blocks[i + 1]?.trim() || ''
    if (key && value) result[key] = value
  }
  return result
}

// 直接点击历史分析项时，强制刷新内容
function handleSelectAnalysis(id: string) {
  showAnalysisFromHistory(id)
  selectedAnalysisId.value = id
  // 如需同步到 URL，可加：router.replace({ query: { ...route.query, analysisId: id } })
}

const showLoginModal = ref(false)
const handleLoginConfirm = () => {
  showLoginModal.value = false
  router.push('/login')
}
const handleLoginCancel = () => {
  showLoginModal.value = false
}

// 根据分析类型返回图标
const getAnalysisTypeIcon = (type: string) => {
  const normalizeType = (v: string) => {
    if (v.includes('基础分析')) return 'basic'
    if (v.includes('用神分析')) return 'deity'
    if (v.includes('运势预测')) return 'ai'
    if (v.includes('八字排盘')) return 'chart'
    if (v.includes('五行')) return 'fiveElements'
    if (v.includes('格局')) return 'pattern'
    if (v.includes('性格')) return 'personality'
    if (v.includes('建议')) return 'advice'
    return 'unknown'
  }
  switch (normalizeType(type)) {
    case 'basic':
      return '📊'
    case 'deity':
      return '🎯'
    case 'ai':
      return '🔮'
    case 'chart':
      return '🔮'
    case 'fiveElements':
      return '⚖️'
    case 'pattern':
      return '🎲'
    case 'personality':
      return '🧠'
    case 'advice':
      return '💡'
    default:
      return '📝'
  }
}

// 获取排序后的分析结果
const getSortedAnalysisResults = () => {
  if (!analysisResult.value?.analysisResult) return []
  
  const entries = Object.entries(analysisResult.value.analysisResult)
  
  // 定义排序优先级
  const getTypePriority = (type: string): number => {
    // 基础分析相关 - 优先级1
    if (type.includes('基础') || type.includes('八字') || type.includes('五行') || type.includes('排盘')) {
      return 1
    }
    // 用神分析相关 - 优先级2
    if (type.includes('用神') || type.includes('格局') || type.includes('忌神')) {
      return 2
    }
    // 运势预测相关 - 优先级3
    if (type.includes('运势') || type.includes('流年') || type.includes('流月') || type.includes('流日') || 
        type.includes('性格') || type.includes('建议') || type.includes('预测')) {
      return 3
    }
    // 其他类型 - 优先级4
    return 4
  }
  
  // 按优先级排序
  return entries.sort(([typeA], [typeB]) => {
    const priorityA = getTypePriority(typeA)
    const priorityB = getTypePriority(typeB)
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }
    
    // 同优先级内按字母顺序排序
    return typeA.localeCompare(typeB)
  })
}

// 根据分析类型返回描述
const getAnalysisTypeDescription = (type: string) => {
  const normalizeType = (v: string) => {
    if (v.includes('基础分析')) return 'basic'
    if (v.includes('用神分析')) return 'deity'
    if (v.includes('运势预测')) return 'ai'
    if (v.includes('八字排盘')) return 'chart'
    if (v.includes('五行')) return 'fiveElements'
    if (v.includes('格局')) return 'pattern'
    if (v.includes('性格')) return 'personality'
    if (v.includes('建议')) return 'advice'
    return 'unknown'
  }
  switch (normalizeType(type)) {
    case 'basic':
      return t('analysis.types.basic.desc')
    case 'deity':
      return t('analysis.types.deity.desc')
    case 'ai':
      return t('analysis.types.ai.desc')
    case 'chart':
      return t('analysis.types.basic.desc')
    case 'fiveElements':
      return t('analysis.types.basic.desc')
    case 'pattern':
      return t('analysis.types.deity.desc')
    case 'personality':
      return t('analysis.types.ai.desc')
    case 'advice':
      return t('analysis.types.ai.desc')
    default:
      return t('analysis.types.basic.desc')
  }
}

// 检查是否同时存在基础分析和用神分析数据
const hasBaseAndYongshenData = () => {
  if (!analysisResult.value?.analysisResult) return false
  
  const results = analysisResult.value.analysisResult
  const hasBase = Object.keys(results).some(key => key.includes('基础分析'))
  const hasYongshen = Object.keys(results).some(key => key.includes('用神分析'))
  
  return hasBase && hasYongshen
}

// 存储原始API数据的引用
const rawBaseData = ref<any>(null)
const rawYongshenData = ref<any>(null)
const rawDayunData = ref<any>(null)

const getSortedFlowTen = () => {
  if (!rawDayunData.value) return [] as Array<[string, string]>
  return Object.keys(rawDayunData.value)
    .sort()
    .map((y) => [y, (rawDayunData.value as Record<string, string>)[y]])
}

const getFlowTenRangeLabel = () => {
  const list = getSortedFlowTen()
  if (!list.length) return ''
  const nums = list.map(([y]) => parseInt(y.match(/\d{4}/)?.[0] || y))
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  return `${min}-${max}`
}

// 将markdown格式的基础分析数据转换为结构化数据
const getStructuredBaseData = (content: string) => {
  // 如果有原始API数据，直接使用
  if (rawBaseData.value) {
    return rawBaseData.value
  }
  
  // 否则从markdown内容中解析（兼容历史数据）
  try {
    const lines = content.split('\n')
    const result: any = {
      性别: '男',
      八字信息: {},
      五行统计: { 五行分布: {}, 最强五行: '', 最弱五行: '' },
      当前大运信息: {
        天干: '',
        地支: '',
        五行: { 天干五行: '', 地支五行: '' }
      },
      流年流月流日信息: {
        流年: { 天干: '', 地支: '', 五行: { 天干五行: '', 地支五行: '' } },
        流月: { 天干: '', 地支: '', 五行: { 天干五行: '', 地支五行: '' } },
        流日: { 天干: '', 地支: '', 五行: { 天干五行: '', 地支五行: '' } }
      }
    }
    
    // 解析性别
    const genderMatch = content.match(/\*\*性别：\*\*\s*([男女])/)
    if (genderMatch) {
      result.性别 = genderMatch[1] === '男' ? '男' : '女'
    }
    
    // 解析八字信息
    const baziMatches = content.matchAll(/\*\*([年月日时]柱)：\*\*\s*([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])\s*\(([金木水火土])([金木水火土])\)/g)
    for (const match of baziMatches) {
      const [, pillar, tiangan, dizhi, tianganWuxing, dizhiWuxing] = match
      result.八字信息[pillar] = {
        干支组合: { 天干: tiangan, 地支: dizhi },
        五行属性: { 天干五行: tianganWuxing, 地支五行: dizhiWuxing }
      }
    }
    
    // 解析五行统计
    const wuxingMatches = content.matchAll(/- ([金木水火土])：(\d+)/g)
    for (const match of wuxingMatches) {
      const [, element, count] = match
      result.五行统计.五行分布[element] = parseInt(count)
    }
    
    const strongestMatch = content.match(/\*\*最强五行：\*\*\s*([金木水火土])/)
    if (strongestMatch) {
      result.五行统计.最强五行 = strongestMatch[1]
    }
    
    const weakestMatch = content.match(/\*\*最弱五行：\*\*\s*([金木水火土])/)
    if (weakestMatch) {
      result.五行统计.最弱五行 = weakestMatch[1]
    }
    
    // 解析大运信息
    const dayunMatch = content.match(/\*\*大运：\*\*\s*([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])\s*\(([金木水火土])([金木水火土])\)/)
    if (dayunMatch) {
      const [, tiangan, dizhi, tianganWuxing, dizhiWuxing] = dayunMatch
      result.当前大运信息 = {
        天干: tiangan,
        地支: dizhi,
        五行: { 天干五行: tianganWuxing, 地支五行: dizhiWuxing }
      }
    }
    
    // 解析流年流月流日
    const liuNianMatch = content.match(/\*\*流年：\*\*\s*([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])\s*\(([金木水火土])([金木水火土])\)/)
    if (liuNianMatch) {
      const [, tiangan, dizhi, tianganWuxing, dizhiWuxing] = liuNianMatch
      result.流年流月流日信息.流年 = {
        天干: tiangan,
        地支: dizhi,
        五行: { 天干五行: tianganWuxing, 地支五行: dizhiWuxing }
      }
    }
    
    const liuYueMatch = content.match(/\*\*流月：\*\*\s*([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])\s*\(([金木水火土])([金木水火土])\)/)
    if (liuYueMatch) {
      const [, tiangan, dizhi, tianganWuxing, dizhiWuxing] = liuYueMatch
      result.流年流月流日信息.流月 = {
        天干: tiangan,
        地支: dizhi,
        五行: { 天干五行: tianganWuxing, 地支五行: dizhiWuxing }
      }
    }
    
    const liuRiMatch = content.match(/\*\*流日：\*\*\s*([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])\s*\(([金木水火土])([金木水火土])\)/)
    if (liuRiMatch) {
      const [, tiangan, dizhi, tianganWuxing, dizhiWuxing] = liuRiMatch
      result.流年流月流日信息.流日 = {
        天干: tiangan,
        地支: dizhi,
        五行: { 天干五行: tianganWuxing, 地支五行: dizhiWuxing }
      }
    }
    
    return result
  } catch (error) {
    console.error('解析基础分析数据失败:', error)
    return null
  }
}

// 将markdown格式的用神分析数据转换为结构化数据
const getStructuredYongshenData = (content: string) => {
  // 如果有原始API数据，直接使用
  if (rawYongshenData.value) {
    return rawYongshenData.value
  }
  
  // 否则从markdown内容中解析（兼容历史数据）
  try {
    const result: any = {
      格局: '',
      用神: [],
      忌神: [],
      取用: '',
      分析: ''
    }
    
    // 解析格局
    const geJuMatch = content.match(/\*\*格局：\*\*\s*([^\n]+)/)
    if (geJuMatch) {
      result.格局 = geJuMatch[1].trim()
    }
    
    // 解析用神
    const yongshenSection = content.match(/### 用神\n\n([\s\S]*?)\n\n### 忌神/)
    if (yongshenSection) {
      const yongshenLines = yongshenSection[1].split('\n')
      result.用神 = yongshenLines
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.replace(/^- /, '').trim())
    }
    
    // 解析忌神
    const jishenSection = content.match(/### 忌神\n\n([\s\S]*?)\n\n\*\*取用原则：\*\*/)
    if (jishenSection) {
      const jishenLines = jishenSection[1].split('\n')
      result.忌神 = jishenLines
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.replace(/^- /, '').trim())
    }
    
    // 解析取用原则
    const quyongMatch = content.match(/\*\*取用原则：\*\*\s*([^\n]+)/)
    if (quyongMatch) {
      result.取用 = quyongMatch[1].trim()
    }
    
    // 解析分析结论
    const analysisSection = content.match(/### 分析结论\n\n([\s\S]*?)$/)
    if (analysisSection) {
      result.分析 = analysisSection[1].trim()
    }
    
    return result
  } catch (error) {
    console.error('解析用神分析数据失败:', error)
    return null
  }
}
</script>

<style>
/* 基础文本样式 */
.prose {
  color: #1f2937; /* text-gray-800 */
}

.dark .prose {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 标题样式 */
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #1f2937; /* text-gray-800 */
}

.dark .prose h1,
.dark .prose h2,
.dark .prose h3,
.dark .prose h4,
.dark .prose h5,
.dark .prose h6 {
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose h3 {
  font-size: 1.125rem; /* text-lg */
  font-weight: 500; /* font-medium */
  margin-top: 1rem; /* mt-4 */
  margin-bottom: 0.5rem; /* mb-2 */
}

/* 段落样式 */
.prose p {
  margin-top: 0.5rem; /* my-2 */
  margin-bottom: 0.5rem; /* my-2 */
  color: #1f2937; /* text-gray-800 */
}

.dark .prose p {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 列表样式 */
.prose ul {
  list-style-type: disc; /* list-disc */
  list-style-position: inside; /* list-inside */
  margin-top: 0.5rem; /* my-2 */
  margin-bottom: 0.5rem; /* my-2 */
  color: #1f2937; /* text-gray-800 */
}

.dark .prose ul {
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose li {
  margin-top: 0.25rem; /* my-1 */
  margin-bottom: 0.25rem; /* my-1 */
  color: #1f2937; /* text-gray-800 */
}

.dark .prose li {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 强调样式 */
.prose strong {
  color: #1f2937; /* text-gray-800 */
  font-weight: 600; /* font-semibold */
}

.dark .prose strong {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 流年流月流日信息特殊样式 */
.prose .time-info-label {
  color: #059669; /* text-emerald-600 */
  font-weight: 500; /* font-medium */
  font-size: 0.9rem; /* text-sm */
}

.dark .prose .time-info-label {
  color: #10b981; /* dark:text-emerald-500 */
}

.prose .time-info-content {
  color: #1f2937; /* text-gray-800 */
  font-weight: 400; /* font-normal */
  font-size: 0.9rem; /* text-sm */
}

.dark .prose .time-info-content {
  color: #d1d5db; /* dark:text-gray-300 */
}

.prose em {
  color: #1f2937; /* text-gray-800 */
  font-style: italic; /* italic */
}

.dark .prose em {
  color: #e5e7eb; /* dark:text-gray-200 */
}

/* 链接样式 */
.prose a {
  color: #2563eb; /* text-blue-600 */
}

.dark .prose a {
  color: #60a5fa; /* dark:text-blue-400 */
}

.prose a:hover {
  color: #1d4ed8; /* hover:text-blue-800 */
}

.dark .prose a:hover {
  color: #93c5fd; /* dark:hover:text-blue-300 */
}

/* 引用样式 */
.prose blockquote {
  border-left-width: 4px; /* border-l-4 */
  border-left-color: #d1d5db; /* border-gray-300 */
  padding-left: 1rem; /* pl-4 */
  color: #374151; /* text-gray-700 */
}

.dark .prose blockquote {
  border-left-color: #4b5563; /* dark:border-gray-600 */
  color: #d1d5db; /* dark:text-gray-300 */
}

/* 代码样式 */
.prose code {
  background-color: #f3f4f6; /* bg-gray-100 */
  color: #1f2937; /* text-gray-800 */
  padding: 0.125rem 0.25rem; /* px-1 py-0.5 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
}

.dark .prose code {
  background-color: #374151; /* dark:bg-gray-700 */
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose pre {
  background-color: #f3f4f6; /* bg-gray-100 */
  color: #1f2937; /* text-gray-800 */
  padding: 1rem; /* p-4 */
  border-radius: 0.5rem; /* rounded-lg */
  overflow-x: auto; /* overflow-x-auto */
}

.dark .prose pre {
  background-color: #374151; /* dark:bg-gray-700 */
  color: #e5e7eb; /* dark:text-gray-200 */
}

.prose pre code {
  background-color: transparent; /* bg-transparent */
  color: inherit; /* text-inherit */
  padding: 0; /* p-0 */
}
</style>
