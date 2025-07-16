<template>
  <div class="flex items-center space-x-2">
    <input
      :id="id"
      type="checkbox"
      :checked="checked"
      @change="$emit('update:checked', ($event.target as HTMLInputElement).checked)"
      :class="cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-[#b67fda] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b67fda] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#b67fda] data-[state=checked]:text-white',
        $attrs.class || ''
      )"
      v-bind="$attrs"
    />
    <label v-if="$slots.default" :for="id" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked?: boolean
  id?: string
}

defineProps<CheckboxProps>()
defineEmits<{
  'update:checked': [checked: boolean]
}>()
</script>