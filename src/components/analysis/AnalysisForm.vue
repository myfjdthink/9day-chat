<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Basic Information -->
    <div class="space-y-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm p-6">
      <div class="flex items-center space-x-2 mb-6">
        <User class="w-5 h-5 text-green-500" />
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">基本信息</h2>
      </div>

      <!-- Gender Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">性别</label>
        <div class="flex space-x-3">
          <Button
            :variant="modelValue.gender === '男' ? 'default' : 'outline'"
            @click="updateGender('男')"
          >
            男
          </Button>
          <Button
            :variant="modelValue.gender === '女' ? 'default' : 'outline'"
            @click="updateGender('女')"
          >
            女
          </Button>
        </div>
      </div>

      <!-- Birth Date and Time -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          出生日期和时间 <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <Input
            type="datetime-local"
            :value="modelValue.birthDateTime"
            @input="updateBirthDateTime"
            class="w-full"
          />
          <CalendarIcon class="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>

        <!-- Confirmation Message -->
        <div class="mt-3 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
          <div class="flex items-center space-x-2">
            <CalendarIcon class="w-4 h-4 text-green-600" />
            <span class="text-sm text-green-800 dark:text-green-200">
              已选择：{{ formatDateTime(modelValue.birthDateTime) }} <span class="text-green-600">(新历)</span>
            </span>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-300 mt-2">出生时间已选择，可点击输入框重新调整</p>
      </div>
    </div>

    <!-- Analysis Configuration -->
    <div class="space-y-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm p-6">
      <div class="flex items-center space-x-2 mb-6">
        <Settings class="w-5 h-5 text-green-500" />
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">分析配置</h2>
      </div>

      <!-- Analysis Types -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">分析类型</label>
        <div class="space-y-3">
          <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
            <CardContent class="p-4">
              <div class="flex items-start space-x-3">
                <Checkbox
                  :checked="modelValue.analysisTypes.basic"
                  @update:checked="updateAnalysisType('basic', $event)"
                  class="mt-1"
                />
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-gray-100">基础分析</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-300">八字排盘、五行分析、基本信息</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
            <CardContent class="p-4">
              <div class="flex items-start space-x-3">
                <Checkbox
                  :checked="modelValue.analysisTypes.deity"
                  @update:checked="updateAnalysisType('deity', $event)"
                  class="mt-1"
                />
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-gray-100">用神分析</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-300">用神喜忌、避神分析、格局判断</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
            <CardContent class="p-4">
              <div class="flex items-start space-x-3">
                <Checkbox
                  :checked="modelValue.analysisTypes.ai"
                  @update:checked="updateAnalysisType('ai', $event)"
                  class="mt-1"
                />
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-gray-100">运势预测</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-300">运势分析、性格分析、人生建议</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- AI Analysis Scope -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">选择分析范围</label>
        <div class="flex space-x-3">
          <Button
            :variant="modelValue.analysisScope.year ? 'default' : 'outline'"
            @click="updateAnalysisScope('year')"
          >
            流年
          </Button>
          <Button
            :variant="modelValue.analysisScope.month ? 'default' : 'outline'"
            @click="updateAnalysisScope('month')"
          >
            流月
          </Button>
          <Button
            :variant="modelValue.analysisScope.day ? 'default' : 'outline'"
            @click="updateAnalysisScope('day')"
          >
            流日
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Settings, Calendar as CalendarIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import dayjs from 'dayjs'

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

interface FormData {
  gender: '男' | '女'
  birthDateTime: string
  analysisTypes: AnalysisTypes
  analysisScope: AnalysisScope
}

const props = defineProps<{
  modelValue: FormData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FormData]
}>()

// 格式化日期时间
const formatDateTime = (dateTime: string): string => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}

// 更新性别
const updateGender = (gender: '男' | '女') => {
  emit('update:modelValue', { ...props.modelValue, gender })
}

// 更新出生日期时间
const updateBirthDateTime = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', { ...props.modelValue, birthDateTime: value })
}

// 更新分析类型
const updateAnalysisType = (type: keyof AnalysisTypes, checked: boolean) => {
  emit('update:modelValue', {
    ...props.modelValue,
    analysisTypes: {
      ...props.modelValue.analysisTypes,
      [type]: checked
    }
  })
}

// 更新分析范围
const updateAnalysisScope = (scope: keyof AnalysisScope) => {
  emit('update:modelValue', {
    ...props.modelValue,
    analysisScope: {
      ...props.modelValue.analysisScope,
      [scope]: !props.modelValue.analysisScope[scope]
    }
  })
}
</script> 