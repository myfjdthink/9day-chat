<template>
  <button
    :class="cn(buttonVariants({ variant, size }), $attrs.class || '')"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b67fda] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#b67fda] text-white hover:bg-[#a06cc7]',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-[#b67fda] text-[#b67fda] bg-white hover:bg-[#ecd8f6] hover:border-[#a06cc7]',
        secondary: 'bg-[#0b3289] text-white hover:bg-[#1746b1]',
        ghost: 'hover:bg-[#e6eaf6] hover:text-[#0b3289]',
        link: 'text-[#b67fda] underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

defineProps<ButtonProps>()
defineEmits<{
  click: [event: MouseEvent]
}>()
</script>