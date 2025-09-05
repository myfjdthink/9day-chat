/**
 * API 统一配置文件
 * 用于统一管理模型提供商、模型型号等配置
 */

// ========== API 基础配置 ========== //

/**
 * API 基础地址配置
 */
export const API_CONFIG = {
  // 主API服务 - 使用相对路径，通过 nginx 代理
  MAIN_BASE_URL: '/api',
  // 用户管理系统 - 使用相对路径，通过 nginx 代理
  USER_BASE_URL: '/user-api',
  // N8N AI服务 - 使用相对路径，通过 nginx 代理
  N8N_AI_URL: '/n8n/ai-service',
  // 许愿池服务 - 使用相对路径，通过 nginx 代理
  N8N_WISH_URL: '/n8n/wish'
} as const

/**
 * API 端点配置
 */
export const API_ENDPOINTS = {
  // AI对话
  CHAT: '/bazi/model/invoke',
  // 八字分析
  BAZI_ANALYSIS: '/bazi/ai',
  BAZI_FORTUNE: '/bazi/fortune',
  // 生肖运势
  ZODIAC_FORTUNE: '/zodiac-fortune/analyze',
  // 用户管理
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_PASSWORD_RESET_REQUEST: '/auth/password-reset-request',
  AUTH_PASSWORD_RESET_VERIFY: '/auth/password-reset-verify',
  USERS_ME: '/users/me',
  USERS_ADMIN_EXPORT: '/users/admin/export',
  USERS_ADMIN_IMPORT: '/users/admin/import',
  // 会话管理
  CHAT_SESSIONS: '/chat/sessions',
  CHAT_MESSAGES: '/chat/sessions',
  // 八字分析历史
  BAZI_ANALYSES: '/bazi/analyses'
} as const

// ========== 模型提供商配置 ========== //

/**
 * 支持的模型提供商
 */
export const PROVIDERS = {
  OLLAMA: 'ollama',
  ZHIPUAI: 'zhipuai', 
  DEEPSEEK: 'deepseek',
  GEMINI: 'gemini',
  OPENROUTER: 'openrouter'
} as const

/**
 * 模型提供商类型
 */
export type ProviderType = typeof PROVIDERS[keyof typeof PROVIDERS]

// ========== 模型型号配置 ========== //

/**
 * 支持的模型型号
 */
export const MODELS = {
  // 智谱AI模型
  GLM_4_5_FLASH: 'glm-4.5-flash',
  GLM_4_FLASH_250414: 'glm-4-flash-250414',  // 新增：GLM-4 Flash 250414版本
  GLM_4_5: 'glm-4.5',                         // 新增：GLM-4.5
  GLM_4V: 'glm-4v',
  
  // DeepSeek模型
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat-v3-0324:free',
  DEEPSEEK_CODER: 'deepseek/deepseek-coder-v2:free',
  
  // 其他模型（可根据需要添加）
  // OPENAI_GPT_4: 'gpt-4',
  // OPENAI_GPT_3_5: 'gpt-3.5-turbo',
  // CLAUDE_3: 'claude-3-sonnet',
} as const

/**
 * 模型型号类型
 */
export type ModelType = typeof MODELS[keyof typeof MODELS]

// ========== 默认配置 ========== //// ========== 默认配置 ========== //// ========== 默认配置 ========== //// 

/**
 * 默认模型配置
 * 在这里统一调整前端发送的模型提供商和型号
 */
// 从环境变量获取默认配置，如果未设置则使用默认值
export const DEFAULT_MODEL_CONFIG = {
  // 默认提供商 - 从环境变量获取，默认为 ZHIPUAI
  PROVIDER: import.meta.env.VITE_DEFAULT_PROVIDER 
    ? (PROVIDERS as any)[import.meta.env.VITE_DEFAULT_PROVIDER.toUpperCase()] 
    : PROVIDERS.ZHIPUAI,
  
  // 默认模型 - 从环境变量获取，默认为 GLM_4_FLASH_250414
  MODEL: import.meta.env.VITE_DEFAULT_MODEL 
    ? (MODELS as any)[import.meta.env.VITE_DEFAULT_MODEL.replace(/[.-]/g, '_').toUpperCase()]
    : MODELS.GLM_4_FLASH_250414,
  
  // 默认系统角色（可选）- 从环境变量获取，默认为空
  SYSTEM_ROLE: import.meta.env.VITE_DEFAULT_SYSTEM_ROLE || ''
} as const

