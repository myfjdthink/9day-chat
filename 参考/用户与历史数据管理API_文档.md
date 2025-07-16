# 用户与历史数据管理 API 文档

## 1. 基础信息

- **基础URL**: `http://localhost:8000/api/v1`
- **认证方式**: Bearer Token (JWT)
- **内容类型**: `application/json`
- **字符编码**: UTF-8

### 认证说明

大部分接口需在请求头中包含有效的访问令牌：

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 2. 通用响应与错误码

### 响应格式

- **成功响应**：返回数据对象或数组，包含常见字段如 id、created_at、updated_at 等。
- **错误响应**：

```json
{
    "detail": "错误描述信息",
    "error_code": "ERROR_CODE",
    "timestamp": "2024-01-01T00:00:00Z"
}
```

### HTTP 状态码与常见错误码

| 状态码 | 说明           | 错误码                  | 说明           |
|--------|----------------|-------------------------|----------------|
| 200    | 请求成功       | INVALID_CREDENTIALS     | 用户名或密码错误 |
| 201    | 创建成功       | TOKEN_EXPIRED           | 令牌已过期     |
| 400    | 请求参数错误   | INSUFFICIENT_PERMISSIONS| 权限不足       |
| 401    | 未授权         | VALIDATION_ERROR        | 数据验证失败   |
| 403    | 权限不足       | RESOURCE_NOT_FOUND      | 资源不存在     |
| 404    | 资源不存在     | DUPLICATE_ENTRY         | 数据重复       |
| 422    | 数据验证失败   |                         |                |
| 500    | 服务器内部错误 |                         |                |

---

## 3. 用户认证模块

### 3.1 注册与登录

#### 用户注册

- **接口**: `POST /auth/register`
- **权限**: 无需认证
- **请求体**:
  ```json
  {
      "username": "testuser",
      "email": "test@example.com",
      "password": "securepassword123",
      "phone": "13800138000",
      "birth_year": 1990,
      "birth_month": 5,
      "birth_day": 15,
      "birth_time": "14:30",
      "gender": "male"
  }
  ```
- **响应示例**:
  ```json
  {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "username": "testuser",
      "email": "test@example.com",
      "phone": "13800138000",
      "role": "user",
      "is_active": true,
      "is_verified": false,
      "birth_year": 1990,
      "birth_month": 5,
      "birth_day": 15,
      "birth_time": "14:30",
      "gender": "male",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "last_login": null
  }
  ```

#### 用户登录

- **接口**: `POST /auth/login`
- **权限**: 无需认证
- **请求体**: `application/x-www-form-urlencoded`
  ```
  username=testuser&password=securepassword123
  ```
- **响应示例**:
  ```json
  {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer"
  }
  ```

#### 刷新令牌

- **接口**: `POST /auth/refresh`
- **权限**: 需要认证
- **请求体**: 无
- **响应示例**:
  ```json
  {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer"
  }
  ```

### 3.2 密码管理

#### 密码重置请求

- **接口**: `POST /auth/password-reset-request`
- **权限**: 无需认证
- **请求体**:
  ```json
  {
      "email": "test@example.com"
  }
  ```
- **响应示例**:
  ```json
  {
      "message": "如果邮箱存在，重置链接已发送"
  }
  ```

#### 密码重置验证

- **接口**: `POST /auth/password-reset-verify`
- **权限**: 无需认证
- **请求体**:
  ```json
  {
      "token": "reset_token_here",
      "new_password": "newpassword123"
  }
  ```
- **响应示例**:
  ```json
  {
      "message": "密码重置成功",
      "email": "test@example.com"
  }
  ```

---

## 4. 用户管理模块

### 4.1 当前用户操作

#### 获取当前用户信息

- **接口**: `GET /users/me`
- **权限**: 需要认证
- **响应示例**:
  ```json
  {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "username": "testuser",
      "email": "test@example.com",
      "phone": "13800138000",
      "role": "user",
      "is_active": true,
      "is_verified": true,
      "birth_year": 1990,
      "birth_month": 5,
      "birth_day": 15,
      "birth_time": "14:30",
      "gender": "male",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-01T12:00:00Z"
  }
  ```

#### 更新当前用户信息

- **接口**: `PUT /users/me`
- **权限**: 需要认证
- **请求体**:
  ```json
  {
      "username": "newusername",
      "phone": "13900139000",
      "birth_year": 1991,
      "birth_month": 6,
      "birth_day": 20,
      "birth_time": "15:30",
      "gender": "female"
  }
  ```
