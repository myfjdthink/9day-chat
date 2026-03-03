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
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand text-brand-foreground hover:bg-brand-strong',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700',
        outline: 'border border-brand text-brand bg-white hover:bg-brand-soft hover:border-brand-strong dark:bg-gray-800 dark:hover:bg-gray-700',
        secondary: 'bg-[#0b3289] text-white hover:bg-[#1746b1] dark:bg-[#0b3289] dark:text-white dark:hover:bg-[#1746b1]',
        ghost: 'text-brand hover:bg-brand-soft hover:text-brand-strong dark:hover:bg-gray-700',
        link: 'text-brand underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-11 px-4 py-2 md:h-10',
        sm: 'h-10 rounded-lg px-3 md:h-9',
        lg: 'h-12 rounded-lg px-6 md:h-11',
        icon: 'h-11 w-11 md:h-10 md:w-10'
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
