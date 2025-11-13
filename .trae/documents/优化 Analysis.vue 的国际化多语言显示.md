## 目标
- 使 `src/views/Analysis.vue` 及相关展示组件在中英文切换时保持一致的 UI 文案与稳定的数据访问，覆盖新分析与历史记录场景。

## 已完成
- 在 `src/views/Analysis.vue` 内统一使用稳定字段：`analysisType`、`analysisTime`、`analysisResult`（替代 `t('analysis.fields.*')` 键）。
- 修复报告头部、总结统计、懒加载与排序、保存/分享、对话插入等读取位置。
- 重构类型图标与描述为“规范化类型代码”判断，避免比较本地化文案。
- 扩展 Markdown 预处理以兼容中英文首级标题清理。

## 待实施项
### 组件级国际化
- 在 `src/components/BaziDisplay.vue` 与 `src/components/YongshenDisplay.vue` 中，将静态中文标题（如“八字排盘”“五行统计”“用神”“忌神”“取用原则”）替换为 `t('analysis.report.labels.*')` 及对应键：
  - `analysis.report.labels.baseTitle`、`baziInfo`、`fiveElementsStats`、`distribution`、`strongest`、`weakest`、`deityTitle`、`pattern`、`usefulElements` 等。
- 保持子组件接收的“数据对象键”为中文以兼容现有 API 与解析（无需改后端）。

### 类型本地化映射扩展
- 完善 `getLocalizedTypeName(type)`：为后端可能返回的中文类型补充映射（如“八字排盘”“五行分析”“格局判断”“性格分析”“人生建议”），英文展示使用 `analysis.types.*.title` 或固定英文文案。

### Markdown 清理规则完善（可选）
- 在不影响现有显示的前提下，补充常见英文标题清理（如 `# Basic Information`、`# Useful Elements`），仅清理首个标题，保留正文结构。

### 验证与回归
- 语言切换：调用 `useLocale().setLocale('en' | 'zh-CN')`，确认页面标题、按钮、提示、报告头部时间与类型正确。
- 新分析与历史记录：两种语言均可正常展示，虚拟列表懒加载与排序工作正常。
- 保存与对话：图片/名称时间格式正确；对话页面能携带报告内容。

## 影响与风险
- 变更集中在视图层与组件文案；数据结构保持向后兼容。
- 建议在完成组件级国际化后一起回归两种语言的关键路径。

## 确认后执行
- 按上述“组件级国际化”与“类型本地化映射扩展”实施代码修改与自测；如需，我可以继续完成并提交对应补丁。