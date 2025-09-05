<!-- WishPool.vue -->
<template>
  <div class="fixed right-4 bottom-1/3 z-50 group">
    <!-- 悬浮图标 -->
    <button
      @click="openModal"
      class="relative flex items-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white rounded-full pl-4 pr-5 py-3 shadow-lg transition-all duration-300 transform group-hover:scale-105"
      title="点击吐槽"
    >
      <!-- 星星图标 -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
      <!-- 文字 -->
      <span class="text-sm font-medium whitespace-nowrap">吐个槽</span>
      
      <!-- 提示气泡 -->
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        点击吐槽 ✨
      </div>
    </button>
    
    <!-- 装饰星星 -->
    <div class="absolute -top-2 -right-2 text-yellow-300 animate-bounce">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
    </div>
    <div class="absolute -bottom-2 -left-2 text-purple-300 animate-bounce" style="animation-delay: 0.2s;">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
    </div>
  </div>

  <!-- 许愿池弹窗 -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="isSubmitting ? null : closeModal()"></div>

      <!-- 弹窗内容 -->
      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
        <!-- 统一的状态提示区域 -->
        <div class="mb-6">
          <!-- 错误提示 -->
          <div
            v-if="showError"
            class="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4"
          >
            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div class="flex-1 text-sm text-red-700 dark:text-red-200">
              {{ errorMessage }}
            </div>
          </div>
          
          <!-- 成功提示 -->
          <div
            v-if="showSuccess"
            class="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4"
          >
            <svg class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div class="flex-1 text-sm text-green-700 dark:text-green-200">
              {{ successMessage }}
            </div>
          </div>

          <!-- 提交进度提示 -->
          <div
            v-if="isSubmitting"
            class="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4"
          >
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <div class="flex-1">
              <div class="text-sm text-blue-700 dark:text-blue-200">
                正在提交吐槽...
              </div>
              <div class="text-xs text-blue-600 dark:text-blue-300 mt-1">
                请稍候，不要关闭窗口
              </div>
            </div>
          </div>
        </div>
        <!-- 关闭按钮 -->
        <div class="absolute right-0 top-0 pr-4 pt-4">
          <button
            type="button"
            class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="closeModal"
          >
            <span class="sr-only">关闭</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 顶部装饰 -->
        <div class="text-center mb-6">
          <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
            ✨ 吐槽池 ✨
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            写下你的吐槽，让我们被尽情鞭策
          </p>
        </div>

        <form @submit.prevent="isSubmitting ? null : submitWish()" class="space-y-6">
          <!-- 愿望内容 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              吐槽内容 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="wishForm.content"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
              required
              :disabled="isSubmitting"
              placeholder="在这里写下你的吐槽，也可以是其他..."
            ></textarea>
          </div>

          <!-- 用户信息 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                用户名
              </label>
              <Input
                v-model="wishForm.userName"
                type="text"
                :disabled="isSubmitting"
                placeholder="请输入用户名（选填）"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                邮箱
              </label>
              <Input
                v-model="wishForm.email"
                type="email"
                :disabled="isSubmitting"
                placeholder="请输入邮箱（选填）"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                手机号
              </label>
              <Input
                v-model="wishForm.phone"
                type="tel"
                :disabled="isSubmitting"
                placeholder="请输入手机号（选填）"
              />
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-3 pt-4">
            <Button 
              @click="closeModal" 
              variant="outline"
              :disabled="isSubmitting"
              class="min-w-[100px]"
            >
              取消
            </Button>
            <Button 
              type="submit" 
              :loading="isSubmitting"
              :disabled="isSubmitting"
              class="min-w-[100px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '提交中...' : '吐槽' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { API_CONFIG, REQUEST_CONFIG, ENV_CONFIG } from '@/api/config'
import axios from 'axios'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

