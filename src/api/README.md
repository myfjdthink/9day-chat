# API 统一配置与使用说明

本文档说明如何使用统一的 API 配置和 AI 对话服务。

## 📁 文件结构

```
src/api/
├── config.ts              # 统一配置文件（核心）
├── chat.ts               # AI 对话 API
├── bazi.ts               # 八字分析 API
├── user.ts               # 用户管理 API
├── request-main.ts       # 主 API 请求实例
├── request-user.ts       # 用户 API 请求实例
└── README.md            # 本文档
```

## 🎯 统一配置

### 核心配置文件：`config.ts`

所有模型提供商、模型型号、API 地址等配置都统一在 `config.ts` 中管理：

```typescript
import { 
  DEFAULT_MODEL_CONFIG, 
  PROVIDERS, 
  MODELS, 
  SYSTEM_ROLES 
} from '@/api/config'

// 获取默认配置
console.log(DEFAULT_MODEL_CONFIG.PROVIDER) // 'zhipuai'
console.log(DEFAULT_MODEL_CONFIG.MODEL)    // 'glm-4.5-flash'
```

### 快速调整模型配置

如需调整前端发送的模型，只需修改 `config.ts` 中的 `DEFAULT_MODEL_CONFIG`：

**注意**: 现在默认不设置系统角色，您可以根据需要选择是否传递 `system` 参数。

```typescript
// 在 config.ts 中修改
export const DEFAULT_MODEL_CONFIG = {
  PROVIDER: PROVIDERS.DEEPSEEK,        // 改为 DeepSeek
  MODEL: MODELS.DEEPSEEK_CHAT,         // 改为 DeepSeek Chat
  SYSTEM_ROLE: '你是一个专业的命理分析师'
} as const
```

## API 接口信息

- **主接口地址**: `https://api.9day.tech`
- **用户管理地址**: `https://user.9day.tech/api/v1`
- **N8N AI 服务**: `https://n8n.9day.tech/webhook/ai-service`
- **请求方法**: POST
- **内容类型**: application/json

## 快速开始

### 基本用法

```typescript
import { chat, SYSTEM_ROLES } from '@/api/chat'
import { getDefaultModelConfig } from '@/api/config'

// 最简单的对话（不传递任何可选参数）
const response = await chat('你好，请介绍一下自己')
console.log(response) // AI 的回复内容

// 使用预设角色
const response2 = await chat(
  '请帮我分析一下我的运势',
  SYSTEM_ROLES.FORTUNE_TELLER
)

// 指定模型和提供商
const response3 = await chat(
  '请分析我的八字',
  SYSTEM_ROLES.BAZI_EXPERT,
  'zhipuai',
  'glm-4.5'
)

// 查看当前默认配置
const { provider, model } = getDefaultModelConfig()
console.log(`当前使用: ${provider} - ${model}`)
```

### 高级用法

```typescript
import { sendChatMessage, createChatRequest, ChatAPIError } from '@/api/chat'
import { PROVIDERS, MODELS, getDefaultModelConfig } from '@/api/config'

// 创建自定义请求
const request = createChatRequest(
  '请分析我的八字',
  '你是一个专业的八字分析师，精通传统命理学',
  PROVIDERS.ZHIPUAI,
  MODELS.GLM_4_FLASH
)

// 发送请求并处理响应
try {
  const response = await sendChatMessage(request)
  console.log('成功:', response.data.content)
} catch (error) {
  if (error instanceof ChatAPIError) {
    console.error('API 错误:', error.message, error.statusCode)
  } else {
    console.error('其他错误:', error)
  }
}

// 使用默认配置创建请求
const { provider, model } = getDefaultModelConfig()
const defaultRequest = createChatRequest(
  '请分析我的运势',
  '你是一个专业的命理分析师',
  provider,
  model
)
```

## 预设角色

```typescript
import { SYSTEM_ROLES } from '@/api/config'

// 可用的预设角色
SYSTEM_ROLES.FORTUNE_TELLER  // 专业命理分析师
SYSTEM_ROLES.ASSISTANT       // 智能助手
SYSTEM_ROLES.BAZI_EXPERT     // 八字分析专家
SYSTEM_ROLES.LIFE_ADVISOR    // 人生导师
```

## 支持的模型提供商

```typescript
import { PROVIDERS } from '@/api/config'

PROVIDERS.OLLAMA      // 'ollama'
PROVIDERS.ZHIPUAI     // 'zhipuai'
PROVIDERS.DEEPSEEK    // 'deepseek'
PROVIDERS.GEMINI      // 'gemini'
PROVIDERS.OPENROUTER  // 'openrouter'
```

## 支持的模型

```typescript
import { MODELS } from '@/api/config'

// 智谱AI模型
MODELS.GLM_4_5                    // 'glm-4.5' (默认)
MODELS.GLM_4_FLASH                // 'glm-4.5-flash'
MODELS.GLM_4_FLASH_250414         // 'glm-4-flash-250414'
MODELS.GLM_4V                     // 'glm-4v'

// DeepSeek模型
MODELS.DEEPSEEK_CHAT              // 'deepseek/deepseek-chat-v3-0324:free'
MODELS.DEEPSEEK_CODER             // 'deepseek/deepseek-coder-v2:free'
```

## 配置管理