- **响应示例**:
  ```json
  {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "username": "newusername",
      "email": "test@example.com",
      "phone": "13900139000",
      "birth_year": 1991,
      "birth_month": 6,
      "birth_day": 20,
      "birth_time": "15:30",
      "gender": "female",
      "role": "user",
      "is_active": true,
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T12:30:00Z",
      "last_login": "2024-01-01T12:00:00Z"
  }
  ```

#### 获取当前用户权限

- **接口**: `GET /users/me/permissions`
- **权限**: 需要认证
- **响应示例**:
  ```json
  {
      "permissions": [
          "read:own_profile",
          "update:own_profile",
          "create:bazi_analysis",
          "read:own_bazi_analysis",
          "create:chat_session",
          "read:own_chat_session"
      ],
      "role": "user"
  }
  ```

#### 获取当前用户同步统计

- **接口**: `GET /users/me/sync-stats`
- **权限**: 需要认证
- **响应示例**:
  ```json
  {
      "total_bazi_analyses": 10,
      "synced_bazi_analyses": 8,
      "pending_bazi_analyses": 2,
      "total_chat_sessions": 5,
      "synced_chat_sessions": 5,
      "pending_chat_sessions": 0,
      "last_sync_at": "2024-07-05T10:00:00Z"
  }
  ```

#### 同步当前用户数据

- **接口**: `POST /users/me/sync`
- **权限**: 需要认证
- **请求体**:
  ```json
  {
      "sync_type": "full",
      "client_timestamp": "2024-07-05T10:00:00Z",
      "force_sync": false
  }
  ```
- **响应示例**:
  ```json
  {
      "sync_id": "some-sync-id",
      "sync_status": "success",
      "server_timestamp": "2024-07-05T10:00:05Z",
      "synced_items": {
          "bazi": 2,
          "chat": 0
      },
      "failed_items": {},
      "conflicts": [],
      "next_sync_version": 2,
      "message": "Sync successful"
  }
  ```

#### 获取当前用户八字分析统计

- **接口**: `GET /users/me/bazi-stats`
- **权限**: 需要认证
- **响应示例**:
  ```json
  {
      "total_analyses": 15,
      "pending_sync": 2,
      "synced": 12,
      "failed_sync": 1,
      "last_analysis_time": "2024-01-01T12:00:00Z"
  }
  ```

#### 获取当前用户聊天统计

- **接口**: `GET /users/me/chat-stats`
- **权限**: 需要认证
- **响应示例**:
  ```json
  {
      "total_sessions": 8,
      "total_messages": 120,
      "pending_sync": 1,
      "synced": 7,
      "last_chat_time": "2024-01-01T12:00:00Z"
  }
  ```

### 4.2 管理员/超级管理员操作

#### 获取用户列表

- **接口**: `GET /users/list`
- **权限**: 需要管理员权限
- **查询参数**:
  - `skip`: 跳过的记录数（默认：0）
  - `limit`: 返回的最大记录数（默认：10，最大：100）
  - `role`: 角色过滤（可选）
- **响应示例**:
  ```json
  [
      {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "username": "testuser",
          "email": "test@example.com",
          "phone": "13800138000",
          "role": "user",
          "is_active": true,
          "is_verified": true,
          "created_at": "2024-01-01T00:00:00Z",
          "updated_at": "2024-01-01T00:00:00Z",
          "last_login": "2024-01-01T12:00:00Z"
      }
  ]
  ```

#### 获取指定用户信息

- **接口**: `GET /users/{user_id}`
- **权限**: 需要管理员权限
- **路径参数**: `user_id`
- **响应示例**: 同获取当前用户信息

#### 更新指定用户信息

- **接口**: `PUT /users/{user_id}`
- **权限**: 需要管理员权限
- **路径参数**: `user_id`
- **请求体**: 同更新当前用户信息
- **响应示例**: 同获取当前用户信息

#### 删除用户

- **接口**: `DELETE /users/{user_id}`
- **权限**: 需要超级管理员权限
- **路径参数**: `user_id`
- **响应示例**:
  ```json
  {
      "message": "用户已成功停用"
  }
  ```

#### 批量同步用户数据

- **接口**: `POST /users/batch-sync`
- **权限**: 需要管理员权限
- **请求体**:
  ```json
  {
      "user_ids": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
      "sync_type": "incremental"
  }
  ```
- **响应示例**:
  ```json
  {
      "batch_sync_id": "batch_123456",
      "status": "started",
      "user_count": 1,
      "message": "批量同步已开始"
  }
  ```

