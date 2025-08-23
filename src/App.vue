<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO组件 -->
    <SEO />
    
    <ResponsiveSidebar />
    <main class="flex-1 pt-16 md:pt-16 pb-16 md:pb-0">
      <router-view />
    </main>
    <LoginModal />
  </div>
</template>

<script setup lang="ts">
import ResponsiveSidebar from './components/ResponsiveSidebar.vue'
import SEO from './components/SEO.vue'
import LoginModal from '@/components/LoginModal.vue'
</script>

<style>
#app {
  height: 100vh;
}
</style>