import { defineStore } from 'pinia'
import { login as apiLogin, getCurrentUser } from '@/api/user'
import { useChatStore } from '@/stores/chat'
import { useBaziStore } from '@/stores/bazi'

// 用户信息类型
export interface UserInfo {
  id: string
  username?: string
  email: string
  phone?: string
  role?: string
  is_active?: boolean
  is_verified?: boolean
  birth_year?: number
  birth_month?: number
  birth_day?: number
  birth_time?: string
  gender?: string
  created_at?: string
  updated_at?: string
  last_login?: string
}

interface State {
  token: string | null
  user: UserInfo | null
}

// ========== 新增：本地 token 过期管理 ==========
// token 过期天数
const TOKEN_EXPIRE_DAYS = 30
// token 过期时间存储 key
const TOKEN_EXPIRE_AT_KEY = 'access_token_expire_at'

// 获取本地 token 过期时间
function getExpireAt() {
  const expireAt = localStorage.getItem(TOKEN_EXPIRE_AT_KEY)
  return expireAt ? parseInt(expireAt) : null
}
// 设置本地 token 过期时间
function setExpireAt(days: number) {
  const expireAt = Date.now() + days * 24 * 60 * 60 * 1000
  localStorage.setItem(TOKEN_EXPIRE_AT_KEY, expireAt.toString())
}
// 清除本地 token 过期时间
function clearExpireAt() {
  localStorage.removeItem(TOKEN_EXPIRE_AT_KEY)
}
// 判断 token 是否已过期
function isTokenExpired() {
  const expireAt = getExpireAt()
  return expireAt !== null && Date.now() > expireAt
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: localStorage.getItem('access_token'),
    user: null
  }),
  getters: {
    isLoggedIn: (state): boolean => !!state.token && !isTokenExpired(),
    userInfo: (state): UserInfo | null => state.user
  },
  actions: {
    // 登录 action
    async login(username: string, password: string) {
      const res = await apiLogin({ username, password })
      this.token = res.access_token
      localStorage.setItem('access_token', res.access_token)
      setExpireAt(TOKEN_EXPIRE_DAYS) // 登录时写入过期时间
      // 登录后获取用户信息
      await this.fetchUser()
      // 登录后自动拉取云端会话
      const chatStore = useChatStore()
      await chatStore.loadConversationsFromBackend()
      await chatStore.loadAllMessagesForSyncedConversations()
    },
    // 获取当前用户信息
    async fetchUser() {
      // 检查本地 token 是否过期
      if (!this.token || isTokenExpired()) {
        this.logout()
        return
      }
      try {
        const user = await getCurrentUser()
        this.user = user
      } catch (e) {
        // token 失效或请求失败时自动登出
        this.logout()
      }
    },
    // 登出
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      clearExpireAt() // 清理本地过期时间
      // 清理云端对话
      const chatStore = useChatStore()
      chatStore.$reset()
      // 清理八字分析历史
      const baziStore = useBaziStore()
      baziStore.$reset()
    },
    // 初始化校验登录状态
    init() {
      this.token = localStorage.getItem('access_token')
      // 检查本地 token 是否过期
      if (!this.token || isTokenExpired()) {
        this.logout()
      }
    }
  }
}) 