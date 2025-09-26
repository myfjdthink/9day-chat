<template>
  <div class="max-w-2xl mx-auto mt-10 px-4">
    <!-- 顶部卡片：头像+用户名+邮箱 -->
    <div class="flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-6">
      <img :src="avatarUrl" class="w-20 h-20 rounded-full border-4 border-green-400 shadow mb-3 bg-gray-100 dark:bg-gray-700 object-cover" alt="avatar" />
      <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ form.username || '未设置用户名' }}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ form.email }}</div>
      <div class="flex gap-2 mt-2">
        <span class="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs">{{ form.role }}</span>
        <span class="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs">{{ form.is_active ? '已激活' : '未激活' }}</span>
        <span class="px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs">{{ form.is_verified ? '已验证' : '未验证' }}</span>
      </div>
      <Button v-if="!isEdit" variant="default" size="lg" class="mt-6 px-8 py-2" @click="isEdit = true">编辑</Button>
    </div>

    <!-- 详细信息卡片 -->
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">个人信息管理 - 用户中心</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <!-- 用户名分组 -->
        <div class="md:col-span-2">
          <label class="block text-gray-700 dark:text-gray-300 mb-1">用户名</label>
          <template v-if="isEdit">
            <Input v-model="form.username" class="input" />
          </template>
          <template v-else>
            <div class="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              {{ form.username || '未设置用户名' }}
            </div>
          </template>
        </div>
        <!-- 手机号、性别等其它字段 -->
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">手机号</label>
          <input v-model="form.phone" :readonly="!isEdit" class="input" type="tel" required />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">性别</label>
          <select v-model="form.gender" :disabled="!isEdit" class="input">
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>
        <!-- 出生日期和时间分组 -->
        <div class="md:col-span-2">
          <label class="block text-gray-700 dark:text-gray-300 mb-1">出生日期和时间</label>
          <template v-if="isEdit">
            <Input type="datetime-local" v-model="birthDateTime" class="input" />
          </template>
          <template v-else>
            <div class="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              {{ formatDateTimeDisplay(birthDateTime) }}
            </div>
          </template>
        </div>
        <!-- 只读信息 -->
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">用户ID</label>
          <input :value="form.id" readonly class="input bg-gray-100 dark:bg-gray-800" />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">注册时间</label>
          <input :value="formatTime(form.created_at)" readonly class="input bg-gray-100 dark:bg-gray-800" />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">更新时间</label>
          <input :value="formatTime(form.updated_at)" readonly class="input bg-gray-100 dark:bg-gray-800" />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">最后登录</label>
          <input :value="formatTime(form.last_login)" readonly class="input bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
      <div v-if="validationError" class="mt-2 text-red-600 dark:text-red-400">{{ validationError }}</div>
      <div v-if="isEdit" class="flex justify-end mt-6 gap-2">
        <Button type="submit" variant="default" @click="onSubmit">保存</Button>
        <Button type="button" variant="outline" @click="onCancel">取消</Button>
      </div>
      <div v-if="msg" class="mt-4 text-green-600 dark:text-green-400">{{ msg }}</div>
      <div v-if="error" class="mt-4 text-red-600 dark:text-red-400">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateUserInfo, fetchUserInfo } from '@/api/user'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import boyAvatar from '@/assets/boy.png'
import girlAvatar from '@/assets/girl.png'

// 头像（根据性别动态选择）
const avatarUrl = computed(() => 
  form.gender === 'female' ? girlAvatar : boyAvatar
)

function formatTime(val: string | null) {
  if (!val) return '-'
  return new Date(val).toLocaleString()
}

const form = reactive({
  id: '',
  username: '',
  email: '',
  phone: '',
  role: '',
  is_active: false,
  is_verified: false,
  birth_year: 2000,
  birth_month: 1,
  birth_day: 1,
  birth_time: '00:00',
  gender: 'male',
  created_at: '',
  updated_at: '',
  last_login: '',
})

const isEdit = ref(false)
const msg = ref('')
const error = ref('')
const userStore = useUserStore()
const validationError = ref('')

function validateForm() {
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    validationError.value = '请输入有效的手机号'
    return false
  }
  if (form.birth_year < 1900 || form.birth_year > 2100) {
    validationError.value = '出生年份范围1900-2100'
    return false
  }
  if (form.birth_month < 1 || form.birth_month > 12) {
    validationError.value = '出生月份范围1-12'
    return false
  }
  if (form.birth_day < 1 || form.birth_day > 31) {
    validationError.value = '出生日范围1-31'
    return false
  }
  if (!/^\d{2}:\d{2}$/.test(form.birth_time)) {
    validationError.value = '出生时间格式应为HH:MM'
    return false
  }
  validationError.value = ''
  return true
}

const loadUser = async () => {
  try {
    const data = await fetchUserInfo()
    Object.assign(form, data)
  } catch (e: any) {
    error.value = e?.message || '获取用户信息失败'
  }
}

onMounted(() => {
  loadUser()
})

const onSubmit = async () => {
  if (!validateForm()) return
  try {
    await updateUserInfo({
      username: form.username,
      phone: form.phone,
      birth_year: form.birth_year,
      birth_month: form.birth_month,
      birth_day: form.birth_day,
      birth_time: form.birth_time,
      gender: form.gender,
    })
    msg.value = '保存成功！'
    error.value = ''
    isEdit.value = false
    userStore.fetchUser()
    await nextTick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e: any) {
    error.value = e?.message || '保存失败'
    msg.value = ''
  }
}

const onCancel = () => {
  isEdit.value = false
  loadUser()
}

// 生日日期时间双向绑定，和 year/month/day/time 字段互转
const birthDateTime = computed({
  get() {
    if (!form.birth_year || !form.birth_month || !form.birth_day || !form.birth_time) return ''
    // birth_time 可能为 "08:00" 或 "8:00"，需补零
    const [h, m] = form.birth_time.split(':')
    const hh = h.padStart(2, '0')
    const mm = m.padStart(2, '0')
    return `${form.birth_year}-${String(form.birth_month).padStart(2, '0')}-${String(form.birth_day).padStart(2, '0')}T${hh}:${mm}`
  },
  set(val: string) {
    if (!val) return
    const [date, time] = val.split('T')
    if (!date || !time) return
    const [year, month, day] = date.split('-').map(Number)
    form.birth_year = year
    form.birth_month = month
    form.birth_day = day
    form.birth_time = time.slice(0, 5)
  }
})

function formatDateTimeDisplay(val: string) {
  if (!val) return '-'
  const [date, time] = val.split('T')
  return `${date} ${time}`
}
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition;
}
</style>