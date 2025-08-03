# AI 对话 API 使用说明

本文档说明如何使用 AI 对话 API 服务。

## API 接口信息

- **接口地址**: `https://api.9day.tech/model/invoke`
- **请求方法**: POST
- **内容类型**: application/json

## 快速开始

### 基本用法

```typescript
import { chat, SYSTEM_ROLES } from '@/api/chat'

// 简单对话
const response = await chat('你好，请介绍一下自己')
console.log(response) // AI 的回复内容

// 使用预设角色
const response2 = await chat(
  '请帮我分析一下我的运势',
  SYSTEM_ROLES.FORTUNE_TELLER
)
```

### 高级用法

```typescript
import { sendChatMessage, createChatRequest, ChatAPIError, PROVIDERS, MODELS } from '@/api/chat'

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
```

## 预设角色

```typescript
import { SYSTEM_ROLES } from '@/api/chat'

// 可用的预设角色
SYSTEM_ROLES.FORTUNE_TELLER  // 专业命理分析师
SYSTEM_ROLES.ASSISTANT       // 智能助手
SYSTEM_ROLES.BAZI_EXPERT     // 八字分析专家
SYSTEM_ROLES.LIFE_ADVISOR    // 人生导师
```

## 支持的模型提供商

```typescript
import { PROVIDERS } from '@/api/chat'

PROVIDERS.OLLAMA      // 'ollama'
PROVIDERS.ZHIPUAI     // 'zhipuai'
PROVIDERS.DEEPSEEK    // 'deepseek'
PROVIDERS.GEMINI      // 'gemini'
PROVIDERS.OPENROUTER  // 'openrouter'
```

## 支持的模型

```typescript
import { MODELS } from '@/api/chat'

MODELS.GLM_4_FLASH      // 'glm-4-flash-250414'
MODELS.GLM_4V           // 'glm-4v'
MODELS.DEEPSEEK_CHAT    // 'deepseek/deepseek-chat-v3-0324:free'
MODELS.DEEPSEEK_CODER   // 'deepseek/deepseek-coder-v2:free'
```

## 请求参数说明

### 必需参数
- `prompt`: 输入提示文本

### 可选参数
- `provider`: 模型提供商，可选值：ollama、zhipuai、deepseek、gemini、openrouter
- `model_name`: 模型名称，如果不指定则使用当前配置的默认模型
- `system`: 系统提示，如果不指定则使用默认值："你是一位专业的AI助手，请根据用户的问题提供准确、有用的回答。"
- `image_paths`: 图片路径列表，用于图像分析

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