### 4.3 用户数据导入导出（仅管理员）

#### 导出用户数据
- **接口**: `GET /users/admin/export`
- **权限**: 需要管理员权限
- **说明**: 导出所有用户数据，返回标准 users.json 结构，密码字段为 hashed_password。
- **响应示例**:
```json
{
    "version": "1.0",
    "backup_date": "2025-07-03T15:24:42.557225",
    "users": [
        {
            "email": "test@example.com",
            "username": "testuser",
            "hashed_password": "$2b$12$...",
            "role": "user",
            "is_active": true,
            "is_verified": false,
            "created_at": "2025-07-03T15:24:42.557225",
            "updated_at": "2025-07-03T15:24:42.557225",
            "last_login": "2025-07-03T15:24:42.557225",
            "birth_year": 1990,
            "birth_month": 5,
            "birth_day": 15,
            "birth_time": "14:30",
            "gender": "male",
            "phone": "13800138000"
        }
    ],
    "metadata": {
        "total_users": 1,
        "backup_type": "full",
        "timestamp": "2025-07-03T15:24:42.557225"
    }
}
```

#### 导入用户数据
- **接口**: `POST /users/admin/import`
- **权限**: 需要管理员权限
- **说明**: 上传 users.json 文件，自动识别 hashed_password 字段，已存在邮箱/用户名的用户自动跳过。
- **请求参数**: 表单上传文件（file 字段）
- **返回示例**:
```json
{
    "message": "成功导入10个新用户，跳过2个已存在用户。"
}
```

- **数据格式说明**：
    - 文件结构需包含 version、backup_date、users（数组）、metadata 字段
    - users 数组内每个用户需包含 email、username、hashed_password 及其他基本信息
    - 支持 hashed_password 或 password_hash 字段，自动映射
    - 时间字段需为 ISO 8601 字符串

---

## 5. 关系和同步管理

### 获取用户同步日志列表

- **接口**: `GET /relations/sync-logs`
- **权限**: 需要认证
- **查询参数**:
  - `skip`: 跳过的记录数（默认: 0）
  - `limit`: 返回的记录数（默认: 10，最大: 100）
  - `sync_type`: 同步类型过滤（可选）
  - `status`: 状态过滤（可选）
- **响应示例**:
  ```json
  [
      {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "user_id": "user_123",
          "sync_type": "bazi_analysis",
          "status": "success",
          "sync_data": {},
          "error_message": null,
          "created_at": "2024-01-01T12:00:00Z",
          "updated_at": "2024-01-01T12:00:00Z"
      }
  ]
  ```

### 获取单个同步日志详情

- **接口**: `GET /relations/sync-logs/{log_id}`
- **权限**: 需要认证
- **路径参数**: `log_id`
- **响应示例**: 同上

### 获取聊天-八字分析关联列表

- **接口**: `GET /relations/chat-bazi-relations`
- **权限**: 需要认证
- **查询参数**:
  - `skip`: 跳过的记录数（默认: 0）
  - `limit`: 返回的记录数（默认: 10，最大: 100）
  - `relation_type`: 关联类型过滤（可选）
- **响应示例**:
  ```json
  [
      {
          "id": "rel_123",
          "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "bazi_analysis_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "relation_type": "analysis_discussion",
          "created_at": "2024-01-01T12:00:00Z"
      }
  ]
  ```

### 删除聊天-八字分析关联

- **接口**: `DELETE /relations/chat-bazi-relations/{relation_id}`
- **权限**: 需要认证
- **路径参数**: `relation_id`
- **响应**: 204 No Content

### 解决同步冲突

- **接口**: `POST /relations/resolve-conflict`
- **权限**: 需要认证
- **请求体**:
  ```json
  {
      "conflict_id": "conflict_123",
      "resolution_strategy": "use_server",
      "selected_version": "server"
  }
  ```
- **响应示例**:
  ```json
  {
      "conflict_id": "conflict_123",
      "resolution_strategy": "use_server",
      "success": true,
      "message": "冲突解决成功",
      "resolved_data": {}
  }
  ```

### 管理员获取所有同步日志/统计

- **接口**: `GET /relations/admin/sync-logs`
- **权限**: 需要管理员权限
- **查询参数**:
  - `skip`, `limit`, `user_id`, `sync_type`, `status`, `start_date`, `end_date`
- **响应示例**: 同获取用户同步日志列表

