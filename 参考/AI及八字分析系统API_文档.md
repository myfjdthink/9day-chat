# 北斗九号八字分析系统 API 对接文档

## 1. 基本信息

### 1.1 服务信息
- **服务名称**: 北斗九号分析系统
- **API版本**: v1.1.0
- **基础URL**: `https://api.9day.tech` 
- **协议**: HTTP/HTTPS
- **数据格式**: JSON

### 1.2 通用响应格式
所有API接口都遵循统一的响应格式：

```json
{
  "success": true,
  "message": "操作成功信息",
  "data": {
    // 具体的响应数据
  }
}
```

### 1.3 错误处理
当请求出现错误时，会返回以下格式：

```json
{
  "success": false,
  "message": "错误信息描述",
  "detail": "详细错误信息"
}
```

常见HTTP状态码：
- `200` - 请求成功
- `400` - 请求参数错误
- `422` - 数据验证失败
- `500` - 服务器内部错误

## 2. 接口列表

### 2.1 健康检查

#### 接口信息
- **接口名称**: 健康检查
- **接口URL**: `/health`
- **请求方法**: GET
- **功能描述**: 检查服务状态

#### 响应示例
```json
{
  "status": "healthy"
}
```

### 2.2 八字基础信息计算

#### 接口信息
- **接口名称**: 计算八字基础信息
- **接口URL**: `/bazi/base`
- **请求方法**: POST
- **功能描述**: 计算八字的基础信息，包括四柱、五行分布、大运等

