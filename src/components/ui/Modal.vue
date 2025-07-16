<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
        <slot name="icon">
          <!-- 默认图标 -->
          <svg class="mx-auto mb-4 w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        </slot>
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ title }}</h2>
        <p class="text-gray-500 dark:text-gray-300 mb-6">{{ message }}</p>
        <div class="flex justify-center gap-4">
          <Button variant="default" @click="onConfirm">{{ confirmText }}</Button>
          <Button variant="outline" @click="onCancel">{{ cancelText }}</Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Button from './Button.vue'
const props = defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}>()
</script> 