# LumenUI 组件使用文档

本文档为 AI 模型提供 LumenUI 组件库的完整 API 参考，便于快速理解和使用组件。

## 安装与引入

```bash
npm install @ryanhe919/lumen-ui
# or
pnpm add @ryanhe919/lumen-ui
```

```tsx
import { LMButton, LMInput, LMSelect, ... } from '@ryanhe919/lumen-ui'
import '@ryanhe919/lumen-ui/styles.css'
```

## 通用属性

所有组件支持以下通用尺寸：
```ts
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

---

## 通用 General

### LMButton 按钮

用于触发操作或事件的交互元素。

```tsx
interface LMButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: ComponentSize              // 默认 'md'
  loading?: boolean                 // 加载状态
  disabled?: boolean                // 禁用状态
  fullWidth?: boolean               // 是否撑满容器宽度
  rounded?: boolean                 // 圆角样式
  leftIcon?: ReactNode              // 左侧图标
  rightIcon?: ReactNode             // 右侧图标
  loadingText?: string              // 加载时显示的文字
  children: ReactNode               // 按钮内容
  onClick?: () => void
}
```

**示例：**
```tsx
<LMButton variant="primary" size="md">提交</LMButton>
<LMButton variant="danger" loading loadingText="删除中...">删除</LMButton>
<LMButton variant="outline" leftIcon={<Icon />}>带图标</LMButton>
```

### LMBadge 徽章

用于状态标记和分类展示。

```tsx
interface LMBadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: ComponentSize              // 默认 'md'
  rounded?: boolean                 // 圆形徽章
  dot?: boolean                     // 仅显示圆点
  children?: ReactNode              // 徽章内容
}
```

**示例：**
```tsx
<LMBadge variant="success">已完成</LMBadge>
<LMBadge variant="error" dot />
<LMBadge variant="primary" rounded>99+</LMBadge>
```

---

## 表单 Form

### LMInput 输入框

单行文本输入，支持多种类型。

```tsx
interface LMInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: ComponentSize              // 默认 'md'
  error?: boolean                   // 错误状态
  errorMessage?: string             // 错误提示信息
  leftIcon?: ReactNode              // 左侧图标
  rightElement?: ReactNode          // 右侧元素
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local'
  includeSeconds?: boolean          // 时间类型是否包含秒
}
```

**示例：**
```tsx
<LMInput placeholder="请输入用户名" />
<LMInput type="email" error errorMessage="邮箱格式不正确" />
<LMInput type="password" rightElement={<EyeIcon />} />
```

### LMTextarea 文本域

多行文本输入。

```tsx
interface LMTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: ComponentSize              // 默认 'md'
  error?: boolean                   // 错误状态
  errorMessage?: string             // 错误提示信息
  rows?: number                     // 显示行数
  maxLength?: number                // 最大字符数
}
```

**示例：**
```tsx
<LMTextarea placeholder="请输入描述..." rows={4} />
<LMTextarea maxLength={500} error errorMessage="内容不能为空" />
```

### LMNumberInput 数字输入框

数值输入，支持步进、范围限制和精度控制。

```tsx
interface LMNumberInputProps {
  value?: number | null             // 当前值 (受控)
  onChange?: (value: number | null) => void
  size?: ComponentSize              // 默认 'md'
  error?: boolean
  errorMessage?: string
  placeholder?: string
  disabled?: boolean
  min?: number                      // 最小值
  max?: number                      // 最大值
  step?: number                     // 步进值，默认 1
  precision?: number                // 小数精度，默认 0
  showControls?: boolean            // 显示增减按钮，默认 true
  prefix?: string                   // 前缀文字 (如 $)
  suffix?: string                   // 后缀文字 (如 %)
}
```

**示例：**
```tsx
<LMNumberInput value={100} min={0} max={1000} step={10} />
<LMNumberInput prefix="$" precision={2} step={0.01} />  {/* 价格输入 */}
<LMNumberInput suffix="%" min={0} max={100} />          {/* 百分比 */}
```

### LMSearchInput 搜索输入框

专用于搜索场景的输入框。

```tsx
interface LMSearchInputProps {
  value?: string                    // 当前搜索值
  onChange?: (value: string) => void
  onSearch?: (value: string) => void // 搜索回调 (回车或点击按钮)
  size?: ComponentSize              // 默认 'md'
  error?: boolean
  errorMessage?: string
  placeholder?: string              // 默认 'Search...'
  disabled?: boolean
  showClear?: boolean               // 显示清除按钮，默认 true
  showSearchButton?: boolean        // 显示搜索按钮，默认 true
  searchButtonText?: string         // 搜索按钮文字，默认 'Search'
  debounceDelay?: number            // 防抖延迟 (ms)，默认 300
}
```

**示例：**
```tsx
<LMSearchInput placeholder="搜索商品..." onSearch={(v) => search(v)} />
<LMSearchInput showSearchButton={false} showClear />    {/* 简洁模式 */}
```

### LMSelect 选择器

下拉选择，支持单选和多选。

```tsx
interface LMSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface LMSelectProps {
  options: LMSelectOption[]         // 选项列表
  value?: string | number | (string | number)[]  // 单选时为值，多选时为数组
  onChange?: (value: string | number | (string | number)[]) => void
  onDropdownVisibleChange?: (visible: boolean) => void
  size?: ComponentSize              // 默认 'md'
  error?: boolean
  errorMessage?: string
  placeholder?: string              // 默认 'Select...'
  disabled?: boolean
  multiple?: boolean                // 是否多选，默认 false
  name?: string                     // 表单字段名
}
```

**示例：**
```tsx
const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三', disabled: true }
]

