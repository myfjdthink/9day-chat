<template>
  <div class="space-y-6">
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
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

// 配置 dayjs
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

interface BirthInfo {
  gender: '男' | '女'
  birthDateTime: string
}

const props = defineProps<{
  modelValue: BirthInfo
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: BirthInfo): void
}>()

// 格式化日期时间为北京时间
const formatDateTime = (dateTime: string): string => {
  return dayjs(dateTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
}

// 更新性别
const updateGender = (gender: '男' | '女') => {
  emit('update:modelValue', { ...props.modelValue, gender })
}

// 更新出生日期时间
const updateBirthDateTime = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', { ...props.modelValue, birthDateTime: target.value })
}
</script>
