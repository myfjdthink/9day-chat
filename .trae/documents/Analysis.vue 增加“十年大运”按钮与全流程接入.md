## 需求概述
- 在 `src/views/Analysis.vue` 的“开始分析”按钮旁新增“十年大运”按钮，样式一致，点击后按现有“开始分析”的采集逻辑组装参数并提交到新 API：`POST https://9daycore.zeabur.app/bazi/ai/10years_single`。
- 获取返回内容后，按现有持久化流程保存到本地与云端，并在页面展示，支持历史回看。

## 改动范围
1. UI：在“开始分析”按钮容器处新增一个同样风格的按钮
   - 位置：`src/views/Analysis.vue`:186-197
2. 逻辑：新增一个点击处理函数与加载状态
   - 新增变量：`const isTenYearsAnalyzing = ref(false)`
   - 新增方法：`handleTenYearsAnalysis()`，参照 `handleStartAnalysis`：`src/views/Analysis.vue`:616-792
3. API封装：在 `src/api/bazi.ts` 内新增函数，复用 axios 实例与重试工具
   - 新增方法：`export async function analyzeTenYearsSingle(params)`；参考 `retryRequest` 与 `request.post`：`src/api/bazi.ts`:36-48, 276-285

## 实现步骤
1. UI新增按钮
   - 在“开始分析”按钮容器 `div` 内，加一个并排的 `<Button size="lg" variant="default" :disabled="isTenYearsAnalyzing" @click="handleTenYearsAnalysis">十年大运</Button>`，与现有按钮保持 Tailwind 与组件风格一致。
2. 组装提交参数
   - 复用现有采集逻辑：
     - `birth_datetime`: 将 `birthDateTime` 转为北京时间 ISO：`dayjs(birthDateTime).tz('Asia/Shanghai').format()`：`src/views/Analysis.vue`:638-642
     - `current_datetime`: 使用当前北京时间 ISO。
     - `gender`: `'男' | '女'`，取自页面选择：`src/views/Analysis.vue`:52-67
     - `provider`/`model_name`: 从 `getDefaultModelConfig()` 读取默认值：`src/api/config.ts`:170-175, 100-113
3. 新增 API 方法（仅一次封装）
   - 在 `src/api/bazi.ts` 添加：
     - `export async function analyzeTenYearsSingle(params: { birth_datetime: string; current_datetime: string; gender: '男'|'女'; provider?: string; model_name?: string }): Promise<any>`
     - 内部调用：`return retryRequest(() => request.post('https://9daycore.zeabur.app/bazi/ai/10years_single', params).then(res => res.data))`
4. 点击处理与结果归并
   - `handleTenYearsAnalysis`：
     - 校验必填（出生时间、性别），设置 `isTenYearsAnalyzing = true`。
     - 调用 `analyzeTenYearsSingle(params)` 获取结果。
     - 将返回内容写入 `allResults['十年大运'] = content`；若返回为结构化对象则序列化为 Markdown 或直接保留对象并同时记录 `rawDayunData.value = result.data ?? result` 以便后续结构化展示：`src/views/Analysis.vue`:1187-1189。
     - 组装 `analysisResult.value = { analysisType: '十年大运', analysisTime: now, analysisResult: allResults }`。
5. 持久化到数据库
   - 复用现有保存流程，构造参数（参考 `handleStartAnalysis`）：`src/views/Analysis.vue`:758-774。
   - 差异：`analysis_type` 包含 `'十年大运'`；`analysis_results` 包含键 `'十年大运'`。
   - 调用 `baziStore.addAnalysis(params)` 完成本地与云端同步：`src/stores/bazi.ts`:101-128。
6. 展示与历史
   - 展示：默认走 Markdown 渲染路径，自动参与排序与懒加载：`src/views/Analysis.vue`:267-271, 1101-1138, 969-989。
   - 历史：已有的 `showAnalysisFromHistory` 将优先读取 `analysis_results` 显示：`src/views/Analysis.vue`:999-1010。

## 数据与兼容
- 入参：`{ birth_datetime, current_datetime, gender, provider, model_name }`，均已在前端有现成来源。
- 响应兼容策略：
  - 若存在 `success`/`data`/`message` 字段，先取 `data`，否则取 `message` 或整体字符串；最终写入 `analysis_results['十年大运']`。
  - 保留原始对象到 `rawDayunData` 以支撑未来结构化组件。

## 交互与错误处理
- 加载：按钮禁用态与文案切换，沿用 `isAnalyzing` 的体验模式；新增独立 `isTenYearsAnalyzing`，避免互相阻塞。
- 失败：弹出错误信息（与 `handleStartAnalysis` 一致），仍可重试；网络超时自动重试由 `retryRequest` 保证。

## 验证清单
- 未登录与已登录场景均可调用接口；已登录时云端成功写入 `POST /bazi/analyses`。
- 历史列表中出现“十年大运”记录，点击可回显。
- 舒适度：移动端排版按钮并排或换行，风格与现有一致。

## 备注
- 该实现仅在前端增加按钮与调用，后端无需改动；使用绝对 URL 通过现有 axios 实例发送请求，自动携带 `Authorization`。