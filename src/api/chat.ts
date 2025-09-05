/**
 * AI 对话 API 服务
 * 对接 https://api.9day.tech/bazi/model/invoke 接口
 */

import request from './request-main'
import requestUser from './request-user'
import axios from 'axios'
import { 
  API_CONFIG, 
  API_ENDPOINTS, 
  PROVIDERS, 
  MODELS, 
  SYSTEM_ROLES, 
  DEFAULT_MODEL_CONFIG,
  ENV_CONFIG,
  REQUEST_CONFIG,
  getDefaultModelConfig,
  type ProviderType,
  type ModelType,
  type SystemRoleType
} from './config'

// 请求和响应类型定义
export interface Message {
  role: 'user' | 'assistant'
  content: string
}

// 根据API文档更新请求参数类型
export interface ChatRequest {
  prompt: string
  provider?: string
  model_name?: string
  system?: string
  image_paths?: string[]
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
 * 发送 AI 对话请求（主接口优先，失败降级到后备接口）
 * @param chatRequest 对话请求参数
 * @returns Promise<ChatResponse>
 */
export async function sendChatMessage(chatRequest: ChatRequest): Promise<ChatResponse> {
  // 1. 主接口（n8n webhook，POST，x-www-form-urlencoded）
  try {
    if (ENV_CONFIG.N8N_AI_USER && ENV_CONFIG.N8N_AI_PASS) {
      const basicAuth = btoa(`${ENV_CONFIG.N8N_AI_USER}:${ENV_CONFIG.N8N_AI_PASS}`)
      const params = new URLSearchParams()
      params.append('message', chatRequest.prompt)
      const mainResp = await axios.post(API_CONFIG.N8N_AI_URL, params, {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: REQUEST_CONFIG.N8N_TIMEOUT
      })
      if (mainResp.data && typeof mainResp.data.output === 'string' && mainResp.data.output.trim()) {
        // 主接口成功，返回兼容 ChatResponse 格式
        return {
          success: true,
          message: '主接口调用成功',
          data: {
            content: mainResp.data.output,
            type: 'text',
            extra: {}
          }
        }
      }
    }
  } catch (mainErr) {
    // 主接口异常，降级到后备
    // 可选：console.warn('主接口调用失败，降级到后备接口', mainErr)
  }
  // 2. 后备接口（原有）
  try {
    const response = await request({
      url: API_ENDPOINTS.CHAT,
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
 * @param system 系统角色设定，可选
 * @param provider 模型提供商，可选值：ollama、zhipuai、deepseek、gemini、openrouter
 * @param modelName 模型名称，如果为None则使用当前配置的模型
 * @param history 历史消息记录
 * @param imagePaths 图片路径列表，可选
 * @returns ChatRequest
 */
export function createChatRequest(
  prompt: string,
  system?: string,
  provider?: string,
  modelName?: string,
  history: Message[] = [],
  imagePaths?: string[]
): ChatRequest {
  // 将历史消息和当前问题组合成完整的 prompt
  const historyText = history.length ? formatHistoryToText(history.slice(0, -1)) : ''
  const fullPrompt = `${prompt}${historyText}`
  
  const request: ChatRequest = {
    prompt: fullPrompt.trim()
  }
  
  // 使用默认配置，除非明确指定了其他配置
  const { provider: defaultProvider, model: defaultModel } = getDefaultModelConfig()
  request.provider = provider || defaultProvider
  request.model_name = modelName || defaultModel
  
  // 只有当system不为空时才添加
  if (system && system.trim()) request.system = system.trim()
  if (imagePaths && imagePaths.length > 0) request.image_paths = imagePaths
  
  return request
}

/**
 * 便捷的对话函数
 * @param prompt 用户问题
 * @param system 系统角色设定（可选）
 * @param provider 模型提供商（可选）
 * @param modelName 模型名称（可选）
 * @param history 历史消息记录（可选）
 * @param imagePaths 图片路径列表（可选）
 * @returns Promise<string> 返回 AI 回复内容
 */
export async function chat(
  prompt: string,
  system?: string,
  provider?: string,
  modelName?: string,
  history: Message[] = [],
  imagePaths?: string[]
): Promise<string> {
  const chatRequest = createChatRequest(prompt, system, provider, modelName, history, imagePaths)
  const response = await sendChatMessage(chatRequest)
  return response.data.content
}

// 从配置文件导入的常量已在文件顶部导入，这里不再重复定义

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