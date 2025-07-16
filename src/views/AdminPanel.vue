<template>
  <div class="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
    <h2 class="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
      <span class="i-heroicons-users-2 mr-2"></span>用户信息管理
    </h2>
    <!-- 统计卡片区 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="flex items-center p-5 rounded-xl shadow bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800">
        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-2xl mr-4">
          <span class="i-heroicons-user-group"></span>
        </div>
        <div>
          <div class="text-2xl font-bold text-blue-700 dark:text-blue-200">{{ totalUsers }}</div>
          <div class="text-sm text-blue-600 dark:text-blue-300">累计注册用户</div>
        </div>
      </div>
      <div class="flex items-center p-5 rounded-xl shadow bg-gradient-to-tr from-green-100 to-green-50 dark:from-green-900 dark:to-green-800">
        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-green-500 text-white text-2xl mr-4">
          <span class="i-heroicons-user-check"></span>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-700 dark:text-green-200">{{ activeUsers }}</div>
          <div class="text-sm text-green-600 dark:text-green-300">活跃用户（30天内登录）</div>
        </div>
      </div>
      <div class="flex items-center p-5 rounded-xl shadow bg-gradient-to-tr from-yellow-100 to-yellow-50 dark:from-yellow-900 dark:to-yellow-800">
        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500 text-white text-2xl mr-4">
          <span class="i-heroicons-chart-pie"></span>
        </div>
        <div>
          <div class="text-2xl font-bold" :class="activeRateColor">{{ activeRateStr }}</div>
          <div class="text-sm text-yellow-700 dark:text-yellow-200">活跃率</div>
        </div>
      </div>
    </div>
    <div v-if="!isAdmin" class="text-red-600 dark:text-red-400">无权限访问</div>
    <div v-else>
      <!-- 导入导出按钮区 -->
      <div class="flex gap-2 mb-4">
        <Button @click="handleExport" variant="outline">导出用户数据</Button>
        <label class="inline-flex items-center cursor-pointer">
          <input type="file" accept="application/json" class="hidden" @change="handleImport" ref="importInput" />
          <Button variant="outline">导入用户数据</Button>
        </label>
      </div>
      <!-- 筛选与搜索区 -->
      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div class="flex gap-2">
          <select v-model="filterRole" class="input w-32">
            <option value="">全部角色</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
          <select v-model="filterActive" class="input w-24">
            <option value="">激活状态</option>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
          <select v-model="filterVerified" class="input w-24">
            <option value="">验证状态</option>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <input v-model="search" class="input flex-1 md:w-64" placeholder="搜索用户名/邮箱..." />
      </div>
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">用户列表</h3>
      <table class="w-full text-sm border rounded overflow-hidden">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="p-2">序号</th>
            <th class="p-2 cursor-pointer select-none" @click="sortBy('username')">
              用户名
              <span v-if="sortField==='username'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
            </th>
            <th class="p-2 cursor-pointer select-none" @click="sortBy('email')">
              邮箱
              <span v-if="sortField==='email'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
            </th>
            <th class="p-2 cursor-pointer select-none" @click="sortBy('role')">
              角色
              <span v-if="sortField==='role'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
            </th>
            <th class="p-2 cursor-pointer select-none" @click="sortBy('is_active')">
              激活
              <span v-if="sortField==='is_active'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
            </th>
            <th class="p-2 cursor-pointer select-none" @click="sortBy('is_verified')">
              验证
              <span v-if="sortField==='is_verified'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
            </th>
            <th class="p-2 cursor-pointer select-none" @click="sortBy('created_at')">
              注册时间
              <span v-if="sortField==='created_at'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
            </th>
            <th class="p-2 cursor-pointer select-none" @click="sortBy('last_login')">
              最后登录
              <span v-if="sortField==='last_login'">{{ sortOrder==='asc'?'▲':'▼' }}</span>
            </th>
            <th class="p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, idx) in filteredSortedUsers" :key="user.id" class="border-b dark:border-gray-700">
            <td class="p-2">{{ idx + 1 }}</td>
            <td class="p-2">{{ user.username }}</td>
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2">{{ user.role }}</td>
            <td class="p-2">{{ user.is_active ? '是' : '否' }}</td>
            <td class="p-2">{{ user.is_verified ? '是' : '否' }}</td>
            <td class="p-2">{{ formatTime(user.created_at) }}</td>
            <td class="p-2">{{ formatTime(user.last_login) }}</td>
            <td class="p-2">
              <template v-if="isAdmin">
                <button class="text-blue-600 dark:text-blue-300 hover:underline mr-2" @click="editUser(user)">编辑</button>
                <template v-if="userStore.user?.role === 'superadmin'">
                  <button class="text-red-600 dark:text-red-400 hover:underline" @click="confirmDeleteUser(user)">删除</button>
                </template>
              </template>
              <template v-else>
                -
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- 用户编辑/删除弹窗 -->
  <Modal
    :show="showUserModal"
    :title="userModalMode==='edit' ? '编辑用户' : '删除用户'"
    :message="userModalMode==='edit' ? '可修改用户属性' : '确定要删除该用户吗？'"
    :confirmText="userModalMode==='edit' ? '保存' : '删除'"
    :cancelText="'取消'"
    :onConfirm="userModalMode==='edit' ? handleUserSave : handleUserDelete"
    :onCancel="() => { showUserModal = false }"
  >
    <template #default>
      <div v-if="userModalMode==='edit' && editUserForm">
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">角色</label>
          <select v-model="editUserForm.role" class="input w-full">
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">激活</label>
          <select v-model="editUserForm.is_active" class="input w-full">
            <option :value="true">是</option>
            <option :value="false">否</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">验证</label>
          <select v-model="editUserForm.is_verified" class="input w-full">
            <option :value="true">是</option>
            <option :value="false">否</option>
          </select>
        </div>
      </div>
      <div v-else-if="userModalMode==='delete'">
        <div class="text-red-600 dark:text-red-400 font-bold">该操作不可恢复，确定要删除该用户吗？</div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import request from '@/api/request-user'
