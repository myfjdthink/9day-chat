# 9day.chat - Vue3 AI聊天工具

这是一个基于Vue3的AI聊天工具，从Next.js项目转换而来，保持了原有的UI设计和交互体验。

## 功能特性

- 🏠 **首页展示** - 功能介绍和统计数据展示
- 💬 **AI智能对话** - 与AI助手进行自然对话
- ⭐ **八字分析** - 专业的八字命理分析功能
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎨 **现代UI** - 基于Tailwind CSS的美观界面

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 快速的前端构建工具
- **Vue Router** - Vue.js官方路由管理器
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide Vue** - 美观的图标库

## 项目结构

```
9day.chat/
├── src/
│   ├── components/          # 组件目录
│   │   ├── ui/             # 基础UI组件
│   │   └── Sidebar.vue     # 侧边栏组件
│   ├── views/              # 页面组件
│   │   ├── Home.vue        # 首页
│   │   ├── Chat.vue        # 聊天页面
│   │   └── Analysis.vue    # 分析页面
│   ├── router/             # 路由配置
│   ├── lib/                # 工具函数
│   ├── App.vue             # 根组件
│   ├── main.ts             # 应用入口
│   └── style.css           # 全局样式
├── public/                 # 静态资源
├── index.html              # HTML模板
├── package.json            # 项目配置
├── vite.config.ts          # Vite配置
├── tailwind.config.js      # Tailwind配置
└── tsconfig.json           # TypeScript配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 页面说明

### 首页 (`/`)
- 欢迎界面和功能介绍
- 功能特性卡片展示
- 统计数据展示
- 快速导航按钮

### AI对话页面 (`/chat`)
- 实时聊天界面
- 消息历史记录
- 加载状态指示
- 响应式消息布局

### 八字分析页面 (`/analysis`)
- 基本信息输入（性别、出生时间）
- 分析类型选择（基础分析、用神分析、AI分析）
- 分析范围配置（流年、流月、流日）
- 一键开始分析

## 组件说明

### UI组件
- `Button.vue` - 按钮组件，支持多种变体和尺寸
- `Card.vue` / `CardContent.vue` - 卡片组件
- `Input.vue` - 输入框组件
- `Checkbox.vue` - 复选框组件

### 业务组件
- `Sidebar.vue` - 侧边栏导航组件

## 开发说明

1. 项目使用Vue 3 Composition API
2. 所有组件都使用TypeScript编写
3. 样式使用Tailwind CSS
4. 路由使用Vue Router 4
5. 图标使用Lucide Vue

## 注意事项

- 当前聊天功能为模拟实现，实际项目中需要连接真实的AI服务
- 八字分析功能为界面展示，需要连接后端分析服务
- 项目保持了与原Next.js版本一致的UI设计和交互体验

## 后续开发

- [ ] 连接真实的AI聊天服务
- [ ] 实现八字分析后端接口
- [ ] 添加用户认证功能
- [ ] 添加聊天历史记录
- [ ] 优化移动端体验