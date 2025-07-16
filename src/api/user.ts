import request from './request-user'

/**
 * 用户登录
 * @param data { username: string; password: string }
 * @returns Promise<{ access_token: string; refresh_token: string; token_type: string }>
 */
export function login(data: { username: string; password: string }) {
  // 登录接口要求 application/x-www-form-urlencoded
  const params = new URLSearchParams()
  params.append('username', data.username)
  params.append('password', data.password)
  return request.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(res => res.data)
}

/**
 * 获取当前用户信息
 * @returns Promise<UserInfo>
 */
export function getCurrentUser() {
  return request.get('/users/me').then(res => res.data)
}

/**
 * 获取当前用户信息（Profile.vue 用）
 */
export function fetchUserInfo() {
  return request.get('/users/me').then(res => res.data)
}

/**
 * 更新当前用户信息（Profile.vue 用）
 * @param data 用户信息
 */
export function updateUserInfo(data: {
  username: string
  phone: string
  birth_year: number
  birth_month: number
  birth_day: number
  birth_time: string
  gender: string
}) {
  return request.put('/users/me', data).then(res => res.data)
}

/**
 * 用户注册
 * @param data 注册信息
 */
export function register(data: {
  username: string
  email: string
  password: string
  phone?: string
  birth_year?: number
  birth_month?: number
  birth_day?: number
  birth_time?: string
  gender?: string
}) {
  return request.post('/auth/register', data).then(res => res.data)
}

/**
 * 请求重置密码
 * @param email 邮箱
 */
export function passwordResetRequest(email: string) {
  return request.post('/auth/password-reset-request', { email }).then(res => res.data)
}

/**
 * 验证重置密码
 * @param token 重置 token
 * @param newPassword 新密码
 */
export function passwordResetVerify(token: string, newPassword: string) {
  return request.post('/auth/password-reset-verify', { token, new_password: newPassword }).then(res => res.data)
}

/**
 * 导出所有用户数据（管理员）
 * @returns Promise<any> 返回完整的用户数据JSON文件
 */
export function exportUsers() {
  // 新接口：/users/admin/export，返回文件流
  return request.get('/users/admin/export', {
    responseType: 'blob',
    headers: { 'Content-Type': undefined }
  }).then(res => res.data)
}

/**
 * 导入用户数据（管理员）
 * @param file File 用户数据JSON文件
 * @returns Promise<any> 导入结果
 */
export function importUsers(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  // 新接口：/users/admin/import，表单上传
  return request.post('/users/admin/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}

// 可根据需要继续扩展注册、重置密码等方法 