import { exportUsers, importUsers } from '@/api/user'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'

// 1. 用 request.patch/delete 代替 updateUser/deleteUser
// 2. 确保所有变量已用 ref 定义
const showUserModal = ref(false)
const userModalMode = ref<'edit'|'delete'>('edit')
const editUserObj = ref<any>(null)
const editUserForm = ref<any>(null)

const userStore = useUserStore()
const users = ref<any[]>([])

const isAdmin = computed(() => {
  const role = userStore.user?.role
  return role === 'admin' || role === 'superadmin'
})

function formatTime(val: string) {
  if (!val) return '-'
  return new Date(val).toLocaleString()
}

// 统计逻辑
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => {
  const now = Date.now()
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
  return users.value.filter(u => u.last_login && (now - new Date(u.last_login).getTime() < THIRTY_DAYS)).length
})
const activeRate = computed(() => totalUsers.value ? (activeUsers.value / totalUsers.value) : 0)
const activeRateStr = computed(() => totalUsers.value ? (activeRate.value * 100).toFixed(1) + '%' : '-')
const activeRateColor = computed(() => activeRate.value >= 0.5 ? 'text-green-700 dark:text-green-200' : 'text-red-600 dark:text-red-400')

async function fetchAllUsers() {
  const all: any[] = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await request.get(`/users/list?skip=${skip}&limit=${limit}`)
    const list = res.data || []
    all.push(...list)
    if (list.length < limit) break
    skip += limit
  }
  users.value = all
}

function editUser(user: any) {
  editUserObj.value = user
  editUserForm.value = { ...user }
  userModalMode.value = 'edit'
  showUserModal.value = true
}

function confirmDeleteUser(user: any) {
  editUserObj.value = user
  userModalMode.value = 'delete'
  showUserModal.value = true
}

async function handleUserSave() {
  if (!editUserObj.value || !editUserForm.value) return
  try {
    // 用 PATCH 更新用户属性
    await request.patch(`/users/${editUserObj.value.id}`, editUserForm.value)
    Object.assign(editUserObj.value, editUserForm.value)
    showUserModal.value = false
    msg.value = '用户信息已更新'
  } catch (e: any) {
    error.value = e?.message || '保存失败'
  }
}

async function handleUserDelete() {
  if (!editUserObj.value) return
  try {
    await request.delete(`/users/${editUserObj.value.id}`)
    await fetchAllUsers()
    showUserModal.value = false
    msg.value = '用户已停用'
  } catch (e: any) {
    if (e?.response?.status === 403) {
      error.value = '只有超级管理员可以删除用户'
    } else {
      error.value = e?.message || '删除失败'
    }
  }
}

const filterRole = ref('')
const filterActive = ref('')
const filterVerified = ref('')
const search = ref('')
const sortField = ref('created_at')
const sortOrder = ref<'asc'|'desc'>('desc')

const filteredSortedUsers = computed(() => {
  let arr = users.value.slice()
  // 筛选
  arr = arr.filter(u => u.is_active) // 只显示激活用户
  if (filterRole.value) arr = arr.filter(u => u.role === filterRole.value)
  if (filterActive.value) arr = arr.filter(u => String(u.is_active) === filterActive.value)
  if (filterVerified.value) arr = arr.filter(u => String(u.is_verified) === filterVerified.value)
  // 搜索
  if (search.value) {
    const kw = search.value.toLowerCase()
    arr = arr.filter(u => (u.username && u.username.toLowerCase().includes(kw)) || (u.email && u.email.toLowerCase().includes(kw)))
  }
  // 排序
  arr.sort((a, b) => {
    let va = a[sortField.value], vb = b[sortField.value]
    if (sortField.value.endsWith('_at') || sortField.value === 'last_login') {
      va = va ? new Date(va).getTime() : 0
      vb = vb ? new Date(vb).getTime() : 0
    }
    if (va === undefined || va === null) va = ''
    if (vb === undefined || vb === null) vb = ''
    if (va < vb) return sortOrder.value === 'asc' ? -1 : 1
    if (va > vb) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  return arr
})

function sortBy(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const importInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const msg = ref('')
const error = ref('')

// 导出用户数据
async function handleExport() {
  isLoading.value = true
  msg.value = ''
  error.value = ''
  try {
    // 调用新版导出接口，返回 blob 文件
    const blob = await exportUsers()
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_${new Date().toISOString().slice(0,10)}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
    msg.value = '用户数据导出成功！'
  } catch (e: any) {
    error.value = e?.message || '导出失败'
  } finally {
    isLoading.value = false
  }
}

// 导入用户数据
async function handleImport(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  const file = files[0]
  isLoading.value = true
  msg.value = ''
  error.value = ''
  try {
    // 调用新版导入接口，后端返回 message 字段
    const res = await importUsers(file)
    msg.value = res.message || '导入成功'
    fetchAllUsers() // 刷新用户列表
  } catch (e: any) {
    error.value = e?.message || '导入失败'
  } finally {
    isLoading.value = false
    if (importInput.value) importInput.value.value = '' // 重置文件选择
  }
}

onMounted(() => {
  if (isAdmin.value) fetchAllUsers()
})
</script> 