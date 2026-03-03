<template>
  <div :class="cn('p-6', $attrs.class || '')">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