<LMSelect options={options} value={selected} onChange={setSelected} />
<LMSelect options={options} multiple value={selectedList} onChange={setSelectedList} />
```

### LMCheckbox 复选框

多选项勾选控件。

```tsx
interface LMCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string                     // 标签文字 (必填)
  description?: string              // 描述文字
  size?: ComponentSize              // 默认 'md'
  error?: boolean
  errorMessage?: string
  checked?: boolean
  onChange?: (e: ChangeEvent) => void
  disabled?: boolean
}
```

**示例：**
```tsx
<LMCheckbox label="同意协议" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
<LMCheckbox label="订阅通知" description="接收最新消息和优惠信息" />
```

### LMRadio 单选框

单选项控件，通常成组使用。

```tsx
interface LMRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string                     // 标签文字 (必填)
  description?: string              // 描述文字
  size?: ComponentSize              // 默认 'md'
  error?: boolean
  errorMessage?: string
  name?: string                     // 同组 radio 需相同 name
  value?: string
  checked?: boolean
  onChange?: (e: ChangeEvent) => void
  disabled?: boolean
}
```

**示例：**
```tsx
<LMRadio name="gender" value="male" label="男" checked={gender === 'male'} onChange={...} />
<LMRadio name="gender" value="female" label="女" checked={gender === 'female'} onChange={...} />
```

### LMSwitch 开关

开关切换控件。

```tsx
interface LMSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string                    // 标签文字
  description?: string              // 描述文字
  size?: ComponentSize              // 默认 'md'
  error?: boolean
  errorMessage?: string
  checked?: boolean
  onChange?: (e: ChangeEvent) => void
  disabled?: boolean
}
```

**示例：**
```tsx
<LMSwitch label="开启通知" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
<LMSwitch label="暗色模式" description="切换深色主题" />
```

### LMField 表单字段

表单字段容器，用于包装输入组件并提供统一的标签和错误展示。

```tsx
interface LMFieldProps {
  label: string                     // 字段标签 (必填)
  required?: boolean                // 是否必填 (显示 * 号)
  errorMessage?: string             // 错误提示
  help?: string                     // 帮助文字
  children: ReactNode               // 输入组件
  className?: string
}
```

**示例：**
```tsx
<LMField label="用户名" required errorMessage={errors.username}>
  <LMInput value={username} onChange={setUsername} error={!!errors.username} />
