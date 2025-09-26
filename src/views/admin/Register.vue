<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div class="text-center mb-6">
        <img src="@/assets/logo.png" alt="Logo" class="w-16 h-16 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">注册新账号 - 北斗九号日历</h1>
        <p class="text-gray-500 dark:text-gray-300">请填写以下信息完成注册</p>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">用户名</label>
          <Input v-model="form.username" placeholder="用户名（选填）" autocomplete="username" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">邮箱 <span class="text-red-500">*</span></label>
          <Input v-model="form.email" placeholder="邮箱（必填）" autocomplete="email" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">手机号</label>
          <Input v-model="form.phone" placeholder="手机号（选填）" autocomplete="tel" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">出生日期和时间</label>
          <div class="relative">
            <Input type="datetime-local" v-model="form.birth_datetime" class="w-full" />
            <CalendarIcon class="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          <div v-if="form.birth_datetime" class="mt-2 text-xs text-green-700 dark:text-green-200">
            已选择：{{ formatDateTime(form.birth_datetime) }}
          </div>
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">性别</label>
          <select v-model="form.gender" class="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-100">
            <option value="">请选择性别（选填）</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">密码 <span class="text-red-500">*</span></label>
          <Input v-model="form.password" type="password" placeholder="密码（必填）" autocomplete="new-password" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">确认密码 <span class="text-red-500">*</span></label>
          <Input v-model="form.confirmPassword" type="password" placeholder="确认密码（必填）" autocomplete="new-password" />
        </div>
        <div v-if="errorMsg" class="mb-4 text-red-500 text-sm">{{ errorMsg }}</div>
        <Button type="submit" variant="default" class="w-full py-2">注册</Button>
      </form>
      <div class="flex justify-between mt-4 text-sm">
        <router-link to="/login" class="text-blue-500 hover:underline">已有账号？去登录</router-link>
      </div>
    </div>
    <!-- 注册成功浮层 -->
    <transition name="fade">
      <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="bg-[#b67fda] text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center space-x-3 text-lg font-semibold">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>注册成功，请登录</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { register } from '@/api/user'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import dayjs from 'dayjs'

const router = useRouter()
interface RegisterForm {
  username: string
  email: string
  phone: string
  birth_datetime: string
  birth_year: string
  birth_month: string
  birth_day: string
  birth_time: string
  gender: string
  password: string
  confirmPassword: string
}
const form = ref<RegisterForm>({
  username: '',
  email: '',
  phone: '',
  birth_datetime: '',
  birth_year: '',
  birth_month: '',
  birth_day: '',
  birth_time: '',
  gender: '',
  password: '',
  confirmPassword: ''
})
const errorMsg = ref('')
const showSuccess = ref(false)

// 手机号正则
const phonePattern = /^1[3-9]\d{9}$/

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return ''
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
}

const handleRegister = async (): Promise<void> => {
  errorMsg.value = ''
  // 只校验邮箱和密码为必填项
  if (!form.value.email || !form.value.password || !form.value.confirmPassword) {
    errorMsg.value = '请填写邮箱和密码'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }
  // 用户名校验
  if (form.value.username && form.value.username.length < 2) {
    errorMsg.value = '用户名至少2个字符'
    return
  }
  // 手机号校验
  if (form.value.phone && !phonePattern.test(form.value.phone)) {
    errorMsg.value = '请输入有效的手机号'
    return
  }
  // 拆分 birth_datetime 到各字段
  if (form.value.birth_datetime) {
    const dt = dayjs(form.value.birth_datetime)
    form.value.birth_year = String(dt.year())
    form.value.birth_month = String(dt.month() + 1)
    form.value.birth_day = String(dt.date())
    form.value.birth_time = dt.format('HH:mm')
  } else {
    form.value.birth_year = ''
    form.value.birth_month = ''
    form.value.birth_day = ''
    form.value.birth_time = ''
  }
  // gender 只允许 male/female，否则不传
  const genderValue = form.value.gender === 'male' || form.value.gender === 'female' ? form.value.gender : undefined
  // birth_time 只允许 HH:mm 格式，否则不传
  const birthTimeValue = form.value.birth_time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.value.birth_time) ? form.value.birth_time : undefined
  try {
    await register({
      username: form.value.username || form.value.email,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone || undefined,
      birth_year: form.value.birth_year ? Number(form.value.birth_year) : undefined,
      birth_month: form.value.birth_month ? Number(form.value.birth_month) : undefined,
      birth_day: form.value.birth_day ? Number(form.value.birth_day) : undefined,
      birth_time: birthTimeValue,
      gender: genderValue
    })
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
      router.push('/login')
    }, 3000)
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.detail || e?.message || '注册失败，请重试'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>