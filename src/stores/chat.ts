import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message as APIMessage } from '@/api/chat'
import {
  createSession,
  getSessions,
  getSessionDetail,
  deleteSession,
  createMessage,
  getMessages,
  Session,
  ChatMessage,
  updateSession
} from '@/api/chat'

// 消息接口，扩展以兼容后端字段
export interface Message {
  id: string // 本地唯一标识，后端为 UUID
  client_message_id: string // 前端生成的唯一 client_id，便于本地与后端映射
  session_id?: string // 所属会话 id，后端支持，可选
  timestamp: Date
  created_at?: Date // 后端创建时间，可选
  updated_at?: Date // 后端更新时间，可选
  error?: boolean
  role: 'user' | 'assistant' | 'report'
  content: string
  message_type: string // 消息类型，后端支持
  sender_type: string // 发送方类型，后端支持
  sync_status: 'pending' | 'synced' | 'failed' | 'conflict' // 同步状态
  sync_version?: number // 同步版本号，后端支持
}

// 对话接口，扩展以兼容后端字段
export interface Conversation {
  id: string // 本地唯一标识，后端为 UUID
  client_session_id: string // 前端生成的唯一 client_id，便于本地与后端映射
  title: string
  description?: string // 会话描述，后端支持，可选
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  is_active?: boolean // 会话是否激活，后端支持
  message_count?: number // 消息数量，后端支持
  last_message_at?: Date // 最后一条消息时间，后端支持
  sync_status: 'pending' | 'synced' | 'failed' | 'conflict' // 同步状态
  sync_version?: number // 同步版本号，后端支持
}

// 分析历史接口
export interface AnalysisRecord {
  id: string
  name: string
  type: '八字分析' | '运势分析' | '姓名分析'
  result: string
  createdAt: Date
}

// ========== 自动无感同步相关 ========== //
import { useUserStore } from '@/stores/user'