</LMField>

<LMField label="简介" help="不超过 200 字">
  <LMTextarea maxLength={200} />
</LMField>
```

---

## 数据展示 Data Display

### LMTable 表格

数据表格，支持排序、分页、选择等功能。

```tsx
interface LMTableColumn<T> {
  title: string                     // 列标题
  dataIndex: string                 // 数据字段名 (支持嵌套如 'user.name')
  width?: string | number           // 列宽
  render?: (value: unknown, record: T, index: number) => ReactNode  // 自定义渲染
  sorter?: boolean                  // 是否可排序
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'          // 固定列
}

interface LMPaginationConfig {
  current: number                   // 当前页
  pageSize: number                  // 每页条数
  total: number                     // 总条数
  showPagination?: boolean          // 显示分页
  pageSizeOptions?: number[]        // 每页条数选项
  showTotal?: boolean               // 显示总数
  showQuickJumper?: boolean         // 显示快速跳转
  showSizeChanger?: boolean         // 显示每页条数选择
  onChange?: (page: number, pageSize: number) => void
}

interface LMTableProps<T> {
  dataSource: T[]                   // 数据源
  columns: LMTableColumn<T>[]       // 列配置
  rowKey?: string | ((record: T, index: number) => string)  // 行唯一键，默认 'id'
  pagination?: LMPaginationConfig   // 分页配置
  loading?: boolean                 // 加载状态
  emptyText?: string                // 空数据文案，默认 'No data'
  size?: ComponentSize              // 默认 'md'
  bordered?: boolean                // 显示边框
  striped?: boolean                 // 斑马纹
  selectable?: boolean              // 可选择
  selectedRowKeys?: string[]        // 已选行 keys
  onSelectionChange?: (keys: string[], rows: T[]) => void
  onRowClick?: (record: T, index: number) => void
  onSortChange?: (field: string, order: 'ascend' | 'descend') => void
  variant?: 'default' | 'elevated' | 'outline' | 'minimal' | 'soft' | 'zebra'
  fullHeight?: boolean              // 撑满容器高度
}
```

**示例：**
```tsx
const columns = [
  { title: '姓名', dataIndex: 'name', sorter: true },
  { title: '年龄', dataIndex: 'age', align: 'center' },
  {
    title: '操作',
    dataIndex: 'id',
    render: (_, record) => <LMButton size="xs" onClick={() => edit(record)}>编辑</LMButton>
  }
]

<LMTable
  dataSource={users}
  columns={columns}
  rowKey="id"
  pagination={{
    current: page,
    pageSize: 10,
    total: 100,
    showPagination: true,
    showTotal: true,
    onChange: (p, ps) => fetchData(p, ps)
  }}
  selectable
  selectedRowKeys={selected}
  onSelectionChange={setSelected}
/>
```

### LMStatCard 统计卡片

数据统计展示卡片。

```tsx
interface LMStatCardProps {
  title: string                     // 标题 (必填)
  value: string | number            // 数值 (必填)
  description?: string              // 描述文字
  icon?: ReactNode                  // 左侧图标
  trend?: number                    // 趋势值 (正数上升，负数下降，0 持平)
  trendText?: string                // 趋势描述文字
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: ComponentSize              // 默认 'md'
  clickable?: boolean               // 可点击
  onClick?: () => void
  prefix?: string                   // 数值前缀 (如 $)
  suffix?: string                   // 数值后缀 (如 %)
  bordered?: boolean                // 显示边框，默认 true
  shadow?: boolean                  // 显示阴影，默认 true
  compact?: boolean                 // 紧凑模式
}
```

**示例：**
```tsx
<LMStatCard title="总收入" value="12,345" prefix="$" trend={12.5} trendText="较上月" />
<LMStatCard
  title="用户数"
  value={1024}
  icon={<UserIcon />}
  variant="primary"
  clickable
  onClick={() => navigate('/users')}