#### 请求参数
```json
{
  "birth_datetime": "1990-01-01T12:00:00",
  "current_datetime": "2024-01-01T12:00:00",
  "gender": "男"
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| birth_datetime | string | 是 | 出生日期时间，ISO格式 |
| current_datetime | string | 否 | 分析日期时间，默认为当前时间 |
| gender | string | 是 | 性别，只能是"男"或"女" |

#### 响应示例
```json
{
  "success": true,
  "message": "基础信息计算成功",
  "data": {
    "基础分析": {
      "性别": "男",
      "八字信息": {
        "年柱": {
          "干支组合": {
            "天干": "己",
            "地支": "巳"
          },
          "五行属性": {
            "天干五行": "土",
            "地支五行": "火"
          }
        },
        "月柱": {
          "干支组合": {
            "天干": "丙",
            "地支": "子"
          },
          "五行属性": {
            "天干五行": "火",
            "地支五行": "水"
          }
        },
        "日柱": {
          "干支组合": {
            "天干": "丙",
            "地支": "寅"
          },
          "五行属性": {
            "天干五行": "火",
            "地支五行": "木"
          }
        },
        "时柱": {
          "干支组合": {
            "天干": "甲",
            "地支": "午"
          },
          "五行属性": {
            "天干五行": "木",
            "地支五行": "火"
          }
        }
      },
      "五行统计": {
        "五行分布": {
          "金": 1,
          "火": 4,
          "水": 5,
          "木": 5,
          "土": 1
        },
        "最强五行": "水",
        "最弱五行": "金"
      },
      "当前大运信息": {
        "天干": "壬",
        "地支": "申",
        "五行": {
          "天干五行": "水",
          "地支五行": "金"
        }
      },
      "流年流月流日信息": {
        "流年": {
          "天干": "癸",
          "地支": "卯",
          "五行": {
            "天干五行": "水",
            "地支五行": "木"
          }
        },
        "流月": {
          "天干": "甲",
          "地支": "子",
          "五行": {
            "天干五行": "木",
            "地支五行": "水"
          }
        }
      }
    }
  }
}
```

### 2.3 十神分析

#### 接口信息
- **接口名称**: 十神分析
- **接口URL**: `/bazi/shishen`
- **请求方法**: POST
- **功能描述**: 分析八字中的十神关系

#### 请求参数
与基础信息计算接口相同

#### 响应示例
```json
{
  "success": true,
  "message": "十神分析成功",
  "data": {
    "性别": "男",
    "日元": {
      "天干": "丙",
      "五行": "火",
      "结论": "丙(火)命"
    },
    "原局分析": {
      "年柱": {
        "天干五行关系": {
          "原字": "己",
          "五行": "土",
          "关系": "生",
          "十神": "食神",
          "结论": "年柱天干为食神"
        },
        "地支五行关系": {
          "原字": "巳",
          "五行": "火",
          "关系": "比和",
          "十神": "比肩",
          "结论": "年柱地支为比肩"
        }
      }
      // ... 其他柱的分析
    },
    "运势分析": {
      "大运分析": {
        // 大运十神分析
      },
      "流运分析": {
        "流年": {
          // 流年十神分析
        },
        "流月": {
          // 流月十神分析
        }
      }
    }
  }
}
```

### 2.4 用神分析

#### 接口信息
- **接口名称**: 用神分析
- **接口URL**: `/bazi/yongshen`
- **请求方法**: POST
- **功能描述**: 分析八字的用神和忌神

#### 请求参数
与基础信息计算接口相同

#### 响应示例
```json
{
  "success": true,
  "message": "用神分析成功",
  "data": {
    "格局": "从强格",
    "用神": [
      "正印(木)",
      "偏印(木)",
      "比肩(火)",
      "劫财(火)"
    ],
    "忌神": [
      "食神(土)",
      "伤官(土)",
      "正财(水)",
      "偏财(水)",
      "正官(水)",
      "七杀(水)"
    ],
    "取用": "泄耗",
    "大运分析": {},
    "分析": "八字为从强格格，用神为正印(木), 偏印(木), 比肩(火), 劫财(火)，忌神为食神(土), 伤官(土), 正财(水), 偏财(水), 正官(水), 七杀(水)。"
  }
}
```

### 2.5 刑冲分析

#### 接口信息
- **接口名称**: 刑冲分析
- **接口URL**: `/bazi/xingchong`
- **请求方法**: POST
- **功能描述**: 分析八字中的刑冲关系

#### 请求参数
与基础信息计算接口相同

#### 响应示例
```json
{
  "success": true,
  "message": "刑冲分析成功",
  "data": {
    "年干关系": {
      "原局关系": [
        {
          "当前": "年干己",
          "对象": "时干甲",
          "关系类型": "天干合化"
        }
      ],
      "流运关系": {
        "流年关系": [],
        "流月关系": [
          {
            "当前": "年干己",
            "对象": "流月干甲",
            "关系类型": "天干合化"
          }
        ]
      }
    },
    "年支关系": {
      "原局关系": [
        {
          "当前": "年支巳",
          "对象": "日支寅",
          "关系类型": "三刑"
        }
      ]
    }
    // ... 其他柱的刑冲关系
  }
}
```

### 2.6 完整八字分析

#### 接口信息
- **接口名称**: 完整八字分析
- **接口URL**: `/bazi/full`
- **请求方法**: POST
- **功能描述**: 进行全面的八字分析，整合基础、十神、刑冲分析结果

#### 请求参数
与基础信息计算接口相同

#### 响应示例
```json
{
  "success": true,
  "message": "完整分析成功",
  "data": {
    "analysis_result": {
      "日主五行": "火",
      "日主天干": "丙",
      "五行统计": {
        "土": 1,
        "水": 5,
        "木": 5,
        "金": 1,
        "火": 4
      },
      "强弱判断": "从强格",
      "分析说明": "八字为从强格格，用神为正印(木)..."
    },
    "key_info": {
      "性别": "男",
      "日元": {
        "原局": "丙(火)命",
        "大运": "正官",
        "流年": "天干正官，地支正印"
      }
      // ... 详细的关键信息
    }
  }
}
```

### 2.7 AI智能分析

#### 接口信息
- **接口名称**: AI智能分析
- **接口URL**: `/bazi/ai`
- **请求方法**: POST
- **功能描述**: 使用AI进行深度八字分析

#### 请求参数
```json
{
  "birth_datetime": "1990-01-01T12:00:00",
  "current_datetime": "2024-01-01T12:00:00",
  "gender": "男",
  "analysis_parts": ["流年", "流月", "流日"]
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| birth_datetime | string | 是 | 出生日期时间 |
| current_datetime | string | 否 | 分析日期时间 |
| gender | string | 是 | 性别 |
| analysis_parts | array | 否 | 分析部分，可选：["流年", "流月", "流日"] |

#### 响应示例
```json
{
  "success": true,
  "message": "AI分析成功",
  "data": {
    "分析结果": "流年总论：\n- 事业运势：2025年，流年天干正官，地支正印...\n- 财运分析：身弱格局中，流年偏财星较旺...",
    "分析类型": "default",
    "分析时间": "2025-01-05T01:44:54.221336"
  }
}
```

### 2.8 运势分析

#### 接口信息
- **接口名称**: 每日运势分析
- **接口URL**: `/bazi/fortune`
- **请求方法**: POST
- **功能描述**: 分析当日各方面运势评分

#### 请求参数
与基础信息计算接口相同

#### 响应示例
```json
{
  "success": true,
  "message": "运势分析成功",
  "data": {
    "code": 200,
    "message": "success",
    "data": {
      "wealth": 65,        // 财运
      "career": 75,        // 事业运
      "love": 60,          // 感情运
      "luck": 70,          // 综合运势
      "boss": 80,          // 上级关系
      "colleague": 85,     // 同事关系
      "client": 75,        // 客户关系
      "social": 70,        // 社交运
      "negotiation": 65,   // 谈判运
      "cooperation": 75,   // 合作运
      "contract": 70,      // 合同运
      "payment": 65,       // 收款运
      "mood": 80,          // 心情指数
      "travel": 75,        // 出行运
      "friend": 85,        // 朋友运
      "entertainment": 80  // 娱乐运
    }
  }
}
```

### 2.9 模型调用

#### 接口信息
- **接口名称**: 模型调用
- **接口URL**: `/model/invoke`
- **请求方法**: POST
- **功能描述**: 直接调用AI模型进行对话

#### 请求参数
```json
{
  "prompt": "你好，请介绍一下自己",
  "model_name": "glm-4-flash-250414",
  "system": "你是一个专业的命理分析师",
  "image_paths": null
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| prompt | string | 是 | 输入提示文本 |
| model_name | string | 否 | 模型名称，不传则使用默认模型 |
| system | string | 否 | 系统提示 |
| image_paths | array | 否 | 图片路径列表 |

#### 响应示例
```json
{
  "success": true,
  "message": "模型调用成功",
  "data": {
    "type": "text",
    "content": "你好，我是一个AI助手...",
    "extra": {}
  }
}
```

## 3. 前端集成示例

### 3.1 JavaScript/TypeScript 示例

```javascript
// 基础API调用类
class BaziAPI {
  constructor(baseURL = 'http://api.9day.chat') {
    this.baseURL = baseURL;
  }

  async request(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('API调用失败:', error);
      throw error;
    }
  }

  // 八字基础信息
  async getBaseInfo(birthDateTime, gender, currentDateTime = null) {
    return this.request('/bazi/base', 'POST', {
      birth_datetime: birthDateTime,
      current_datetime: currentDateTime,
      gender: gender
    });
  }

  // 十神分析
  async getShishenAnalysis(birthDateTime, gender, currentDateTime = null) {
    return this.request('/bazi/shishen', 'POST', {
      birth_datetime: birthDateTime,
      current_datetime: currentDateTime,
      gender: gender
    });
  }

  // AI分析
  async getAIAnalysis(birthDateTime, gender, analysisParts = ['流年', '流月', '流日'], currentDateTime = null) {
    return this.request('/bazi/ai', 'POST', {
      birth_datetime: birthDateTime,
      current_datetime: currentDateTime,
      gender: gender,
      analysis_parts: analysisParts
    });
  }

  // 运势分析
  async getFortuneAnalysis(birthDateTime, gender, currentDateTime = null) {
    return this.request('/bazi/fortune', 'POST', {
      birth_datetime: birthDateTime,
      current_datetime: currentDateTime,
      gender: gender
    });
  }
}