export const useChatStore = defineStore('chat', () => {
  // 本地存储键名
  const STORAGE_KEYS = {
    conversations: 'chat_conversations',
    currentConversationId: 'chat_current_conversation_id',
    analysisHistory: 'chat_analysis_history'
  }

  // 从localStorage加载数据的辅助函数
  const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        // 如果是包含日期的数据，需要转换日期字符串为Date对象
        if (key === STORAGE_KEYS.conversations) {
          return parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }))
        }
        if (key === STORAGE_KEYS.analysisHistory) {
          return parsed.map((record: any) => ({
            ...record,
            createdAt: new Date(record.createdAt)
          }))
        }
        return parsed
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error)
    }
    return defaultValue
  }

  // 保存到localStorage的辅助函数
  const saveToStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error)
    }
  }

  // 状态 - 先初始化为空，稍后加载
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<string | null>(null)
  const analysisHistory = ref<AnalysisRecord[]>([])
  const isLoading = ref(false)

  // 初始化数据加载
  const initializeStore = () => {
    conversations.value = loadFromStorage(STORAGE_KEYS.conversations, [])
    currentConversationId.value = loadFromStorage(STORAGE_KEYS.currentConversationId, null)
    analysisHistory.value = loadFromStorage(STORAGE_KEYS.analysisHistory, [])
  }

  // 计算属性
  const currentConversation = computed(() => {
    if (!currentConversationId.value) return null
    return conversations.value.find(conv => conv.id === currentConversationId.value) || null
  })

  const currentMessages = computed(() => {
    return currentConversation.value?.messages || []
  })

  const chatHistory = computed(() => {
    return conversations.value.map(conv => ({
      id: conv.id,
      title: conv.title,
      date: conv.updatedAt,
      preview: conv.messages.length > 0 ? conv.messages[0].content.substring(0, 50) + '...' : ''
    }))
  })

  // 创建唯一 client_id 的辅助函数
  function generateClientId(prefix: string = 'client'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  }

  // 创建会话时，自动生成 client_session_id 和 sync_status 字段
  const createConversation = async () => {
    const newConversation: Conversation = {
      id: Date.now().toString(), // 本地临时 id
      client_session_id: generateClientId('session'),
      title: '新对话', // 默认不为空，避免后端校验失败
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      sync_status: 'pending',
    }
    conversations.value.unshift(newConversation)
    currentConversationId.value = newConversation.id
    saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    saveToStorage(STORAGE_KEYS.currentConversationId, currentConversationId.value)
    // 新建后自动同步，等待同步完成
    await syncConversationWithBackend(newConversation)
    // 返回同步后的 UUID（后端 id）
    return newConversation.id
  }

  // 登录后批量加载云端消息
  const loadAllMessagesForSyncedConversations = async () => {
    for (const conv of conversations.value) {
      if (conv.sync_status === 'synced') {
        await loadMessagesFromBackend(conv.id)
      }
    }
  }

  // selectConversation 时自动加载消息
  const selectConversation = async (conversationId: string) => {
    const conversation = conversations.value.find(conv => conv.id === conversationId)
    if (conversation) {
      currentConversationId.value = conversationId
      saveToStorage(STORAGE_KEYS.currentConversationId, currentConversationId.value)
      // 自动加载云端消息
      await loadMessagesFromBackend(conversationId)
      // 新增：补同步所有 pending 消息，防止用户消息丢失
      conversation.messages.filter(m => m.sync_status === 'pending').forEach(m => {
        syncMessageWithBackend(m, conversation.id)
      })
    }
  }

  const deleteConversation = (conversationId: string) => {
    const index = conversations.value.findIndex(conv => conv.id === conversationId)
    if (index !== -1) {
      conversations.value.splice(index, 1)
      
      // 如果删除的是当前对话，切换到最新的对话或创建新对话
      if (currentConversationId.value === conversationId) {
        if (conversations.value.length > 0) {
          currentConversationId.value = conversations.value[0].id
        } else {
          createConversation()
          return // createConversation已经保存了数据
        }
      }
      
      // 保存到localStorage
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
      saveToStorage(STORAGE_KEYS.currentConversationId, currentConversationId.value)
    }
  }

  // 添加消息时，首次用户消息自动覆盖会话标题并同步到后端
  const addMessage = (message: Omit<Message, 'id' | 'timestamp' | 'client_message_id' | 'sync_status'>) => {
    if (!currentConversationId.value) {
      createConversation()
    }
    const conversation = conversations.value.find(conv => conv.id === currentConversationId.value)
    if (conversation) {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(),
        client_message_id: generateClientId('msg'),
        timestamp: new Date(),
        message_type: 'text',
        sender_type: message.role === 'user' ? 'user' : 'assistant',
        sync_status: 'pending',
      }
      conversation.messages.push(newMessage)
      conversation.updatedAt = new Date()
      // 如果是首次用户消息，自动用内容覆盖会话标题并同步到后端
      if (conversation.title === '新对话' && message.role === 'user') {
        conversation.title = message.content.substring(0, 20) + (message.content.length > 20 ? '...' : '')
        // 如果会话已同步，更新云端标题
        if (conversation.sync_status === 'synced') {
          updateSession(conversation.id, { title: conversation.title })
        } else {
          // 未同步时，后续同步会用新标题
        }
      }
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
      // 新增消息后自动同步
      syncMessageWithBackend(newMessage, conversation.id)
    }
  }

  const updateLastMessage = (content: string, error?: boolean) => {
    const conversation = conversations.value.find(conv => conv.id === currentConversationId.value)
    if (conversation && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1]
      lastMessage.content = content
      if (error !== undefined) {
        lastMessage.error = error
      }
      conversation.updatedAt = new Date()
      
      // 保存到localStorage
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    }
  }

  const addAnalysisRecord = (record: Omit<AnalysisRecord, 'id' | 'createdAt'>) => {
    const newRecord: AnalysisRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    
    analysisHistory.value.unshift(newRecord)
    saveToStorage(STORAGE_KEYS.analysisHistory, analysisHistory.value)
  }

  const deleteAnalysisRecord = (recordId: string) => {
    const index = analysisHistory.value.findIndex(record => record.id === recordId)
    if (index !== -1) {
      analysisHistory.value.splice(index, 1)
      saveToStorage(STORAGE_KEYS.analysisHistory, analysisHistory.value)
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  /**
   * 同步本地新建会话到后端，成功后更新 id/sync_status，并替换所有相关消息的 session_id
   * @param conversation 本地会话对象
   */
  const syncConversationWithBackend = async (conversation: Conversation) => {
    const userStore = useUserStore()
    if (!userStore.user || !userStore.token) return // 未登录不发起同步
    try {
      if (conversation.sync_status !== 'pending') return
      const oldId = conversation.id
      const res = await createSession({
        title: conversation.title,
        description: conversation.description,
        client_session_id: conversation.client_session_id
      })
      // 用后端 id 替换本地 id，并更新同步状态
      conversation.id = res.id
      conversation.sync_status = 'synced'
      conversation.sync_version = res.sync_version
      conversation.is_active = res.is_active
      conversation.message_count = res.message_count
      conversation.createdAt = new Date(res.created_at)
      conversation.updatedAt = new Date(res.updated_at)
      conversation.last_message_at = res.last_message_at ? new Date(res.last_message_at) : undefined
      // 替换所有消息的 session_id
      conversation.messages.forEach(m => { m.session_id = res.id })
      // 替换当前会话 id
      if (currentConversationId.value === oldId) {
        currentConversationId.value = res.id
      }
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
      saveToStorage(STORAGE_KEYS.currentConversationId, currentConversationId.value)
      // 新增：会话同步成功后，自动补同步所有 pending 消息
      conversation.messages.filter(m => m.sync_status === 'pending').forEach(m => {
        syncMessageWithBackend(m, conversation.id)
      })
    } catch (e) {
      conversation.sync_status = 'failed'
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    }
  }

  /**
   * 拉取云端会话并合并本地未同步会话（用 client_session_id 去重）
   * @param force 是否强制覆盖本地
   */
  const loadConversationsFromBackend = async (force = false) => {
    isLoading.value = true
    try {
      const res = await getSessions()
      const remoteList = res.items.map((item) => ({
        id: item.id,
        client_session_id: item.client_session_id,
        title: item.title,
        description: item.description, // 可选
        messages: [],
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        is_active: item.is_active,
        message_count: item.message_count,
        last_message_at: item.last_message_at ? new Date(item.last_message_at) : undefined,
        sync_status: 'synced' as const,
        sync_version: item.sync_version
      } as Conversation))
      if (force) {
        conversations.value = remoteList
      } else {
        // 合并本地未同步会话（用 client_session_id 去重）
        const localPending = conversations.value.filter(c => c.sync_status !== 'synced')
        const all = [...remoteList]
        localPending.forEach(localConv => {
          if (!all.some(r => r.client_session_id === localConv.client_session_id)) {
            all.push(localConv as Conversation)
          }
        })
        conversations.value = all
      }
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 拉取云端消息并合并本地未同步消息（用 client_message_id 去重）
   * @param sessionId 会话 id
   * @param force 是否强制覆盖本地
   */
  const loadMessagesFromBackend = async (sessionId: string, force = false) => {
    const conversation = conversations.value.find(c => c.id === sessionId)
    if (!conversation) return
    try {
      const res = await getMessages(sessionId)
      const remoteMsgs = res.map((msg) => ({
        id: msg.id,
        client_message_id: msg.client_message_id,
        session_id: msg.session_id, // 可选
        timestamp: new Date(msg.created_at),
        created_at: msg.created_at ? new Date(msg.created_at) : undefined,
        updated_at: msg.updated_at ? new Date(msg.updated_at) : undefined,
        error: false,
        // 兼容：优先用 sender_type，没有则兜底为 'user' 或 'assistant'
        role: (msg.sender_type ? (msg.sender_type === 'user' ? 'user' : 'assistant') : (msg.content && msg.content.length < 30 ? 'user' : 'assistant')) as 'user' | 'assistant',
        content: msg.content,
        message_type: msg.message_type,
        sender_type: msg.sender_type || ((msg.content && msg.content.length < 30) ? 'user' : 'assistant'), // 兜底
        sync_status: 'synced' as const,
        sync_version: msg.sync_version
      } as Message))
      // 拉取后按时间升序排序，保证旧消息在上新消息在下
      remoteMsgs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      if (force) {
        conversation.messages = remoteMsgs
      } else {
        // 合并本地未同步消息（用 client_message_id 去重）
        const localPending = conversation.messages.filter(m => m.sync_status !== 'synced')
        const all = [...remoteMsgs]
        localPending.forEach(localMsg => {
          if (!all.some(r => r.client_message_id === localMsg.client_message_id)) {
            all.push(localMsg as Message)
          }
        })
        conversation.messages = all
      }
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    } catch {}
  }

  /**
   * 同步本地新建消息到后端，只有会话已同步（有后端 id）才允许同步
   * @param message 本地消息对象
   * @param sessionId 会话 id
   */
  const syncMessageWithBackend = async (message: Message, sessionId: string) => {
    // 只有 sync_status === 'synced' 的会话才允许同步消息
    const conversation = conversations.value.find(c => c.id === sessionId)
    if (!conversation || conversation.sync_status !== 'synced') return
    try {
      if (message.sync_status !== 'pending') return
      const res = await createMessage(sessionId, {
        content: message.content,
        message_type: message.message_type,
        client_message_id: message.client_message_id,
        sender_type: message.sender_type // 新增，必须传递
      })
      message.id = res.id
      message.sync_status = 'synced'
      message.sync_version = res.sync_version
      message.session_id = res.session_id
      message.created_at = new Date(res.created_at)
      message.updated_at = new Date(res.updated_at)
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    } catch (e) {
      message.sync_status = 'failed'
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    }
  }

  /**
   * 删除会话：同步调用后端 deleteSession，并在本地移除
   * @param conversationId 会话 id
   */
  const removeConversation = async (conversationId: string) => {
    const idx = conversations.value.findIndex(conv => conv.id === conversationId)
    if (idx === -1) return
    const conv = conversations.value[idx]
    // 只对已同步的会话调用后端删除
    if (conv.sync_status === 'synced') {
      try {
        await deleteSession(conv.id)
      } catch (e) {
        // 可以在 UI 上提示删除失败
        return
      }
    }
    conversations.value.splice(idx, 1)
    // 如果当前会话被删，切换到最新或新建
    if (currentConversationId.value === conversationId) {
      if (conversations.value.length > 0) {
        currentConversationId.value = conversations.value[0].id
      } else {
        createConversation()
        return
      }
    }
    saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    saveToStorage(STORAGE_KEYS.currentConversationId, currentConversationId.value)
  }

  /**
   * 重试同步失败的会话
   * @param conversation 会话对象
   */
  const retrySyncConversation = async (conversation: Conversation) => {
    conversation.sync_status = 'pending'
    await syncConversationWithBackend(conversation)
  }

  /**
   * 重试同步失败的消息
   * @param message 消息对象
   * @param sessionId 会话 id
   */
  const retrySyncMessage = async (message: Message, sessionId: string) => {
    message.sync_status = 'pending'
    await syncMessageWithBackend(message, sessionId)
  }

  // 自动同步所有待同步会话和消息
  function syncAllPending() {
    conversations.value.filter(c => c.sync_status === 'pending').forEach(c => syncConversationWithBackend(c))
    conversations.value.forEach(conv => {
      conv.messages.filter(m => m.sync_status === 'pending').forEach(m => syncMessageWithBackend(m, conv.id))
    })
  }

  // 监听网络恢复自动同步
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      syncAllPending()
    })
  }

  // 监听用户登录自动同步
  const userStore = useUserStore()
  userStore.$subscribe((mutation, state) => {
    if (state.user) {
      syncAllPending()
    }
  })

  // 初始化示例数据
  const initializeExampleData = () => {
    // 首先加载存储的数据
    initializeStore()
    
    // 只有在localStorage中没有数据且当前也没有数据时才初始化示例数据
    const hasStoredData = localStorage.getItem(STORAGE_KEYS.conversations) !== null
    if (!hasStoredData && conversations.value.length === 0) {
      // 创建示例对话
      const exampleConversations: Conversation[] = [
        {
          id: '1',
          client_session_id: generateClientId('session'), // 新增
          title: '关于事业发展的咨询',
          messages: [
            {
              id: '1-1',
              client_message_id: generateClientId('msg'), // 新增
              role: 'user',
              content: '我想了解一下我的事业运势，最近工作上遇到了一些困难。',
              timestamp: new Date('2024-01-15T10:00:00'),
              message_type: 'text', // 新增
              sender_type: 'user', // 新增
              sync_status: 'synced', // 新增
            },
            {
              id: '1-2',
              client_message_id: generateClientId('msg'), // 新增
              role: 'assistant',
              content: '根据您的情况，我建议您在事业发展方面要保持耐心和坚持。当前可能面临一些挑战，但这也是成长的机会。',
              timestamp: new Date('2024-01-15T10:01:00'),
              message_type: 'text', // 新增
              sender_type: 'assistant', // 新增
              sync_status: 'synced', // 新增
            }
          ],
          createdAt: new Date('2024-01-15T10:00:00'),
          updatedAt: new Date('2024-01-15T10:01:00'),
          sync_status: 'synced', // 新增
          sync_version: 1 // 新增
        },
        {
          id: '2',
          client_session_id: generateClientId('session'), // 新增
          title: '感情问题咨询',
          messages: [
            {
              id: '2-1',
              client_message_id: generateClientId('msg'), // 新增
              role: 'user',
              content: '最近感情方面遇到了一些困扰，想听听您的建议。',
              timestamp: new Date('2024-01-14T15:30:00'),
              message_type: 'text', // 新增
              sender_type: 'user', // 新增
              sync_status: 'synced', // 新增
            }
          ],
          createdAt: new Date('2024-01-14T15:30:00'),
          updatedAt: new Date('2024-01-14T15:30:00'),
          sync_status: 'synced', // 新增
          sync_version: 1 // 新增
        }
      ]
      
      conversations.value = exampleConversations
      
      // 创建示例分析记录
      const exampleAnalysis: AnalysisRecord[] = [
        {
          id: '1',
          name: '张三的八字分析',
          type: '八字分析',
          result: '八字分析结果...',
          createdAt: new Date('2024-01-15T09:00:00')
        },
        {
          id: '2',
          name: '李四的运势分析',
          type: '运势分析',
          result: '运势分析结果...',
          createdAt: new Date('2024-01-14T14:00:00')
        }
      ]
      
      analysisHistory.value = exampleAnalysis
      
      // 保存示例数据到localStorage
      saveToStorage(STORAGE_KEYS.conversations, conversations.value)
      saveToStorage(STORAGE_KEYS.analysisHistory, analysisHistory.value)
    }
  }

  // 重置方法：退出登录时清空所有云端同步的会话和消息，只保留本地未同步的
  const $reset = () => {
    conversations.value = conversations.value
      .filter(c => c.sync_status !== 'synced')
      .map(c => ({
        ...c,
        messages: c.messages.filter(m => m.sync_status !== 'synced')
      }))
    currentConversationId.value = conversations.value.length > 0 ? conversations.value[0].id : null
    saveToStorage(STORAGE_KEYS.conversations, conversations.value)
    saveToStorage(STORAGE_KEYS.currentConversationId, currentConversationId.value)
  }

  // 保存conversations到本地
  const saveConversations = () => {
    saveToStorage(STORAGE_KEYS.conversations, conversations.value)
  }

  return {
    // 状态
    conversations,
    currentConversationId,
    analysisHistory,
    isLoading,
    
    // 计算属性
    currentConversation,
    currentMessages,
    chatHistory,
    
    // 动作
    createConversation,
    selectConversation,
    deleteConversation,
    addMessage,
    updateLastMessage,
    addAnalysisRecord,
    deleteAnalysisRecord,
    setLoading,
    initializeStore,
    initializeExampleData,
    $reset,
    saveConversations, // 新增导出
    removeConversation, // 新增导出
    retrySyncConversation, // 新增导出
    retrySyncMessage, // 新增导出
    loadConversationsFromBackend,
    loadMessagesFromBackend,
    loadAllMessagesForSyncedConversations
  }
})