// ========== 系统角色配置 ========== //

/**
 * 预设的系统角色
 */
export const SYSTEM_ROLES = {
  FORTUNE_TELLER: '你是一个专业的命理分析师',
  ASSISTANT: '你是一个智能助手',
  BAZI_EXPERT: '你是一个八字分析专家，精通传统命理学',
  LIFE_ADVISOR: '你是一个人生导师，善于给出建设性的建议'
} as const

/**
 * 系统角色类型
 */
export type SystemRoleType = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES]

// ========== 环境变量配置 ========== //

/**
 * 环境变量配置
 */
export const ENV_CONFIG = {
  N8N_AI_USER: import.meta.env.VITE_N8N_AI_USER || process.env.VITE_N8N_AI_USER,
  N8N_AI_PASS: import.meta.env.VITE_N8N_AI_PASS || process.env.VITE_N8N_AI_PASS
} as const

// ========== 请求配置 ========== //

/**
 * 请求超时配置
 */
export const REQUEST_CONFIG = {
  TIMEOUT: 120000, // 120秒
  N8N_TIMEOUT: 60000 // N8N专用超时
} as const

// ========== 缓存配置 ========== //

/**
 * 缓存配置
 */
export const CACHE_CONFIG = {
  // 生肖运势缓存键前缀
  ZODIAC_FORTUNE_PREFIX: 'zodiac-fortune:',
  // 缓存过期时间（毫秒）
  ZODIAC_FORTUNE_EXPIRE: 24 * 60 * 60 * 1000 // 24小时
} as const

// ========== 工具函数 ========== //

/**
 * 获取默认模型配置
 * @returns 默认的提供商和模型
 */
export function getDefaultModelConfig() {
  return {
    provider: DEFAULT_MODEL_CONFIG.PROVIDER,
    model: DEFAULT_MODEL_CONFIG.MODEL
  }
}

/**
 * 验证模型配置是否有效
 * @param provider 提供商
 * @param model 模型
 * @returns 是否有效
 */
export function isValidModelConfig(provider?: string, model?: string): boolean {
  if (!provider || !model) return false
  
  const validProviders = Object.values(PROVIDERS)
  const validModels = Object.values(MODELS)
  
  return validProviders.includes(provider as ProviderType) && 
         validModels.includes(model as ModelType)
}

/**
 * 获取所有可用的模型配置
 * @returns 所有有效的模型配置组合
 */
export function getAvailableModelConfigs() {
  const configs: Array<{ provider: ProviderType; model: ModelType; label: string }> = []
  
  // 智谱AI配置
  configs.push(
    { provider: PROVIDERS.ZHIPUAI, model: MODELS.GLM_4_5, label: '智谱AI - GLM-4.5' },
    { provider: PROVIDERS.ZHIPUAI, model: MODELS.GLM_4_5_FLASH, label: '智谱AI - GLM-4.5 Flash' },
    { provider: PROVIDERS.ZHIPUAI, model: MODELS.GLM_4_FLASH_250414, label: '智谱AI - GLM-4 Flash 250414 (默认)' },
    { provider: PROVIDERS.ZHIPUAI, model: MODELS.GLM_4V, label: '智谱AI - GLM-4V' }
  )
  
  // DeepSeek配置
  configs.push(
    { provider: PROVIDERS.DEEPSEEK, model: MODELS.DEEPSEEK_CHAT, label: 'DeepSeek - Chat' },
    { provider: PROVIDERS.DEEPSEEK, model: MODELS.DEEPSEEK_CODER, label: 'DeepSeek - Coder' }
  )
  
  return configs
} 