/>
```

### LMTooltip 文字提示

鼠标悬停时显示的提示气泡。

```tsx
interface LMTooltipProps {
  content: ReactNode                // 提示内容 (必填)
  children: ReactNode               // 触发元素 (必填)
  placement?: 'top' | 'bottom' | 'left' | 'right'  // 位置，默认 'top'
  maxWidth?: number                 // 最大宽度
  size?: ComponentSize              // 默认 'sm'
}
```

**示例：**
```tsx
<LMTooltip content="这是提示信息">
  <LMButton>悬停查看</LMButton>
</LMTooltip>

<LMTooltip content="很长的提示文字会自动换行..." placement="right" maxWidth={200}>
  <span>帮助</span>
</LMTooltip>
```

---

## 反馈 Feedback

### LMMessage 消息提示

全局消息通知，用于操作反馈。

```tsx
type LMMessageType = 'success' | 'error' | 'warning' | 'info'

// 单条消息 Props
interface LMMessageProps {
  id: string
  type: LMMessageType
  title?: string                    // 标题
  content: string                   // 内容 (必填)
  duration?: number                 // 自动关闭延迟 (ms)，0 表示不自动关闭，默认 2000
  onClose: (id: string) => void
}

// 消息容器 Props
interface LMMessageContainerProps {
  messages: LMMessageItem[]
  onClose: (id: string) => void
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
}

// useMessage Hook 返回值
interface UseMessageReturn {
  messages: LMMessageItem[]
  success: (content: string, title?: string, duration?: number) => string
  error: (content: string, title?: string, duration?: number) => string
  warning: (content: string, title?: string, duration?: number) => string
  info: (content: string, title?: string, duration?: number) => string
  removeMessage: (id: string) => void
  clearAll: () => void
}
```

**示例：**
```tsx
function App() {
  const { messages, success, error, removeMessage } = useMessage()

  const handleSave = async () => {
    try {
      await save()
      success('保存成功', '操作提示')
    } catch (e) {
      error('保存失败，请重试')
    }
  }

  return (
    <>
      <LMButton onClick={handleSave}>保存</LMButton>
      <LMMessageContainer messages={messages} onClose={removeMessage} position="top-right" />
    </>
  )
}
```

### LMModal 模态框

模态对话框，用于重要信息确认或复杂表单。

```tsx
interface LMModalProps {
  visible: boolean                  // 是否显示 (必填)
  title?: string                    // 标题
  children: ReactNode               // 内容 (必填)
  footer?: ReactNode                // 自定义底部 (传 null 隐藏底部)
  onClose?: () => void              // 关闭回调
  onOk?: () => void                 // 确认回调
  onCancel?: () => void             // 取消回调
  okText?: string                   // 确认按钮文字，默认 'Confirm'
  cancelText?: string               // 取消按钮文字，默认 'Cancel'
  showOk?: boolean                  // 显示确认按钮，默认 true
  showCancel?: boolean              // 显示取消按钮，默认 true
  okLoading?: boolean               // 确认按钮加载状态
  cancelLoading?: boolean           // 取消按钮加载状态
  mask?: boolean                    // 显示遮罩，默认 true
  maskClosable?: boolean            // 点击遮罩关闭，默认 false
  closable?: boolean                // 显示关闭按钮，默认 true
  closeIcon?: ReactNode             // 自定义关闭图标
  headerIcon?: ReactNode            // 标题图标
  width?: string | number           // 宽度
  height?: string | number          // 高度
  size?: ComponentSize              // 默认 'md'
  centered?: boolean                // 垂直居中，默认 true
  fullscreen?: boolean              // 全屏模式
  animation?: boolean               // 启用动画，默认 true
  animationDuration?: number        // 动画时长 (ms)，默认 300
}
```

**示例：**
```tsx
<LMModal
  visible={showModal}
  title="编辑用户"
  onOk={handleSubmit}
  onCancel={() => setShowModal(false)}
  okText="保存"
  cancelText="取消"
  okLoading={saving}
>
  <LMField label="姓名" required>
    <LMInput value={name} onChange={setName} />
  </LMField>
</LMModal>

