<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div class="text-center mb-6">
        <img src="@/assets/logo.png" alt="Logo" class="w-16 h-16 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.forgotPassword.title') }}</h1>
        <p class="text-gray-500 dark:text-gray-300">{{ t('admin.forgotPassword.desc') }}</p>
      </div>
      <form @submit.prevent="handleRequest">
        <!-- 邮箱输入框 -->
        <div class="mb-4"><Input v-model="email" :placeholder="t('admin.forgotPassword.emailPlaceholder')" autocomplete="email" /></div>
        <!-- 成功与错误提示 -->
        <div v-if="msg" class="mb-4 text-green-500 text-sm">{{ msg }}</div>
        <div v-if="errorMsg" class="mb-4 text-red-500 text-sm">{{ errorMsg }}</div>
        <Button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white py-2">{{ t('admin.forgotPassword.submit') }}</Button>
      </form>
      <div class="flex justify-between mt-4 text-sm">
        <router-link to="/login" class="text-blue-500 hover:underline">{{ t('auth.backToLogin') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { passwordResetRequest } from '@/api/user'
import * as I18n from 'vue-i18n'

const { useI18n } = I18n as any
const { t } = useI18n()

const email = ref('') // 用户输入的邮箱
const errorMsg = ref('')
const msg = ref('')

// 发送重置密码请求
const handleRequest = async () => {
  errorMsg.value = ''
  msg.value = ''
  if (!email.value) {
    errorMsg.value = t('admin.forgotPassword.emptyEmail')
    return
  }
  try {
    await passwordResetRequest(email.value)
    msg.value = t('admin.forgotPassword.success')
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.detail || e?.message || t('admin.forgotPassword.errorDefault')
  }
}
</script>

<style scoped>
</style>