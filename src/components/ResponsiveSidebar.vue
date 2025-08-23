<template>
  <!-- 桌面版导航栏 -->
  <Sidebar
    :active-tab="activeTab"
    @set-active-tab="setActiveTab"
    @select-chat="(id) => $emit('select-chat', id)"
    @delete-chat="(id) => $emit('delete-chat', id)"
    @select-analysis="(id) => $emit('select-analysis', id)"
    @delete-analysis="(id) => $emit('delete-analysis', id)"
  />

  <!-- 移动版导航栏 -->
  <MobileSidebar
    :active-tab="activeTab"
    @set-active-tab="setActiveTab"
    @select-chat="(id) => $emit('select-chat', id)"
    @delete-chat="(id) => $emit('delete-chat', id)"
    @select-analysis="(id) => $emit('select-analysis', id)"
    @delete-analysis="(id) => $emit('delete-analysis', id)"
  />
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import MobileSidebar from './MobileSidebar.vue'
import { useNavigation } from '@/composables/useNavigation'

const { activeTab, setActiveTab } = useNavigation()

defineEmits<{
  'select-chat': [id: string]
  'delete-chat': [id: string]
  'select-analysis': [id: string]
  'delete-analysis': [id: string]
}>()
</script> 