{/* 自定义底部 */}
<LMModal visible={show} title="详情" footer={null}>
  <p>只读内容...</p>
</LMModal>
```

### LMConfirm 确认框

简单的确认对话框。

```tsx
interface LMConfirmProps {
  visible: boolean                  // 是否显示 (必填)
  title?: string                    // 标题，默认 'Confirm'
  content: string                   // 内容 (必填)
  confirmText?: string              // 确认按钮文字，默认 'Confirm'
  cancelText?: string               // 取消按钮文字，默认 'Cancel'
  confirmButtonStyle?: 'primary' | 'danger'  // 确认按钮样式，默认 'primary'
  onConfirm: () => void             // 确认回调 (必填)
  onCancel: () => void              // 取消回调 (必填)
  closeOnOverlayClick?: boolean     // 点击遮罩关闭，默认 true
}

// useConfirm Hook 返回值
interface UseConfirmReturn {
  confirm: (options: {
    title?: string
    content: string
    confirmText?: string
    cancelText?: string
    confirmButtonStyle?: 'primary' | 'danger'
  }) => Promise<boolean>            // 返回 true 表示确认，false 表示取消
  ConfirmDialog: React.FC           // 对话框组件，需渲染到页面
}
```

**示例：**
```tsx
function DeleteButton({ onDelete }) {
  const { confirm, ConfirmDialog } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmText: '删除',
      confirmButtonStyle: 'danger'
    })

    if (confirmed) {
      onDelete()
    }
  }

  return (
    <>
      <LMButton variant="danger" onClick={handleDelete}>删除</LMButton>
      <ConfirmDialog />
    </>
  )
}
```

---

## 聊天 Chat

### LMChatContainer 聊天容器

完整的聊天界面，整合消息列表和输入框，支持流式输出。

```tsx
interface LMChatContainerProps {
  messages: ChatMessage[]              // 消息列表 (必填)
  size?: ComponentSize                 // 默认 'md'
  variant?: 'default' | 'filled' | 'outline' | 'soft'  // 气泡变体
  onSend?: (content: string) => void   // 发送消息回调
  onStop?: () => void                  // 停止生成回调
  isGenerating?: boolean               // 是否正在生成
  disabled?: boolean                   // 禁用输入
  placeholder?: string                 // 输入框占位符
  inputValue?: string                  // 输入框值 (受控)
  onInputChange?: (value: string) => void
  maxInputLength?: number              // 最大输入字符数
  showInputCount?: boolean             // 显示字符计数
  showTypingIndicator?: boolean        // 显示打字指示器
  typingIndicatorText?: string         // 打字指示器文字
  typingIndicatorAvatar?: ReactNode    // 打字指示器头像
  header?: ReactNode                   // 头部内容
  footer?: ReactNode                   // 底部额外内容
  inputRightSlot?: ReactNode           // 输入框右侧插槽
  inputToolbar?: ReactNode             // 输入框底部工具栏
  emptyContent?: ReactNode             // 空状态内容
  loading?: boolean                    // 加载状态
  onLoadMore?: () => void              // 加载更多回调
  hasMore?: boolean                    // 是否有更多消息
  onMessageRetry?: (messageId: string) => void  // 消息重试回调
  renderMessage?: (message: ChatMessage, index: number) => ReactNode  // 自定义渲染
  autoFocus?: boolean                  // 输入框自动聚焦
  enterToSend?: boolean                // Enter 发送，默认 true
  height?: string | number             // 容器高度
  maxHeight?: string | number          // 最大高度
  bubbleMaxWidth?: string | number     // 气泡最大宽度，默认 '95%'
}

interface LMChatContainerRef {
  scrollToBottom: (behavior?: 'auto' | 'smooth') => void
  scrollToMessage: (messageId: string, behavior?: 'auto' | 'smooth') => void
  focusInput: () => void
  getInputValue: () => string
  setInputValue: (value: string) => void
  clearInput: () => void
}
```

**示例：**
```tsx
const [messages, setMessages] = useState<ChatMessage[]>([])
const [isGenerating, setIsGenerating] = useState(false)