- **接口**: `GET /relations/admin/sync-stats`
- **权限**: 需要管理员权限
- **查询参数**:
  - `days`: 统计天数（默认: 7，最大: 365）
- **响应示例**:
  ```json
  {
      "total_syncs": 1000,
      "successful_syncs": 950,
      "failed_syncs": 50,
      "sync_types": {
          "bazi_analysis": 600,
          "chat_session": 400
      },
      "daily_stats": [
          {
              "date": "2024-01-01",
              "total": 100,
              "successful": 95,
              "failed": 5
          }
      ]
  }
  ```

---

## 6. 八字分析模块

### 创建八字分析
- **接口**: `POST /bazi/analyses`
- **权限**: 需要认证
- **请求体**:
  ```json
  {
      "client_analysis_id": "client_123",      // 可选，客户端分析ID
      "birth_year": 1990,                       // 必填
      "birth_month": 5,                         // 必填
      "birth_day": 15,                          // 必填
      "birth_time": "14:30",                   // 必填
      "gender": "male",                        // 必填
      "analysis_type": "basic",                // 可选，分析类型
      "notes": "基础八字分析",                  // 可选，备注
      "user_nickname": "张三",                  // 可选，用户昵称
      "display_name": "张三(男) 1990-5-15",    // 可选，显示名，后端自动生成
      "analysis_results": {},                    // 可选，分析结果，JSON
      "summary": {},                             // 可选，分析摘要，JSON
      "settings": {},                            // 可选，分析设置，JSON
      "extra_metadata": {}                       // 可选，额外元数据，JSON
  }
  ```
- **响应示例**:
  ```json
  {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "client_analysis_id": "client_123",
      "user_id": "user_123",
      "birth_year": 1990,
      "birth_month": 5,
      "birth_day": 15,
      "birth_time": "14:30",
      "gender": "male",
      "analysis_type": "basic",
      "notes": "基础八字分析",
      "display_name": "张三(男) 1990-5-15",    // 后端自动生成
      "user_nickname": "张三",
      "analysis_results": {},
      "summary": {},
      "settings": {},
      "extra_metadata": {},
      "sync_status": "pending",                // 同步状态
      "is_synced": false,                       // 是否已同步
      "sync_version": 1,                        // 同步版本
      "last_sync_at": null,                     // 最后同步时间
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
  }
  ```
  // 【与后端实现同步】所有字段、类型、默认值、自动生成说明与 bazi.py 保持一致。

### 获取八字分析列表
- **接口**: `GET /bazi/analyses`
- **权限**: 需要认证
- **查询参数**:
  - `skip`: 跳过的记录数（默认：0）
  - `limit`: 返回的最大记录数（默认：10，最大：100）
- **响应示例**:
  ```json
  [
      {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "client_analysis_id": "client_123",
          "user_id": "user_123",
          "birth_year": 1990,
          "birth_month": 5,
          "birth_day": 15,
          "birth_time": "14:30",
          "gender": "male",
          "analysis_type": "basic",
          "notes": "基础八字分析",
          "display_name": "张三(男) 1990-5-15",
          "user_nickname": "张三",
          "analysis_results": {},
          "summary": {},
          "settings": {},
          "extra_metadata": {},
          "sync_status": "synced",
          "is_synced": true,
          "sync_version": 1,
          "last_sync_at": "2024-01-01T00:00:00Z",
          "created_at": "2024-01-01T00:00:00Z",
          "updated_at": "2024-01-01T00:00:00Z"
      }
  ]
  ```
  // 【与后端实现同步】

### 获取单个八字分析
- **接口**: `GET /bazi/analyses/{analysis_id}`
- **权限**: 需要认证
- **路径参数**: `analysis_id`（UUID）
- **响应示例**: 同创建八字分析响应

### 更新八字分析
- **接口**: `PUT /bazi/analyses/{analysis_id}`
- **权限**: 需要认证
- **路径参数**: `analysis_id`（UUID）
- **请求体**: 同创建八字分析（所有字段可选）
- **响应示例**: 同创建八字分析响应

### 删除八字分析
- **接口**: `DELETE /bazi/analyses/{analysis_id}`
- **权限**: 需要认证
- **路径参数**: `analysis_id`（UUID）
- **响应示例**:
  ```json
  {
      "message": "八字分析删除成功"
  }
  ```

### 按同步状态获取分析
- **接口**: `GET /bazi/analyses/sync-status/{sync_status}`
- **权限**: 需要认证
- **路径参数**: `sync_status`（pending, synced, failed, conflict）
- **查询参数**:
  - `skip`: 跳过的记录数（默认：0）
  - `limit`: 返回的最大记录数（默认：10，最大：100）