// 创建专用的 axios 实例
const wishApi = axios.create({
  timeout: REQUEST_CONFIG.N8N_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 用户状态
const userStore = useUserStore()

// 弹窗状态
const isModalOpen = ref(false)
const isSubmitting = ref(false)

// 吐槽表单数据
const wishForm = reactive({
  content: '',
  userName: '',
  email: '',
  phone: ''
})

// 打开弹窗
const openModal = () => {
  // 如果用户已登录，自动填充用户信息
  if (userStore.isLoggedIn && userStore.userInfo) {
    wishForm.userName = userStore.userInfo.username || ''
    wishForm.email = userStore.userInfo.email || ''
    wishForm.phone = userStore.userInfo.phone || ''
  }
  isModalOpen.value = true
}

// 关闭弹窗
const closeModal = () => {
  // 如果正在提交中，不允许关闭弹窗
  if (isSubmitting.value) {
    console.log('正在提交中，不允许关闭弹窗')
    return
  }
  isModalOpen.value = false
}

// 错误提示
const errorMessage = ref('')
const showError = ref(false)

// 成功提示
const successMessage = ref('')
const showSuccess = ref(false)

// 显示错误信息
const showErrorMessage = (message: string) => {
  errorMessage.value = message
  showError.value = true
  setTimeout(() => {
    showError.value = false
    errorMessage.value = ''
  }, 3000)
}

// 显示成功信息
const showSuccessMessage = (message: string) => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    successMessage.value = ''
  }, 3000)
}

// 提交吐槽
const submitWish = async () => {
  // 防重复提交检查
  if (isSubmitting.value) {
    console.log('正在提交中，忽略重复点击')
    return
  }

  if (!wishForm.content.trim()) {
    showErrorMessage('请输入吐槽内容')
    return
  }

  try {
    // 设置提交状态，防止重复提交
    isSubmitting.value = true
    
    // 获取环境变量中的用户名和密码
    const username = import.meta.env.VITE_N8N_AI_USER
    const password = import.meta.env.VITE_N8N_AI_PASS
    
    // 调试信息（仅在开发环境显示）
    if (import.meta.env.DEV) {
      console.log('开发环境调试信息:', {
        username: username ? '已设置' : '未设置',
        password: password ? '已设置' : '未设置',
        apiUrl: API_CONFIG.N8N_WISH_URL,
        timeout: REQUEST_CONFIG.N8N_TIMEOUT,
        isDev: import.meta.env.DEV
      })
    }
    
    if (!username || !password) {
      throw new Error('认证信息未配置')
    }
    
    // 创建 Basic Auth 凭证
    const credentials = btoa(`${username}:${password}`)
    
    // 添加请求超时处理
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_CONFIG.N8N_TIMEOUT)
    
    // 使用配置的API地址
    const response = await wishApi.post(API_CONFIG.N8N_WISH_URL, {
      records: [
        {
          content: wishForm.content.trim(),
          userName: wishForm.userName.trim(),
          email: wishForm.email.trim(),
          phone: wishForm.phone.trim()
        }
      ]
    }, {
      headers: {
        'Authorization': `Basic ${credentials}`
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId) // 清除超时定时器
    console.log('API Response:', response.status, response.data)

    if (response.status !== 200) {
      throw new Error(`提交失败: ${response.status} ${response.data}`)
    }

    // 提交成功 - 使用更友好的提示
    showSuccessMessage('吐槽成功！我们会努力改进 ✨')
    
    // 重置表单
    wishForm.content = ''
    if (!userStore.isLoggedIn) {
      wishForm.userName = ''
      wishForm.email = ''
      wishForm.phone = ''
    }
    
    // 延迟关闭弹窗，让用户看到成功提示
    setTimeout(() => {
      closeModal()
    }, 1500)
    
  } catch (error) {
    console.error('提交吐槽失败:', error)
    
    // 根据错误类型显示不同的错误信息
    let errorMsg = '抱歉，吐槽失败了，请稍后再试'
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMsg = '请求超时，请检查网络连接后重试'
      } else if (error.message.includes('认证信息未配置')) {
        errorMsg = '系统配置错误，请联系管理员'
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMsg = import.meta.env.DEV 
          ? '请求失败：请确保本地开发服务器已启动，并检查代理配置'
          : '网络请求失败，请稍后重试'
      } else {
        errorMsg = import.meta.env.DEV
          ? `错误详情：${error.message}`
          : error.message
      }
    }
    
    // 在开发环境中输出详细错误信息
    if (import.meta.env.DEV) {
      console.error('吐槽请求失败:', {
        error,
        apiUrl: API_CONFIG.N8N_WISH_URL,
        errorName: error instanceof Error ? error.name : '未知错误类型',
        errorMessage: error instanceof Error ? error.message : String(error)
      })
    }
    
    showErrorMessage(errorMsg)
  } finally {
    // 确保提交状态被重置
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* 添加一些动画效果 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 输入框聚焦时的光晕效果 */
textarea:focus,
input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>