<LMChatContainer
  messages={messages}
  onSend={(content) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content }])
    // 调用 AI API...
  }}
  isGenerating={isGenerating}
  onStop={() => setIsGenerating(false)}
  placeholder="输入消息..."
  height="600px"
  header={<div>AI 助手</div>}
/>
```

### LMChatList 消息列表

消息列表组件，支持自动滚动和加载更多。

```tsx
interface ChatMessage {
  id: string                           // 消息唯一 ID (必填)
  role?: 'user' | 'assistant' | 'system'
  content: ReactNode                   // 消息内容
  avatar?: string | ReactNode          // 头像
  name?: string                        // 发送者名称
  timestamp?: string | Date            // 时间戳
  status?: 'sending' | 'sent' | 'error' | 'streaming'
  actions?: ChatMessageAction[]        // 操作按钮
  errorMessage?: string                // 错误信息
}

interface LMChatListProps {
  messages: ChatMessage[]              // 消息列表 (必填)
  size?: ComponentSize                 // 默认 'md'
  variant?: 'default' | 'filled' | 'outline' | 'soft'
  showTypingIndicator?: boolean        // 显示打字指示器
  typingIndicatorVariant?: 'dots' | 'pulse' | 'bounce' | 'wave'
  typingIndicatorText?: string
  typingIndicatorAvatar?: ReactNode
  autoScrollToBottom?: boolean         // 自动滚动到底部，默认 true
  scrollBehavior?: 'auto' | 'smooth'   // 滚动行为，默认 'smooth'
  messageGap?: number                  // 消息间距，默认 16
  emptyContent?: ReactNode             // 空状态内容
  loading?: boolean                    // 加载状态
  onLoadMore?: () => void              // 加载更多回调
  hasMore?: boolean                    // 是否有更多
  loadMoreText?: string                // 加载更多文字
  renderMessage?: (message: ChatMessage, index: number) => ReactNode
  onMessageRetry?: (messageId: string) => void
  bubbleMaxWidth?: string | number     // 气泡最大宽度
}

interface LMChatListRef {
  scrollToBottom: (behavior?: 'auto' | 'smooth') => void
  scrollToMessage: (messageId: string, behavior?: 'auto' | 'smooth') => void
  getContainer: () => HTMLDivElement | null
}
```

### LMChatMessage 聊天消息

单条聊天消息组件，包含头像、气泡和操作按钮。

```tsx
interface LMChatMessageProps {
  id?: string                          // 消息唯一 ID
  role?: 'user' | 'assistant' | 'system'  // 默认 'user'
  content: ReactNode                   // 消息内容 (必填)
  avatar?: string | ReactNode          // 头像 URL 或组件
  name?: string                        // 发送者名称
  timestamp?: string | Date            // 时间戳
  status?: 'sending' | 'sent' | 'error' | 'streaming'
  size?: ComponentSize                 // 默认 'md'
  variant?: 'default' | 'filled' | 'outline' | 'soft'
  actions?: ChatMessageAction[]        // 操作按钮
  showActions?: boolean                // hover 时显示操作，默认 true
  errorMessage?: string                // 错误信息
  onRetry?: () => void                 // 重试回调
  hideAvatar?: boolean                 // 隐藏头像
  renderBubble?: (content: ReactNode) => ReactNode  // 自定义气泡渲染
  bubbleMaxWidth?: string | number     // 气泡最大宽度，默认 '95%'
}

interface ChatMessageAction {
  key: string                          // 操作唯一标识
  icon: ReactNode                      // 图标
  tooltip?: string                     // 提示文字
  onClick?: () => void                 // 点击回调
  disabled?: boolean                   // 是否禁用
}
```

**示例：**
```tsx
<LMChatMessage
  role="assistant"
  content={<LMMarkdownRenderer content={markdownText} />}
  name="AI 助手"
  timestamp={new Date()}
  status="streaming"
  actions={[
    { key: 'copy', icon: <CopyIcon />, tooltip: '复制', onClick: handleCopy }
  ]}
