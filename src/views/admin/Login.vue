<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div class="text-center mb-6">
        <img src="@/assets/logo.png" alt="Logo" class="w-16 h-16 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.login.title') }}</h1>
        <p class="text-gray-500 dark:text-gray-300">{{ t('admin.login.desc') }}</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <Input v-model="form.username" :placeholder="t('admin.login.usernameOrEmail')" autocomplete="username" />
        </div>
        <div class="mb-4">
          <Input v-model="form.password" type="password" :placeholder="t('admin.login.password')" autocomplete="current-password" />
        </div>
        <div v-if="errorMsg" class="mb-4 text-red-500 dark:text-red-400 text-sm">{{ errorMsg }}</div>
        <Button type="submit" variant="default" class="w-full py-2">{{ t('admin.login.submit') }}</Button>
      </form>
      <div class="flex justify-between mt-4 text-sm">
        <router-link to="/forgot-password" class="text-blue-500 dark:text-blue-400 hover:underline">{{ t('admin.login.forgot') }}</router-link>
        <router-link to="/register" class="text-gray-500 dark:text-gray-400 hover:underline">{{ t('admin.login.register') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { useUserStore } from '@/stores/user'
import * as I18n from 'vue-i18n'

const { useI18n } = I18n as any
const { t } = useI18n()

const router = useRouter()
const userStore = useUserStore()
const form = ref({
  username: '',
  password: ''
})
const errorMsg = ref('')

// 登录处理函数
const handleLogin = async () => {
  errorMsg.value = ''
  if (!form.value.username || !form.value.password) {
    errorMsg.value = t('admin.login.requireCredential')
    return
  }
  try {
    await userStore.login(form.value.username, form.value.password)
    // 登录成功后跳转首页
    router.push('/')
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.detail || e?.message || t('admin.login.errorDefault')
  }
}
</script>

<style scoped>
/* 可根据实际需要调整样式 */
</style>