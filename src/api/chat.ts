/**
 * AI 对话 API 服务
 * 对接 https://api.9day.tech/model/invoke 接口
 */

import request from './request-main'
import requestUser from './request-user'

// API 配置
const API_BASE_URL = 'https://api.9day.tech'
const API_ENDPOINTS = {
  CHAT: '/model/invoke'
}

// 请求和响应类型定义
export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  model_name: string
  prompt: string
  system: string
}

export interface ChatResponse {
  success: boolean
  message: string
  data: {
    content: string
    type: string
    extra: Record<string, any>
  }
}

// API 错误类
export class ChatAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ChatAPIError'
  }
}

/**
 * 发送 AI 对话请求
 * @param request 对话请求参数
 * @returns Promise<ChatResponse>
 */
export async function sendChatMessage(chatRequest: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await request({
      url: `${API_BASE_URL}${API_ENDPOINTS.CHAT}`,
      method: 'POST',
      data: chatRequest
    })
    if (!response.data.success) {
      throw new ChatAPIError(
        response.data.message || '对话请求失败',
        response.status,
        response.data
      )
    }
    return response.data
  } catch (error) {
    if (error instanceof ChatAPIError) {
      throw error
    }
    throw new ChatAPIError(
      error instanceof Error ? error.message : '网络请求失败',
      undefined,
      error
    )
  }
}

/**
 * 将历史消息格式化为对话文本
 * @param history 历史消息数组
 * @returns 格式化后的对话文本
 */
function formatHistoryToText(history: Message[]): string {
  if (!history.length) return ''

  // 只保留最近的20轮对话
  const recentHistory = history.slice(-40) // 20轮对话 = 40条消息(用户+AI)
  
  const historyText = recentHistory.map(msg => {
    const role = msg.role === 'user' ? '用户' : 'AI'
    return `${role}：${msg.content}`
  }).join('\n')

  return `，以下是历史对话：\n"${historyText}"`
}

/**
 * 创建预设的对话请求
 * @param prompt 用户输入的问题
 * @param system 系统角色设定，默认为专业命理分析师
 * @param modelName 模型名称，默认为 glm-4-flash-250414
 * @param history 历史消息记录
 * @returns ChatRequest
 */
export function createChatRequest(
  prompt: string,
  system: string = '你是一个专业的命理分析师',
  modelName: string = 'glm-4-flash-250414',
  history: Message[] = []
): ChatRequest {
  // 将历史消息和当前问题组合成完整的 prompt
  const historyText = history.length ? formatHistoryToText(history.slice(0, -1)) : ''
  const fullPrompt = `${prompt}${historyText}`
  
  return {
    model_name: modelName,
    prompt: fullPrompt.trim(),
    system: system.trim()
  }
}

/**
 * 便捷的对话函数
 * @param prompt 用户问题
 * @param system 系统角色设定
 * @param modelName 模型名称
 * @param history 历史消息记录
 * @returns Promise<string> 返回 AI 回复内容
 */
export async function chat(
  prompt: string,
  system?: string,
  modelName?: string,
  history: Message[] = []
): Promise<string> {
  const chatRequest = createChatRequest(prompt, system, modelName, history)
  const response = await sendChatMessage(chatRequest)
  return response.data.content
}

// 预设的系统角色
export const SYSTEM_ROLES = {
  FORTUNE_TELLER: '你是一个专业的命理分析师',
  ASSISTANT: '你是一个智能助手',
  BAZI_EXPERT: '你是一个八字分析专家，精通传统命理学',
  LIFE_ADVISOR: '你是一个人生导师，善于给出建设性的建议'
} as const

// 预设的模型
export const MODELS = {
  GLM_4_FLASH: 'glm-4-flash-250414'
} as const

// ===================== 新增：会话与消息持久化 API 封装 =====================

/**
 * 会话（Session）类型定义，对应后端结构
 */
export interface Session {
  id: string
  user_id?: string
  title: string
  description?: string
  is_active: boolean
  message_count: number
  client_session_id: string
  sync_status: string
  sync_version: number
  created_at: string
  updated_at: string
  last_message_at?: string
}

/**
 * 消息（Message）类型定义，对应后端结构
 */
export interface ChatMessage {
  id: string
  session_id: string
  content: string
  message_type: string
  sender_type: string
  client_message_id: string
  sync_status: string
  sync_version: number
  created_at: string
  updated_at: string
}

/**
 * 创建会话
 * @param data 会话参数（title, description, client_session_id）
 */
export async function createSession(data: {
  title: string
  description?: string
  client_session_id: string
}): Promise<Session> {
  const res = await requestUser({
    url: '/chat/sessions',
    method: 'POST',
    data
  })
  return res.data
}

/**
 * 获取会话列表
 * @param params 查询参数（skip, limit, include_archived）
 */
export async function getSessions(params?: {
  skip?: number
  limit?: number
  include_archived?: boolean
}): Promise<{ total: number, items: Session[] }> {
  const res = await requestUser({
    url: '/chat/sessions',
    method: 'GET',
    params
  })
  return res.data
}

/**
 * 获取单个会话及其消息
 * @param sessionId 会话ID
 * @param params 可选参数（message_limit）
 */
export async function getSessionDetail(sessionId: string, params?: { message_limit?: number }): Promise<any> {
  const res = await requestUser({
    url: `/chat/sessions/${sessionId}`,
    method: 'GET',
    params
  })
  return res.data
}

/**
 * 删除会话
 * @param sessionId 会话ID
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await requestUser({
    url: `/chat/sessions/${sessionId}`,
    method: 'DELETE'
  })
}

/**
 * 更新会话（如修改标题等）
 * @param sessionId 会话ID
 * @param data 可选参数（title, description, ...）
 */
export async function updateSession(sessionId: string, data: {
  title?: string
  description?: string
}): Promise<any> {
  const res = await requestUser({
    url: `/chat/sessions/${sessionId}`,
    method: 'PUT',
    data
  })
  return res.data
}

/**
 * 创建消息
 * @param sessionId 会话ID
 * @param data 消息内容（content, message_type, client_message_id, sender_type）
 */
export async function createMessage(sessionId: string, data: {
  content: string
  message_type: string
  client_message_id: string
  sender_type: string // 新增，允许传递 sender_type
}): Promise<ChatMessage> {
  const res = await requestUser({
    url: `/chat/sessions/${sessionId}/messages`,
    method: 'POST',
    data
  })
  return res.data
}

/**
 * 获取会话消息列表
 * @param sessionId 会话ID
 * @param params 查询参数（skip, limit）
 */
export async function getMessages(sessionId: string, params?: { skip?: number, limit?: number }): Promise<ChatMessage[]> {
  const res = await requestUser({
    url: `/chat/sessions/${sessionId}/messages`,
    method: 'GET',
    params
  })
  return res.data
}