- **响应示例**: 同获取八字分析列表

### 按客户端ID获取分析
- **接口**: `GET /bazi/analyses/client/{client_analysis_id}`
- **权限**: 需要认证
- **路径参数**: `client_analysis_id`
- **响应示例**: 同创建八字分析响应

### 同步八字分析数据
- **接口**: `POST /bazi/analyses/sync`
- **权限**: 需要认证
- **请求体**:
  ```json
  {
      "analysis_ids": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
      "force_sync": false
  }
  ```
- **响应示例**:
  ```json
  {
      "sync_id": "sync_123456",
      "status": "started",
      "analysis_count": 1,
      "message": "八字分析同步已开始"
  }
  ```

### 批量更新同步状态
- **接口**: `PUT /bazi/analyses/batch-sync-status`
- **权限**: 需要认证
- **请求体**:
  ```json
  {
      "analysis_ids": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
      "sync_status": "synced"
  }
  ```
- **响应示例**:
  ```json
  {
      "updated_count": 1,
      "message": "同步状态更新成功"
  }
  ```

### 获取八字分析统计
- **接口**: `GET /bazi/stats`
- **权限**: 需要认证
- **响应示例**:
  ```json
  {
      "total_analyses": 15,
      "synced_analyses": 12,
      "pending_analyses": 2,
      "public_analyses": 5,
      "private_analyses": 10
  }
  ```
  // 【与后端实现同步】所有统计字段与 bazi.py 保持一致。

---

## 7. 聊天系统模块

### 创建聊天会话

- **接口**: `POST /chat/sessions`
- **权限**: 需要认证
- **请求体**:
  ```json
  {
      "title": "新对话",
      "description": "关于八字分析的讨论",
      "client_session_id": "client_1234567890_def456"
  }
  ```
- **响应示例**:
  ```json
  {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "user_id": "user_123",
      "title": "新对话",
      "description": "关于八字分析的讨论",
      "is_active": true,
      "message_count": 0,
      "client_session_id": "client_1234567890_def456",
      "sync_status": "pending",
      "sync_version": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "last_message_at": null
  }
  ```

### 获取聊天会话列表

- **接口**: `GET /chat/sessions`
- **权限**: 需要认证
- **查询参数**:
  - `skip`: 跳过的记录数（默认: 0）
  - `limit`: 返回的记录数（默认: 10，最大: 100）
  - `include_archived`: 是否包含已归档的会话（默认: false）
- **响应示例**:
  ```json
  {
      "total": 1,
      "items": [
          {
              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "title": "新对话",
              "description": "关于八字分析的讨论",
              "is_active": true,
              "message_count": 5,
              "created_at": "2024-01-01T00:00:00Z",
              "last_message_at": "2024-01-01T12:00:00Z"
          }
      ]
  }
  ```

### 获取单个会话及其消息

- **接口**: `GET /chat/sessions/{session_id}`
- **权限**: 需要认证
- **路径参数**: `session_id`（UUID）
- **查询参数**:
  - `message_limit`: 返回的最大消息数（默认: 50，最大: 100）
- **响应示例**:
  ```json
  {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "title": "新对话",
      "description": "关于八字分析的讨论",
      "is_active": true,
      "message_count": 2,
      "created_at": "2024-01-01T00:00:00Z",
      "messages": [
          {
              "id": "msg_123",
              "content": "你好，我想了解一下我的八字分析结果。",
              "message_type": "text",
              "sender_type": "user",
              "created_at": "2024-01-01T12:00:00Z"
          }
      ]
  }
  ```

### 更新会话信息

- **接口**: `PUT /chat/sessions/{session_id}`
- **权限**: 需要认证
- **路径参数**: `session_id`（UUID）
- **请求体**:
  ```json
  {
      "title": "更新的对话标题",
      "description": "更新的描述",
      "is_active": true
  }
  ```
- **响应示例**: 同创建聊天会话

### 删除会话

- **接口**: `DELETE /chat/sessions/{session_id}`
- **权限**: 需要认证
- **路径参数**: `session_id`（UUID）
- **响应**: 204 No Content

### 创建消息

- **接口**: `POST /chat/sessions/{session_id}/messages`
- **权限**: 需要认证
- **路径参数**: `session_id`（UUID）
- **请求体**:
  ```json
  {
      "content": "你好，我想了解一下我的八字分析结果。",
      "message_type": "text",
      "client_message_id": "client_1234567890_ghi789"
  }
  ```