// 使用示例
const api = new BaziAPI();

async function analyzeBazi() {
  try {
    const birthDateTime = '1990-01-01T12:00:00';
    const gender = '男';
    
    // 获取基础信息
    const baseInfo = await api.getBaseInfo(birthDateTime, gender);
    console.log('基础信息:', baseInfo);
    
    // 获取AI分析
    const aiAnalysis = await api.getAIAnalysis(birthDateTime, gender);
    console.log('AI分析:', aiAnalysis);
    
    // 获取运势分析
    const fortune = await api.getFortuneAnalysis(birthDateTime, gender);
    console.log('运势分析:', fortune);
    
  } catch (error) {
    console.error('分析失败:', error);
  }
}
```

### 3.2 React Hook 示例

```javascript
import { useState, useCallback } from 'react';

// 自定义Hook
export const useBaziAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const apiCall = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  const analyzeBase = useCallback((birthDateTime, gender, currentDateTime) => {
    return apiCall('/bazi/base', {
      birth_datetime: birthDateTime,
      current_datetime: currentDateTime,
      gender: gender
    });
  }, [apiCall]);

  const analyzeAI = useCallback((birthDateTime, gender, analysisParts, currentDateTime) => {
    return apiCall('/bazi/ai', {
      birth_datetime: birthDateTime,
      current_datetime: currentDateTime,
      gender: gender,
      analysis_parts: analysisParts
    });
  }, [apiCall]);

  return {
    loading,
    error,
    analyzeBase,
    analyzeAI,
    // ... 其他分析方法
  };
};

// 组件中使用
function BaziAnalyzer() {
  const { loading, error, analyzeBase, analyzeAI } = useBaziAPI();
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      const data = await analyzeBase('1990-01-01T12:00:00', '男');
      setResult(data);
    } catch (err) {
      console.error('分析失败:', err);
    }
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? '分析中...' : '开始分析'}
      </button>
      {error && <div style={{color: 'red'}}>错误: {error}</div>}
      {result && <div>分析结果: {JSON.stringify(result, null, 2)}</div>}
    </div>
  );
}
```

## 4. 注意事项

### 4.1 时间格式
- 所有时间参数都使用ISO 8601格式：`YYYY-MM-DDTHH:mm:ss`
- 时区默认使用系统时区

### 4.2 性别参数
- 只接受"男"或"女"两个值
- 区分大小写

### 4.3 分析部分参数
- AI分析接口的`analysis_parts`参数可选值：["流年", "流月", "流日"]
- 如果不传或传入无效值，默认返回全部分析

### 4.4 错误处理
- 建议在前端实现统一的错误处理机制
- 对于网络错误和服务器错误要有不同的处理策略

### 4.5 性能优化
- 建议对分析结果进行缓存，避免重复请求
- 可以考虑使用防抖(debounce)来避免频繁请求

## 5. 开发环境配置

### 5.1 本地开发
```bash
# 启动后端服务
python app.py

# 服务地址
http://localhost:8000

# API文档地址
http://localhost:8000/docs
```

### 5.2 生产环境
```bash
# 生产环境地址
https://api.9day.tech

# API文档地址
https://api.9day.tech/docs
```

## 6. 联系方式

如有问题或建议，请联系开发团队。 