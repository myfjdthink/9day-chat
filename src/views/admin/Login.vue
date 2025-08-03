<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div class="text-center mb-6">
        <img src="@/assets/logo.png" alt="Logo" class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">用户登录</h2>
        <p class="text-gray-500 dark:text-gray-300">欢迎回来，请输入您的账号信息</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <Input v-model="form.username" placeholder="用户名或邮箱" autocomplete="username" />
        </div>
        <div class="mb-4">
          <Input v-model="form.password" type="password" placeholder="密码" autocomplete="current-password" />
        </div>
        <div v-if="errorMsg" class="mb-4 text-red-500 dark:text-red-400 text-sm">{{ errorMsg }}</div>
        <Button type="submit" variant="default" class="w-full py-2">登录</Button>
      </form>
      <div class="flex justify-between mt-4 text-sm">
        <router-link to="/forgot-password" class="text-blue-500 dark:text-blue-400 hover:underline">忘记密码？</router-link>
        <router-link to="/register" class="text-gray-500 dark:text-gray-400 hover:underline">注册新账号</router-link>
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
    errorMsg.value = '请输入用户名和密码'
    return
  }
  try {
    await userStore.login(form.value.username, form.value.password)
    // 登录成功后跳转首页
    router.push('/')
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.detail || e?.message || '登录失败，请重试'
  }
}
</script>

<style scoped>
/* 可根据实际需要调整样式 */
</style> 