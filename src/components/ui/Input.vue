<template>
  <input
    ref="inputRef"
    :class="cn(
      'flex h-10 w-full rounded-md border border-[#b67fda] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b67fda] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      $attrs.class || ''
    )"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ref } from 'vue'

interface InputProps {
  modelValue?: string
}

defineProps<InputProps>()
defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement>()

defineExpose({
  focus: () => inputRef.value?.focus(),
  input: inputRef
})
</script>