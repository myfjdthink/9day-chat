<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div class="text-center mb-6">
        <img src="@/assets/logo.png" alt="Logo" class="w-16 h-16 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.passwordReset.title') }}</h1>
        <p class="text-gray-500 dark:text-gray-300">{{ t('admin.passwordReset.desc') }}</p>
      </div>
      <form @submit.prevent="handleVerify">
        <!-- 新密码输入框 -->
        <div class="mb-4"><Input v-model="newPassword" type="password" :placeholder="t('admin.passwordReset.newPassword')" autocomplete="new-password" /></div>
        <!-- 确认密码输入框 -->
        <div class="mb-4"><Input v-model="confirmPassword" type="password" :placeholder="t('admin.passwordReset.confirmPassword')" autocomplete="new-password" /></div>
        <!-- 成功与错误提示 -->
        <div v-if="msg" class="mb-4 text-green-500 text-sm">{{ msg }}</div>
        <div v-if="errorMsg" class="mb-4 text-red-500 text-sm">{{ errorMsg }}</div>
        <Button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white py-2" :disabled="!token">{{ t('admin.passwordReset.submit') }}</Button>
      </form>
      <div class="flex justify-between mt-4 text-sm">
        <router-link to="/login" class="text-blue-500 hover:underline">{{ t('auth.backToLogin') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { passwordResetVerify } from '@/api/user'
import * as I18n from 'vue-i18n'

const { useI18n } = I18n as any
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const token = ref('') // 重置令牌
const newPassword = ref('') // 新密码
const confirmPassword = ref('') // 确认新密码
const errorMsg = ref('')
const msg = ref('')

// 页面加载时自动从 URL 获取 token
onMounted(() => {
  // 从 query 参数获取 token
  token.value = route.query.token as string || ''
  if (!token.value) {
    errorMsg.value = t('admin.passwordReset.invalidLink')
  }
})

// 提交新密码，调用重置接口
const handleVerify = async () => {
  errorMsg.value = ''
  msg.value = ''
  if (!token.value) {
    errorMsg.value = t('admin.passwordReset.invalidLink')
    return
  }
  if (!newPassword.value) {
    errorMsg.value = t('admin.passwordReset.requireNewPassword')
    return
  }
  if (!confirmPassword.value) {
    errorMsg.value = t('admin.passwordReset.requireConfirm')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = t('admin.passwordReset.mismatch')
    return
  }
  try {
    await passwordResetVerify(token.value, newPassword.value)
    msg.value = t('admin.passwordReset.success')
    setTimeout(() => router.push('/login'), 1500)
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.detail || e?.message || t('admin.passwordReset.errorDefault')
  }
}
</script>

<style scoped>
</style>