- **响应示例**:
  ```json
  {
      "id": "msg_123",
      "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "content": "你好，我想了解一下我的八字分析结果。",
      "message_type": "text",
      "sender_type": "user",
      "client_message_id": "client_1234567890_ghi789",
      "sync_status": "pending",
      "sync_version": 1,
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
  }
  ```

### 获取会话消息列表

- **接口**: `GET /chat/sessions/{session_id}/messages`
- **权限**: 需要认证
- **路径参数**: `session_id`（UUID）
- **查询参数**:
  - `skip`: 跳过的记录数（默认: 0）
  - `limit`: 返回的记录数（默认: 50，最大: 100）
- **响应示例**:
  ```json
  [
      {
          "id": "msg_123",
          "content": "你好，我想了解一下我的八字分析结果。",
          "message_type": "text",
          "sender_type": "user",
          "created_at": "2024-01-01T12:00:00Z"
      },
      {
          "id": "msg_124",
          "content": "您好！我很乐意为您解释八字分析结果...",
          "message_type": "text",
          "sender_type": "assistant",
          "created_at": "2024-01-01T12:01:00Z"
      }
  ]
  ```

### 按同步状态获取会话

- **接口**: `GET /chat/sessions/sync-status/{sync_status}`
- **权限**: 需要认证
- **路径参数**: `sync_status`
- **查询参数**:
  - `skip`: 跳过的记录数（默认: 0）
  - `limit`: 返回的记录数（默认: 10，最大: 100）
- **响应示例**: 同获取聊天会话列表的items数组

### 按客户端ID获取会话

- **接口**: `GET /chat/sessions/client/{client_id}`
- **权限**: 需要认证
- **路径参数**: `client_id`
- **响应示例**: 同创建聊天会话

### 按客户端ID获取消息

- **接口**: `GET /chat/messages/client/{client_message_id}`
- **权限**: 需要认证
- **路径参数**: `client_message_id`
- **响应示例**: 同创建消息

### 创建聊天-八字分析关联

- **接口**: `POST /chat/sessions/{session_id}/bazi-relations`
- **权限**: 需要认证
- **路径参数**: `session_id`（UUID）
- **请求体**:
  ```json
  {
      "bazi_analysis_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "relation_type": "analysis_discussion"
  }
  ```
- **响应示例**:
  ```json
  {
      "id": "rel_123",
      "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "bazi_analysis_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "relation_type": "analysis_discussion",
      "created_at": "2024-01-01T12:00:00Z"
  }
  ```

### 获取会话的八字分析关联

- **接口**: `GET /chat/sessions/{session_id}/bazi-relations`
- **权限**: 需要认证
- **路径参数**: `session_id`（UUID）
- **响应示例**:
  ```json
  [
      {
          "id": "rel_123",
          "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "bazi_analysis_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "relation_type": "analysis_discussion",
          "created_at": "2024-01-01T12:00:00Z"
      }
  ]
  ```

### 批量更新会话同步状态

- **接口**: `PUT /chat/sessions/batch-sync-status`
- **权限**: 需要认证
- **请求体**:
  ```json
  {
      "session_ids": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
      "sync_status": "synced",
      "sync_version": 2
  }
  ```
- **响应示例**:
  ```json
  {
      "updated_count": 1,
      "message": "会话同步状态更新成功"
  }
  ```

### 获取用户聊天统计

- **接口**: `GET /chat/stats`
- **权限**: 需要认证
- **响应示例**:
  ```json
  {
      "total_sessions": 8,
      "total_messages": 120,
      "pending_sync": 1,
      "synced": 7,
      "last_chat_time": "2024-01-01T12:00:00Z"
  }
  ```

---

## 8. 注意事项

1. **时间格式**: 所有时间字段使用 ISO 8601 格式（UTC时间）
2. **分页**: 使用 `skip` 和 `limit` 参数进行分页
3. **排序**: 默认按创建时间倒序排列
4. **软删除**: 删除操作通常是软删除，数据仍保留在数据库中
5. **版本控制**: API 版本通过 URL 路径控制（/api/v1/）
6. **ID格式**: 所有实体ID使用UUID格式
7. **同步机制**: 支持客户端与服务器之间的数据同步
8. **权限控制**: 严格的基于角色的访问控制（RBAC）

---

## 9. 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 用户认证和管理功能
- 八字分析功能
- 聊天系统功能
- 数据同步机制
- 关系和同步管理功能 