/>
```

### LMChatBubble 聊天气泡

聊天气泡容器，支持多种样式和流式输出动画。

```tsx
interface LMChatBubbleProps {
  role?: 'user' | 'assistant' | 'system'  // 默认 'assistant'
  variant?: 'default' | 'filled' | 'outline' | 'soft'  // 默认 'default'
  size?: ComponentSize                 // 默认 'md'
  isStreaming?: boolean                // 流式输出状态 (显示光标)
  error?: boolean                      // 错误状态
  children: ReactNode                  // 气泡内容 (必填)
  className?: string
  style?: CSSProperties
}
```

**示例：**
```tsx
<LMChatBubble role="user">
  你好，请帮我写一段代码
</LMChatBubble>

<LMChatBubble role="assistant" isStreaming>
  {streamingText}
</LMChatBubble>
```

### LMChatInput 聊天输入框

聊天输入框，支持多行输入、工具栏和发送/停止按钮。

```tsx
interface LMChatInputProps {
  value?: string                       // 输入值
  onChange?: (value: string) => void   // 值变化回调
  onSend?: (value: string) => void     // 发送消息回调
  placeholder?: string                 // 占位符，默认 '输入消息...'
  size?: ComponentSize                 // 默认 'md'
  disabled?: boolean                   // 禁用状态
  sending?: boolean                    // 加载状态
  maxLength?: number                   // 最大字符数
  showCount?: boolean                  // 显示字符计数
  maxRows?: number                     // 最大行数，默认 6
  autoFocus?: boolean                  // 自动聚焦
  sendButtonText?: string              // 发送按钮文本
  showSendButton?: boolean             // 显示发送按钮，默认 true
  rightSlot?: ReactNode                // 右侧自定义内容
  toolbar?: ReactNode                  // 底部工具栏
  enterToSend?: boolean                // Enter 发送，默认 true
  onStop?: () => void                  // 停止生成回调
  isGenerating?: boolean               // 是否正在生成
}

// 工具栏按钮组件
interface ToolbarButtonProps {
  icon: ReactNode                      // 图标 (必填)
  label?: string                       // 标签文字
  onClick?: () => void                 // 点击回调
  disabled?: boolean                   // 禁用状态
  active?: boolean                     // 激活状态
}
```

**示例：**
```tsx
<LMChatInput
  value={inputValue}
  onChange={setInputValue}
  onSend={handleSend}
  placeholder="输入消息..."
  isGenerating={isGenerating}
  onStop={handleStop}
  toolbar={
    <>
      <ToolbarButton icon={<AttachIcon />} label="附件" onClick={handleAttach} />
      <ToolbarButton icon={<ImageIcon />} label="图片" onClick={handleImage} />
    </>
  }
/>
```

### LMTypingIndicator 打字指示器

显示对方正在输入的动画指示器。

```tsx
type TypingIndicatorVariant = 'dots' | 'pulse' | 'bounce' | 'wave'

interface LMTypingIndicatorProps {
  variant?: TypingIndicatorVariant     // 动画变体，默认 'dots'
  size?: ComponentSize                 // 默认 'md'
  text?: string                        // 提示文字，如 "正在输入..."
  avatar?: ReactNode                   // 头像
  showAvatar?: boolean                 // 显示头像，默认 true
  className?: string
}
```

**示例：**
```tsx
<LMTypingIndicator variant="dots" text="AI 正在思考..." />
<LMTypingIndicator variant="wave" avatar={<Avatar src="ai.png" />} />
```

### LMCodeBlock 代码块

代码块组件，支持语法高亮和复制功能。

```tsx
interface LMCodeBlockProps {
  code: string                         // 代码内容 (必填)
  language?: string                    // 编程语言，默认 'plaintext'
  filename?: string                    // 文件名
  size?: ComponentSize                 // 默认 'md'
  showLineNumbers?: boolean            // 显示行号，默认 true
  startLineNumber?: number             // 起始行号，默认 1
  highlightLines?: number[]            // 高亮行
  showCopyButton?: boolean             // 显示复制按钮，默认 true
  maxHeight?: string | number          // 最大高度
  wrapLines?: boolean                  // 允许换行
  enableHighlight?: boolean            // 启用语法高亮，默认 true
}
```

**示例：**
```tsx
<LMCodeBlock
  code={`function greet(name: string) {
  return \`Hello, \${name}!\`
}`}
  language="typescript"
  filename="greeting.ts"
  highlightLines={[2]}
