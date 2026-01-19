# LumenUI

基于 React 的现代 UI 组件库，采用 Apple 风格设计美学，使用 TypeScript 和 TailwindCSS v4 构建。

## 特性

- 25+ 精心设计的组件
- **Apple 风格设计**，精致的动画和交互体验
- 毛玻璃效果，选择性模糊
- 完整的 TypeScript 支持
- TailwindCSS v4 集成
- 基于 CSS 变量的主题系统（5 种主题：light、dark、blue、green、redWhite）
- 6 种尺寸变体（xs、sm、md、lg、xl、2xl）
- **无障碍支持**：`prefers-reduced-motion` 支持，符合 WCAG 对比度标准
- 支持 ESM 和 CommonJS
- 支持 Tree-shaking

## 设计亮点

- **Apple 系统蓝**主色调（亮色 `#007AFF` / 暗色 `#0A84FF`）
- **精致的圆角**系统（6px、10px、12px、16px、20px）
- **流畅动画**，弹性缓动（120ms-250ms）
- **微妙的悬停效果**，使用 scale 变换
- **柔和的扩散阴影**，营造层次感

## 安装

```bash
npm install @ryanhe919/lumen-ui
# 或
pnpm add @ryanhe919/lumen-ui
# 或
yarn add @ryanhe919/lumen-ui
```

## 快速开始

```tsx
import { LMButton, LMInput } from '@ryanhe919/lumen-ui'
import '@ryanhe919/lumen-ui/styles.css'

function App() {
  return (
    <div>
      <LMInput placeholder="请输入姓名" />
      <LMButton variant="primary">提交</LMButton>
    </div>
  )
}
```

## 组件

### 通用 General
- **LMButton** - 按钮，支持多种变体和尺寸
- **LMBadge** - 徽章，状态标记和标签

### 表单 Form
- **LMInput** - 文本输入框
- **LMTextarea** - 多行文本输入
- **LMNumberInput** - 数字输入框，带增减按钮
- **LMSearchInput** - 搜索输入框
- **LMSelect** - 下拉选择器（单选/多选）
- **LMCheckbox** - 复选框
- **LMRadio** - 单选按钮
- **LMSwitch** - 开关
- **LMField** - 表单字段容器
- **LMDatePicker** - 日期选择器
- **LMUpload** - 文件上传

### 数据展示 Data Display
- **LMTable** - 数据表格，支持分页、排序、选择
- **LMStatCard** - 统计卡片
- **LMTooltip** - 文字提示
- **LMCard** - 卡片容器
- **LMEmpty** - 空状态占位
- **LMTabs** - 标签页

### 导航 Navigation
- **LMMenu** - 侧边导航菜单
- **LMDropdown** - 下拉菜单
- **LMPagination** - 分页

### 反馈 Feedback
- **LMMessage** - 消息提示
- **LMModal** - 模态框
- **LMConfirm** - 确认对话框
- **LMDrawer** - 抽屉面板

## 主题

LumenUI 使用 CSS 变量实现主题切换。添加 `data-theme` 属性切换主题：

```html
<!-- 可用主题：light（默认）、dark、blue、green、redWhite -->
<html data-theme="dark">
  <!-- 你的应用 -->
</html>
```

### 自定义主题

覆盖 CSS 变量来自定义主题：

```css
:root {
  /* 主色调（默认为 Apple 系统蓝） */
  --lm-primary-500: #007AFF;
  --lm-primary-600: #0066d6;

  /* 圆角系统 */
  --lm-radius-sm: 6px;
  --lm-radius-md: 10px;
  --lm-radius-lg: 12px;
  --lm-radius-xl: 16px;

  /* 动画时长 */
  --lm-transition-fast: 120ms;
  --lm-transition-normal: 180ms;
  --lm-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --lm-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* 柔和阴影 */
  --lm-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
}
```

### 无障碍支持

LumenUI 尊重用户偏好设置：

```css
/* 自动为偏好减少动画的用户减少动效 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 使用示例

### 按钮

```tsx
<LMButton variant="primary" size="md">
  点击我
</LMButton>

<LMButton variant="outline" loading>
  加载中...
</LMButton>
```

### 表格

```tsx
const columns = [
  { title: '姓名', dataIndex: 'name', sorter: true },
  { title: '年龄', dataIndex: 'age' },
  { title: '邮箱', dataIndex: 'email' },
]

const data = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
]

<LMTable
  dataSource={data}
  columns={columns}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
    showPagination: true,
  }}
/>
```

### 标签页

```tsx
<LMTabs
  items={[
    { key: 'tab1', label: '标签 1', children: <div>内容 1</div> },
    { key: 'tab2', label: '标签 2', children: <div>内容 2</div> },
  ]}
  defaultActiveKey="tab1"
/>
```

### 菜单

```tsx
<LMMenu
  items={[
    { key: 'home', label: '首页', icon: <HomeIcon /> },
    { key: 'settings', label: '设置', icon: <SettingsIcon /> },
  ]}
  mode="inline"
  collapsed={false}
/>
```

### 消息提示

```tsx
import { useMessage, LMMessageContainer } from '@ryanhe919/lumen-ui'

function App() {
  const { messages, success, error, removeMessage } = useMessage()

  return (
    <>
      <button onClick={() => success('操作成功！')}>
        显示成功提示
      </button>
      <LMMessageContainer messages={messages} onClose={removeMessage} />
    </>
  )
}
```

### 确认对话框

```tsx
import { useConfirm } from '@ryanhe919/lumen-ui'

function App() {
  const { confirm, ConfirmDialog } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: '删除确认',
      content: '确定要删除这个项目吗？',
      confirmButtonStyle: 'danger',
    })

    if (confirmed) {
      // 执行删除操作
    }
  }

  return (
    <>
      <button onClick={handleDelete}>删除</button>
      <ConfirmDialog />
    </>
  )
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动 Storybook
pnpm storybook

# 构建
pnpm build

# 运行测试
pnpm test:run

# 类型检查
pnpm typecheck
```

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件。
