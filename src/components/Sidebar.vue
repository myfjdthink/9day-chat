<template>
  <div>
    <!-- Web 端侧边栏 -->
    <WebSidebar
      v-show="!isMobile"
      :active-tab="activeTab"
      :selected-chat-id="selectedChatId"
      :selected-analysis-id="selectedAnalysisId"
      @set-active-tab="$emit('set-active-tab', $event)"
      @select-chat="$emit('select-chat', $event)"
      @delete-chat="$emit('delete-chat', $event)"
      @select-analysis="$emit('select-analysis', $event)"
      @delete-analysis="$emit('delete-analysis', $event)"
    />

    <!-- 移动端底部导航 -->
    <MobileSidebar
      v-show="isMobile"
      :active-tab="activeTab"
      @set-active-tab="$emit('set-active-tab', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import WebSidebar from './WebSidebar.vue'
import MobileSidebar from './MobileSidebar.vue'
import { useMediaQuery } from '@vueuse/core'

interface SidebarProps {
  activeTab: string
  selectedChatId?: string | null
  selectedAnalysisId?: string | null
}

defineProps<SidebarProps>()

defineEmits<{
  'set-active-tab': [tab: string]
  'select-chat': [id: string]
  'delete-chat': [id: string]
  'select-analysis': [id: string]
  'delete-analysis': [id: string]
}>()

// 使用 VueUse 的 useMediaQuery 来处理响应式
const isMobile = useMediaQuery('(max-width: 640px)')
</script>