```typescript
import { 
  getDefaultModelConfig, 
  getAvailableModelConfigs, 
  isValidModelConfig 
} from '@/api/config'

// 获取默认配置
const { provider, model } = getDefaultModelConfig()

// 获取所有可用配置
const allConfigs = getAvailableModelConfigs()

// 验证配置是否有效
const isValid = isValidModelConfig('zhipuai', 'glm-4.5-flash')
```

## 请求参数说明

### 必需参数
- `prompt`: 输入提示文本

### 可选参数
- `provider`: 模型提供商，可选值：ollama、zhipuai、deepseek、gemini、openrouter
- `model_name`: 模型名称，如果不指定则使用当前配置的默认模型
- `system`: 系统提示，如果不指定则不设置系统角色
- `image_paths`: 图片路径列表，用于图像分析

### 使用示例

```typescript
// 最简单的调用（只传递 prompt）
await chat('你好')

// 指定系统角色
await chat('请分析我的运势', '你是一个专业的命理分析师')

// 指定模型和提供商
await chat('请分析我的八字', '你是一个八字专家', 'zhipuai', 'glm-4.5')

// 使用预设角色
await chat('请帮我分析', SYSTEM_ROLES.FORTUNE_TELLER)
```

## 错误处理

API 服务提供了完善的错误处理机制：

```typescript
try {
  const response = await chat('你好')
} catch (error) {
  if (error instanceof ChatAPIError) {
    switch (error.statusCode) {
      case 400:
        console.error('请求参数错误')
        break
      case 429:
        console.error('请求过于频繁')
        break
      case 500:
        console.error('服务器错误')
        break
      default:
        console.error('API 错误:', error.message)
    }
  } else {
    console.error('网络或其他错误:', error.message)
  }
}
```

## 在 Vue 组件中使用

参考 `src/views/Chat.vue` 中的实现：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { chat, ChatAPIError, SYSTEM_ROLES, PROVIDERS, MODELS } from '@/api/chat'

const isLoading = ref(false)
const response = ref('')

const handleChat = async (userInput: string) => {
  isLoading.value = true
  try {
    // 基础对话
    const result = await chat(userInput, SYSTEM_ROLES.FORTUNE_TELLER)
    response.value = result
    
    // 高级对话（指定提供商和模型）
    const advancedResult = await chat(
      userInput,
      SYSTEM_ROLES.FORTUNE_TELLER,
      PROVIDERS.ZHIPUAI,
      MODELS.GLM_4_FLASH
    )
    response.value = advancedResult
  } catch (error) {
    console.error('对话失败:', error)
    // 处理错误...
  } finally {
    isLoading.value = false
  }
}
</script>
```

## 注意事项

1. **网络连接**: 确保应用能够访问 `https://api.9day.tech`
2. **错误处理**: 始终使用 try-catch 包装 API 调用
3. **用户体验**: 在请求期间显示加载状态
4. **频率限制**: 避免过于频繁的 API 调用
5. **内容过滤**: 根据需要对用户输入和 AI 输出进行内容过滤
6. **参数选择**: 对于简单对话，只需要提供 `prompt` 参数即可；对于特定需求，可以添加相应的可选参数

## 🔧 配置调整指南

### 快速调整模型

如需调整前端发送的模型，只需修改 `src/api/config.ts` 中的 `DEFAULT_MODEL_CONFIG`：

```typescript
// 当前默认配置（不设置系统角色）
export const DEFAULT_MODEL_CONFIG = {
  PROVIDER: PROVIDERS.ZHIPUAI,        // 智谱AI
  MODEL: MODELS.GLM_4_5,              // GLM-4.5 (默认)
  SYSTEM_ROLE: ''                     // 不设置默认系统角色
} as const

// 改为 GLM-4 Flash
export const DEFAULT_MODEL_CONFIG = {
  PROVIDER: PROVIDERS.ZHIPUAI,        // 智谱AI
  MODEL: MODELS.GLM_4_FLASH,          // GLM-4 Flash
  SYSTEM_ROLE: ''                     // 不设置默认系统角色
} as const

// 改为 DeepSeek
export const DEFAULT_MODEL_CONFIG = {
  PROVIDER: PROVIDERS.DEEPSEEK,       // DeepSeek
  MODEL: MODELS.DEEPSEEK_CHAT,        // DeepSeek Chat
  SYSTEM_ROLE: ''                     // 不设置默认系统角色
} as const
```

### 添加新模型

如需添加新的模型提供商或型号，在 `config.ts` 中添加：

```typescript
// 添加新的提供商
export const PROVIDERS = {
  // ... 现有提供商
  NEW_PROVIDER: 'new-provider'
} as const

// 添加新的模型
export const MODELS = {
  // ... 现有模型
  NEW_MODEL: 'new-model-name'
} as const
```

### 验证配置

使用提供的工具函数验证配置：

```typescript
import { isValidModelConfig, getAvailableModelConfigs } from '@/api/config'

// 验证配置是否有效
const isValid = isValidModelConfig('zhipuai', 'glm-4.5-flash')

// 获取所有可用配置
const allConfigs = getAvailableModelConfigs()
```

## API 响应格式

成功响应：
```json
{
  "success": true,
  "message": "模型调用成功",
  "data": {
    "content": "AI 的回复内容",
    "type": "text",
    "extra": {}
  }
}
```

错误响应：
```json
{
  "success": false,
  "message": "错误描述",
  "data": null
}
```