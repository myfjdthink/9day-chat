<template>
  <span :class="iconClass" class="text-5xl">
    {{ getZodiacEmoji(zodiac) }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  zodiac: string
  iconClass?: string
}

withDefaults(defineProps<Props>(), {
  iconClass: 'text-gray-700'
})

// 生肖emoji映射
const zodiacEmojiMap: Record<string, string> = {
  '鼠': '🐭',
  '牛': '🐮',
  '虎': '🐯',
  '兔': '🐰',
  '龙': '🐲',
  '蛇': '🐍',
  '马': '🐴',
  '羊': '🐑',
  '猴': '🐒',
  '鸡': '🐔',
  '狗': '🐕',
  '猪': '🐷'
}

// 获取生肖emoji
const getZodiacEmoji = (zodiac: string): string => {
  return zodiacEmojiMap[zodiac] || '❓'
}
</script> 
