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

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: localStorage.getItem('access_token'),
    user: null
  }),
  actions: {
    // 登录 action
    async login(username: string, password: string) {
      const res = await apiLogin({ username, password })
      this.token = res.access_token
      localStorage.setItem('access_token', res.access_token)
      // 登录后获取用户信息
      await this.fetchUser()
      // 登录后自动拉取云端会话
      const chatStore = useChatStore()
      await chatStore.loadConversationsFromBackend()
      await chatStore.loadAllMessagesForSyncedConversations()
    },
    // 获取当前用户信息
    async fetchUser() {
      if (!this.token) {
        this.user = null
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
      if (!this.token) {
        this.user = null
      }
    }
  }
}) 