/>
```

### LMMarkdownRenderer Markdown 渲染器

渲染 Markdown 内容，支持代码块语法高亮。

```tsx
interface LMMarkdownRendererProps {
  content: string                      // Markdown 内容 (必填)
  size?: ComponentSize                 // 默认 'md'
  className?: string
}
```

**支持的 Markdown 语法：**
- 标题 (`#`, `##`, `###`, 等)
- 粗体 (`**text**`)、斜体 (`*text*`)
- 行内代码 (`` `code` ``)
- 代码块 (``` ```language ```)
- 列表（有序、无序）
- 引用 (`> quote`)
- 链接 (`[text](url)`)
- 表格

**示例：**
```tsx
<LMMarkdownRenderer
  content={`
## 代码示例

这是一段 **Markdown** 文本。

\`\`\`typescript
const greeting = 'Hello!'
\`\`\`
  `}
/>
```

---

## 主题系统

通过 CSS 变量控制主题，支持 5 种主题模式。

```html
<!-- 切换主题: light (默认), dark, blue, green, redWhite -->
<html data-theme="dark">
```

### 颜色变量

**主色调** (Apple System Blue):
- `--lm-primary-500`: `#007AFF` (亮色) / `#0A84FF` (暗色)
- `--lm-primary-*`: 50-950 完整色阶

**语义色**:
- `--lm-success-*`: 成功色 (绿色系)
- `--lm-warning-*`: 警告色 (黄色系)
- `--lm-error-*`: 错误色 (红色系)
- `--lm-info-*`: 信息色 (蓝色系)
- `--lm-gray-*`: 灰色系

**背景与文字**:
- `--lm-bg-elevated`: 浮层背景
- `--lm-bg-paper`: 卡片背景
- `--lm-bg-hover`: 悬停背景
- `--lm-text-primary`: 主要文字
- `--lm-text-secondary`: 次要文字
- `--lm-border-default`: 默认边框
- `--lm-border-focus`: 焦点边框

### 圆角系统

```css
--lm-radius-sm: 6px;    /* 小元素 */
--lm-radius-md: 10px;   /* 中等元素 */
--lm-radius-lg: 12px;   /* 主要组件 (按钮、输入框) */
--lm-radius-xl: 16px;   /* 大型组件 (卡片、模态框) */
--lm-radius-2xl: 20px;  /* 超大组件 */
```

### 阴影系统

```css
/* 柔和的多层阴影 */
--lm-shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
--lm-shadow-md: 0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04);
--lm-shadow-lg: 0 8px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04);
--lm-shadow-xl: 0 16px 48px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.06);
```

### 动效系统

**过渡时长**:
```css
--lm-transition-fast: 120ms;    /* 微交互 */
--lm-transition-normal: 180ms;  /* 标准过渡 */
--lm-transition-slow: 250ms;    /* 复杂动画 */
```

**缓动曲线**:
```css
--lm-ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
--lm-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* 弹性效果 */
--lm-ease-out: cubic-bezier(0, 0, 0.2, 1);
--lm-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 工具类

```css
.lm-transition      /* 标准过渡效果 */
.lm-transition-fast /* 快速过渡效果 */
.lm-hover-lift      /* 悬停提升效果 (scale + shadow) */
.lm-glass           /* 毛玻璃效果 */
.lm-tracking-tight  /* 紧凑字间距 */
```

### 无障碍支持

- 自动支持 `prefers-reduced-motion` 减少动画
- 使用 `:focus-visible` 显示键盘焦点
- 文字对比度满足 WCAG 4.5:1 标准
