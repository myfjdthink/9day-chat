<template>
  <Modal
    :show="userStore.showLoginModal"
    title="登录提示"
    message="请先登录后再使用此功能"
    confirmText="去登录"
    cancelText="取消"
    :onConfirm="handleLoginConfirm"
    :onCancel="handleLoginCancel"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Modal from '@/components/ui/Modal.vue'

const router = useRouter()
const userStore = useUserStore()

const handleLoginConfirm = () => {
  userStore.hideLogin()
  // 保存当前路径
  userStore.redirectPath = router.currentRoute.value.path
  router.push('/login')
  
}

const handleLoginCancel = () => {
  userStore.hideLogin()
}
</script> 