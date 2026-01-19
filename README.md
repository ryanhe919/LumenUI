# LumenUI

A modern React UI component library with Apple-like design aesthetics, built with TypeScript and TailwindCSS v4.

## Features

- 25+ beautifully crafted components
- **Apple-like design** with refined animations and interactions
- Glassmorphism effects with selective blur
- Full TypeScript support
- TailwindCSS v4 integration
- CSS variable-based theming (5 themes: light, dark, blue, green, redWhite)
- 6 size variants (xs, sm, md, lg, xl, 2xl)
- **Accessibility**: `prefers-reduced-motion` support, WCAG contrast compliance
- ESM and CommonJS support
- Tree-shakeable

## Design Highlights

- **Apple System Blue** primary color (`#007AFF` light / `#0A84FF` dark)
- **Refined border radius** scale (6px, 10px, 12px, 16px, 20px)
- **Smooth animations** with spring easing (120ms-250ms)
- **Subtle hover effects** using scale transforms
- **Soft, diffuse shadows** for depth

## Installation

```bash
npm install @ryanhe919/lumen-ui
# or
pnpm add @ryanhe919/lumen-ui
# or
yarn add @ryanhe919/lumen-ui
```

## Quick Start

```tsx
import { LMButton, LMInput } from '@ryanhe919/lumen-ui'
import '@ryanhe919/lumen-ui/styles.css'

function App() {
  return (
    <div>
      <LMInput placeholder="Enter your name" />
      <LMButton variant="primary">Submit</LMButton>
    </div>
  )
}
```

## Components

### General
- **LMButton** - Button with multiple variants and sizes
- **LMBadge** - Status badges and labels

### Form
- **LMInput** - Text input field
- **LMTextarea** - Multi-line text input
- **LMNumberInput** - Numeric input with controls
- **LMSearchInput** - Search input with icon
- **LMSelect** - Dropdown select (single/multiple)
- **LMCheckbox** - Checkbox input
- **LMRadio** - Radio button input
- **LMSwitch** - Toggle switch
- **LMField** - Form field wrapper with label
- **LMDatePicker** - Date picker with calendar

### Data Display
- **LMTable** - Data table with pagination, sorting, selection
- **LMStatCard** - Statistics display cards
- **LMTooltip** - Hover tooltips
- **LMCard** - Card container with variants
- **LMEmpty** - Empty state placeholder
- **LMTabs** - Tab navigation component

### Navigation
- **LMMenu** - Side navigation menu
- **LMDropdown** - Dropdown menu
- **LMPagination** - Pagination component

### Feedback
- **LMMessage** - Toast notifications
- **LMModal** - Modal dialogs
- **LMConfirm** - Confirmation dialogs
- **LMDrawer** - Side drawer panel

## Theming

LumenUI uses CSS variables for theming. Add `data-theme` to switch themes:

```html
<!-- Available themes: light (default), dark, blue, green, redWhite -->
<html data-theme="dark">
  <!-- Your app -->
</html>
```

### Custom Theme

Override CSS variables to customize the theme:

```css
:root {
  /* Primary color (Apple System Blue by default) */
  --lm-primary-500: #007AFF;
  --lm-primary-600: #0066d6;

  /* Border radius scale */
  --lm-radius-sm: 6px;
  --lm-radius-md: 10px;
  --lm-radius-lg: 12px;
  --lm-radius-xl: 16px;

  /* Animation timing */
  --lm-transition-fast: 120ms;
  --lm-transition-normal: 180ms;
  --lm-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --lm-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Soft shadows */
  --lm-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
}
```

### Accessibility

LumenUI respects user preferences:

```css
/* Automatically reduces motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Usage Examples

### Button

```tsx
<LMButton variant="primary" size="md">
  Click me
</LMButton>

<LMButton variant="outline" loading>
  Loading...
</LMButton>
```

### Table

```tsx
const columns = [
  { title: 'Name', dataIndex: 'name', sorter: true },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Email', dataIndex: 'email' },
]

const data = [
  { id: 1, name: 'John', age: 25, email: 'john@example.com' },
  { id: 2, name: 'Jane', age: 30, email: 'jane@example.com' },
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

### Tabs

```tsx
<LMTabs
  items={[
    { key: 'tab1', label: 'Tab 1', children: <div>Content 1</div> },
    { key: 'tab2', label: 'Tab 2', children: <div>Content 2</div> },
  ]}
  defaultActiveKey="tab1"
/>
```

### Menu

```tsx
<LMMenu
  items={[
    { key: 'home', label: 'Home', icon: <HomeIcon /> },
    { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ]}
  mode="inline"
  collapsed={false}
/>
```

### Message Notifications

```tsx
import { useMessage, LMMessageContainer } from '@ryanhe919/lumen-ui'

function App() {
  const { messages, success, error, removeMessage } = useMessage()

  return (
    <>
      <button onClick={() => success('Operation successful!')}>
        Show Success
      </button>
      <LMMessageContainer messages={messages} onClose={removeMessage} />
    </>
  )
}
```

### Confirm Dialog

```tsx
import { useConfirm } from '@ryanhe919/lumen-ui'

function App() {
  const { confirm, ConfirmDialog } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item?',
      confirmButtonStyle: 'danger',
    })

    if (confirmed) {
      // Perform delete
    }
  }

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <ConfirmDialog />
    </>
  )
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start Storybook
pnpm storybook

# Build
pnpm build

# Run tests
pnpm test:run

# Type check
pnpm typecheck
```

## License

MIT License - see [LICENSE](./LICENSE) for details.
